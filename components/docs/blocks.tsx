'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { highlight } from './highlight'
import { useShell } from './Shell'

const RELAY_KEY = 'sk_test_relay_4eC39HqLyjWD'

/* Building blocks of the documentation view: the same pieces a real docs
   site is made of, so the page demonstrates the craft while it describes it. */

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="group mt-14 scroll-mt-32 font-display text-[1.6rem] font-extrabold tracking-[-0.01em] first:mt-0">
      <a href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }} className="relative">
        <span aria-hidden className="absolute -left-6 top-0 hidden text-primary opacity-0 transition group-hover:opacity-100 md:inline">#</span>
        {children}
      </a>
    </h2>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[0.98rem] leading-[1.85] text-parchment/85">{children}</p>
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-[rgb(var(--inline-code-bg))] px-1.5 py-0.5 font-head text-[0.82em] text-[rgb(var(--inline-code-ink))]">{children}</code>
}

const calloutTone = {
  note: { bar: 'border-primary', bg: 'bg-primary/[0.06]', label: 'Note', ink: 'text-primary' },
  tip: { bar: 'border-success', bg: 'bg-success/[0.07]', label: 'Tip', ink: 'text-success' },
  warning: { bar: 'border-[#D97706]', bg: 'bg-[#D97706]/[0.08]', label: 'Warning', ink: 'text-[#B45309] dark:text-[#FBBF24]' },
}

export function Callout({ kind = 'note', title, children }: { kind?: keyof typeof calloutTone; title?: string; children: ReactNode }) {
  const t = calloutTone[kind]
  return (
    <div className={`mt-6 rounded-r-xl border-l-4 ${t.bar} ${t.bg} px-5 py-4`}>
      <p className={`text-xs font-bold uppercase tracking-[0.14em] ${t.ink}`}>{title ?? t.label}</p>
      <div className="mt-1.5 text-[0.92rem] leading-7 text-parchment/85">{children}</div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1600) } catch {} }}
      className="rounded-md border border-white/10 px-2.5 py-1 text-[0.7rem] font-semibold text-white/70 transition hover:border-white/30 hover:text-white">
      {done ? 'Copied' : 'Copy'}
    </button>
  )
}

/** Shell snippets can run in the docs terminal; comment-only snippets cannot. */
function runnable(lang: string, code: string) {
  if (!['cURL', 'Shell', 'Terminal'].includes(lang)) return null
  const cmd = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n').trim()
  return cmd || null
}

/** Code sample with one tab per language; the chosen language is shared across the page. */
export function CodeTabs({ samples, title, lang, onLang }: { samples: Record<string, string>; title?: string; lang?: string; onLang?: (l: string) => void }) {
  const shell = useShell()
  const uid = useId()
  const names = Object.keys(samples)
  const [own, setOwn] = useState(names[0])
  const active = lang && names.includes(lang) ? lang : own
  const pick = (l: string) => { setOwn(l); onLang?.(l) }
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[rgb(var(--code-border))] bg-[rgb(var(--code-bg))] text-[rgb(var(--code-ink))]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3">
        <div className="flex">
          {title && <span className="py-2.5 pr-4 text-[0.72rem] text-white/50">{title}</span>}
          {names.length > 1 && names.map(n => (
            <button key={n} type="button" onClick={() => pick(n)} className={`relative px-3 py-2.5 text-[0.75rem] font-semibold transition ${n === active ? 'text-white' : 'text-white/45 hover:text-white/80'}`}>
              {n}
              {n === active && <motion.span layoutId={`tab-${uid}`} className="absolute inset-x-2 bottom-0 h-[2px] bg-[#60A5FA]" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {runnable(active, samples[active]) && <button type="button" onClick={() => shell.run(runnable(active, samples[active])!)} className="rounded-md bg-[#4ADE80]/15 px-2.5 py-1 text-[0.7rem] font-bold text-[#4ADE80] transition hover:bg-[#4ADE80]/25">Run ▸</button>}
          <CopyButton text={samples[active]} />
        </div>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-head text-[0.8rem] leading-6"><code>{highlight(samples[active])}</code></pre>
    </div>
  )
}

/** Numbered steps that can be ticked off, with progress. */
export function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  const [done, setDone] = useState<boolean[]>(items.map(() => false))
  const count = done.filter(Boolean).length
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 text-xs font-semibold text-muted">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-border"><motion.div className="h-full bg-success" animate={{ width: `${(count / items.length) * 100}%` }} /></div>
        {count} of {items.length} done
      </div>
      <ol className="mt-5 space-y-0">
        {items.map((s, n) => (
          <li key={s.title} className="relative border-l-2 border-ink-border pb-8 pl-9 last:pb-0">
            <button type="button" aria-pressed={done[n]} aria-label={`Mark step ${n + 1} done`} onClick={() => setDone(d => d.map((v, i) => (i === n ? !v : v)))}
              className={`absolute -left-[15px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 font-head text-[0.7rem] font-bold transition ${done[n] ? 'border-success bg-success text-white' : 'border-ink-border bg-surface text-parchment hover:border-success'}`}>
              {done[n] ? '✓' : n + 1}
            </button>
            <h3 className={`font-display text-[1.05rem] font-extrabold transition ${done[n] ? 'text-muted line-through decoration-2' : ''}`}>{s.title}</h3>
            <div className="text-[0.95rem] leading-7 text-parchment/85">{s.body}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export type Param = { name: string; type: string; required?: boolean; body: string }

export function Params({ items, title = 'Body parameters' }: { items: Param[]; title?: string }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-3 divide-y divide-ink-border rounded-xl border border-ink-border">
        {items.map(p => (
          <li key={p.name} className="px-4 py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-head text-[0.82rem] font-bold">{p.name}</code>
              <span className="font-head text-[0.72rem] text-muted">{p.type}</span>
              {p.required ? <span className="rounded bg-[#E5484D]/10 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-[#E5484D]">required</span> : <span className="text-[0.68rem] text-muted">optional</span>}
            </div>
            <p className="mt-1.5 text-[0.88rem] leading-6 text-parchment/80">{p.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Endpoint({ method, path }: { method: string; path: string }) {
  const color = method === 'GET' ? 'bg-success/15 text-success' : method === 'POST' ? 'bg-primary/15 text-primary' : 'bg-[#E5484D]/15 text-[#E5484D]'
  return (
    <div className="mt-5 flex items-center gap-3 rounded-xl border border-ink-border bg-surface px-4 py-3 font-head text-[0.85rem]">
      <span className={`rounded-md px-2 py-0.5 text-[0.72rem] font-bold ${color}`}>{method}</span>
      <span className="truncate">{path}</span>
    </div>
  )
}

/** "Try it": sends a real request to the Relay sandbox and shows the response. */
export function Playground() {
  const shell = useShell()
  const [amount, setAmount] = useState('12500')
  const [currency, setCurrency] = useState('NGN')
  const [reference, setReference] = useState('inv_0142')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ status: number; body: string; ms: number } | null>(null)
  const [origin, setOrigin] = useState('')
  useEffect(() => setOrigin(window.location.origin), [])

  const send = async () => {
    setBusy(true)
    const started = performance.now()
    const r = await fetch('/api/relay/v1/payments', { method: 'POST', headers: { Authorization: `Bearer ${RELAY_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: amount === '' ? undefined : Number(amount), currency, reference }) })
    setRes({ status: r.status, body: JSON.stringify(await r.json(), null, 2), ms: Math.round(performance.now() - started) })
    setBusy(false)
  }

  const curl = `curl ${origin}/api/relay/v1/payments \\\n  -H "Authorization: Bearer $RELAY_SECRET_KEY" \\\n  -d amount=${amount} \\\n  -d currency=${currency}${reference ? ` \\\n  -d reference=${reference}` : ''}`
  const field = 'mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-head text-[0.82rem] text-white outline-none transition focus:border-[#60A5FA]'
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[rgb(var(--code-border))] bg-[rgb(var(--code-bg))] text-[rgb(var(--code-ink))]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="flex items-center gap-2 text-[0.75rem] font-semibold text-white/70"><span className="rounded bg-[#60A5FA]/15 px-1.5 py-0.5 font-head text-[0.68rem] text-[#60A5FA]">POST</span>/v1/payments</span>
        <span className="flex items-center gap-1.5 text-[0.7rem] text-white/50"><span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />Sandbox</span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-3">
        <label className="text-[0.72rem] font-semibold text-white/60">amount<input value={amount} onChange={e => setAmount(e.target.value)} className={field} /></label>
        <label className="text-[0.72rem] font-semibold text-white/60">currency<select value={currency} onChange={e => setCurrency(e.target.value)} className={field}>{['NGN', 'USD', 'GHS', 'KES', 'EUR'].map(c => <option key={c} className="bg-[#121820]">{c}</option>)}</select></label>
        <label className="text-[0.72rem] font-semibold text-white/60">reference<input value={reference} onChange={e => setReference(e.target.value)} className={field} /></label>
      </div>
      <pre className="overflow-x-auto border-t border-white/10 px-5 py-3 font-head text-[0.76rem] leading-6 text-white/70"><code>{highlight(curl)}</code></pre>
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-3">
        <button type="button" onClick={send} disabled={busy} className="rounded-lg bg-[#2563EB] px-4 py-2 text-[0.8rem] font-bold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60">{busy ? 'Sending…' : 'Send request'}</button>
        <button type="button" onClick={() => shell.run(curl)} className="rounded-lg border border-white/15 px-4 py-2 text-[0.8rem] font-bold text-white/80 transition hover:border-white/40 hover:text-white">Run in terminal</button>
      </div>
      <AnimatePresence>
        {res && (
          <motion.div key={res.body} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden border-t border-white/10">
            <div className="flex items-center gap-2 px-4 pt-3 text-[0.72rem] font-bold">
              <span className={`rounded px-1.5 py-0.5 ${res.status < 300 ? 'bg-[#4ADE80]/15 text-[#4ADE80]' : 'bg-[#F87171]/15 text-[#F87171]'}`}>{res.status}</span>
              <span className="text-white/50">{res.ms} ms</span>
            </div>
            <pre className="overflow-x-auto px-5 py-3 font-head text-[0.8rem] leading-6"><code>{highlight(res.body)}</code></pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** A button that runs a command in the docs terminal. */
export function RunCommand({ cmd, label }: { cmd: string; label?: string }) {
  const shell = useShell()
  if (label === 'Run') return <button type="button" onClick={() => shell.run(cmd)} title={cmd} className="whitespace-nowrap rounded-lg bg-[rgb(var(--code-bg))] px-3 py-1.5 font-head text-[0.72rem] font-bold text-[#4ADE80] transition hover:ring-2 hover:ring-[#4ADE80]/50">Run ▸</button>
  return (
    <button type="button" onClick={() => shell.run(cmd)} className="group inline-flex max-w-full items-center gap-2 rounded-lg bg-[rgb(var(--code-bg))] px-3 py-2 text-left font-head text-[0.78rem] text-[rgb(var(--code-ink))] transition hover:ring-2 hover:ring-[#4ADE80]/50">
      <span className="text-[#4ADE80]">$</span><span className="truncate">{label ?? cmd}</span><span className="ml-1 shrink-0 text-[0.68rem] font-bold text-[#4ADE80] opacity-70 group-hover:opacity-100">Run ▸</span>
    </button>
  )
}

/** Click a question to open its answer: the troubleshooting pattern. */
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mt-6 divide-y divide-ink-border rounded-xl border border-ink-border">
      {items.map((it, n) => (
        <div key={it.q}>
          <button type="button" aria-expanded={open === n} onClick={() => setOpen(open === n ? null : n)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.95rem] font-bold">
            {it.q}<motion.span animate={{ rotate: open === n ? 45 : 0 }} className="text-xl text-muted">+</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === n && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="px-5 pb-5 text-[0.92rem] leading-7 text-parchment/80">{it.a}</div></motion.div>}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

/** Payment lifecycle: each state lights up in turn; click a state to read it. */
export function Lifecycle() {
  const states = [
    { key: 'pending', label: 'pending', body: 'The payment exists and is waiting for funds. Lasts about 8 seconds in the sandbox.' },
    { key: 'confirmed', label: 'confirmed', body: 'The funds have arrived and passed checks. Settles about 8 seconds later.' },
    { key: 'settled', label: 'settled', body: 'The money is in your balance. The payment can now be refunded.' },
  ]
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => setI(v => (v + 1) % states.length), 2200)
    return () => clearInterval(t)
  }, [auto, states.length])
  return (
    <div className="mt-6 rounded-xl border border-ink-border bg-surface p-5 md:p-7">
      <div className="flex items-center">
        {states.map((s, n) => (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <button type="button" onClick={() => { setAuto(false); setI(n) }} className={`relative rounded-full border-2 px-4 py-2 font-head text-[0.78rem] font-bold transition ${n <= i ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-bg text-muted'}`}>
              {s.label}
              {n === i && <motion.span layoutId="life-ring" className="absolute -inset-1.5 rounded-full border-2 border-primary/40" />}
            </button>
            {n < states.length - 1 && <div className="mx-2 h-[2px] flex-1 overflow-hidden rounded bg-ink-border"><motion.div className="h-full bg-primary" animate={{ width: n < i ? '100%' : '0%' }} transition={{ duration: 0.6 }} /></div>}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 text-[0.92rem] leading-7"><code className="font-head font-bold text-primary">{states[i].label}</code> · {states[i].body}</motion.p>
      </AnimatePresence>
    </div>
  )
}

/** A product screen with numbered hotspots; each number explains one control. */
export function Hotspots() {
  const spots = [
    { x: 8, y: 14, title: 'Balance', body: 'What you can spend right now, in naira. Pending deposits are not included.' },
    { x: 70, y: 14, title: 'Add money', body: 'Opens the funding options and shows the current rate before you send anything.' },
    { x: 8, y: 52, title: 'Pay a bill', body: 'Choose a category, enter the account or meter number, then confirm the amount.' },
    { x: 52, y: 80, title: 'Activity', body: 'Every payment with its status. Select one to download a receipt.' },
  ]
  const [on, setOn] = useState(0)
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-[1fr_0.9fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink-border bg-surface-2 p-4">
        <div className="h-[22%] rounded-lg bg-surface p-3 shadow-sm"><div className="h-2 w-16 rounded bg-ink-border" /><div className="mt-2 h-4 w-28 rounded bg-parchment/80" /></div>
        <div className="absolute right-4 top-4 h-[13%] w-[26%] rounded-lg bg-primary" />
        <div className="mt-3 grid h-[34%] grid-cols-4 gap-2">{[0, 1, 2, 3].map(n => <div key={n} className="rounded-lg bg-surface shadow-sm" />)}</div>
        <div className="mt-3 space-y-2">{[0, 1].map(n => <div key={n} className="h-6 rounded-lg bg-surface shadow-sm" />)}</div>
        {spots.map((s, n) => (
          <button key={s.title} type="button" onClick={() => setOn(n)} aria-label={`${n + 1}: ${s.title}`} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <span className={`relative flex h-7 w-7 items-center justify-center rounded-full font-head text-xs font-bold shadow-lg transition ${n === on ? 'bg-primary text-on-primary' : 'bg-parchment text-bg'}`}>
              {n === on && <span className="absolute inset-0 animate-ping rounded-full bg-primary/50" />}<span className="relative">{n + 1}</span>
            </span>
          </button>
        ))}
      </div>
      <ol className="space-y-2">
        {spots.map((s, n) => (
          <li key={s.title}>
            <button type="button" onClick={() => setOn(n)} className={`w-full rounded-xl border px-4 py-3 text-left transition ${n === on ? 'border-primary bg-primary/[0.06]' : 'border-ink-border hover:bg-surface-2'}`}>
              <span className="font-head text-xs font-bold text-primary">{n + 1}</span> <b className="text-[0.92rem]">{s.title}</b>
              {n === on && <p className="mt-1 text-[0.85rem] leading-6 text-parchment/80">{s.body}</p>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Table with tidy borders, used for error codes and skills. */
export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-ink-border">
      <table className="w-full text-left text-[0.88rem]">
        <thead className="bg-[rgb(var(--table-head-bg))]"><tr>{head.map(h => <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-muted">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-ink-border">{rows.map((r, n) => <tr key={n}>{r.map((c, i) => <td key={i} className="px-4 py-3 align-top leading-6">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
