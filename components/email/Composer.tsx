'use client'

import { useMemo, useRef, useState } from 'react'
import { EMAIL_RE, isFinished, personalise, SOURCES, type Lead, type Template } from '@/lib/outreach'
import { Avatar, field, fullName, localInput, SidePanel, statusLabel } from './shared'
import Icon from './Icon'

// The one place to write an email. "To" takes saved contacts or any address;
// each person gets their own copy (personalised and tracked). New addresses
// can be added to contacts with the tick box at the bottom.

export type Recipient = { lead?: Lead; email: string }
export type Attachment = { filename: string; content: string; size: number }
export type Outgoing = {
  recipients: Recipient[]
  make: (r: Recipient) => { subject: string; body: string }
  schedule: { at: Date; gapMin: number } | null
  attachments: Attachment[]
  saveNew: { source: string } | null
  includeFinished: boolean
}

const MAX_ATTACH = 3 * 1024 * 1024 // stays well under the hosting request limit

export default function Composer({ contacts, templates, initial, initialEmails = [], initialSubject, initialTemplate, busy, onClose, onSend }: {
  contacts: Lead[]; templates: Template[]; initial: Lead[]; initialEmails?: string[]; initialSubject?: string; initialTemplate?: string | null; busy: boolean
  onClose: () => void; onSend: (o: Outgoing) => void
}) {
  const [to, setTo] = useState<Recipient[]>([...initial.map(l => ({ lead: l, email: l.email })), ...initialEmails.filter(e => !initial.some(l => l.email === e)).map(email => ({ email }))])
  const [typed, setTyped] = useState('')
  const [templateId, setTemplateId] = useState(initialTemplate ?? '')
  const tpl = templates.find(t => t.id === templateId)
  const [subject, setSubject] = useState(initialSubject ?? tpl?.subject ?? '')
  const [body, setBody] = useState(tpl?.body ?? '')
  const [files, setFiles] = useState<Attachment[]>([])
  const [mode, setMode] = useState<'now' | 'later'>('now')
  const [at, setAt] = useState(() => { const d = new Date(Date.now() + 86_400_000); d.setHours(9, 0, 0, 0); return localInput(d) })
  const [gap, setGap] = useState(3)
  const [saveNew, setSaveNew] = useState(true)
  const [source, setSource] = useState('linkedin')
  const [preview, setPreview] = useState(0)
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)

  const chosen = new Set(to.map(r => r.email))
  const suggestions = useMemo(() => {
    const q = typed.trim().toLowerCase()
    if (!q) return []
    return contacts.filter(c => !chosen.has(c.email) && [c.email, c.first_name, c.last_name, c.company].some(v => v?.toLowerCase().includes(q))).slice(0, 6)
  }, [typed, contacts, to]) // eslint-disable-line react-hooks/exhaustive-deps

  const add = (r: Recipient) => { if (!chosen.has(r.email)) setTo(t => [...t, r]); setTyped(''); setError(''); input.current?.focus() }
  const addTyped = () => {
    const email = typed.trim().replace(/[,;]$/, '').toLowerCase()
    if (!email) return
    if (!EMAIL_RE.test(email)) { setError(`"${email}" doesn’t look like an email address.`); return }
    const known = contacts.find(c => c.email.toLowerCase() === email)
    add(known ? { lead: known, email: known.email } : { email })
  }

  const pick = (id: string) => {
    setTemplateId(id)
    const t = templates.find(x => x.id === id)
    setSubject(t?.subject ?? ''); setBody(t?.body ?? '')
  }

  const attach = async (list: FileList | null) => {
    if (!list) return
    const next = [...files]
    for (const f of Array.from(list)) {
      const content = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = rej; r.readAsDataURL(f) })
      next.push({ filename: f.name, content, size: f.size })
    }
    if (next.reduce((n, f) => n + f.size, 0) > MAX_ATTACH) { setError('Attachments must add up to less than 3 MB.'); return }
    setFiles(next); setError('')
  }

  const asLead = (r: Recipient) => r.lead ?? ({ first_name: null, last_name: null, company: null, title: null } as unknown as Lead)
  const make = (r: Recipient) => ({ subject: personalise(subject, asLead(r)), body: personalise(body, asLead(r)) })
  const newOnes = to.filter(r => !r.lead)
  const finished = to.filter(r => r.lead && isFinished(r.lead.status))
  const p = to[Math.min(preview, to.length - 1)]
  const shown = p ? make(p) : { subject, body }

  const send = () => {
    if (!to.length) { setError('Add at least one person in “To”.'); return }
    if (!subject.trim() || !body.trim()) { setError('Add a subject and a message.'); return }
    let includeFinished = false
    if (finished.length) includeFinished = window.confirm(`${finished.map(r => fullName(r.lead!)).join(', ')} ${finished.length > 1 ? 'have' : 'has'} already ${finished.length > 1 ? 'replied, bounced or been stopped' : `been marked “${statusLabel[finished[0].lead!.status].toLowerCase()}”`}. Email ${finished.length > 1 ? 'them' : 'them'} too?\n\nOK = include, Cancel = skip ${finished.length > 1 ? 'them' : 'them'}.`)
    let schedule: Outgoing['schedule'] = null
    if (mode === 'later') {
      const date = new Date(at)
      if (Number.isNaN(date.getTime()) || date.getTime() < Date.now() + 60_000) { setError('Pick a time at least a minute from now.'); return }
      schedule = { at: date, gapMin: gap }
    }
    onSend({ recipients: to, make, schedule, attachments: files, saveNew: saveNew && newOnes.length ? { source } : null, includeFinished })
  }

  return <SidePanel wide onClose={onClose} title="New email"
    footer={<div className="flex flex-col gap-3">
      {newOnes.length > 0 && <label className="flex flex-wrap items-center gap-2.5 text-sm">
        <input type="checkbox" checked={saveNew} onChange={e => setSaveNew(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--primary))]" />
        <span className="font-semibold">Add {newOnes.length === 1 ? newOnes[0].email : `${newOnes.length} new addresses`} to my contacts</span>
        {saveNew && <select value={source} onChange={e => setSource(e.target.value)} className="rounded-full border border-ink-border bg-bg px-2.5 py-1 text-xs">{SOURCES.map(s => <option key={s.key} value={s.key}>met via {s.label}</option>)}</select>}
        <span className="w-full pl-6 text-xs text-muted sm:w-auto sm:pl-0">so opens, replies and follow-ups are tracked.</span>
      </label>}
      {error && <p className="text-sm font-semibold text-[#DC2626] dark:text-[#F87171]">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={busy} onClick={send} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-[0_10px_30px_-12px_rgb(var(--primary)/.7)] transition hover:bg-primary-dim disabled:opacity-50">
          {mode === 'later' ? 'Schedule' : 'Send'}{to.length > 1 ? ` to ${to.length} people` : ''} →
        </button>
        <button onClick={onClose} className="text-sm font-semibold text-muted hover:text-parchment">Cancel</button>
        <span className="ml-auto text-xs text-muted">From hello@ladyprowess.com · each person gets their own email</span>
      </div>
    </div>}>
    <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4 p-5">
        {/* To */}
        <div>
          <label htmlFor="to" className="text-xs font-semibold text-muted">To</label>
          <div className="relative mt-1.5">
            <div onClick={() => input.current?.focus()} className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-xl border border-ink-border bg-bg px-2 py-1.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              {to.map(r => <span key={r.email} className={`flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-xs font-semibold ${r.lead ? 'bg-primary/10 text-primary' : 'bg-surface-2'}`}>
                {r.lead ? <Avatar lead={r.lead} size="sm" /> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-muted"><Icon name="at" className="h-3.5 w-3.5" /></span>}
                {r.lead ? fullName(r.lead) : r.email}{!r.lead && <span className="font-normal text-muted">new</span>}
                <button onClick={e => { e.stopPropagation(); setTo(t => t.filter(x => x.email !== r.email)) }} aria-label={`Remove ${r.email}`} className="ml-0.5 opacity-60 hover:opacity-100"><Icon name="x" className="h-3.5 w-3.5" /></button>
              </span>)}
              <input id="to" ref={input} value={typed} onChange={e => { setTyped(e.target.value); setError('') }} placeholder={to.length ? 'Add another…' : 'Type a name from your contacts, or any email address'}
                onKeyDown={e => { if (['Enter', ',', 'Tab'].includes(e.key) && typed.trim()) { e.preventDefault(); suggestions[0] && !EMAIL_RE.test(typed.trim()) ? add({ lead: suggestions[0], email: suggestions[0].email }) : addTyped() } else if (e.key === 'Backspace' && !typed) setTo(t => t.slice(0, -1)) }}
                onBlur={() => typed.trim() && EMAIL_RE.test(typed.trim()) && addTyped()}
                className="min-w-[180px] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none" />
            </div>
            {suggestions.length > 0 && <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-ink-border bg-surface shadow-lg">
              {suggestions.map(c => <li key={c.id}><button onMouseDown={e => { e.preventDefault(); add({ lead: c, email: c.email }) }} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-surface-2">
                <Avatar lead={c} size="sm" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{fullName(c)}</span><span className="block truncate text-xs text-muted">{[c.company, c.email].filter(Boolean).join(' · ')}</span></span>
              </button></li>)}
            </ul>}
          </div>
        </div>

        <label className="block text-xs font-semibold text-muted">Template
          <select value={templateId} onChange={e => pick(e.target.value)} className={`mt-1.5 ${field}`}>
            <option value="">Blank email</option>{templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-muted">Subject<input value={subject} onChange={e => setSubject(e.target.value)} className={`mt-1.5 ${field}`} /></label>
        <label className="block text-xs font-semibold text-muted">Message
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} placeholder="Hi {first_name}," className={`mt-1.5 resize-y leading-6 ${field}`} />
        </label>
        <p className="-mt-2 text-xs text-muted">{'{first_name}'}, {'{company}'} and {'{title}'} are filled in for each person. Editing here doesn’t change the saved template.</p>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-ink-border px-3.5 py-2 text-xs font-semibold hover:border-primary"><Icon name="paperclip" className="h-3.5 w-3.5" />Attach file<input type="file" multiple className="sr-only" onChange={e => { attach(e.target.files); e.target.value = '' }} /></label>
          {files.map(f => <span key={f.filename} className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs">{f.filename}<button onClick={() => setFiles(fs => fs.filter(x => x !== f))} aria-label={`Remove ${f.filename}`} className="text-muted hover:text-parchment"><Icon name="x" className="h-3.5 w-3.5" /></button></span>)}
        </div>

        <div className="rounded-2xl border border-ink-border p-3.5">
          <div className="flex gap-1 text-xs font-semibold">
            {([['now', 'Send now'], ['later', 'Schedule for later']] as const).map(([k, t]) => <button key={k} onClick={() => setMode(k)} className={`rounded-full px-3.5 py-1.5 ${mode === k ? 'bg-primary text-on-primary' : 'text-muted hover:text-parchment'}`}>{t}</button>)}
          </div>
          {mode === 'later' && <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-muted">{to.length > 1 ? 'First email at' : 'Send at'}<input type="datetime-local" value={at} onChange={e => setAt(e.target.value)} className={`mt-1 ${field}`} /></label>
            {to.length > 1 && <label className="text-xs text-muted">Then one every (minutes)<input type="number" min={1} max={120} value={gap} onChange={e => setGap(Math.max(1, Number(e.target.value)))} className={`mt-1 ${field}`} /></label>}
            <p className="text-xs text-muted sm:col-span-2">Sent at that time even if your laptop is closed. Cancel any time from “Scheduled”.</p>
          </div>}
        </div>
      </div>

      {/* Live preview, per person */}
      <div className="border-t border-ink-border bg-surface-2/40 p-5 lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-muted">Preview{p ? ` · ${p.lead ? fullName(p.lead) : p.email}` : ''}</span>
          {to.length > 1 && <span className="flex items-center gap-1"><button onClick={() => setPreview(i => (i - 1 + to.length) % to.length)} className="rounded-full border border-ink-border px-2 py-0.5">←</button><span className="w-10 text-center text-muted">{Math.min(preview, to.length - 1) + 1}/{to.length}</span><button onClick={() => setPreview(i => (i + 1) % to.length)} className="rounded-full border border-ink-border px-2 py-0.5">→</button></span>}
        </div>
        <div className="mt-3 rounded-2xl border border-ink-border bg-paper p-5 text-sm leading-6 shadow-sm">
          <p className="text-xs text-muted">From Lady Prowess &lt;hello@ladyprowess.com&gt;{p ? ` · to ${p.email}` : ''}</p>
          <p className="mt-1.5 font-semibold">{shown.subject || 'No subject'}</p>
          <div className="mt-4 whitespace-pre-wrap">{shown.body || <span className="text-muted">Your message appears here.</span>}</div>
          {files.length > 0 && <p className="mt-4 flex items-center gap-1.5 text-xs text-muted"><Icon name="paperclip" className="h-3.5 w-3.5" />{files.map(f => f.filename).join(', ')}</p>}
          <p className="mt-4 border-t border-ink-border pt-3 text-xs text-muted">+ your Lady Prowess signature</p>
        </div>
        {finished.length > 0 && <p className="mt-3 rounded-xl bg-surface p-3 text-xs text-muted">{finished.length} of these {finished.length > 1 ? 'have' : 'has'} already replied, bounced or been stopped. You’ll be asked before they’re included.</p>}
      </div>
    </div>
  </SidePanel>
}
