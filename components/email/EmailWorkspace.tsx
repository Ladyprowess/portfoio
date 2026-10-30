'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import AdminNav from '@/components/AdminNav'
import { DEFAULT_SETTINGS, followUpDue, isFinished, leadEmails, SOURCES, type Lead, type OutreachSettings, type Reply, type SentEmail, type Template } from '@/lib/outreach'
import Composer, { type Outgoing, type Recipient } from './Composer'
import ContactPanel from './ContactPanel'
import EmailPanel from './EmailPanel'
import { AddContactsPanel, RulesPanel, TemplatesView } from './Library'
import { ago, Avatar, fullName, PAGE_SIZE, Pager, Progress, sourceLabel, StatusPill, when } from './shared'
import Icon, { type IconName } from './Icon'

// The one place for email: write and send (to contacts or anyone), see who to
// follow up, who is waiting and who replied, and every email ever sent.
// Nothing is sent unless you choose the people and press Send.

const PW_KEY = 'ladyprowess_admin_password'

type View = 'follow_up' | 'waiting' | 'replied' | 'new' | 'scheduled' | 'sent' | 'all' | 'templates'
type Event = { email_id: string; event_type: 'open' | 'click' | 'bounce' }
type Progress = { done: number; total: number; label: string; errors: string[]; finished: boolean }

const VIEWS: { key: View; label: string; icon: IconName; group: string; hint: string; empty: string }[] = [
  { key: 'follow_up', label: 'Follow up now', icon: 'refresh', group: 'To do', hint: 'Emailed a while ago with no reply yet. Tick the people you want to follow up, then “Write email”.', empty: 'Nobody needs a follow-up right now. You’re all caught up.' },
  { key: 'scheduled', label: 'Scheduled', icon: 'clock', group: 'To do', hint: 'Emails waiting to go out at the time you chose. Cancel any you no longer want to send.', empty: 'Nothing scheduled.' },
  { key: 'new', label: 'Not contacted yet', icon: 'circle', group: 'Contacts', hint: 'People you’ve added but haven’t emailed. Tick the ones you want to email, then “Write email”.', empty: 'Everyone in your contacts has been emailed.' },
  { key: 'waiting', label: 'Waiting for reply', icon: 'hourglass', group: 'Contacts', hint: 'Emailed recently. They’ll move to “Follow up now” if they don’t reply in time.', empty: 'Nobody is waiting on a reply.' },
  { key: 'replied', label: 'Replied', icon: 'checkCircle', group: 'Contacts', hint: 'People who answered. Pick the conversation up in your inbox.', empty: 'No replies yet.' },
  { key: 'all', label: 'All contacts', icon: 'users', group: 'Contacts', hint: 'Everyone, including bounced and stopped contacts.', empty: 'No contacts yet. Use “Add contacts”, or tick “Add to my contacts” when you send an email.' },
  { key: 'sent', label: 'Sent', icon: 'send', group: 'Library', hint: 'Every email sent from hello@ladyprowess.com, to contacts or anyone else.', empty: 'No emails sent yet.' },
  { key: 'templates', label: 'Templates', icon: 'template', group: 'Library', hint: 'Reusable emails. Pick one when writing, then edit it for the person.', empty: '' },
]

const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

export default function EmailWorkspace() {
  const params = useSearchParams()
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  // A load problem that isn't the password (e.g. the email tables don't exist yet).
  const [setupError, setSetupError] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [emails, setEmails] = useState<(SentEmail & { recipients?: string[] })[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [settings, setSettings] = useState<OutreachSettings>(DEFAULT_SETTINGS)
  const [sentToday, setSentToday] = useState(0)
  const [view, setView] = useState<View>('follow_up')
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(null)
  const [composer, setComposer] = useState<{ leads: Lead[]; templateId: string | null; emails?: string[]; subject?: string } | null>(null)
  const [emailId, setEmailId] = useState<string | null>(null)
  const [panel, setPanel] = useState<'add' | 'rules' | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const stop = useRef(false)

  const call = useCallback(async (action: string, extra: Record<string, unknown> = {}, pw = password) => {
    const res = await fetch('/api/outreach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw, action, ...extra }) })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  }, [password])

  const load = useCallback(async (pw = password) => {
    const { ok, status, data } = await call('load', {}, pw)
    if (!ok) {
      // One login for the whole admin: a bad or missing password goes back to it.
      if (status === 401) { toAdminLogin(); return false }
      setSetupError(data.error || 'Could not load your email.')
      return false
    }
    setLeads(data.leads); setEmails(data.emails); setEvents(data.events || []); setReplies(data.replies); setTemplates(data.templates); setSettings(data.settings); setSentToday(data.sentToday)
    setUnlocked(true); setSetupError('')
    return true
  }, [call, password]) // eslint-disable-line react-hooks/exhaustive-deps

  function toAdminLogin() {
    sessionStorage.removeItem(PW_KEY)
    window.location.replace(`/admin?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY)
    if (!saved) { toAdminLogin(); return }
    setPassword(saved)
    load(saved).then(ok => { if (ok && params.get('compose')) setComposer({ leads: [], templateId: null }) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Opens, clicks and replies arrive by webhook, so refresh quietly every minute.
  const sending = !!progress && !progress.finished
  useEffect(() => {
    if (!unlocked || sending || composer) return
    const t = window.setInterval(() => load(), 60_000)
    return () => window.clearInterval(t)
  }, [unlocked, sending, composer, load])

  const putLead = (lead?: Lead) => lead && setLeads(ls => (ls.some(l => l.id === lead.id) ? ls.map(l => (l.id === lead.id ? lead : l)) : [lead, ...ls]))
  const putEmail = (e?: SentEmail) => e && setEmails(es => [e, ...es.filter(x => x.id !== e.id)])

  const upcoming = useMemo(() => emails.filter(e => e.status === 'scheduled' && new Date(e.sent_at).getTime() > Date.now()).sort((a, b) => a.sent_at.localeCompare(b.sent_at)), [emails])
  const scheduledLeads = useMemo(() => new Set(upcoming.map(e => e.lead_id).filter(Boolean) as string[]), [upcoming])
  const due = (l: Lead) => followUpDue(l, settings) && !scheduledLeads.has(l.id)

  const inView = useCallback((l: Lead, v: View) => {
    switch (v) {
      case 'follow_up': return due(l)
      case 'waiting': return ['sent', 'opened', 'clicked'].includes(l.status) && !due(l)
      case 'replied': return l.status === 'replied'
      case 'new': return l.status === 'new' && !scheduledLeads.has(l.id)
      case 'all': return true
      default: return false
    }
  }, [settings, scheduledLeads]) // eslint-disable-line react-hooks/exhaustive-deps

  const count = (v: View) => (v === 'scheduled' ? upcoming.length : v === 'sent' ? emails.filter(e => e.status !== 'cancelled').length : v === 'templates' ? templates.length : leads.filter(l => inView(l, v)).length)

  const q = query.trim().toLowerCase()
  const list = leads.filter(l => inView(l, view) && (source === 'all' || (l.source || 'other') === source) && (!q || [...leadEmails(l), l.first_name, l.last_name, l.company, l.title].some(v => v?.toLowerCase().includes(q))))
  const isContactView = !['scheduled', 'sent', 'templates'].includes(view)
  const meta = VIEWS.find(v => v.key === view)!
  const contacted = leads.filter(l => l.status !== 'new').length
  const replyRate = contacted ? Math.round(((leads.filter(l => l.status === 'replied').length) / contacted) * 100) : 0
  const openLead = leads.find(l => l.id === openId)
  const followUpTemplate = templates.find(t => /follow/i.test(t.name))?.id ?? null

  const switchView = (v: View) => { setView(v); setSelected(new Set()); setQuery(''); setPage(1) }
  // Back to page 1 whenever the search or filter changes.
  useEffect(() => setPage(1), [query, source])
  const pageList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pageAllChecked = pageList.length > 0 && pageList.every(l => selected.has(l.id))
  const toggle = (id: string) => setSelected(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const write = (people: Lead[]) => setComposer({ leads: people, templateId: people.length && people.every(l => l.status !== 'new') ? followUpTemplate : null })

  /** Sends the composer's email to each chosen person, one at a time. */
  async function deliver(o: Outgoing) {
    setComposer(null)
    const recipients = o.recipients.filter(r => !r.lead || !isFinished(r.lead.status) || o.includeFinished)
    stop.current = false
    const label = o.schedule ? 'Scheduling' : 'Sending'
    let state: Progress = { done: 0, total: recipients.length, label, errors: [], finished: false }
    setProgress(state)
    for (let i = 0; i < recipients.length; i++) {
      if (stop.current) { state = { ...state, errors: [...state.errors, 'Stopped. The rest were not sent.'] }; break }
      let r: Recipient = recipients[i]
      // A new address, saved to contacts first so the email is tracked against them.
      if (!r.lead && o.saveNew) {
        const { ok, data } = await call('add_lead', { lead: { email: r.email, source: o.saveNew.source } })
        if (ok) { putLead(data.lead); r = { lead: data.lead, email: data.lead.email } }
      }
      const { subject, body } = o.make(r)
      const scheduledAt = o.schedule ? new Date(o.schedule.at.getTime() + i * o.schedule.gapMin * 60000).toISOString() : undefined
      const { ok, data } = await call('send', { ...(r.lead ? { id: r.lead.id } : { to: r.email }), subject, body, scheduledAt, force: o.includeFinished, attachments: o.attachments.map(a => ({ filename: a.filename, content: a.content })) })
      if (ok) { putLead(data.lead); putEmail(data.email); setSentToday(data.sentToday); state = { ...state, done: state.done + 1 } }
      else { state = { ...state, errors: [...state.errors, `${r.lead ? fullName(r.lead) : r.email}: ${data.error || 'failed'}`] }; if (data.limit && !o.schedule) { setProgress(state); break } }
      setProgress(state)
      if (!o.schedule && i < recipients.length - 1) await wait(4000 + Math.random() * 4000)
    }
    setProgress({ ...state, finished: true })
    setSelected(new Set())
  }

  const loadEmail = useCallback(async (id: string) => { const { ok, data } = await call('email', { id }); return ok ? data : null }, [call])

  async function patch(lead: Lead, change: Record<string, unknown>) {
    const { ok, data } = await call('update', { id: lead.id, ...change })
    if (ok) putLead(data.lead)
    else if (data?.error) window.alert(data.error)
  }
  async function cancel(e: SentEmail) {
    if (!window.confirm('Cancel this scheduled email? It won’t be sent.')) return
    const { ok, data } = await call('cancel', { emailId: e.id })
    if (!ok) { window.alert(data.error || 'Could not cancel.'); return }
    setEmails(es => es.map(x => (x.id === e.id ? { ...x, status: 'cancelled' } : x)))
    putLead(data.lead)
  }

  if (!unlocked) return <main className="min-h-screen bg-bg">
    <AdminNav />
    <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8">
      {setupError ? <div className="max-w-xl rounded-3xl border border-ink-border bg-surface p-7">
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Private · Email</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-[-.03em]">Your email isn’t set up yet</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{setupError}</p>
        <p className="mt-3 text-sm leading-6 text-muted">If this is the first time, open Supabase → SQL Editor, paste everything in <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">supabase/outreach.sql</code> and press Run. Then try again.</p>
        <button onClick={() => { setSetupError(''); load() }} className="mt-5 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim"><Icon name="refresh" />Try again</button>
      </div> : <div className="space-y-3">{[0, 1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-surface-2" />)}</div>}
    </div>
  </main>

  return <main className="min-h-screen bg-bg pb-28 text-parchment">
    <AdminNav />
    {/* Header */}
    <header className="border-b border-ink-border bg-surface">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-4 px-5 py-5 md:px-8">
        <div className="min-w-0 flex-1">
          <p className="font-head text-[10px] uppercase tracking-[.16em] text-primary">Private · Email</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-[-.03em] md:text-[1.9rem]">Your email, sent and tracked</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Stat label="sent today" value={`${sentToday}/${settings.daily_limit}`} />
          <Stat label="reply rate" value={`${replyRate}%`} />
          <button onClick={() => setPanel('rules')} aria-label="Sending rules" title="Sending rules" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-border text-muted hover:border-primary hover:text-primary"><Icon name="settings" className="h-[18px] w-[18px]" /></button>
          <button onClick={() => setPanel('add')} className="flex items-center gap-1.5 rounded-full border border-ink-border px-4 py-2.5 text-sm font-semibold hover:border-primary"><Icon name="plus" />Add contacts</button>
          <button onClick={() => setComposer({ leads: [], templateId: null })} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-[0_10px_30px_-12px_rgb(var(--primary)/.7)] hover:bg-primary-dim"><span className="flex items-center gap-2"><Icon name="pen" />New email</span></button>
        </div>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1320px] gap-6 px-5 py-6 md:px-8 lg:grid-cols-[230px_1fr]">
      {/* Left menu (a scrolling row on phones) */}
      <nav aria-label="Email views" className="-mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-5 lg:overflow-visible lg:px-0">
        {['To do', 'Contacts', 'Library'].map(group => <div key={group} className="contents lg:block">
          <p className="hidden px-3 pb-1.5 font-head text-[10px] uppercase tracking-[.16em] text-muted lg:block">{group}</p>
          {VIEWS.filter(v => v.group === group).map(v => {
            const n = count(v.key), on = view === v.key, urgent = v.key === 'follow_up' && n > 0
            return <button key={v.key} onClick={() => switchView(v.key)} aria-current={on ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition lg:w-full ${on ? 'bg-primary/10 font-semibold text-primary' : 'text-parchment/80 hover:bg-surface'}`}>
              <Icon name={v.icon} className={`h-[18px] w-[18px] ${on ? 'text-primary' : 'text-muted'}`} />
              <span className="flex-1 whitespace-nowrap">{v.label}</span>
              {n > 0 && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${urgent ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted'}`}>{n}</span>}
            </button>
          })}
        </div>)}
      </nav>

      <section className="min-w-0">
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold tracking-[-.02em]">{meta.label}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">{meta.hint}</p>
        </div>

        {isContactView && <>
          <div className="mb-3 flex flex-wrap gap-2">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, company or email" className="min-w-0 flex-1 rounded-full border border-ink-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <select value={source} onChange={e => setSource(e.target.value)} aria-label="Met via" className="rounded-full border border-ink-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary">
              <option value="all">Met anywhere</option>{SOURCES.map(s => <option key={s.key} value={s.key}>Met via {s.label}</option>)}
            </select>
          </div>
          {!list.length ? <Empty>{q || source !== 'all' ? 'No one matches your search.' : meta.empty}</Empty> :
            <div className="overflow-hidden rounded-2xl border border-ink-border bg-surface">
              <div className="flex flex-wrap items-center gap-3 border-b border-ink-border bg-surface-2/50 px-4 py-2.5 text-xs font-semibold text-muted">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={pageAllChecked} onChange={e => setSelected(s => { const n = new Set(s); pageList.forEach(l => (e.target.checked ? n.add(l.id) : n.delete(l.id))); return n })} className="h-4 w-4 accent-[rgb(var(--primary))]" />
                  {selected.size ? `${selected.size} selected` : list.length > PAGE_SIZE ? 'Select this page' : `Select all ${list.length}`}
                </label>
                {/* Ticking a page never quietly selects people on other pages; this is an explicit choice. */}
                {pageAllChecked && list.length > PAGE_SIZE && selected.size < list.length && <button onClick={() => setSelected(new Set(list.map(l => l.id)))} className="text-primary hover:underline">Select all {list.length} matching</button>}
                {selected.size > 0 && <button onClick={() => setSelected(new Set())} className="ml-auto hover:text-parchment">Clear</button>}
              </div>
              <ul className="divide-y divide-ink-border">
                {pageList.map(l => <ContactRow key={l.id} lead={l} checked={selected.has(l.id)} onCheck={() => toggle(l.id)} onOpen={() => setOpenId(l.id)} onWrite={() => write([l])}
                  note={scheduledLeads.has(l.id) ? `Email scheduled ${ago(upcoming.find(e => e.lead_id === l.id)?.sent_at)}` : due(l) ? `No reply for ${ago(l.last_sent_at).replace(' ago', '')}` : ''} />)}
              </ul>
            </div>}
          <Pager page={page} total={list.length} onPage={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        </>}

        {view === 'scheduled' && (!upcoming.length ? <Empty>{meta.empty}</Empty> : <><ul className="space-y-2">
          {upcoming.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(e => { const l = leads.find(x => x.id === e.lead_id); return <li key={e.id} className="flex items-center gap-4 rounded-2xl border border-ink-border bg-surface p-4">
            <span className="w-20 shrink-0 text-center"><span className="block font-display text-lg font-semibold">{new Date(e.sent_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><span className="text-[11px] text-muted">{new Date(e.sent_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}</span></span>
            <button onClick={() => setEmailId(e.id)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-semibold">{l ? fullName(l) : e.recipients?.[0]}{l?.company ? ` · ${l.company}` : ''}</span><span className="block truncate text-xs text-muted">{e.subject}</span></button>
            <button onClick={() => cancel(e)} className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#EF4444]/10 dark:text-[#F87171]">Cancel</button>
          </li> })}
        </ul><Pager page={page} total={upcoming.length} onPage={setPage} /></>)}

        {view === 'sent' && <SentList emails={emails} events={events} leads={leads} onOpen={id => setEmailId(id)}
          onAdd={async (emailId, email) => { const { ok } = await call('link', { emailId, lead: { email, source: 'other' } }); if (ok) await load() }} />}

        {view === 'templates' && <TemplatesView templates={templates} sample={leads[0]}
          onSave={async t => { const { ok, data } = await call('template_save', { template: t }); if (ok) setTemplates(ts => (t.id ? ts.map(x => (x.id === t.id ? data.template : x)) : [...ts, data.template])); return ok ? data.template as Template : null }}
          onDelete={async id => { await call('template_delete', { id }); setTemplates(ts => ts.filter(t => t.id !== id)) }} />}
      </section>
    </div>

    {/* Selection bar: the only way to email several people at once */}
    <AnimatePresence>{selected.size > 0 && isContactView && <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="pointer-events-auto flex items-center gap-3 rounded-full border border-ink-border bg-surface py-2 pl-5 pr-2 shadow-[0_20px_50px_-15px_rgba(17,24,39,.5)]">
        <span className="text-sm font-semibold">{selected.size} {selected.size === 1 ? 'person' : 'people'} selected</span>
        <button onClick={() => setSelected(new Set())} className="text-xs text-muted hover:text-parchment">Clear</button>
        <button onClick={() => write(leads.filter(l => selected.has(l.id)))} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-dim"><Icon name="pen" />Write email</button>
      </motion.div>
    </div>}</AnimatePresence>

    {/* Sending progress */}
    <AnimatePresence>{progress && <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="pointer-events-auto w-full max-w-md rounded-2xl border border-ink-border bg-surface p-4 shadow-[0_20px_50px_-15px_rgba(17,24,39,.5)]">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">{progress.finished ? `${progress.label === 'Scheduling' ? 'Scheduled' : 'Sent'} ${progress.done} of ${progress.total}` : `${progress.label} ${progress.done + 1} of ${progress.total}…`}</span>
          {progress.finished ? <button onClick={() => setProgress(null)} className="text-xs font-semibold text-muted hover:text-parchment">Close</button> : <button onClick={() => { stop.current = true }} className="text-xs font-semibold text-[#DC2626] dark:text-[#F87171]">Stop</button>}
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} /></div>
        {progress.errors.map(e => <p key={e} className="mt-2 text-xs text-[#DC2626] dark:text-[#F87171]">{e}</p>)}
      </motion.div>
    </div>}</AnimatePresence>

    <AnimatePresence>
      {composer && <Composer key="composer" contacts={leads} templates={templates} initial={composer.leads} initialEmails={composer.emails} initialSubject={composer.subject} initialTemplate={composer.templateId} busy={sending} onClose={() => setComposer(null)} onSend={deliver} />}
      {openLead && <ContactPanel key="contact" lead={openLead} followUpDue={due(openLead)} emails={emails.filter(e => e.lead_id === openLead.id)} replies={replies.filter(r => r.lead_id === openLead.id)}
        onClose={() => setOpenId(null)} onViewEmail={id => { setOpenId(null); setEmailId(id) }} onWrite={() => { setOpenId(null); write([openLead]) }} onPatch={c => patch(openLead, c)} onCancel={cancel}
        onLog={async (subject, at) => { const { ok, data } = await call('log', { lead: { email: openLead.email }, subject, sentAt: at }); if (ok) { putLead(data.lead); putEmail(data.email) } return ok ? '' : data.error }}
        onDelete={async () => { if (window.confirm(`Remove ${fullName(openLead)} and their history?`)) { await call('delete', { id: openLead.id }); setLeads(ls => ls.filter(x => x.id !== openLead.id)); setOpenId(null) } }} />}
      {emailId && <EmailPanel key={`email-${emailId}`} id={emailId} lead={leads.find(l => l.id === emails.find(e => e.id === emailId)?.lead_id)}
        load={loadEmail} onClose={() => setEmailId(null)}
        onFollowUp={(to, subject) => { setEmailId(null); const l = leads.find(x => leadEmails(x).some(e => e.toLowerCase() === to.toLowerCase())); setComposer({ leads: l ? [l] : [], emails: l ? [] : [to], subject, templateId: null }) }}
        onOpenContact={id => { setEmailId(null); setOpenId(id) }}
        onAddContact={async (id, address) => { const { ok } = await call('link', { emailId: id, lead: { email: address, source: 'other' } }); if (ok) await load() }}
        onCancel={async id => { const e = emails.find(x => x.id === id); if (e) { await cancel(e); setEmailId(null) } }} />}
      {panel === 'add' && <AddContactsPanel key="add" onClose={() => setPanel(null)}
        onAdd={async (lead, sent) => {
          const { ok, data } = sent ? await call('log', { lead, subject: sent.subject, sentAt: sent.at }) : await call('add_lead', { lead })
          if (!ok) return data.error || 'Could not save.'
          putLead(data.lead); putEmail(data.email)
          return sent ? `✓ Saved ${fullName(data.lead)} and logged your email.` : data.created ? `✓ Added ${fullName(data.lead)}.` : `${fullName(data.lead)} was already in your contacts; blanks were filled in.`
        }}
        onImport={async (rows, src) => { const { ok, data } = await call('import', { leads: rows, source: src }); if (ok) await load(); return ok ? data : { error: data.error } }} />}
      {panel === 'rules' && <RulesPanel key="rules" settings={settings} onClose={() => setPanel(null)} onSave={async s => { const { ok, data } = await call('settings', { settings: s }); if (ok) setSettings(data.settings) }} />}
    </AnimatePresence>
  </main>
}

function Stat({ label, value }: { label: string; value: string }) {
  return <span className="rounded-full border border-ink-border px-3.5 py-2"><span className="font-semibold text-parchment">{value}</span> <span className="text-muted">{label}</span></span>
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-ink-border bg-surface/50 p-10 text-center text-sm text-muted">{children}</p>
}

function ContactRow({ lead: l, checked, onCheck, onOpen, onWrite, note }: { lead: Lead; checked: boolean; onCheck: () => void; onOpen: () => void; onWrite: () => void; note: string }) {
  return <li className={`group flex items-center gap-3 px-4 py-3 transition ${checked ? 'bg-primary/[0.05]' : 'hover:bg-surface-2/50'}`}>
    <input type="checkbox" checked={checked} onChange={onCheck} aria-label={`Select ${fullName(l)}`} className="h-4 w-4 shrink-0 accent-[rgb(var(--primary))]" />
    <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
      <Avatar lead={l} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{fullName(l)}</span>
        <span className="block truncate text-xs text-muted">{[l.title, l.company].filter(Boolean).join(' · ') || l.email}</span>
      </span>
      <span className="hidden w-40 shrink-0 md:block"><Progress status={l.status} /><span className="mt-1 block text-[11px] text-muted">{sourceLabel(l.source)}{l.last_sent_at && l.last_sent_at < new Date().toISOString() ? ` · ${ago(l.last_sent_at)}` : ''}</span></span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <StatusPill status={l.status} />
        {note && <span className="whitespace-nowrap text-[11px] font-semibold text-primary">{note}</span>}
      </span>
    </button>
    <button onClick={onWrite} aria-label={`Write to ${fullName(l)}`} title="Write email" className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-border text-sm text-muted transition hover:border-primary hover:text-primary sm:flex"><Icon name="pen" /></button>
  </li>
}

type SentFilter = 'all' | 'opened' | 'unopened' | 'scheduled' | 'logged' | 'failed'
const SENT_FILTERS: [SentFilter, string][] = [['all', 'All'], ['opened', 'Opened'], ['unopened', 'Not opened'], ['scheduled', 'Scheduled'], ['logged', 'Sent elsewhere'], ['failed', 'Failed']]

function SentList({ emails, events, leads, onOpen, onAdd }: { emails: (SentEmail & { recipients?: string[] })[]; events: Event[]; leads: Lead[]; onOpen: (id: string) => void; onAdd: (emailId: string, email: string) => Promise<void> }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<SentFilter>('all')
  const [page, setPage] = useState(1)
  useEffect(() => setPage(1), [query, filter])
  const opens = useMemo(() => { const m = new Map<string, number>(); for (const e of events) if (e.event_type === 'open') m.set(e.email_id, (m.get(e.email_id) || 0) + 1); return m }, [events])
  const clicked = useMemo(() => new Set(events.filter(e => e.event_type === 'click').map(e => e.email_id)), [events])
  const byId = useMemo(() => new Map(leads.map(l => [l.id, l])), [leads])
  const known = useMemo(() => new Set(leads.flatMap(l => leadEmails(l)).map(e => e.toLowerCase())), [leads])

  const q = query.trim().toLowerCase()
  const all = emails.filter(e => e.status !== 'cancelled')
  const match = (e: SentEmail & { recipients?: string[] }, f: SentFilter) =>
    f === 'all' ? true : f === 'opened' ? e.status === 'sent' && (opens.get(e.id) || 0) > 0 : f === 'unopened' ? e.status === 'sent' && !opens.get(e.id) : e.status === f
  const shown = all.filter(e => {
    if (!match(e, filter)) return false
    if (!q) return true
    const lead = e.lead_id ? byId.get(e.lead_id) : undefined
    return [e.subject, ...(e.recipients || []), lead && fullName(lead), lead?.company].some(v => v?.toLowerCase().includes(q))
  })
  if (!all.length) return <Empty>No emails sent yet.</Empty>

  return <>
    <div className="mb-3 flex flex-wrap gap-2">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search person, company or subject" className="min-w-0 flex-1 rounded-full border border-ink-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" />
    </div>
    <div className="mb-3 flex flex-wrap gap-1.5">
      {SENT_FILTERS.map(([k, t]) => { const n = all.filter(e => match(e, k)).length; return <button key={k} onClick={() => setFilter(k)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === k ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-surface text-muted hover:text-parchment'}`}>{t} <span className="opacity-70">{n}</span></button> })}
    </div>
    {!shown.length ? <Empty>No emails match.</Empty> : <div className="overflow-hidden rounded-2xl border border-ink-border bg-surface">
      <ul className="divide-y divide-ink-border">
        {shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(e => {
          const lead = e.lead_id ? byId.get(e.lead_id) : undefined
          const to = lead ? fullName(lead) : e.recipients?.join(', ') || '-'
          const n = opens.get(e.id) || 0
          const addable = !lead && e.recipients?.length === 1 && !known.has(e.recipients[0].toLowerCase())
          return <li key={e.id} className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => onOpen(e.id)} className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm"><span className="font-semibold">{to}</span><span className="text-muted"> · {e.subject}</span></span>
              <span className="block text-xs text-muted">{e.status === 'scheduled' ? `Scheduled for ${when(e.sent_at)}` : e.status === 'logged' ? `Sent from another inbox · ${when(e.sent_at)}` : e.status === 'failed' ? 'Failed to send' : when(e.sent_at)}</span>
            </button>
            {e.status === 'sent' && <span className="hidden shrink-0 gap-1.5 text-[11px] sm:flex">
              <span className={`rounded-full px-2 py-0.5 ${n ? 'bg-primary/15 font-semibold text-primary' : 'bg-surface-2 text-muted'}`}>{n ? `Opened${n > 1 ? ` ×${n}` : ''}` : 'Not opened'}</span>
              {clicked.has(e.id) && <span className="rounded-full bg-primary px-2 py-0.5 font-semibold text-on-primary">Clicked</span>}
            </span>}
            <button onClick={() => onOpen(e.id)} aria-label="View email" className="hidden shrink-0 text-muted hover:text-primary md:block"><Icon name="chevronRight" /></button>
            {addable && <button onClick={() => onAdd(e.id, e.recipients![0])} className="shrink-0 rounded-full border border-ink-border px-3 py-1.5 text-[11px] font-semibold hover:border-primary hover:text-primary">+ Add to contacts</button>}
          </li>
        })}
      </ul>
    </div>}
    <Pager page={page} total={shown.length} onPage={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
  </>
}
