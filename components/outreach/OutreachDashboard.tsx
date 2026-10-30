'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminNav from '@/components/AdminNav'
import { TypeHeading } from '@/components/home/Motion'
import { apolloToLead, parseCsv } from '@/lib/csv'
import { DEFAULT_SETTINGS, followUpDue, isFinished, personalise, SOURCES, type Lead, type LeadStatus, type OutreachSettings, type Reply, type SentEmail, type Template } from '@/lib/outreach'

// Private outreach tracker. Contacts come from anywhere (Apollo, LinkedIn,
// referrals…); emails are written from a library of templates, edited per
// person, and sent now or scheduled. Opens, clicks, bounces and replies update
// each contact automatically. Emails sent elsewhere can be logged too.

const PW_KEY = 'ladyprowess_admin_password'
const STEPS: LeadStatus[] = ['sent', 'opened', 'clicked', 'replied']
const RANK: Record<LeadStatus, number> = { new: 0, sent: 1, opened: 2, clicked: 3, replied: 4, bounced: -1, stopped: -1 }
const pill: Record<LeadStatus, string> = {
  new: 'bg-surface-2 text-muted', sent: 'bg-primary/10 text-primary', opened: 'bg-primary/20 text-primary', clicked: 'bg-primary text-on-primary',
  replied: 'bg-success/15 text-success', bounced: 'bg-[#EF4444]/10 text-[#DC2626]', stopped: 'bg-surface-2 text-muted',
}
const label: Record<LeadStatus, string> = { new: 'Not contacted', sent: 'Sent', opened: 'Opened', clicked: 'Clicked', replied: 'Replied', bounced: 'Bounced', stopped: 'Stopped' }
const sourceLabel = (k: string) => SOURCES.find(s => s.key === k)?.label || 'Other'

type Filter = LeadStatus | 'all' | 'due'
type Tab = 'contacts' | 'scheduled' | 'templates' | 'add'
type LogLine = { id: number; ok: boolean; text: string }
type Composer = { leads: Lead[]; templateId: string | null }

const ago = (iso: string | null) => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.round(Math.abs(diff) / 60000)
  const t = m < 60 ? `${Math.max(1, m)}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`
  return diff < 0 ? `in ${t}` : `${t} ago`
}
const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const name = (l: Pick<Lead, 'first_name' | 'last_name' | 'email'>) => [l.first_name, l.last_name].filter(Boolean).join(' ') || l.email
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
/** "datetime-local" value for a Date, in the browser's own time zone. */
const localInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
const input = 'w-full rounded-xl border border-ink-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary'

export default function OutreachDashboard() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [authError, setAuthError] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [emails, setEmails] = useState<SentEmail[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [settings, setSettings] = useState<OutreachSettings>(DEFAULT_SETTINGS)
  const [sentToday, setSentToday] = useState(0)
  const [tab, setTab] = useState<Tab>('contacts')
  const [filter, setFilter] = useState<Filter>('all')
  const [source, setSource] = useState('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [composer, setComposer] = useState<Composer | null>(null)
  const [logFor, setLogFor] = useState<Lead | null>(null)
  const [log, setLog] = useState<LogLine[]>([])
  const [running, setRunning] = useState(false)
  const stop = useRef(false)

  const call = useCallback(async (action: string, extra: Record<string, unknown> = {}, pw = password) => {
    const res = await fetch('/api/outreach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw, action, ...extra }) })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  }, [password])

  const load = useCallback(async (pw = password) => {
    const { ok, status, data } = await call('load', {}, pw)
    if (!ok) { setAuthError(status === 401 ? 'Wrong password.' : data.error || 'Could not load outreach. Has supabase/outreach.sql been run?'); setUnlocked(false); return }
    sessionStorage.setItem(PW_KEY, pw)
    setLeads(data.leads); setEmails(data.emails); setReplies(data.replies); setTemplates(data.templates); setSettings(data.settings); setSentToday(data.sentToday)
    setUnlocked(true); setAuthError('')
  }, [call, password])

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY)
    if (saved) { setPassword(saved); load(saved) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Opens, clicks and replies arrive by webhook, so refresh quietly every minute.
  useEffect(() => {
    if (!unlocked || running || composer) return
    const t = window.setInterval(() => load(), 60_000)
    return () => window.clearInterval(t)
  }, [unlocked, running, composer, load])

  const say = (ok: boolean, text: string) => setLog(l => [{ id: Date.now() + Math.random(), ok, text }, ...l].slice(0, 50))
  const putLead = (lead: Lead) => setLeads(ls => (ls.some(l => l.id === lead.id) ? ls.map(l => (l.id === lead.id ? lead : l)) : [lead, ...ls]))
  const putEmail = (e: SentEmail) => setEmails(es => [e, ...es.filter(x => x.id !== e.id)])

  const scheduledFor = useMemo(() => {
    const m = new Map<string, SentEmail>()
    for (const e of emails) if (e.status === 'scheduled' && new Date(e.sent_at).getTime() > Date.now()) { const cur = m.get(e.lead_id); if (!cur || cur.sent_at > e.sent_at) m.set(e.lead_id, e) }
    return m
  }, [emails])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, due: 0 }
    for (const l of leads) { c[l.status] = (c[l.status] || 0) + 1; if (followUpDue(l, settings)) c.due += 1 }
    return c
  }, [leads, settings])

  const contacted = leads.filter(l => l.status !== 'new').length
  const reached = (min: number) => leads.filter(l => RANK[l.status] >= min).length
  const pct = (n: number) => (contacted ? Math.round((n / contacted) * 100) : 0)
  const left = Math.max(0, settings.daily_limit - sentToday)
  const newLeads = leads.filter(l => l.status === 'new' && !scheduledFor.has(l.id)).slice().reverse()
  const dueLeads = leads.filter(l => followUpDue(l, settings) && !scheduledFor.has(l.id))
  const scheduled = emails.filter(e => e.status === 'scheduled' && new Date(e.sent_at).getTime() > Date.now()).sort((a, b) => a.sent_at.localeCompare(b.sent_at))

  const shown = leads.filter(l => {
    if (filter === 'due' ? !followUpDue(l, settings) : filter !== 'all' && l.status !== filter) return false
    if (source !== 'all' && (l.source || 'other') !== source) return false
    const q = query.trim().toLowerCase()
    return !q || [l.email, l.first_name, l.last_name, l.company, l.title].some(v => v?.toLowerCase().includes(q))
  })
  const toggle = (id: string) => setSelected(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const followUpTemplate = templates.find(t => /follow/i.test(t.name))?.id ?? templates[0]?.id ?? null

  /** Sends or schedules one email per contact. Batches never email finished contacts. */
  async function deliver(list: Lead[], make: (l: Lead) => { subject: string; body: string }, schedule: { at: Date; gapMin: number } | null, force: boolean) {
    setRunning(true); stop.current = false
    let done = 0
    for (let i = 0; i < list.length; i++) {
      if (stop.current) { say(false, 'Stopped. Nothing else was sent.'); break }
      const lead = list[i]
      const { subject, body } = make(lead)
      const scheduledAt = schedule ? new Date(schedule.at.getTime() + i * schedule.gapMin * 60000).toISOString() : undefined
      const { ok, data } = await call('send', { id: lead.id, subject, body, scheduledAt, force })
      if (ok) {
        putLead(data.lead); putEmail(data.email); setSentToday(data.sentToday); done += 1
        say(true, `${scheduledAt ? `Scheduled for ${when(scheduledAt)}:` : 'Sent to'} ${name(lead)}${lead.company ? ` at ${lead.company}` : ''}`)
      } else { say(false, `${name(lead)}: ${data.error || 'failed'}`); if (data.limit && !schedule) break }
      if (!schedule && i < list.length - 1) await wait(8000 + Math.random() * 6000)
    }
    setRunning(false)
    return done
  }

  async function patch(lead: Lead, change: Record<string, unknown>) {
    const { ok, data } = await call('update', { id: lead.id, ...change })
    if (ok && data.lead) putLead(data.lead)
  }

  async function cancel(e: SentEmail) {
    if (!window.confirm('Cancel this scheduled email? It will not be sent.')) return
    const { ok, data } = await call('cancel', { emailId: e.id })
    if (!ok) { say(false, data.error || 'Could not cancel.'); return }
    setEmails(es => es.map(x => (x.id === e.id ? { ...x, status: 'cancelled' } : x)))
    if (data.lead) putLead(data.lead)
    say(true, 'Cancelled a scheduled email.')
  }

  if (!unlocked) return <main className="flex min-h-screen items-center justify-center bg-bg px-5">
    <form onSubmit={e => { e.preventDefault(); load(password) }} className="w-full max-w-sm rounded-3xl border border-ink-border bg-surface p-7">
      <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Private · Outreach</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.03em]">Unlock your tracker</h1>
      <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" className="mt-6 w-full rounded-full border border-ink-border bg-bg px-4 py-3 text-sm outline-none focus:border-primary" />
      {authError && <p className="mt-3 text-sm text-[#DC2626]">{authError}</p>}
      <button className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:bg-primary-dim">Unlock</button>
    </form>
  </main>

  return <main className="min-h-screen bg-bg pb-24 text-parchment">
    <AdminNav />
    <section className="relative overflow-hidden border-b border-ink-border">
      <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-12">
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Private · Outreach</p>
        <TypeHeading as="h1" className="mt-3 font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.6rem]" text="Every email you send, tracked for you." />
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Any contact, any email, now or scheduled. Opens, clicks, bounces and replies update by themselves; you follow up when it tells you to.</p>
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {([['Contacts', leads.length, ''], ['Emailed', contacted, ''], ['Opened', reached(2), `${pct(reached(2))}%`], ['Clicked', reached(3), `${pct(reached(3))}%`], ['Replied', counts.replied || 0, `${pct(counts.replied || 0)}%`], ['Scheduled', scheduled.length, '']] as const).map(([k, v, p]) =>
            <div key={k} className="flex flex-col-reverse rounded-2xl border border-ink-border bg-surface p-4">
              <dt className="mt-1 text-xs text-muted">{k}{p && <span className="ml-1 text-primary">· {p}</span>}</dt><dd className="font-display text-3xl font-semibold tracking-[-.04em]">{v}</dd>
            </div>)}
        </dl>
      </div>
    </section>

    <div className="mx-auto grid max-w-[1240px] gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_330px]">
      <div className="min-w-0">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-ink-border bg-surface p-1 text-sm font-semibold [scrollbar-width:none] sm:w-max">
          {([['contacts', 'Contacts'], ['scheduled', `Scheduled${scheduled.length ? ` · ${scheduled.length}` : ''}`], ['templates', 'Templates'], ['add', 'Add contacts']] as const).map(([k, t]) =>
            <button key={k} onClick={() => setTab(k)} className={`shrink-0 rounded-full px-4 py-2 transition ${tab === k ? 'bg-primary text-on-primary' : 'text-muted hover:text-parchment'}`}>{t}</button>)}
        </div>

        {tab === 'contacts' && <div className="mt-5">
          <div className="flex flex-wrap gap-2">
            {(['all', 'due', 'new', 'sent', 'opened', 'clicked', 'replied', 'bounced', 'stopped'] as Filter[]).map(f => <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === f ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-surface text-muted hover:text-parchment'}`}>
              {f === 'all' ? 'All' : f === 'due' ? 'Follow-up due' : label[f as LeadStatus]} <span className="opacity-70">{counts[f] || 0}</span>
            </button>)}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, company, email…" className="min-w-0 flex-1 rounded-full border border-ink-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <select value={source} onChange={e => setSource(e.target.value)} aria-label="Source" className="rounded-full border border-ink-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary">
              <option value="all">All sources</option>{SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          {shown.length > 0 && <label className="mt-3 flex items-center gap-2 px-1 text-xs font-semibold text-muted">
            <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--primary))]" checked={shown.every(l => selected.has(l.id))} onChange={e => setSelected(e.target.checked ? new Set(shown.map(l => l.id)) : new Set())} />
            Select all {shown.length} shown
          </label>}

          <ul className="mt-2 space-y-2">
            {shown.length === 0 && <li className="rounded-2xl border border-dashed border-ink-border p-8 text-center text-sm text-muted">{leads.length ? 'No contacts match this filter.' : 'No contacts yet. Add one or import a CSV from the “Add contacts” tab.'}</li>}
            {shown.map(l => <LeadRow key={l.id} lead={l} open={open === l.id} onToggle={() => setOpen(open === l.id ? null : l.id)} due={followUpDue(l, settings)}
              checked={selected.has(l.id)} onCheck={() => toggle(l.id)} next={scheduledFor.get(l.id)}
              history={emails.filter(e => e.lead_id === l.id)} replies={replies.filter(r => r.lead_id === l.id)}
              onWrite={() => setComposer({ leads: [l], templateId: l.status === 'new' ? templates[0]?.id ?? null : followUpTemplate })}
              onLog={() => setLogFor(l)} onPatch={c => patch(l, c)} onCancel={cancel}
              onDelete={async () => { if (window.confirm(`Remove ${name(l)} and their history from your list?`)) { await call('delete', { id: l.id }); setLeads(ls => ls.filter(x => x.id !== l.id)) } }} />)}
          </ul>
        </div>}

        {tab === 'scheduled' && <div className="mt-5 space-y-2">
          {!scheduled.length && <p className="rounded-2xl border border-dashed border-ink-border p-8 text-center text-sm text-muted">Nothing scheduled. When you write an email, choose “Schedule” to send it later.</p>}
          {scheduled.map(e => { const l = leads.find(x => x.id === e.lead_id); return <div key={e.id} className="flex items-center gap-4 rounded-2xl border border-ink-border bg-surface p-4">
            <span className="w-24 shrink-0 text-center"><span className="block font-display text-lg font-semibold">{new Date(e.sent_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><span className="text-[11px] text-muted">{new Date(e.sent_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}</span></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{l ? name(l) : 'Contact'}{l?.company ? ` · ${l.company}` : ''}</span><span className="block truncate text-xs text-muted">{e.subject}</span></span>
            <button onClick={() => cancel(e)} className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#EF4444]/10">Cancel</button>
          </div> })}
        </div>}

        {tab === 'templates' && <Templates templates={templates} sample={leads[0]}
          onSave={async t => { const { ok, data } = await call('template_save', { template: t }); if (ok) setTemplates(ts => (t.id ? ts.map(x => (x.id === t.id ? data.template : x)) : [...ts, data.template])); return ok ? data.template as Template : null }}
          onDelete={async id => { await call('template_delete', { id }); setTemplates(ts => ts.filter(t => t.id !== id)) }} />}

        {tab === 'add' && <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <AddContact onSave={async (lead, sent) => {
            const { ok, data } = sent ? await call('log', { lead, subject: sent.subject, sentAt: sent.at }) : await call('add_lead', { lead })
            if (!ok) return data.error || 'Could not save.'
            putLead(data.lead); if (data.email) putEmail(data.email)
            return sent ? `✓ Saved ${name(data.lead)} and logged your email. You will be reminded to follow up.` : data.created ? `✓ Added ${name(data.lead)}.` : `${name(data.lead)} was already on your list; any blanks were filled in.`
          }} />
          <Importer onImport={async (rows, src) => { const { ok, data } = await call('import', { leads: rows, source: src }); if (ok) await load(); return ok ? data : { error: data.error } }} />
        </div>}
      </div>

      {/* Sidebar: today, sending rules and the live log */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-3xl border border-ink-border bg-surface p-5">
          <p className="font-head text-[10px] uppercase tracking-wider text-muted">Today</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-[-.04em]">{sentToday}<span className="text-lg text-muted"> / {settings.daily_limit} sent</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-primary" animate={{ width: `${Math.min(100, (sentToday / settings.daily_limit) * 100)}%` }} /></div>
          <div className="mt-5 space-y-2">
            <button disabled={running || !newLeads.length} onClick={() => setComposer({ leads: newLeads.slice(0, Math.max(1, left)), templateId: templates[0]?.id ?? null })} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-dim disabled:bg-surface-2 disabled:text-muted">
              Email new contacts · {Math.min(newLeads.length, Math.max(left, 0)) || newLeads.length}
            </button>
            <button disabled={running || !dueLeads.length} onClick={() => setComposer({ leads: dueLeads.slice(0, Math.max(1, left)), templateId: followUpTemplate })} className="w-full rounded-full border border-ink-border px-4 py-3 text-sm font-semibold transition hover:border-primary disabled:text-muted">
              Follow up · {dueLeads.length} due
            </button>
            {running && <button onClick={() => { stop.current = true }} className="w-full rounded-full px-4 py-2 text-sm font-semibold text-[#DC2626] hover:bg-[#EF4444]/10">Stop sending</button>}
          </div>
          <Rules settings={settings} onSave={async s => { const { ok, data } = await call('settings', { settings: s }); if (ok) setSettings(data.settings) }} />
        </div>

        <div className="overflow-hidden rounded-3xl border border-ink-border bg-surface">
          <div className="flex items-center gap-2 border-b border-ink-border px-4 py-2.5">
            <span className="flex gap-1">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />)}</span>
            <span className="text-xs font-semibold">activity.log</span>
            {running && <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-head text-[9px] font-semibold uppercase text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />Sending</span>}
          </div>
          <ul className="max-h-72 space-y-1.5 overflow-y-auto p-4 font-mono text-[11.5px] leading-5">
            {!log.length && <li className="text-muted">Nothing sent this session yet.</li>}
            <AnimatePresence initial={false}>{log.map(line => <motion.li key={line.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={line.ok ? '' : 'text-[#DC2626]'}>{line.ok ? '✓' : '!'} {line.text}</motion.li>)}</AnimatePresence>
          </ul>
        </div>
      </aside>
    </div>

    {/* Selection bar */}
    <AnimatePresence>{selected.size > 0 && tab === 'contacts' && <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="pointer-events-auto flex items-center gap-3 rounded-full border border-ink-border bg-surface py-2 pl-5 pr-2 shadow-[0_20px_50px_-15px_rgba(17,24,39,.5)]">
        <span className="text-sm font-semibold">{selected.size} selected</span>
        <button onClick={() => setSelected(new Set())} className="text-xs text-muted hover:text-parchment">Clear</button>
        <button onClick={() => setComposer({ leads: leads.filter(l => selected.has(l.id)), templateId: templates[0]?.id ?? null })} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-dim">Write email →</button>
      </motion.div>
    </div>}</AnimatePresence>

    <AnimatePresence>{composer && <ComposerPanel key="composer" composer={composer} templates={templates} left={left} busy={running}
      onClose={() => setComposer(null)}
      onSend={async (make, schedule, force) => { const list = composer.leads; setComposer(null); const n = await deliver(list, make, schedule, force); if (n) setSelected(new Set()) }} />}</AnimatePresence>

    <AnimatePresence>{logFor && <Modal key="log" title={`Log an email you sent to ${name(logFor)}`} onClose={() => setLogFor(null)}>
      <LogEmail onSave={async (subject, at) => { const { ok, data } = await call('log', { lead: { email: logFor.email }, subject, sentAt: at }); if (ok) { putLead(data.lead); putEmail(data.email); setLogFor(null) } return ok ? '' : data.error }} />
    </Modal>}</AnimatePresence>
  </main>
}

function LeadRow({ lead: l, open, onToggle, due, checked, onCheck, next, history, replies, onWrite, onLog, onPatch, onCancel, onDelete }: {
  lead: Lead; open: boolean; onToggle: () => void; due: boolean; checked: boolean; onCheck: () => void; next?: SentEmail; history: SentEmail[]; replies: Reply[]
  onWrite: () => void; onLog: () => void; onPatch: (c: Record<string, unknown>) => void; onCancel: (e: SentEmail) => void; onDelete: () => void
}) {
  const [notes, setNotes] = useState(l.notes)
  useEffect(() => setNotes(l.notes), [l.notes])
  const last = l.replied_at || l.clicked_at || l.opened_at || (l.last_sent_at && l.last_sent_at < new Date().toISOString() ? l.last_sent_at : null)
  return <li className={`overflow-hidden rounded-2xl border bg-surface transition ${open ? 'border-primary/40 shadow-[0_20px_40px_-28px_rgba(17,24,39,.45)]' : checked ? 'border-primary/40' : 'border-ink-border'}`}>
    <div className="flex items-center gap-3 p-3.5">
      <input type="checkbox" checked={checked} onChange={onCheck} aria-label={`Select ${name(l)}`} className="h-4 w-4 shrink-0 accent-[rgb(var(--primary))]" />
      <button onClick={onToggle} className="grid min-w-0 flex-1 grid-cols-[auto_1fr_auto] items-center gap-3 text-left sm:grid-cols-[auto_1.4fr_1fr_auto] sm:gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{(l.first_name?.[0] || l.email[0]).toUpperCase()}{l.last_name?.[0]?.toUpperCase() || ''}</span>
        <span className="min-w-0"><span className="block truncate text-sm font-semibold">{name(l)}</span><span className="block truncate text-xs text-muted">{[l.title, l.company].filter(Boolean).join(' · ') || l.email}</span></span>
        <span className="hidden items-center gap-1.5 sm:flex" aria-label={`Progress: ${label[l.status]}`}>
          {STEPS.map((s, i) => <span key={s} className="flex items-center gap-1.5">
            {i > 0 && <span className={`h-px w-4 ${RANK[l.status] >= RANK[s] ? 'bg-primary' : 'bg-ink-border'}`} />}
            <span title={label[s]} className={`h-2.5 w-2.5 rounded-full ${RANK[l.status] >= RANK[s] ? (s === 'replied' ? 'bg-success' : 'bg-primary') : 'bg-ink-border'}`} />
          </span>)}
          <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted">{sourceLabel(l.source)}</span>
          {last && <span className="text-[11px] text-muted">{ago(last)}</span>}
        </span>
        <span className="flex flex-col items-end gap-1">
          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${pill[l.status]}`}>{label[l.status]}</span>
          {next ? <span className="whitespace-nowrap text-[10px] font-semibold text-primary">Scheduled {ago(next.sent_at)}</span> : due && <span className="whitespace-nowrap text-[10px] font-semibold text-primary">Follow-up due</span>}
        </span>
      </button>
    </div>

    <AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
      <div className="grid gap-5 border-t border-ink-border p-4 md:grid-cols-2">
        <div className="space-y-1.5 text-xs">
          <p><span className="text-muted">Email </span><a href={`mailto:${l.email}`} className="font-semibold hover:text-primary">{l.email}</a></p>
          <p><span className="text-muted">Met via </span><select value={l.source || 'other'} onChange={e => onPatch({ source: e.target.value })} className="rounded-md border border-ink-border bg-bg px-1.5 py-0.5">{SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select></p>
          {l.country && <p><span className="text-muted">Location </span>{l.country}</p>}
          <p className="flex flex-wrap gap-3 pt-1">{l.linkedin && <a href={l.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">LinkedIn ↗</a>}{l.website && <a href={l.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">Website ↗</a>}</p>
          <p className="pt-3 font-head text-[10px] uppercase tracking-wider text-muted">History</p>
          <ol className="space-y-1.5 border-l border-ink-border pl-3">
            {!history.length && <li className="text-muted">No emails yet.</li>}
            {history.map(e => <li key={e.id} className={e.status === 'cancelled' ? 'text-muted line-through' : ''}>
              <span className="font-semibold">{e.subject}</span>
              <span className="text-muted"> · {e.status === 'scheduled' ? `scheduled ${when(e.sent_at)}` : e.status === 'logged' ? `logged, sent ${ago(e.sent_at)}` : e.status === 'cancelled' ? 'cancelled' : e.status === 'failed' ? 'failed' : `sent ${ago(e.sent_at)}`}</span>
              {e.status === 'scheduled' && <button onClick={() => onCancel(e)} className="ml-2 font-semibold text-[#DC2626]">Cancel</button>}
            </li>)}
            {l.opened_at && <li className="text-muted">Opened · {ago(l.opened_at)}</li>}
            {l.clicked_at && <li className="text-muted">Clicked a link · {ago(l.clicked_at)}</li>}
            {l.bounced_at && <li className="text-[#DC2626]">Bounced · {ago(l.bounced_at)}</li>}
            {l.replied_at && <li className="font-semibold text-success">Replied · {ago(l.replied_at)}</li>}
          </ol>
          {replies.map(r => <div key={r.id} className="mt-2 rounded-xl bg-success/[0.07] p-3 text-[12px]"><p className="font-semibold">{r.subject || 'Reply'}</p>{r.snippet && <p className="mt-1 text-muted">{r.snippet}</p>}</div>)}
        </div>
        <div>
          <label className="font-head text-[10px] uppercase tracking-wider text-muted" htmlFor={`n-${l.id}`}>Notes</label>
          <textarea id={`n-${l.id}`} value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => notes !== l.notes && onPatch({ notes })} rows={3} placeholder="e.g. Asked me to follow up in January" className="mt-1.5 w-full resize-none rounded-xl border border-ink-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <button onClick={onWrite} className="rounded-full bg-primary px-3.5 py-2 text-on-primary hover:bg-primary-dim">Write email</button>
            <button onClick={onLog} className="rounded-full border border-ink-border px-3.5 py-2 hover:border-primary">Log an email I sent</button>
            {l.status !== 'replied' && <button onClick={() => onPatch({ status: 'replied' })} className="rounded-full border border-ink-border px-3.5 py-2 hover:border-success hover:text-success">Mark replied</button>}
            {!isFinished(l.status) && <button onClick={() => onPatch({ status: 'stopped' })} className="rounded-full border border-ink-border px-3.5 py-2 hover:border-muted">Stop emailing</button>}
            {isFinished(l.status) && <button onClick={() => onPatch({ status: l.first_sent_at ? 'sent' : 'new' })} className="rounded-full border border-ink-border px-3.5 py-2 hover:border-muted">Reopen</button>}
            <button onClick={onDelete} className="rounded-full px-3.5 py-2 text-[#DC2626] hover:bg-[#EF4444]/10">Remove</button>
          </div>
        </div>
      </div>
    </motion.div>}</AnimatePresence>
  </li>
}

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [onClose])
  return <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()} initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }}
      className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-ink-border bg-surface sm:rounded-3xl ${wide ? 'sm:max-w-4xl' : 'sm:max-w-lg'}`}>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-ink-border bg-surface px-5 py-3">
        <span className="flex gap-1">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
        <span className="truncate text-sm font-semibold">{title}</span>
        <button onClick={onClose} aria-label="Close" className="ml-auto rounded-full px-2 text-lg text-muted hover:text-parchment">×</button>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  </motion.div>
}

/** Pick a template, edit it, then send now or schedule, to one person or many. */
function ComposerPanel({ composer, templates, left, busy, onClose, onSend }: {
  composer: Composer; templates: Template[]; left: number; busy: boolean; onClose: () => void
  onSend: (make: (l: Lead) => { subject: string; body: string }, schedule: { at: Date; gapMin: number } | null, force: boolean) => void
}) {
  const many = composer.leads.length > 1
  const first = composer.leads[0]
  const [templateId, setTemplateId] = useState(composer.templateId ?? '')
  const tpl = templates.find(t => t.id === templateId)
  // One person: edit their actual email. Many: edit the template, personalised per person.
  const fill = (t?: Template) => ({ subject: t ? (many ? t.subject : personalise(t.subject, first)) : '', body: t ? (many ? t.body : personalise(t.body, first)) : '' })
  const [draft, setDraft] = useState(() => fill(tpl))
  const [preview, setPreview] = useState(0)
  const [mode, setMode] = useState<'now' | 'later'>('now')
  const [at, setAt] = useState(() => { const d = new Date(Date.now() + 86_400_000); d.setHours(9, 0, 0, 0); return localInput(d) })
  const [gap, setGap] = useState(3)
  const finished = composer.leads.filter(l => isFinished(l.status))
  const pick = (id: string) => { setTemplateId(id); setDraft(fill(templates.find(t => t.id === id))) }
  const make = (l: Lead) => (many ? { subject: personalise(draft.subject, l), body: personalise(draft.body, l) } : draft)
  const p = composer.leads[preview] ?? first
  const shown = make(p)
  const ready = draft.subject.trim() && draft.body.trim()

  const send = () => {
    if (!ready) return
    let force = false
    if (!many && finished.length) { if (!window.confirm(`${name(first)} is marked ${label[first.status].toLowerCase()}. Send anyway?`)) return; force = true }
    if (mode === 'later') {
      const date = new Date(at)
      if (Number.isNaN(date.getTime()) || date.getTime() < Date.now() + 60_000) { window.alert('Pick a time at least a minute from now.'); return }
      onSend(make, { at: date, gapMin: gap }, force)
    } else {
      if (many && !window.confirm(`Send ${composer.leads.length} emails now from hello@ladyprowess.com? They go out one at a time, about 10 seconds apart.`)) return
      onSend(make, null, force)
    }
  }

  return <Modal title={many ? `Write to ${composer.leads.length} people` : `Write to ${name(first)}`} onClose={onClose} wide>
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-3">
        <label className="block text-xs text-muted">Template
          <select value={templateId} onChange={e => pick(e.target.value)} className={`mt-1 ${input}`}>
            <option value="">Blank email</option>{templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="block text-xs text-muted">Subject<input value={draft.subject} onChange={e => setDraft({ ...draft, subject: e.target.value })} className={`mt-1 ${input}`} /></label>
        <label className="block text-xs text-muted">Message<textarea value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={12} className={`mt-1 resize-y font-mono text-[12.5px] leading-6 ${input}`} /></label>
        {many && <p className="text-xs text-muted">Use {'{first_name}'}, {'{company}'}, {'{title}'} and they’re filled in for each person. Changes here apply to this send only; the template itself is unchanged.</p>}
        {many && finished.length > 0 && <p className="rounded-xl bg-surface-2 p-3 text-xs text-muted">{finished.length} of these have replied, bounced or been stopped and will be skipped.</p>}

        <div className="rounded-2xl border border-ink-border p-3">
          <div className="flex gap-1 text-xs font-semibold">
            {([['now', 'Send now'], ['later', 'Schedule']] as const).map(([k, t]) => <button key={k} onClick={() => setMode(k)} className={`rounded-full px-3 py-1.5 ${mode === k ? 'bg-primary text-on-primary' : 'text-muted'}`}>{t}</button>)}
          </div>
          {mode === 'later' ? <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-muted">{many ? 'First email at' : 'Send at'}<input type="datetime-local" value={at} onChange={e => setAt(e.target.value)} className={`mt-1 ${input}`} /></label>
            {many && <label className="text-xs text-muted">Then one every (minutes)<input type="number" min={1} max={120} value={gap} onChange={e => setGap(Math.max(1, Number(e.target.value)))} className={`mt-1 ${input}`} /></label>}
            <p className="text-xs text-muted sm:col-span-2">Resend sends {many ? 'them' : 'it'} at that time, even if your laptop is closed. You can cancel from the Scheduled tab.</p>
          </div> : <p className="mt-2 text-xs text-muted">{many ? `Goes out one at a time. ${left} left within today’s limit; any beyond that are not sent.` : 'Goes out straight away.'}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button disabled={!ready || busy} onClick={send} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-dim disabled:opacity-50">{mode === 'later' ? 'Schedule' : 'Send'}{many ? ` ${composer.leads.length}` : ''} →</button>
          <button onClick={onClose} className="text-sm font-semibold text-muted hover:text-parchment">Cancel</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-border">
        <div className="flex items-center justify-between gap-2 border-b border-ink-border bg-surface-2/50 px-4 py-2.5 text-xs">
          <span className="truncate font-semibold">Preview · {name(p)}{p.company ? `, ${p.company}` : ''}</span>
          {many && <span className="flex shrink-0 gap-1"><button onClick={() => setPreview(i => (i - 1 + composer.leads.length) % composer.leads.length)} className="rounded-full border border-ink-border px-2">←</button><button onClick={() => setPreview(i => (i + 1) % composer.leads.length)} className="rounded-full border border-ink-border px-2">→</button></span>}
        </div>
        <div className="bg-paper p-5 text-sm leading-6">
          <p className="text-xs text-muted">From Lady Prowess &lt;hello@ladyprowess.com&gt; · to {p.email}</p>
          <p className="mt-1 font-semibold">{shown.subject || 'No subject'}</p>
          <div className="mt-4 whitespace-pre-wrap">{shown.body}</div>
          <p className="mt-4 border-t border-ink-border pt-3 text-xs text-muted">+ your Lady Prowess signature</p>
        </div>
      </div>
    </div>
  </Modal>
}

function Templates({ templates, sample, onSave, onDelete }: { templates: Template[]; sample?: Lead; onSave: (t: Partial<Template>) => Promise<Template | null>; onDelete: (id: string) => Promise<void> }) {
  const [id, setId] = useState<string | null>(templates[0]?.id ?? null)
  const current = templates.find(t => t.id === id)
  const [draft, setDraft] = useState<Partial<Template>>(current ?? { name: 'New template', subject: '', body: '' })
  const [saved, setSaved] = useState('')
  const box = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { if (current) setDraft(current) }, [current])
  const lead = sample ?? ({ first_name: 'Ada', last_name: 'Obi', company: 'Acme Pay', title: 'CTO' } as Lead)
  const insert = (field: string) => {
    const text = draft.body || ''
    const s = box.current?.selectionStart ?? text.length
    setDraft({ ...draft, body: `${text.slice(0, s)}{${field}}${text.slice(box.current?.selectionEnd ?? s)}` })
  }

  return <div className="mt-5 space-y-4">
    {/* Template picker: a row of chips, so the editor and preview get the full width */}
    <div className="flex flex-wrap gap-2">
      {templates.map(t => <button key={t.id} onClick={() => setId(t.id)} className={`rounded-full border px-3.5 py-2 text-sm transition ${t.id === id ? 'border-primary bg-primary/10 font-semibold text-primary' : 'border-ink-border bg-surface hover:border-muted'}`}>{t.name}</button>)}
      <button onClick={() => { setId(null); setDraft({ name: 'New template', subject: '', body: '' }) }} className="rounded-full border border-dashed border-ink-border px-3.5 py-2 text-sm font-semibold text-primary hover:border-primary">+ New template</button>
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-3 rounded-3xl border border-ink-border bg-surface p-5">
        <label className="block text-xs text-muted">Template name<input value={draft.name || ''} onChange={e => setDraft({ ...draft, name: e.target.value })} className={`mt-1 ${input}`} /></label>
        <label className="block text-xs text-muted">Subject<input value={draft.subject || ''} onChange={e => setDraft({ ...draft, subject: e.target.value })} className={`mt-1 ${input}`} /></label>
        <label className="block text-xs text-muted">Message<textarea ref={box} value={draft.body || ''} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={13} className={`mt-1 resize-y font-mono text-[12.5px] leading-6 ${input}`} /></label>
        <div className="flex flex-wrap items-center gap-1.5 text-xs"><span className="text-muted">Insert:</span>
          {['first_name', 'last_name', 'company', 'title'].map(f => <button key={f} onClick={() => insert(f)} className="rounded-full border border-ink-border px-2.5 py-1 font-mono hover:border-primary hover:text-primary">{`{${f}}`}</button>)}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button onClick={async () => { const t = await onSave({ ...draft, id: id ?? undefined }); if (t) { setId(t.id); setSaved('✓ Saved') } else setSaved('Could not save'); window.setTimeout(() => setSaved(''), 2500) }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">Save</button>
          {id && <button onClick={async () => { const t = await onSave({ name: `${draft.name} (copy)`, subject: draft.subject, body: draft.body }); if (t) setId(t.id) }} className="text-sm font-semibold text-muted hover:text-parchment">Duplicate</button>}
          {id && <button onClick={async () => { if (window.confirm(`Delete “${draft.name}”?`)) { await onDelete(id); setId(templates.find(t => t.id !== id)?.id ?? null) } }} className="text-sm font-semibold text-[#DC2626]">Delete</button>}
          <span className="text-sm font-semibold text-success">{saved}</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-ink-border bg-surface lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-center gap-2 border-b border-ink-border px-4 py-3">
          <span className="flex gap-1">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
          <span className="truncate text-xs font-semibold">Preview · to {name(lead as Lead)}{lead.company ? `, ${lead.company}` : ''}</span>
        </div>
        <div className="bg-paper p-5 text-sm leading-6">
          <p className="font-semibold">{personalise(draft.subject || '', lead)}</p>
          <div className="mt-4 whitespace-pre-wrap">{personalise(draft.body || '', lead)}</div>
          <p className="mt-4 border-t border-ink-border pt-3 text-xs text-muted">+ your Lady Prowess signature</p>
        </div>
      </div>
    </div>
  </div>
}

function Rules({ settings, onSave }: { settings: OutreachSettings; onSave: (s: OutreachSettings) => Promise<void> }) {
  const [s, setS] = useState(settings)
  const [open, setOpen] = useState(false)
  useEffect(() => setS(settings), [settings])
  return <div className="mt-5 border-t border-ink-border pt-4">
    <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between text-xs font-semibold text-muted hover:text-parchment">Sending rules <span>{open ? '−' : '+'}</span></button>
    {open && <div className="mt-3 space-y-2.5">
      {([['daily_limit', 'Emails per day', 1, 100], ['follow_up_days', 'Follow up after (days)', 1, 30], ['max_follow_ups', 'Max follow-ups', 0, 5]] as const).map(([k, t, lo, hi]) =>
        <label key={k} className="flex items-center justify-between gap-3 text-xs text-muted">{t}<input type="number" min={lo} max={hi} value={s[k]} onChange={e => setS({ ...s, [k]: Number(e.target.value) })} className="w-20 rounded-lg border border-ink-border bg-bg px-2 py-1.5 text-right text-sm text-parchment outline-none focus:border-primary" /></label>)}
      <button onClick={() => onSave(s)} className="w-full rounded-full border border-ink-border py-2 text-xs font-semibold hover:border-primary">Save rules</button>
    </div>}
  </div>
}

/** Add someone by hand; optionally record an email already sent to them elsewhere. */
function AddContact({ onSave }: { onSave: (lead: Record<string, string>, sent: { subject: string; at: string } | null) => Promise<string> }) {
  const blank = { email: '', first_name: '', last_name: '', company: '', title: '', linkedin: '', source: 'linkedin', notes: '' }
  const [f, setF] = useState(blank)
  const [already, setAlready] = useState(false)
  const [sent, setSent] = useState({ subject: '', at: localInput(new Date()) })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  return <form onSubmit={async e => { e.preventDefault(); setBusy(true); const m = await onSave(f, already ? { subject: sent.subject, at: new Date(sent.at).toISOString() } : null); setBusy(false); setMsg(m); if (m.startsWith('✓')) { setF(blank); setAlready(false) } }}
    className="space-y-3 rounded-3xl border border-ink-border bg-surface p-5">
    <p className="font-display text-lg font-semibold">Add a contact</p>
    <p className="-mt-2 text-sm text-muted">Someone from LinkedIn, a referral, an event… anyone.</p>
    <input required type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Email address *" className={input} />
    <div className="grid grid-cols-2 gap-3">
      {([['first_name', 'First name'], ['last_name', 'Last name'], ['company', 'Company'], ['title', 'Job title']] as const).map(([k, t]) => <input key={k} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={t} className={input} />)}
    </div>
    <div className="grid grid-cols-2 gap-3">
      <input value={f.linkedin} onChange={e => setF({ ...f, linkedin: e.target.value })} placeholder="LinkedIn URL" className={input} />
      <select value={f.source} onChange={e => setF({ ...f, source: e.target.value })} className={input}>{SOURCES.map(s => <option key={s.key} value={s.key}>Met via {s.label}</option>)}</select>
    </div>
    <textarea value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} rows={2} placeholder="Notes (optional)" className={`resize-none ${input}`} />
    <label className="flex items-center gap-2.5 text-sm font-semibold"><input type="checkbox" checked={already} onChange={e => setAlready(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--primary))]" />I already emailed them from another inbox</label>
    {already && <div className="grid gap-3 rounded-2xl bg-surface-2/60 p-3 sm:grid-cols-2">
      <input value={sent.subject} onChange={e => setSent({ ...sent, subject: e.target.value })} placeholder="Subject of that email" className={input} />
      <input type="datetime-local" value={sent.at} onChange={e => setSent({ ...sent, at: e.target.value })} className={input} />
      <p className="text-xs text-muted sm:col-span-2">It’s recorded so you’re reminded to follow up. Opens can’t be tracked for emails sent outside the site.</p>
    </div>}
    <button disabled={busy} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim disabled:opacity-50">{busy ? 'Saving…' : already ? 'Save and log email' : 'Add contact'}</button>
    {msg && <p className={`text-sm font-semibold ${msg.startsWith('✓') ? 'text-success' : 'text-muted'}`}>{msg}</p>}
  </form>
}

function LogEmail({ onSave }: { onSave: (subject: string, at: string) => Promise<string> }) {
  const [subject, setSubject] = useState('')
  const [at, setAt] = useState(localInput(new Date()))
  const [err, setErr] = useState('')
  return <form onSubmit={async e => { e.preventDefault(); setErr(await onSave(subject, new Date(at).toISOString())) }} className="space-y-3">
    <p className="text-sm text-muted">For an email you sent from Gmail, iCloud or anywhere else. It’s added to their history and starts the follow-up reminder.</p>
    <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className={input} />
    <input type="datetime-local" value={at} onChange={e => setAt(e.target.value)} className={input} />
    {err && <p className="text-sm text-[#DC2626]">{err}</p>}
    <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">Log email</button>
  </form>
}

function Importer({ onImport }: { onImport: (rows: ReturnType<typeof apolloToLead>[], source: string) => Promise<{ added?: number; skipped?: number; invalid?: number; error?: string }> }) {
  const [rows, setRows] = useState<ReturnType<typeof apolloToLead>[]>([])
  const [file, setFile] = useState('')
  const [src, setSrc] = useState('apollo')
  const [drag, setDrag] = useState(false)
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const read = async (f?: File) => {
    if (!f) return
    setResult('')
    try {
      const parsed = parseCsv(await f.text()).map(apolloToLead).filter(r => r.email)
      setRows(parsed); setFile(f.name)
      if (!parsed.length) setResult('No contacts with an email address were found in that file.')
    } catch (error) { setResult(`Could not read that file: ${error instanceof Error ? error.message : 'unknown error'}`) }
  }
  return <div className="space-y-3">
    <label onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files[0]) }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-primary bg-primary/[0.05]' : 'border-ink-border bg-surface hover:border-primary/50'}`}>
      <span className="text-3xl">⇪</span>
      <span className="mt-3 font-display text-lg font-semibold">Import a CSV</span>
      <span className="mt-1 text-sm text-muted">Apollo exports work as they are. People already on your list are skipped.</span>
      <input type="file" accept=".csv,text/csv" className="sr-only" onChange={e => read(e.target.files?.[0])} />
    </label>
    {rows.length > 0 && <div className="overflow-hidden rounded-3xl border border-ink-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-border p-4">
        <p className="text-sm"><span className="font-semibold">{rows.length} contacts</span> <span className="text-muted">in {file}</span></p>
        <div className="flex items-center gap-2">
          <select value={src} onChange={e => setSrc(e.target.value)} aria-label="Source" className="rounded-full border border-ink-border bg-bg px-3 py-2 text-sm">{SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
          <button disabled={busy} onClick={async () => { setBusy(true); const r = await onImport(rows, src); setBusy(false); setResult(r.error ? `Could not import: ${r.error}` : `✓ Added ${r.added}. Skipped ${r.skipped} already on your list${r.invalid ? `, ${r.invalid} without a valid email` : ''}.`); if (!r.error) setRows([]) }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:bg-primary-dim disabled:opacity-50">{busy ? 'Importing…' : `Import ${rows.length}`}</button>
        </div>
      </div>
      <ul className="max-h-72 divide-y divide-ink-border overflow-y-auto text-sm">
        {rows.map(r => <li key={r.email} className="flex justify-between gap-3 px-4 py-2.5"><span className="truncate"><span className="font-semibold">{r.first_name} {r.last_name}</span> <span className="text-muted">· {r.title}</span></span><span className="shrink-0 text-muted">{r.company}</span></li>)}
      </ul>
    </div>}
    {result && <p className={`rounded-2xl p-4 text-sm font-semibold ${result.startsWith('✓') ? 'bg-success/10 text-success' : 'bg-surface-2 text-muted'}`}>{result}</p>}
  </div>
}
