'use client'

import { useEffect, useState } from 'react'
import type { Lead } from '@/lib/outreach'
import { ago, Avatar, fullName, SidePanel, when } from './shared'
import Icon from './Icon'

// One sent email: who it went to, when it was opened and which links were
// clicked, the email itself, and what to do next.

type Detail = {
  email: { id: string; lead_id: string | null; recipients: string[]; cc?: string[]; bcc?: string[]; subject: string; preview?: string; body_html: string; status: string; kind: string; sent_at: string }
  events: { event_type: 'open' | 'click' | 'bounce'; url: string | null; occurred_at: string; user_agent: string | null }[]
}

/** A readable device name from a user-agent string. */
function device(ua: string | null) {
  if (!ua) return ''
  if (/GoogleImageProxy/i.test(ua)) return 'Gmail'
  if (/iPhone|iPad/i.test(ua)) return 'iPhone or iPad'
  if (/Android/i.test(ua)) return 'Android'
  if (/Macintosh/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows'
  return ''
}

export default function EmailPanel({ id, lead, load, onClose, onFollowUp, onOpenContact, onAddContact, onCancel }: {
  id: string; lead?: Lead
  load: (id: string) => Promise<Detail | null>
  onClose: () => void
  onFollowUp: (to: string, subject: string) => void
  onOpenContact: (leadId: string) => void
  onAddContact: (emailId: string, address: string) => Promise<void>
  onCancel: (emailId: string) => Promise<void>
}) {
  const [detail, setDetail] = useState<Detail | null>(null)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { load(id).then(d => (d ? setDetail(d) : setError('Could not load this email.'))) }, [id, load])

  const e = detail?.email
  const opens = detail?.events.filter(x => x.event_type === 'open') ?? []
  const clicks = detail?.events.filter(x => x.event_type === 'click') ?? []
  const bounced = detail?.events.some(x => x.event_type === 'bounce')
  const to = e?.recipients?.[0] ?? ''
  const status = !e ? '' : e.status === 'scheduled' ? `Scheduled for ${when(e.sent_at)}` : e.status === 'logged' ? `Sent from another inbox · ${when(e.sent_at)}` : e.status === 'failed' ? 'Failed to send' : e.status === 'cancelled' ? 'Cancelled' : `Sent ${when(e.sent_at)} (${ago(e.sent_at)})`
  const sent = e?.status === 'sent'

  return <SidePanel onClose={onClose} title={e?.subject || 'Email'}
    footer={e && <div className="flex flex-wrap gap-2 text-sm font-semibold">
      {e.status !== 'scheduled' && e.status !== 'cancelled' && <button onClick={() => onFollowUp(to, e.subject.startsWith('Re:') ? e.subject : `Re: ${e.subject}`)} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-on-primary hover:bg-primary-dim"><Icon name="refresh" />Follow up</button>}
      {e.status === 'scheduled' && <button onClick={() => onCancel(e.id)} className="rounded-full border border-[#EF4444]/40 px-4 py-2.5 text-[#DC2626] hover:bg-[#EF4444]/10 dark:text-[#F87171]">Cancel this email</button>}
      {lead ? <button onClick={() => onOpenContact(lead.id)} className="rounded-full border border-ink-border px-4 py-2.5 hover:border-primary">Open contact card</button>
        : to && <button disabled={adding} onClick={async () => { setAdding(true); await onAddContact(e.id, to); setAdding(false) }} className="rounded-full border border-ink-border px-4 py-2.5 hover:border-primary disabled:opacity-50">{adding ? 'Adding…' : '+ Add to contacts'}</button>}
    </div>}>
    {error && <p className="p-5 text-sm text-[#DC2626]">{error}</p>}
    {!detail && !error && <div className="space-y-3 p-5">{[0, 1, 2].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-surface-2" />)}</div>}
    {e && <div className="space-y-6 p-5">
      {/* Who and when */}
      <div className="flex items-start gap-3">
        {lead ? <Avatar lead={lead} /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted"><Icon name="at" /></span>}
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold">{lead ? fullName(lead) : to}{lead?.company ? <span className="font-normal text-muted"> · {lead.company}</span> : null}</p>
          <p className="truncate text-xs text-muted">To {e.recipients.join(', ')}{e.cc?.length ? ` · Cc ${e.cc.join(', ')}` : ''}</p>
          <p className="mt-1 text-xs text-muted">{status}</p>
        </div>
      </div>

      {/* At a glance */}
      {sent && <div className="grid grid-cols-3 gap-2">
        {[
          ['Opens', opens.length ? `${opens.length}` : '0', opens.length ? `last ${ago(opens[opens.length - 1].occurred_at)}` : 'not yet'],
          ['Clicks', `${clicks.length}`, clicks.length ? `last ${ago(clicks[clicks.length - 1].occurred_at)}` : 'not yet'],
          ['Status', bounced ? 'Bounced' : clicks.length ? 'Clicked' : opens.length ? 'Opened' : 'Delivered', bounced ? 'address not reachable' : opens.length ? `first ${ago(opens[0].occurred_at)}` : 'waiting'],
        ].map(([k, v, sub]) => <div key={k} className="rounded-2xl border border-ink-border p-3.5">
          <p className="text-xs text-muted">{k}</p>
          <p className={`mt-1 font-display text-2xl font-semibold tracking-[-.03em] ${v === 'Bounced' ? 'text-[#DC2626] dark:text-[#F87171]' : v === 'Clicked' || v === 'Opened' ? 'text-primary' : ''}`}>{v}</p>
          <p className="text-[11px] text-muted">{sub}</p>
        </div>)}
      </div>}

      {/* Activity */}
      {sent && <div>
        <p className="text-xs font-semibold text-muted">Activity</p>
        <ol className="mt-3">
          {[...detail.events].reverse().map((x, i, arr) => <li key={`${x.occurred_at}-${i}`} className="relative flex gap-3 pb-4">
            {i < arr.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-ink-border" />}
            <span className={`relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-surface ${x.event_type === 'click' ? 'bg-primary' : x.event_type === 'bounce' ? 'bg-[#EF4444]' : 'bg-primary/40'}`} />
            <div className="min-w-0 text-sm">
              <p className="font-semibold">{x.event_type === 'click' ? 'Clicked a link' : x.event_type === 'bounce' ? 'Bounced' : 'Opened'}{device(x.user_agent) && <span className="font-normal text-muted"> · {device(x.user_agent)}</span>}</p>
              {x.url && <a href={x.url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-primary hover:underline">{x.url}</a>}
              <p className="text-xs text-muted">{when(x.occurred_at)} · {ago(x.occurred_at)}</p>
            </div>
          </li>)}
          <li className="relative flex gap-3">
            <span className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-surface bg-ink-border" />
            <div className="text-sm"><p className="font-semibold">Sent</p><p className="text-xs text-muted">{when(e.sent_at)}</p></div>
          </li>
        </ol>
        {opens.length > 0 && <p className="mt-2 rounded-xl bg-surface-2/70 p-3 text-xs leading-5 text-muted">Some email apps (Apple Mail, Gmail) load emails automatically, which can count as an open, so several opens close together may be the app rather than the person. A click is a stronger sign they read it.</p>}
      </div>}

      {/* The email itself, isolated so its styles can't affect the page */}
      {e.body_html ? <div>
        <p className="text-xs font-semibold text-muted">The email</p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-ink-border bg-white">
          <div className="border-b border-[#E5E7EB] px-4 py-3 text-xs text-[#6B7280]"><span className="font-semibold text-[#111827]">{e.subject}</span><br />From Lady Prowess &lt;hello@ladyprowess.com&gt;</div>
          <iframe title="Email content" sandbox="" srcDoc={`<!doctype html><meta charset="utf-8"><base target="_blank"><body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;">${e.body_html}</body>`} className="h-[380px] w-full" />
        </div>
      </div> : e.status === 'logged' && <p className="rounded-xl bg-surface-2/70 p-3 text-xs text-muted">This was sent from another inbox, so only the subject and date were recorded.</p>}
    </div>}
  </SidePanel>
}
