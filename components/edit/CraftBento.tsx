'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { deliverables, roles } from '@/lib/portfolio-content'

// The five crafts as a bento grid. Each card has a small live demo of the work
// itself, and opens to show what that craft delivers.
const layout: Record<string, string> = {
  product: 'lg:col-span-4',
  writing: 'lg:col-span-2',
  web: 'lg:col-span-2',
  education: 'lg:col-span-2',
  business: 'lg:col-span-2',
}

const demos: Record<string, () => JSX.Element> = {
  product: ProductDemo,
  writing: WritingDemo,
  web: WebDemo,
  education: EducationDemo,
  business: BusinessDemo,
}

export default function CraftBento() {
  return <section id="expertise" className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
    <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">How I work</p><h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.75rem] md:leading-[1.08]">One person. Five ways to solve the problem.</h2></div>
      <a href="/services" className="text-sm font-semibold text-primary hover:underline">Services and case studies →</a>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {roles.map((r, i) => <CraftCard key={r.key} role={r} index={i} className={layout[r.key]} Demo={demos[r.key]} />)}
    </div>
  </section>
}

function CraftCard({ role, index, className, Demo }: { role: (typeof roles)[number]; index: number; className: string; Demo: () => JSX.Element }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  return <article className={`group flex flex-col overflow-hidden rounded-3xl border border-ink-border bg-surface transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(17,24,39,.35)] ${className}`}>
    <div className="desk-dots relative h-48 overflow-hidden border-b border-ink-border bg-surface-2/60"><Demo /></div>
    <div className="flex flex-1 flex-col p-6">
      <p className="font-head text-[10px] uppercase tracking-wider text-muted">0{index + 1} · {role.label}</p>
      <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-[-.02em]">{role.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{role.body}</p>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="mt-auto flex items-center justify-between pt-5 text-sm font-semibold text-primary">
        What you get <span className={`transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>{open && <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
        {deliverables[role.key].map((item, i) => <li key={item} className="mt-3 flex items-center gap-3 text-sm">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: reduce ? 0 : 0.1 + i * 0.12, type: 'spring', stiffness: 400, damping: 18 }} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] text-on-primary">✓</motion.span>{item}
        </li>)}
      </motion.ul>}</AnimatePresence>
    </div>
  </article>
}

/** Cycles on an interval while on screen. */
function useTicker(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-40px' })
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!inView || reduce) return
    const t = window.setInterval(() => setI(v => (v + 1) % count), ms)
    return () => window.clearInterval(t)
  }, [inView, reduce, count, ms])
  return { ref, i, inView }
}

function ProductDemo() {
  const { ref, i } = useTicker(3, 2200)
  const variants = [
    { tag: 'A', text: 'Seamless cross-border value transfer', ctr: 28 },
    { tag: 'B', text: 'Send money home in two minutes', ctr: 74 },
  ]
  return <div ref={ref} className="absolute inset-0 flex flex-col justify-center gap-2.5 px-6 md:px-10">
    {variants.map((v, k) => {
      const winner = i === 2 && v.tag === 'B'
      return <div key={v.tag} className={`rounded-xl border bg-surface px-4 py-3 shadow-sm transition-colors ${winner ? 'border-success/50' : 'border-ink-border'}`}>
        <div className="flex items-center justify-between gap-3 text-sm"><span className="truncate"><span className="mr-2 font-head text-[10px] text-muted">{v.tag}</span>{v.text}</span>{winner && <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Winner</span>}</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"><motion.div className={`h-full rounded-full ${k === 1 ? 'bg-primary' : 'bg-muted/50'}`} animate={{ width: i === 0 ? '6%' : `${v.ctr}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} /></div>
      </div>
    })}
    <p className="font-head text-[10px] uppercase tracking-wider text-muted">Headline test · sign-up rate</p>
  </div>
}

function WritingDemo() {
  const { ref, i } = useTicker(2, 2600)
  return <div ref={ref} className="absolute inset-0 flex items-center px-5">
    <div className="w-full rounded-xl bg-[#0F172A] p-4 font-mono text-[11px] leading-5 text-[#CBD5E1] shadow-lg">
      <p><span className="text-[#93C5FD]">POST</span> /v1/payments</p>
      <p className={`rounded px-1 transition-colors ${i === 1 ? 'bg-primary/30' : ''}`}><span className="text-[#F9A8D4]">Idempotency-Key</span>: 8f2c…a91</p>
      <p className="text-[#64748B]">{'{ "amount": 5000 }'}</p>
    </div>
    <AnimatePresence>{i === 1 && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-4 right-4 max-w-[70%] rounded-lg border border-ink-border bg-surface px-3 py-2 text-[11px] leading-4 shadow-md">Sent twice by accident? You are only charged once.</motion.div>}</AnimatePresence>
  </div>
}

function WebDemo() {
  const { ref, i } = useTicker(2, 2400)
  const blocks = ['h-2.5 w-full', 'h-10 w-3/4', 'h-2 w-1/2', 'grid']
  return <div ref={ref} className="absolute inset-0 flex items-center justify-center px-6">
    <div className="w-full max-w-[240px] rounded-xl border border-ink-border bg-surface p-3 shadow-lg">
      <div className="mb-2.5 flex gap-1">{[0, 1, 2].map(d => <span key={d} className="h-1.5 w-1.5 rounded-full bg-ink-border" />)}</div>
      <div className="space-y-2">{blocks.map((b, k) => <motion.div key={k} initial={false} animate={{ opacity: i === 1 || k === 0 ? 1 : 0.15, x: i === 1 || k === 0 ? 0 : -8 }} transition={{ delay: i === 1 ? k * 0.12 : 0, duration: 0.35 }}>
        {b === 'grid' ? <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map(c => <span key={c} className="h-7 rounded-md bg-surface-2" />)}</div> : <div className={`rounded-md ${k === 1 ? 'bg-primary/80' : 'bg-surface-2'} ${b}`} />}
      </motion.div>)}</div>
    </div>
  </div>
}

function EducationDemo() {
  const { ref, i } = useTicker(2, 2400)
  const options = ['Logs you into the website', 'Restores your wallet if you lose your phone', 'Speeds up transactions']
  return <div ref={ref} className="absolute inset-0 flex flex-col justify-center px-5">
    <p className="text-xs font-semibold">What does a seed phrase do?</p>
    <div className="mt-2.5 space-y-1.5">{options.map((o, k) => {
      const right = i === 1 && k === 1
      return <div key={o} className={`rounded-lg border px-3 py-1.5 text-[11px] transition-colors ${right ? 'border-success/50 bg-success/10 text-success' : 'border-ink-border bg-surface'}`}>{right ? '✓ ' : ''}{o}</div>
    })}</div>
    <p className="mt-2.5 font-head text-[9px] uppercase tracking-wider text-muted">Module 3 of 5</p>
  </div>
}

function BusinessDemo() {
  const { ref } = useTicker(1, 1000)
  const nodes = ['Offer', 'System', 'Revenue']
  return <div ref={ref} className="absolute inset-0 flex items-center justify-center px-5">
    <svg viewBox="0 0 260 60" className="absolute inset-x-6 top-1/2 h-14 -translate-y-1/2" aria-hidden="true">
      <path d="M40 30 H220" stroke="rgb(var(--primary))" strokeWidth="2" strokeDasharray="6 6" className="motion-safe:animate-[dash_1.2s_linear_infinite]" />
    </svg>
    <div className="relative flex w-full justify-between">{nodes.map((n, k) => <div key={n} className={`rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm ${k === 2 ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-surface'}`}>{n}</div>)}</div>
  </div>
}
