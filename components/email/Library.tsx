'use client'

import { useEffect, useRef, useState } from 'react'
import { apolloToLead, parseCsv } from '@/lib/csv'
import { personalise, SOURCES, type Lead, type OutreachSettings, type Template } from '@/lib/outreach'
import { CheckText, field, fullName, localInput, SidePanel } from './shared'

// Templates view, the "Add contacts" panel (one person or a CSV), and sending rules.

export function TemplatesView({ templates, sample, onSave, onDelete }: { templates: Template[]; sample?: Lead; onSave: (t: Partial<Template>) => Promise<Template | null>; onDelete: (id: string) => Promise<void> }) {
  const [id, setId] = useState<string | null>(templates[0]?.id ?? null)
  const current = templates.find(t => t.id === id)
  const [draft, setDraft] = useState<Partial<Template>>(current ?? { name: 'New template', subject: '', body: '' })
  const [saved, setSaved] = useState('')
  const box = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { if (current) setDraft(current) }, [current])
  const lead = sample ?? ({ first_name: 'Ada', last_name: 'Obi', company: 'Acme Pay', title: 'CTO', email: 'ada@acmepay.com' } as Lead)
  const insert = (f: string) => {
    const text = draft.body || ''
    const s = box.current?.selectionStart ?? text.length
    setDraft({ ...draft, body: `${text.slice(0, s)}{${f}}${text.slice(box.current?.selectionEnd ?? s)}` })
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      {templates.map(t => <button key={t.id} onClick={() => setId(t.id)} className={`rounded-full border px-3.5 py-2 text-sm transition ${t.id === id ? 'border-primary bg-primary/10 font-semibold text-primary' : 'border-ink-border bg-surface hover:border-muted'}`}>{t.name}</button>)}
      <button onClick={() => { setId(null); setDraft({ name: 'New template', subject: '', body: '' }) }} className="rounded-full border border-dashed border-ink-border px-3.5 py-2 text-sm font-semibold text-primary hover:border-primary">+ New template</button>
    </div>
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-3 rounded-2xl border border-ink-border bg-surface p-5">
        <label className="block text-xs font-semibold text-muted">Template name<input value={draft.name || ''} onChange={e => setDraft({ ...draft, name: e.target.value })} className={`mt-1.5 ${field}`} /></label>
        <label className="block text-xs font-semibold text-muted">Subject<input value={draft.subject || ''} onChange={e => setDraft({ ...draft, subject: e.target.value })} className={`mt-1.5 ${field}`} /></label>
        <label className="block text-xs font-semibold text-muted">Message<textarea ref={box} value={draft.body || ''} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={13} className={`mt-1.5 resize-y leading-6 ${field}`} /></label>
        <div className="flex flex-wrap items-center gap-1.5 text-xs"><span className="text-muted">Insert:</span>
          {['first_name', 'last_name', 'company', 'title'].map(f => <button key={f} onClick={() => insert(f)} className="rounded-full border border-ink-border px-2.5 py-1 font-mono hover:border-primary hover:text-primary">{`{${f}}`}</button>)}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button onClick={async () => { const t = await onSave({ ...draft, id: id ?? undefined }); if (t) { setId(t.id); setSaved('✓ Saved') } else setSaved('Could not save'); window.setTimeout(() => setSaved(''), 2500) }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">Save template</button>
          {id && <button onClick={async () => { const t = await onSave({ name: `${draft.name} (copy)`, subject: draft.subject, body: draft.body }); if (t) setId(t.id) }} className="text-sm font-semibold text-muted hover:text-parchment">Duplicate</button>}
          {id && <button onClick={async () => { if (window.confirm(`Delete “${draft.name}”?`)) { await onDelete(id); setId(templates.find(t => t.id !== id)?.id ?? null) } }} className="text-sm font-semibold text-[#DC2626] dark:text-[#F87171]">Delete</button>}
          <span className="text-sm font-semibold text-success"><CheckText text={saved} /></span>
        </div>
      </div>
      <div className="rounded-2xl border border-ink-border bg-surface-2/40 p-5 xl:sticky xl:top-6 xl:self-start">
        <p className="text-xs font-semibold text-muted">Preview · to {fullName(lead)}{lead.company ? `, ${lead.company}` : ''}</p>
        <div className="mt-3 rounded-2xl border border-ink-border bg-paper p-5 text-sm leading-6">
          <p className="font-semibold">{personalise(draft.subject || '', lead) || 'No subject'}</p>
          <div className="mt-4 whitespace-pre-wrap">{personalise(draft.body || '', lead)}</div>
          <p className="mt-4 border-t border-ink-border pt-3 text-xs text-muted">+ your Lady Prowess signature</p>
        </div>
      </div>
    </div>
  </div>
}

export function AddContactsPanel({ onClose, onAdd, onImport }: {
  onClose: () => void
  onAdd: (lead: Record<string, string>, sent: { subject: string; at: string } | null) => Promise<string>
  onImport: (rows: ReturnType<typeof apolloToLead>[], source: string) => Promise<{ added?: number; skipped?: number; invalid?: number; error?: string }>
}) {
  const [tab, setTab] = useState<'one' | 'csv'>('one')
  const blank = { email: '', first_name: '', last_name: '', company: '', title: '', linkedin: '', source: 'linkedin', notes: '' }
  const [f, setF] = useState(blank)
  const [already, setAlready] = useState(false)
  const [sent, setSent] = useState({ subject: '', at: localInput(new Date()) })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [rows, setRows] = useState<ReturnType<typeof apolloToLead>[]>([])
  const [file, setFile] = useState('')
  const [src, setSrc] = useState('apollo')
  const [drag, setDrag] = useState(false)

  const read = async (file?: File) => {
    if (!file) return
    setMsg('')
    try {
      const parsed = parseCsv(await file.text()).map(apolloToLead).filter(r => r.email)
      setRows(parsed); setFile(file.name)
      if (!parsed.length) setMsg('No contacts with an email address were found in that file.')
    } catch (error) { setMsg(`Could not read that file: ${error instanceof Error ? error.message : 'unknown error'}`) }
  }

  return <SidePanel onClose={onClose} title="Add contacts">
    <div className="p-5">
      <div className="flex gap-1 rounded-full border border-ink-border bg-bg p-1 text-sm font-semibold">
        {([['one', 'One person'], ['csv', 'Import a CSV']] as const).map(([k, t]) => <button key={k} onClick={() => { setTab(k); setMsg('') }} className={`flex-1 rounded-full px-4 py-2 ${tab === k ? 'bg-primary text-on-primary' : 'text-muted'}`}>{t}</button>)}
      </div>

      {tab === 'one' && <form onSubmit={async e => { e.preventDefault(); setBusy(true); const m = await onAdd(f, already ? { subject: sent.subject, at: new Date(sent.at).toISOString() } : null); setBusy(false); setMsg(m); if (m.startsWith('✓')) { setF(blank); setAlready(false) } }} className="mt-5 space-y-3">
        <p className="text-sm text-muted">Someone from LinkedIn, a referral, an event… anyone.</p>
        <input required type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Email address *" className={field} />
        <div className="grid grid-cols-2 gap-3">
          {([['first_name', 'First name'], ['last_name', 'Last name'], ['company', 'Company'], ['title', 'Job title']] as const).map(([k, t]) => <input key={k} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={t} className={field} />)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input value={f.linkedin} onChange={e => setF({ ...f, linkedin: e.target.value })} placeholder="LinkedIn URL" className={field} />
          <select value={f.source} onChange={e => setF({ ...f, source: e.target.value })} className={field}>{SOURCES.map(s => <option key={s.key} value={s.key}>Met via {s.label}</option>)}</select>
        </div>
        <textarea value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} rows={2} placeholder="Notes (optional)" className={`resize-none ${field}`} />
        <label className="flex items-center gap-2.5 text-sm font-semibold"><input type="checkbox" checked={already} onChange={e => setAlready(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--primary))]" />I already emailed them from another inbox</label>
        {already && <div className="grid gap-3 rounded-2xl bg-surface-2/60 p-3 sm:grid-cols-2">
          <input value={sent.subject} onChange={e => setSent({ ...sent, subject: e.target.value })} placeholder="Subject of that email" className={field} />
          <input type="datetime-local" value={sent.at} onChange={e => setSent({ ...sent, at: e.target.value })} className={field} />
          <p className="text-xs text-muted sm:col-span-2">Recorded so you’re reminded to follow up.</p>
        </div>}
        <button disabled={busy} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim disabled:opacity-50">{busy ? 'Saving…' : 'Add contact'}</button>
      </form>}

      {tab === 'csv' && <div className="mt-5 space-y-3">
        <label onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files[0]) }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-primary bg-primary/[0.05]' : 'border-ink-border hover:border-primary/50'}`}>
          <span className="font-display text-lg font-semibold">Drop a CSV here</span>
          <span className="mt-1 text-sm text-muted">or click to choose. Apollo exports work as they are. People already in your contacts are skipped.</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={e => read(e.target.files?.[0])} />
        </label>
        {rows.length > 0 && <div className="overflow-hidden rounded-2xl border border-ink-border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-border p-3">
            <p className="text-sm"><span className="font-semibold">{rows.length} contacts</span> <span className="text-muted">in {file}</span></p>
            <div className="flex items-center gap-2">
              <select value={src} onChange={e => setSrc(e.target.value)} aria-label="Source" className="rounded-full border border-ink-border bg-bg px-3 py-1.5 text-sm">{SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
              <button disabled={busy} onClick={async () => { setBusy(true); const r = await onImport(rows, src); setBusy(false); setMsg(r.error ? `Could not import: ${r.error}` : `✓ Added ${r.added}. Skipped ${r.skipped} already in your contacts${r.invalid ? `, ${r.invalid} without a valid email` : ''}.`); if (!r.error) setRows([]) }}
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-on-primary disabled:opacity-50">{busy ? 'Importing…' : `Import ${rows.length}`}</button>
            </div>
          </div>
          <ul className="max-h-72 divide-y divide-ink-border overflow-y-auto text-sm">
            {rows.map(r => <li key={r.email} className="flex justify-between gap-3 px-3 py-2"><span className="truncate"><span className="font-semibold">{r.first_name} {r.last_name}</span> <span className="text-muted">· {r.title}</span></span><span className="shrink-0 text-muted">{r.company}</span></li>)}
          </ul>
        </div>}
      </div>}

      {msg && <p className={`mt-4 rounded-2xl p-3.5 text-sm font-semibold ${msg.startsWith('✓') ? 'bg-success/10 text-success' : 'bg-surface-2 text-muted'}`}><CheckText text={msg} /></p>}
    </div>
  </SidePanel>
}

export function RulesPanel({ settings, onClose, onSave }: { settings: OutreachSettings; onClose: () => void; onSave: (s: OutreachSettings) => Promise<void> }) {
  const [s, setS] = useState(settings)
  const [saved, setSaved] = useState(false)
  return <SidePanel onClose={onClose} title="Sending rules">
    <div className="space-y-5 p-5">
      {([['daily_limit', 'Most emails to contacts per day', 'Protects ladyprowess.com from spam filters. Start with 10–20.', 1, 100], ['follow_up_days', 'Remind me to follow up after (days)', 'People who haven’t replied by then move to “Follow up now”.', 1, 30], ['max_follow_ups', 'Stop reminding after (follow-ups)', 'After this many follow-ups with no reply, they stop appearing.', 0, 5]] as const).map(([k, t, hint, lo, hi]) =>
        <label key={k} className="block">
          <span className="text-sm font-semibold">{t}</span>
          <span className="block text-xs text-muted">{hint}</span>
          <input type="number" min={lo} max={hi} value={s[k]} onChange={e => setS({ ...s, [k]: Number(e.target.value) })} className={`mt-2 w-32 ${field}`} />
        </label>)}
      <button onClick={async () => { await onSave(s); setSaved(true); window.setTimeout(() => setSaved(false), 2000) }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">{saved ? <CheckText text="✓ Saved" /> : 'Save rules'}</button>
    </div>
  </SidePanel>
}
