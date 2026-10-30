'use client'

import { useEffect, useState } from 'react'
import { isFinished, SOURCES, type Lead, type Reply, type SentEmail } from '@/lib/outreach'
import { ago, Avatar, field, fullName, localInput, SidePanel, StatusPill, when } from './shared'

// One contact: who they are, everything that has happened, notes, and the
// actions you can take next.

type Props = {
  lead: Lead; emails: SentEmail[]; replies: Reply[]; followUpDue: boolean
  onClose: () => void; onWrite: () => void; onPatch: (c: Record<string, unknown>) => void
  onLog: (subject: string, at: string) => Promise<string>; onCancel: (e: SentEmail) => void; onDelete: () => void
}

export default function ContactPanel({ lead: l, emails, replies, followUpDue, onClose, onWrite, onPatch, onLog, onCancel, onDelete }: Props) {
  const [notes, setNotes] = useState(l.notes)
  const [logging, setLogging] = useState(false)
  const [log, setLog] = useState({ subject: '', at: localInput(new Date()) })
  const [logMsg, setLogMsg] = useState('')
  useEffect(() => setNotes(l.notes), [l.notes])

  // Everything that happened, newest first.
  const timeline = [
    ...emails.map(e => ({ at: e.sent_at, key: `e${e.id}`, email: e })),
    ...(l.opened_at ? [{ at: l.opened_at, key: 'open', text: 'Opened your email' }] : []),
    ...(l.clicked_at ? [{ at: l.clicked_at, key: 'click', text: 'Clicked a link' }] : []),
    ...(l.bounced_at ? [{ at: l.bounced_at, key: 'bounce', text: 'Email bounced (address not reachable)' }] : []),
    ...replies.map(r => ({ at: r.received_at, key: `r${r.id}`, reply: r })),
    ...(l.replied_at && !replies.length ? [{ at: l.replied_at, key: 'replied', text: 'Replied' }] : []),
    { at: l.created_at, key: 'added', text: `Added to contacts (via ${SOURCES.find(s => s.key === l.source)?.label || 'Other'})` },
  ].sort((a, b) => b.at.localeCompare(a.at)) as { at: string; key: string; email?: SentEmail; reply?: Reply; text?: string }[]

  return <SidePanel onClose={onClose} title={fullName(l)}>
    <div className="space-y-6 p-5">
      <div className="flex items-start gap-4">
        <Avatar lead={l} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl font-semibold tracking-[-.02em]">{fullName(l)}</p>
          <p className="text-sm text-muted">{[l.title, l.company].filter(Boolean).join(' · ') || 'No title or company yet'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <StatusPill status={l.status} />
            {followUpDue && <span className="rounded-full bg-primary px-2.5 py-1 font-semibold text-on-primary">Follow up now</span>}
            <a href={`mailto:${l.email}`} className="text-muted hover:text-primary">{l.email}</a>
            {l.linkedin && <a href={l.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">LinkedIn ↗</a>}
            {l.website && <a href={l.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">Website ↗</a>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm font-semibold">
        <button onClick={onWrite} className="rounded-full bg-primary px-4 py-2.5 text-on-primary hover:bg-primary-dim">✉ Write email</button>
        <button onClick={() => setLogging(v => !v)} className="rounded-full border border-ink-border px-4 py-2.5 hover:border-primary">Log an email I sent elsewhere</button>
        {l.status !== 'replied' && <button onClick={() => onPatch({ status: 'replied' })} className="rounded-full border border-ink-border px-4 py-2.5 hover:border-success hover:text-success">Mark replied</button>}
        {!isFinished(l.status) ? <button onClick={() => onPatch({ status: 'stopped' })} className="rounded-full border border-ink-border px-4 py-2.5 hover:border-muted">Stop emailing</button>
          : <button onClick={() => onPatch({ status: l.first_sent_at ? 'sent' : 'new' })} className="rounded-full border border-ink-border px-4 py-2.5 hover:border-muted">Reopen</button>}
      </div>

      {logging && <form onSubmit={async e => { e.preventDefault(); const err = await onLog(log.subject, new Date(log.at).toISOString()); setLogMsg(err || '✓ Logged. You’ll be reminded to follow up.'); if (!err) setLogging(false) }} className="space-y-3 rounded-2xl bg-surface-2/60 p-4">
        <p className="text-xs text-muted">For an email sent from Gmail, iCloud or anywhere else. It’s added below and starts the follow-up reminder. Opens can’t be tracked for these.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={log.subject} onChange={e => setLog({ ...log, subject: e.target.value })} placeholder="Subject" className={field} />
          <input type="datetime-local" value={log.at} onChange={e => setLog({ ...log, at: e.target.value })} className={field} />
        </div>
        <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary">Log email</button>
      </form>}
      {logMsg && <p className="text-sm font-semibold text-success">{logMsg}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted">Met via
          <select value={l.source || 'other'} onChange={e => onPatch({ source: e.target.value })} className={`mt-1.5 ${field}`}>{SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
        </label>
        <label className="text-xs font-semibold text-muted">Company
          <input defaultValue={l.company || ''} onBlur={e => e.target.value !== (l.company || '') && onPatch({ company: e.target.value })} className={`mt-1.5 ${field}`} />
        </label>
      </div>

      <div>
        <label htmlFor="notes" className="text-xs font-semibold text-muted">Notes</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => notes !== l.notes && onPatch({ notes })} rows={3} placeholder="e.g. Asked me to follow up in January" className={`mt-1.5 resize-none ${field}`} />
      </div>

      <div>
        <p className="text-xs font-semibold text-muted">History</p>
        <ol className="mt-3 space-y-0">
          {timeline.map((t, i) => <li key={t.key} className="relative flex gap-3 pb-5">
            {i < timeline.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-ink-border" />}
            <span className={`relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-surface ${t.reply || t.key === 'replied' ? 'bg-success' : t.key === 'bounce' ? 'bg-[#EF4444]' : t.email ? 'bg-primary' : 'bg-ink-border'}`} />
            <div className="min-w-0 flex-1 text-sm">
              {t.email ? <>
                <p className={`font-semibold ${t.email.status === 'cancelled' ? 'text-muted line-through' : ''}`}>{t.email.subject}</p>
                <p className="text-xs text-muted">
                  {t.email.status === 'scheduled' ? `Scheduled for ${when(t.email.sent_at)}` : t.email.status === 'logged' ? `Sent from another inbox · ${when(t.email.sent_at)}` : t.email.status === 'cancelled' ? 'Cancelled' : t.email.status === 'failed' ? 'Failed to send' : `Sent ${ago(t.email.sent_at)} · ${when(t.email.sent_at)}`}
                  {t.email.status === 'scheduled' && <button onClick={() => onCancel(t.email!)} className="ml-2 font-semibold text-[#DC2626] dark:text-[#F87171]">Cancel</button>}
                </p>
              </> : t.reply ? <div className="rounded-xl bg-success/[0.08] p-3">
                <p className="font-semibold text-success">Replied: {t.reply.subject || '(no subject)'}</p>
                {t.reply.snippet && <p className="mt-1 text-xs leading-5 text-muted">{t.reply.snippet}</p>}
                <p className="mt-1 text-[11px] text-muted">{when(t.reply.received_at)}</p>
              </div> : <><p className={t.key === 'replied' ? 'font-semibold text-success' : ''}>{t.text}</p><p className="text-xs text-muted">{when(t.at)}</p></>}
            </div>
          </li>)}
        </ol>
      </div>

      <button onClick={onDelete} className="text-xs font-semibold text-[#DC2626] hover:underline dark:text-[#F87171]">Remove {fullName(l)} from contacts</button>
    </div>
  </SidePanel>
}
