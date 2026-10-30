'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminNav from '@/components/AdminNav'
import { TypeHeading } from '@/components/home/Motion'
import { apolloToLead, parseCsv } from '@/lib/csv'
import { DEFAULT_SETTINGS, followUpDue, isFinished, personalise, type Lead, type LeadStatus, type OutreachSettings, type Reply } from '@/lib/outreach'

// Private outreach tracker: import Apollo leads, send personalised cold emails
// in daily batches, and watch each lead move from Sent to Replied on its own.

const PW_KEY = 'ladyprowess_admin_password'
const STEPS: { key: LeadStatus; label: string }[] = [
  { key: 'sent', label: 'Sent' }, { key: 'opened', label: 'Opened' }, { key: 'clicked', label: 'Clicked' }, { key: 'replied', label: 'Replied' },
]
const RANK: Record<LeadStatus, number> = { new: 0, sent: 1, opened: 2, clicked: 3, replied: 4, bounced: -1, stopped: -1 }
const pill: Record<LeadStatus, string> = {
  new: 'bg-surface-2 text-muted', sent: 'bg-primary/10 text-primary', opened: 'bg-[#F59E0B]/15 text-[#B45309]', clicked: 'bg-[#8B5CF6]/15 text-[#7C3AED]',
  replied: 'bg-success/15 text-success', bounced: 'bg-[#EF4444]/10 text-[#DC2626]', stopped: 'bg-surface-2 text-muted',
}
const label: Record<LeadStatus, string> = { new: 'Not contacted', sent: 'Sent', opened: 'Opened', clicked: 'Clicked', replied: 'Replied', bounced: 'Bounced', stopped: 'Stopped' }

type Filter = LeadStatus | 'all' | 'due'
type LogLine = { id: number; ok: boolean; text: string }

const ago = (iso: string | null) => {
  if (!iso) return ''
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${Math.max(1, m)}m ago`
  const h = Math.round(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`
}
const name = (l: Lead) => [l.first_name, l.last_name].filter(Boolean).join(' ') || l.email
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

export default function OutreachDashboard() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [authError, setAuthError] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [settings, setSettings] = useState<OutreachSettings>(DEFAULT_SETTINGS)
  const [sentToday, setSentToday] = useState(0)
  const [tab, setTab] = useState<'leads' | 'templates' | 'import'>('leads')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
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
    setLeads(data.leads); setReplies(data.replies); setSettings(data.settings); setSentToday(data.sentToday); setUnlocked(true); setAuthError('')
  }, [call, password])

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY)
    if (saved) { setPassword(saved); load(saved) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Opens, clicks and replies arrive by webhook, so refresh quietly every minute.
  useEffect(() => {
    if (!unlocked || running) return
    const t = window.setInterval(() => load(), 60_000)
    return () => window.clearInterval(t)
  }, [unlocked, running, load])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, due: 0 }
    for (const l of leads) { c[l.status] = (c[l.status] || 0) + 1; if (followUpDue(l, settings)) c.due += 1 }
    return c
  }, [leads, settings])

  const contacted = leads.filter(l => l.status !== 'new').length
  const reached = (min: number) => leads.filter(l => RANK[l.status] >= min).length
  const pct = (n: number) => (contacted ? Math.round((n / contacted) * 100) : 0)
  const left = Math.max(0, settings.daily_limit - sentToday)
  const newLeads = leads.filter(l => l.status === 'new').slice().reverse()
  const dueLeads = leads.filter(l => followUpDue(l, settings))

  const shown = leads.filter(l => {
    if (filter === 'due' ? !followUpDue(l, settings) : filter !== 'all' && l.status !== filter) return false
    const q = query.trim().toLowerCase()
    return !q || [l.email, l.first_name, l.last_name, l.company, l.title].some(v => v?.toLowerCase().includes(q))
  })

  const replace = (lead: Lead) => setLeads(ls => ls.map(l => (l.id === lead.id ? lead : l)))
  const say = (ok: boolean, text: string) => setLog(l => [{ id: Date.now() + Math.random(), ok, text }, ...l].slice(0, 40))

  /** Sends one at a time with a natural gap, stopping at the daily limit. */
  async function runBatch(batch: Lead[], kind: 'first' | 'follow_up') {
    if (!batch.length) return
    const n = Math.min(batch.length, left)
    if (!n) { say(false, `Daily limit of ${settings.daily_limit} reached. The rest go out tomorrow.`); return }
    if (!window.confirm(`Send ${n} ${kind === 'first' ? 'first emails' : 'follow-ups'} from hello@ladyprowess.com? They go out one at a time, about 10 seconds apart.`)) return
    setRunning(true); stop.current = false
    for (let i = 0; i < n; i++) {
      if (stop.current) { say(false, 'Stopped. Nothing else was sent.'); break }
      const lead = batch[i]
      const { ok, data } = await call('send', { id: lead.id, kind })
      if (ok) { replace(data.lead); setSentToday(data.sentToday); say(true, `${kind === 'first' ? 'Sent' : 'Followed up'} to ${name(lead)}${lead.company ? ` at ${lead.company}` : ''}`) }
      else { say(false, `${name(lead)}: ${data.error || 'failed'}`); if (data.limit) break }
      if (i < n - 1) await wait(8000 + Math.random() * 6000)
    }
    setRunning(false)
  }

  async function sendOne(lead: Lead, kind: 'first' | 'follow_up') {
    const { ok, data } = await call('send', { id: lead.id, kind })
    if (ok) { replace(data.lead); setSentToday(data.sentToday); say(true, `Sent to ${name(lead)}`) } else say(false, `${name(lead)}: ${data.error}`)
  }

  async function patch(lead: Lead, change: { notes?: string; status?: LeadStatus }) {
    const { ok, data } = await call('update', { id: lead.id, ...change })
    if (ok && data.lead) replace(data.lead)
  }

  if (!unlocked) return <main className="flex min-h-screen items-center justify-center bg-bg px-5">
    <form onSubmit={e => { e.preventDefault(); load(password) }} className="w-full max-w-sm rounded-3xl border border-ink-border bg-surface p-7">
      <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Private · Outreach</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.03em]">Unlock your tracker</h1>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" className="mt-6 w-full rounded-full border border-ink-border bg-bg px-4 py-3 text-sm outline-none focus:border-primary" />
      {authError && <p className="mt-3 text-sm text-[#DC2626]">{authError}</p>}
      <button className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:bg-primary-dim">Unlock</button>
    </form>
  </main>

  return <main className="min-h-screen bg-bg text-parchment">
    <AdminNav />
    <section className="relative overflow-hidden border-b border-ink-border">
      <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-12">
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Private · Outreach</p>
        <TypeHeading as="h1" className="mt-3 font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.6rem]" text="Your cold emails, tracked for you." />
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Opens, clicks, bounces and replies update by themselves. You just send, and follow up when it tells you to.</p>

        {/* The funnel */}
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['Leads', leads.length, ''], ['Emailed', contacted, ''], ['Opened', reached(2), `${pct(reached(2))}%`],
            ['Clicked', reached(3), `${pct(reached(3))}%`], ['Replied', counts.replied || 0, `${pct(counts.replied || 0)}%`], ['Bounced', counts.bounced || 0, ''],
          ].map(([k, v, p]) => <div key={k} className="flex flex-col-reverse rounded-2xl border border-ink-border bg-surface p-4">
            <dt className="mt-1 text-xs text-muted">{k}{p && <span className="ml-1 text-primary">· {p}</span>}</dt><dd className="font-display text-3xl font-semibold tracking-[-.04em]">{v}</dd>
          </div>)}
        </dl>
      </div>
    </section>

    <div className="mx-auto grid max-w-[1240px] gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <div className="flex gap-1 rounded-full border border-ink-border bg-surface p-1 text-sm font-semibold sm:w-max">
          {(['leads', 'templates', 'import'] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full px-4 py-2 capitalize transition sm:flex-none ${tab === t ? 'bg-primary text-on-primary' : 'text-muted hover:text-parchment'}`}>{t === 'templates' ? 'Templates & settings' : t}</button>)}
        </div>

        {tab === 'leads' && <div className="mt-5">
          <div className="flex flex-wrap gap-2">
            {(['all', 'due', 'new', 'sent', 'opened', 'clicked', 'replied', 'bounced', 'stopped'] as Filter[]).map(f => <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === f ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-surface text-muted hover:text-parchment'}`}>
              {f === 'all' ? 'All' : f === 'due' ? 'Follow-up due' : label[f as LeadStatus]} <span className="opacity-70">{counts[f] || 0}</span>
            </button>)}
          </div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, company, email…" className="mt-3 w-full rounded-full border border-ink-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" />

          <ul className="mt-4 space-y-2">
            {shown.length === 0 && <li className="rounded-2xl border border-dashed border-ink-border p-8 text-center text-sm text-muted">{leads.length ? 'No leads match this filter.' : 'No leads yet. Import an Apollo CSV to start.'}</li>}
            {shown.map(l => <LeadRow key={l.id} lead={l} open={open === l.id} onToggle={() => setOpen(open === l.id ? null : l.id)} due={followUpDue(l, settings)}
              replies={replies.filter(r => r.lead_id === l.id)} busy={running} onSend={k => sendOne(l, k)} onPatch={c => patch(l, c)}
              onDelete={async () => { if (window.confirm(`Remove ${name(l)} from your list?`)) { await call('delete', { id: l.id }); setLeads(ls => ls.filter(x => x.id !== l.id)) } }} />)}
          </ul>
        </div>}

        {tab === 'templates' && <Templates settings={settings} sample={leads[0]} onSave={async s => { const { ok, data } = await call('settings', { settings: s }); if (ok) setSettings(data.settings); return ok }} />}
        {tab === 'import' && <Importer onImport={async rows => { const { ok, data } = await call('import', { leads: rows }); if (ok) await load(); return ok ? data : { error: data.error } }} />}
      </div>

      {/* Today */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-3xl border border-ink-border bg-surface p-5">
          <p className="font-head text-[10px] uppercase tracking-wider text-muted">Today</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-[-.04em]">{sentToday}<span className="text-lg text-muted"> / {settings.daily_limit} sent</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-primary" animate={{ width: `${Math.min(100, (sentToday / settings.daily_limit) * 100)}%` }} /></div>
          <div className="mt-5 space-y-2">
            <button disabled={running || !newLeads.length || !left} onClick={() => runBatch(newLeads, 'first')} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-dim disabled:bg-surface-2 disabled:text-muted">
              Send {Math.min(newLeads.length, left)} new {Math.min(newLeads.length, left) === 1 ? 'email' : 'emails'}
            </button>
            <button disabled={running || !dueLeads.length || !left} onClick={() => runBatch(dueLeads, 'follow_up')} className="w-full rounded-full border border-ink-border px-4 py-3 text-sm font-semibold transition hover:border-primary disabled:text-muted">
              Send {Math.min(dueLeads.length, left)} follow-{Math.min(dueLeads.length, left) === 1 ? 'up' : 'ups'} due
            </button>
            {running && <button onClick={() => { stop.current = true }} className="w-full rounded-full px-4 py-2 text-sm font-semibold text-[#DC2626] hover:bg-[#EF4444]/10">Stop sending</button>}
          </div>
          <p className="mt-3 text-[11px] leading-4 text-muted">Sends one at a time, ~10s apart, never above your daily limit. Replied and bounced leads are never emailed again.</p>
        </div>

        {/* Live log, styled like the editor windows on the site */}
        <div className="overflow-hidden rounded-3xl border border-ink-border bg-surface">
          <div className="flex items-center gap-2 border-b border-ink-border px-4 py-2.5">
            <span className="flex gap-1">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />)}</span>
            <span className="text-xs font-semibold">activity.log</span>
            {running && <span className="ml-auto flex items-center gap-1 rounded-full bg-[#EF4444]/10 px-2 py-0.5 font-head text-[9px] font-semibold uppercase text-[#DC2626]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#EF4444]" />Sending</span>}
          </div>
          <ul className="max-h-72 space-y-1.5 overflow-y-auto p-4 font-mono text-[11.5px] leading-5">
            {!log.length && <li className="text-muted">Nothing sent this session yet.</li>}
            <AnimatePresence initial={false}>{log.map(line => <motion.li key={line.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={line.ok ? '' : 'text-[#DC2626]'}>{line.ok ? '✓' : '!'} {line.text}</motion.li>)}</AnimatePresence>
          </ul>
        </div>
      </aside>
    </div>
  </main>
}

function LeadRow({ lead: l, open, onToggle, due, replies, busy, onSend, onPatch, onDelete }: {
  lead: Lead; open: boolean; onToggle: () => void; due: boolean; replies: Reply[]; busy: boolean
  onSend: (k: 'first' | 'follow_up') => void; onPatch: (c: { notes?: string; status?: LeadStatus }) => void; onDelete: () => void
}) {
  const [notes, setNotes] = useState(l.notes)
  useEffect(() => setNotes(l.notes), [l.notes])
  const last = l.replied_at || l.clicked_at || l.opened_at || l.last_sent_at
  return <li className={`overflow-hidden rounded-2xl border bg-surface transition ${open ? 'border-primary/40 shadow-[0_20px_40px_-28px_rgba(17,24,39,.45)]' : 'border-ink-border'}`}>
    <button onClick={onToggle} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 p-3.5 text-left sm:grid-cols-[auto_1.4fr_1fr_auto] sm:gap-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{(l.first_name?.[0] || l.email[0]).toUpperCase()}{l.last_name?.[0]?.toUpperCase() || ''}</span>
      <span className="min-w-0"><span className="block truncate text-sm font-semibold">{name(l)}</span><span className="block truncate text-xs text-muted">{[l.title, l.company].filter(Boolean).join(' · ')}</span></span>
      {/* Progress dots: sent → opened → clicked → replied */}
      <span className="hidden items-center gap-1.5 sm:flex" aria-label={`Progress: ${label[l.status]}`}>
        {STEPS.map((s, i) => <span key={s.key} className="flex items-center gap-1.5">
          {i > 0 && <span className={`h-px w-4 ${RANK[l.status] >= RANK[s.key] ? 'bg-primary' : 'bg-ink-border'}`} />}
          <span title={s.label} className={`h-2.5 w-2.5 rounded-full ${RANK[l.status] >= RANK[s.key] ? (s.key === 'replied' ? 'bg-success' : 'bg-primary') : 'bg-ink-border'}`} />
        </span>)}
        {last && <span className="ml-2 text-[11px] text-muted">{ago(last)}</span>}
      </span>
      <span className="flex flex-col items-end gap-1">
        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${pill[l.status]}`}>{label[l.status]}</span>
        {due && <span className="whitespace-nowrap text-[10px] font-semibold text-[#B45309]">Follow-up due</span>}
      </span>
    </button>

    <AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
      <div className="grid gap-5 border-t border-ink-border p-4 md:grid-cols-[1fr_1fr]">
        <div className="space-y-1.5 text-xs">
          <p><span className="text-muted">Email </span><a href={`mailto:${l.email}`} className="font-semibold hover:text-primary">{l.email}</a></p>
          {l.country && <p><span className="text-muted">Location </span>{l.country}</p>}
          <p className="flex flex-wrap gap-3 pt-1">{l.linkedin && <a href={l.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">LinkedIn ↗</a>}{l.website && <a href={l.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">Website ↗</a>}</p>
          <ol className="mt-3 space-y-1 border-l border-ink-border pl-3 text-muted">
            {l.first_sent_at && <li>First email · {new Date(l.first_sent_at).toLocaleString()}</li>}
            {l.follow_ups > 0 && <li>{l.follow_ups} follow-up{l.follow_ups > 1 ? 's' : ''} · last {ago(l.last_sent_at)}</li>}
            {l.opened_at && <li>Opened · {ago(l.opened_at)}</li>}
            {l.clicked_at && <li>Clicked a link · {ago(l.clicked_at)}</li>}
            {l.bounced_at && <li className="text-[#DC2626]">Bounced · {ago(l.bounced_at)}</li>}
            {l.replied_at && <li className="font-semibold text-success">Replied · {ago(l.replied_at)}</li>}
          </ol>
          {replies.map(r => <div key={r.id} className="mt-2 rounded-xl bg-success/[0.07] p-3 text-[12px]"><p className="font-semibold">{r.subject || 'Reply'}</p>{r.snippet && <p className="mt-1 text-muted">{r.snippet}</p>}</div>)}
        </div>
        <div>
          <label className="font-head text-[10px] uppercase tracking-wider text-muted" htmlFor={`n-${l.id}`}>Notes</label>
          <textarea id={`n-${l.id}`} value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => notes !== l.notes && onPatch({ notes })} rows={3} placeholder="e.g. Asked me to follow up in January" className="mt-1.5 w-full resize-none rounded-xl border border-ink-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
            {l.status === 'new' && <button disabled={busy} onClick={() => onSend('first')} className="rounded-full bg-primary px-3.5 py-2 text-on-primary disabled:opacity-50">Send now</button>}
            {!isFinished(l.status) && l.status !== 'new' && <button disabled={busy} onClick={() => onSend('follow_up')} className="rounded-full bg-primary px-3.5 py-2 text-on-primary disabled:opacity-50">Send follow-up</button>}
            {l.status !== 'replied' && <button onClick={() => onPatch({ status: 'replied' })} className="rounded-full border border-ink-border px-3.5 py-2 hover:border-success hover:text-success">Mark replied</button>}
            {!isFinished(l.status) && <button onClick={() => onPatch({ status: 'stopped' })} className="rounded-full border border-ink-border px-3.5 py-2 hover:border-muted">Stop emailing</button>}
            <button onClick={onDelete} className="rounded-full px-3.5 py-2 text-[#DC2626] hover:bg-[#EF4444]/10">Remove</button>
          </div>
        </div>
      </div>
    </motion.div>}</AnimatePresence>
  </li>
}

function Templates({ settings, sample, onSave }: { settings: OutreachSettings; sample?: Lead; onSave: (s: OutreachSettings) => Promise<boolean> }) {
  const [s, setS] = useState(settings)
  const [which, setWhich] = useState<'body' | 'follow_up_body'>('body')
  const [saved, setSaved] = useState('')
  const box = useRef<HTMLTextAreaElement>(null)
  useEffect(() => setS(settings), [settings])
  const lead = sample ?? ({ first_name: 'Ada', last_name: 'Obi', company: 'Acme Pay', title: 'CTO' } as Lead)

  const insert = (field: string) => {
    const el = box.current
    const text = s[which]
    const at = el?.selectionStart ?? text.length
    setS({ ...s, [which]: `${text.slice(0, at)}{${field}}${text.slice(el?.selectionEnd ?? at)}` })
  }

  return <div className="mt-5 grid gap-5 xl:grid-cols-2">
    <div className="space-y-4 rounded-3xl border border-ink-border bg-surface p-5">
      <div className="grid grid-cols-3 gap-3">
        {([['daily_limit', 'Emails per day', 1, 100], ['follow_up_days', 'Follow up after (days)', 1, 30], ['max_follow_ups', 'Max follow-ups', 0, 5]] as const).map(([k, t, lo, hi]) =>
          <label key={k} className="text-xs text-muted">{t}<input type="number" min={lo} max={hi} value={s[k]} onChange={e => setS({ ...s, [k]: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-ink-border bg-bg px-3 py-2 text-sm text-parchment outline-none focus:border-primary" /></label>)}
      </div>
      <label className="block text-xs text-muted">Subject<input value={s.subject} onChange={e => setS({ ...s, subject: e.target.value })} className="mt-1 w-full rounded-xl border border-ink-border bg-bg px-3 py-2 text-sm text-parchment outline-none focus:border-primary" /></label>
      <div>
        <div className="flex gap-1 text-xs font-semibold">
          {([['body', 'First email'], ['follow_up_body', 'Follow-up']] as const).map(([k, t]) => <button key={k} onClick={() => setWhich(k)} className={`rounded-full px-3 py-1.5 ${which === k ? 'bg-primary/10 text-primary' : 'text-muted'}`}>{t}</button>)}
        </div>
        <textarea ref={box} value={s[which]} onChange={e => setS({ ...s, [which]: e.target.value })} rows={13} className="mt-2 w-full resize-y rounded-xl border border-ink-border bg-bg px-3 py-2.5 font-mono text-[12.5px] leading-6 outline-none focus:border-primary" />
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs"><span className="text-muted">Insert:</span>
          {['first_name', 'last_name', 'company', 'title'].map(f => <button key={f} onClick={() => insert(f)} className="rounded-full border border-ink-border px-2.5 py-1 font-mono hover:border-primary hover:text-primary">{`{${f}}`}</button>)}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={async () => { setSaved((await onSave(s)) ? '✓ Saved' : 'Could not save') ; window.setTimeout(() => setSaved(''), 2500) }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">Save</button>
        <button onClick={() => setS({ ...s, subject: DEFAULT_SETTINGS.subject, body: DEFAULT_SETTINGS.body, follow_up_body: DEFAULT_SETTINGS.follow_up_body })} className="text-sm font-semibold text-muted hover:text-parchment">Reset to starter copy</button>
        <span className="text-sm font-semibold text-success">{saved}</span>
      </div>
    </div>

    {/* Live preview for a real lead */}
    <div className="overflow-hidden rounded-3xl border border-ink-border bg-surface xl:sticky xl:top-6 xl:self-start">
      <div className="flex items-center gap-2 border-b border-ink-border px-4 py-3">
        <span className="flex gap-1">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
        <span className="truncate text-xs font-semibold">Preview · to {name(lead)}{lead.company ? `, ${lead.company}` : ''}</span>
      </div>
      <div className="bg-paper p-5 text-sm leading-6">
        <p className="text-xs text-muted">From Lady Prowess &lt;hello@ladyprowess.com&gt;</p>
        <p className="mt-1 font-semibold">{which === 'follow_up_body' ? 'Re: ' : ''}{personalise(s.subject, lead)}</p>
        <div className="mt-4 whitespace-pre-wrap">{personalise(s[which], lead)}</div>
        <p className="mt-4 border-t border-ink-border pt-3 text-xs text-muted">+ your Lady Prowess signature</p>
      </div>
    </div>
  </div>
}

function Importer({ onImport }: { onImport: (rows: ReturnType<typeof apolloToLead>[]) => Promise<{ added?: number; skipped?: number; invalid?: number; error?: string }> }) {
  const [rows, setRows] = useState<ReturnType<typeof apolloToLead>[]>([])
  const [file, setFile] = useState('')
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
    } catch (error) {
      setResult(`Could not read that file: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }

  return <div className="mt-5 space-y-4">
    <label onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files[0]) }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition ${drag ? 'border-primary bg-primary/[0.05]' : 'border-ink-border bg-surface hover:border-primary/50'}`}>
      <span className="text-3xl">⇪</span>
      <span className="mt-3 font-display text-lg font-semibold">Drop an Apollo CSV here</span>
      <span className="mt-1 text-sm text-muted">or click to choose a file. People already on your list are skipped.</span>
      <input type="file" accept=".csv,text/csv" className="sr-only" onChange={e => read(e.target.files?.[0])} />
    </label>
    {rows.length > 0 && <div className="overflow-hidden rounded-3xl border border-ink-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-border p-4">
        <p className="text-sm"><span className="font-semibold">{rows.length} contacts</span> <span className="text-muted">in {file}</span></p>
        <button disabled={busy} onClick={async () => { setBusy(true); const r = await onImport(rows); setBusy(false); setResult(r.error ? `Could not import: ${r.error}` : `✓ Added ${r.added}. Skipped ${r.skipped} already on your list${r.invalid ? `, ${r.invalid} without a valid email` : ''}.`); if (!r.error) setRows([]) }}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim disabled:opacity-50">{busy ? 'Importing…' : `Import ${rows.length}`}</button>
      </div>
      <ul className="max-h-80 divide-y divide-ink-border overflow-y-auto text-sm">
        {rows.map(r => <li key={r.email} className="flex justify-between gap-3 px-4 py-2.5"><span className="truncate"><span className="font-semibold">{r.first_name} {r.last_name}</span> <span className="text-muted">· {r.title}</span></span><span className="shrink-0 text-muted">{r.company}</span></li>)}
      </ul>
    </div>}
    {result && <p className="rounded-2xl bg-success/10 p-4 text-sm font-semibold text-success">{result}</p>}
  </div>
}
