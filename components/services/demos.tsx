'use client'

import Image from 'next/image'
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ServiceKey } from '@/lib/services-content'

// Live demos for the services page. Each one plays its steps in real time once
// it scrolls into view, loops, and can be replayed. Reduced motion shows the
// finished result.

function useLoop(durations: number[], active: boolean) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (reduce) { setStep(durations.length - 1); return }
    if (!active) return
    const t = window.setTimeout(() => setStep(s => (s + 1 < durations.length ? s + 1 : 0)), durations[step] + (step === durations.length - 1 ? 1800 : 0))
    return () => window.clearTimeout(t)
  }, [step, active, reduce, durations, run])
  return { step, replay: () => { setStep(0); setRun(r => r + 1) } }
}

/** Types text once it mounts. */
function Typed({ text, speed = 28, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)
  useEffect(() => {
    if (reduce) return
    let i = 0, t = 0
    const tick = () => { i += 1; setN(i); if (i < text.length) t = window.setTimeout(tick, speed) }
    t = window.setTimeout(tick, delay)
    return () => window.clearTimeout(t)
  }, [text, speed, delay, reduce])
  return <>{text.slice(0, n)}{n < text.length && <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] animate-pulse bg-primary" />}</>
}

function Frame({ label, step, total, onReplay, children }: { label: string; step: number; total: number; onReplay: () => void; children: ReactNode }) {
  return <div className="overflow-hidden rounded-[22px] border border-ink-border bg-surface shadow-[0_50px_110px_-45px_rgba(17,24,39,.5)]">
    <div className="flex items-center gap-3 border-b border-ink-border px-4 py-3">
      <span className="hidden gap-1.5 sm:flex" aria-hidden="true">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
      <span className="truncate text-[13px] font-semibold">{label}</span>
      <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-[#EF4444]/10 px-2.5 py-0.5 font-head text-[9px] font-semibold uppercase tracking-wider text-[#DC2626]"><span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] motion-safe:animate-pulse" />Live</span>
      <button type="button" onClick={onReplay} className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-primary hover:bg-primary/10">↺ Replay</button>
    </div>
    <div className="h-[2px] bg-surface-2"><motion.div className="h-full bg-primary" animate={{ width: `${((step + 1) / total) * 100}%` }} transition={{ duration: 0.5 }} /></div>
    {children}
  </div>
}

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.35 } }

/* ── Product marketing: a landing page that loses visitors, rewritten ── */
const marketingSteps = [2400, 1900, 2600, 3600]
function MarketingDemo({ active }: { active: boolean }) {
  const { step, replay } = useLoop(marketingSteps, active)
  return <Frame label="yourproduct.com · homepage" step={step} total={marketingSteps.length} onReplay={replay}>
    <div className="relative min-h-[380px] bg-paper p-5 md:min-h-[420px] md:p-8">
      <div className="flex items-center justify-between"><span className="h-3 w-20 rounded bg-parchment/80" /><span className="flex gap-2">{[0, 1, 2].map(i => <span key={i} className="h-2 w-10 rounded bg-surface-2" />)}</span></div>
      <div className="mt-8 max-w-md">
        <div className="relative font-display text-xl font-semibold leading-snug tracking-[-.02em] md:text-2xl">
          <span className={step >= 1 ? 'text-muted' : ''}>Next-generation omnichannel settlement infrastructure.</span>
          {step >= 1 && <motion.span className="absolute left-0 top-[48%] h-[2px] w-full origin-left bg-muted" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }} />}
        </div>
        {step >= 2 && <p className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-.03em] text-primary md:text-[2rem]"><Typed text="Pay your bills with crypto in 30 seconds." speed={34} /></p>}
        <motion.span layout className={`mt-5 inline-flex rounded-full px-4 py-2 text-xs font-semibold ${step >= 2 ? 'bg-primary text-on-primary' : 'border border-ink-border text-muted'}`}>{step >= 2 ? 'Pay my first bill →' : 'Learn more'}</motion.span>
      </div>

      {/* Ngozi's note */}
      <AnimatePresence>{step === 1 && <motion.div {...fade} className="absolute right-4 top-16 w-[180px] rounded-xl border border-ink-border bg-surface p-3 shadow-lg md:right-8">
        <div className="flex items-center gap-2"><span className="relative h-5 w-5 overflow-hidden rounded-full"><Image src="/hero/mine.jpeg" alt="" fill sizes="20px" className="object-cover object-top" /></span><span className="text-[11px] font-semibold">Ngozi</span></div>
        <p className="mt-1.5 text-xs leading-snug">Say what it does for them, not what it is.</p>
      </motion.div>}</AnimatePresence>

      {/* What visitors do */}
      <div className="absolute inset-x-5 bottom-5 rounded-xl border border-ink-border bg-surface p-3.5 md:inset-x-8 md:bottom-7">
        <div className="flex items-center justify-between text-[11px]"><span className="font-semibold">Visitors who sign up</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"><motion.div className={`h-full rounded-full ${step >= 3 ? 'bg-success' : 'bg-[#EF4444]/70'}`} animate={{ width: step >= 3 ? '72%' : '14%' }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} /></div>
        <p className={`mt-2 text-xs font-semibold ${step >= 3 ? 'text-success' : 'text-[#DC2626]'}`}>{step >= 3 ? 'People understand it, so they sign up.' : 'Most visitors leave in a few seconds.'}</p>
      </div>
    </div>
  </Frame>
}

/* ── Technical writing: an API docs page written live, then tried ── */
const docsSteps = [1300, 2300, 2700, 2600, 2600]
function DocsDemo({ active }: { active: boolean }) {
  const { step, replay } = useLoop(docsSteps, active)
  const nav = ['Getting started', 'Authentication', 'Create a payment', 'Webhooks', 'Errors']
  return <Frame label="docs.yourapi.com · Create a payment" step={step} total={docsSteps.length} onReplay={replay}>
    <div className="grid min-h-[380px] bg-paper sm:grid-cols-[150px_1fr] md:min-h-[420px]">
      <ul className="hidden space-y-1 border-r border-ink-border p-4 text-[12px] sm:block">
        {nav.map((n, i) => <motion.li key={n} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
          className={`rounded-md px-2 py-1.5 ${i === 2 ? 'bg-primary/10 font-semibold text-primary' : 'text-muted'}`}>{n}</motion.li>)}
      </ul>
      <div className="min-w-0 p-5 md:p-6">
        <p className="font-head text-[9px] uppercase tracking-[.16em] text-muted">Payments API</p>
        <h4 className="mt-2 font-display text-xl font-semibold tracking-[-.02em]">Create a payment</h4>
        <p className="mt-2 min-h-[2.8em] text-[13px] leading-5 text-muted">{step >= 1 && <Typed text="Charge a customer once. If your request is sent twice by accident, they are still only charged once." speed={16} />}</p>
        <div className="mt-3 rounded-xl bg-[#0F172A] p-3.5 font-mono text-[11px] leading-5 text-[#CBD5E1]">
          {step >= 2 ? <>
            <p><span className="text-[#93C5FD]">curl</span> -X POST api.yourapi.com/v1/payments \</p>
            <p className="pl-3"><Typed text={'-H "Idempotency-Key: 8f2c…a91" \\'} speed={14} delay={250} /></p>
            <p className="pl-3"><Typed text={'-d \'{ "amount": 5000 }\''} speed={14} delay={900} /></p>
          </> : <p className="text-[#475569]">{'// code sample'}</p>}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <motion.span animate={step === 3 ? { scale: [1, 0.92, 1] } : {}} transition={{ duration: 0.3 }} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${step >= 3 ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted'}`}>▶ Try it</motion.span>
          <AnimatePresence>{step >= 3 && <motion.span {...fade} className="rounded-full bg-success/10 px-2.5 py-1 font-head text-[10px] font-semibold text-success">200 OK · 84 ms</motion.span>}</AnimatePresence>
        </div>
        <AnimatePresence>{step >= 3 && <motion.pre {...fade} className="mt-2 overflow-hidden rounded-xl border border-ink-border bg-surface p-3 font-mono text-[11px] leading-5">{'{ "id": "pay_81x", "status": "succeeded" }'}</motion.pre>}</AnimatePresence>
        <AnimatePresence>{step >= 4 && <motion.p {...fade} className="mt-3 text-xs font-semibold text-success">✓ A developer can copy, paste and ship in one sitting.</motion.p>}</AnimatePresence>
      </div>
    </div>
  </Frame>
}

/* ── Websites: a page built block by block, then shown on a phone ── */
const webSteps = [1500, 2300, 2000, 3400]
function WebsiteDemo({ active }: { active: boolean }) {
  const { step, replay } = useLoop(webSteps, active)
  const real = step >= 1
  const phone = step >= 3
  return <Frame label="yourbrand.com" step={step} total={webSteps.length} onReplay={replay}>
    <div className="relative flex min-h-[380px] items-start justify-center bg-surface-2/60 p-4 md:min-h-[420px] md:p-6">
      <motion.div layout transition={{ type: 'spring', stiffness: 160, damping: 24 }}
        className={`relative overflow-hidden border border-ink-border bg-surface shadow-lg ${phone ? 'w-[210px] rounded-[1.6rem] border-[5px] border-parchment' : 'w-full rounded-xl'}`}>
        <div className={`space-y-3 ${phone ? 'p-3.5' : 'p-4 md:p-5'}`}>
          <div className="flex items-center justify-between">
            {real ? <motion.span {...fade} className="font-display text-sm font-extrabold tracking-[-.03em]">your<span className="text-primary">brand</span></motion.span> : <span className="h-3 w-16 rounded bg-surface-2" />}
            {phone ? <span className="text-xs text-muted">☰</span> : <span className="flex gap-2">{['Shop', 'About', 'Contact'].map(n => real ? <span key={n} className="text-[10px] text-muted">{n}</span> : <span key={n} className="h-2 w-8 rounded bg-surface-2" />)}</span>}
          </div>
          {real ? <motion.p {...fade} className={`font-display font-bold leading-tight tracking-[-.03em] ${phone ? 'text-lg' : 'text-xl md:text-2xl'}`}>Fresh bread, delivered by 8am.</motion.p> : <div className="space-y-2"><span className="block h-5 w-3/4 rounded bg-surface-2" /><span className="block h-5 w-1/2 rounded bg-surface-2" /></div>}
          <motion.span layout className={`relative inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold ${real ? 'bg-primary text-on-primary' : 'h-7 w-24 bg-surface-2'}`}>
            {real && 'Order today →'}
            {step === 2 && <motion.span className="absolute -bottom-3 -right-3 text-lg" initial={{ opacity: 0, x: 18, y: 18 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6 }}>👆</motion.span>}
          </motion.span>
          <div className={`grid gap-2 ${phone ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {['Sourdough', 'Croissants', 'Wholegrain'].map((c, i) => <motion.div layout key={c} className="overflow-hidden rounded-lg border border-ink-border">
              <div className={`h-12 ${real ? ['bg-[#F5D7A8]', 'bg-[#EFC48A]', 'bg-[#D9B48A]'][i] : 'bg-surface-2'} ${phone && i > 0 ? 'hidden' : ''}`} />
              <p className={`px-2 py-1.5 text-[10px] font-semibold ${phone && i > 0 ? 'hidden' : ''}`}>{real ? c : <span className="block h-2 w-12 rounded bg-surface-2" />}</p>
            </motion.div>)}
          </div>
        </div>
        <AnimatePresence>{step === 2 && <motion.div {...fade} className="absolute inset-x-3 bottom-3 rounded-lg bg-success px-3 py-2 text-center text-[11px] font-semibold text-white">✓ Order placed</motion.div>}</AnimatePresence>
      </motion.div>
      <AnimatePresence>{phone && <motion.p {...fade} className="absolute bottom-4 left-4 rounded-full bg-surface px-3 py-1.5 text-[11px] font-semibold shadow md:bottom-6 md:left-6">📱 Works just as well on a phone</motion.p>}</AnimatePresence>
    </div>
  </Frame>
}

/* ── Training: a lesson playing through to a quiz ── */
const teachSteps = [2500, 2500, 2800, 3200]
function TeachingDemo({ active }: { active: boolean }) {
  const { step, replay } = useLoop(teachSteps, active)
  const slides = [
    { icon: '🔑', title: 'A crypto wallet is like a key ring.', body: 'It does not hold your money. It holds the keys that unlock it.' },
    { icon: '📝', title: 'Your seed phrase is the spare key.', body: 'Lose your phone? These 12 words get your wallet back. Never share them.' },
  ]
  return <Frame label="Web3 basics · Lesson 3 of 5" step={step} total={teachSteps.length} onReplay={replay}>
    <div className="relative flex min-h-[380px] flex-col bg-paper p-5 md:min-h-[420px] md:p-7">
      <AnimatePresence mode="wait">
        {step <= 1 && <motion.div key={step} {...fade} className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.span initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="text-5xl">{slides[step].icon}</motion.span>
          <p className="mt-5 max-w-sm font-display text-xl font-semibold tracking-[-.02em] md:text-2xl">{slides[step].title}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{slides[step].body}</p>
        </motion.div>}
        {step === 2 && <motion.div key="quiz" {...fade} className="flex-1">
          <p className="font-head text-[9px] uppercase tracking-[.16em] text-muted">Quick check</p>
          <p className="mt-2 font-display text-lg font-semibold">What does a seed phrase do?</p>
          <div className="mt-3 space-y-2">{['Logs you into a website', 'Restores your wallet if you lose your phone', 'Makes transactions faster'].map((o, i) => <motion.div key={o} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
            className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13px] transition-colors delay-1000 duration-300 ${i === 1 ? 'border-success/50 bg-success/10' : 'border-ink-border bg-surface'}`}>
            {o}{i === 1 && <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }} className="text-xs font-semibold text-success">✓ Correct</motion.span>}
          </motion.div>)}</div>
        </motion.div>}
        {step === 3 && <motion.div key="done" {...fade} className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-2xl text-white">✓</motion.span>
          <p className="mt-4 font-display text-xl font-semibold">Lesson complete</p>
          <p className="mt-1 text-sm text-muted">You can explain this to a friend now.</p>
          <div className="mt-5 flex -space-x-2">{['/hero/mine.jpeg', '/personal photo/headshot6.jpg', '/personal photo/headshot2.png'].map(s => <span key={s} className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-paper"><Image src={s} alt="" fill sizes="32px" className="object-cover object-top" /></span>)}<span className="flex h-8 items-center rounded-full bg-primary px-3 text-[11px] font-semibold text-on-primary ring-2 ring-paper">200+ trained</span></div>
        </motion.div>}
      </AnimatePresence>
      <div className="mt-5 flex gap-1.5">{[0, 1, 2, 3].map(i => <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-primary' : 'bg-ink-border'}`} />)}</div>
    </div>
  </Frame>
}

/* ── Business building: scattered tasks become a system that runs itself ── */
const bizSteps = [2500, 2300, 2000, 3400]
const notes = [
  { id: 'orders', chaos: 'Orders in WhatsApp chats', system: 'Order form', col: 0 },
  { id: 'stock', chaos: 'Stock counted by memory', system: 'Live stock sheet', col: 1 },
  { id: 'invoice', chaos: 'Invoices typed by hand', system: 'Auto invoices', col: 1 },
  { id: 'money', chaos: 'Who paid? No idea.', system: 'Weekly report', col: 2 },
]
const scatter = ['left-[4%] top-[8%] -rotate-6', 'right-[6%] top-[14%] rotate-3', 'left-[12%] top-[48%] rotate-2', 'right-[10%] top-[52%] -rotate-3']
function BusinessDemo({ active }: { active: boolean }) {
  const { step, replay } = useLoop(bizSteps, active)
  const organised = step >= 1
  return <Frame label="Your business · operations" step={step} total={bizSteps.length} onReplay={replay}>
    <div className="relative min-h-[380px] bg-paper p-4 md:min-h-[420px] md:p-6">
      <LayoutGroup>
        {!organised && <div className="relative h-[300px]">
          {notes.map((n, i) => <motion.div key={n.id} layoutId={n.id} className={`absolute w-[46%] rounded-lg border border-[#FCD34D] bg-[#FEF3C7] p-3 text-[12px] font-medium text-[#78350F] shadow-md ${scatter[i]}`}>{n.chaos}</motion.div>)}
          <motion.p {...fade} className="absolute bottom-0 left-0 text-xs font-semibold text-[#DC2626]">Everything depends on you remembering.</motion.p>
        </div>}
        {organised && <div>
          <div className="grid grid-cols-3 gap-2 text-center font-head text-[9px] uppercase tracking-wider text-muted"><span>Sell</span><span>Track</span><span>Know</span></div>
          <div className="relative mt-2 grid grid-cols-3 gap-2">
            {[0, 1, 2].map(c => <div key={c} className="min-h-[120px] space-y-2 rounded-xl border border-ink-border bg-surface-2/60 p-2">
              {notes.filter(n => n.col === c).map(n => <motion.div key={n.id} layoutId={n.id} transition={{ type: 'spring', stiffness: 180, damping: 22 }} className="rounded-lg border border-primary/30 bg-surface p-2.5 text-[11px] font-semibold shadow-sm">{n.system}</motion.div>)}
            </div>)}
            {step >= 2 && [0, 1].map(k => <motion.span key={k} aria-hidden="true" className="absolute top-1/2 h-[2px] w-2 origin-left bg-primary" style={{ left: `calc(${(k + 1) * 33.33}% - 5px)` }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: k * 0.3 }} />)}
          </div>
          <AnimatePresence>{step >= 2 && <motion.p {...fade} className="mt-3 text-xs font-semibold text-success">✓ Runs every day, with or without you watching.</motion.p>}</AnimatePresence>
          <AnimatePresence>{step >= 3 && <motion.div {...fade} className="mt-3 rounded-xl border border-ink-border bg-surface p-3">
            <div className="flex justify-between text-[11px]"><span className="font-semibold">Weekly report</span></div>
            <div className="mt-2 flex h-16 items-end gap-1.5">{[30, 42, 38, 55, 63, 71, 86].map((h, i) => <motion.span key={i} className="flex-1 rounded-t bg-primary/80" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.08, duration: 0.5 }} />)}</div>
          </motion.div>}</AnimatePresence>
        </div>}
      </LayoutGroup>
    </div>
  </Frame>
}

const demos: Record<ServiceKey, (p: { active: boolean }) => JSX.Element> = {
  product: MarketingDemo, writing: DocsDemo, web: WebsiteDemo, education: TeachingDemo, business: BusinessDemo,
}

/** Plays only while on screen, so demos further down start fresh when reached. */
export default function LiveDemo({ service }: { service: ServiceKey }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-15% 0px' })
  const Demo = demos[service]
  return <div ref={ref}><Demo active={inView} /></div>
}
