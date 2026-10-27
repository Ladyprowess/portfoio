'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { facets, type FacetKey } from '@/lib/home-content'

// The hero's live editor: one tab per craft, each playing a short demo of the
// work being done, with Ngozi's note in the margin. It rotates through the
// crafts on its own, pauses on hover, and jumps to whatever the visitor picks.

const CYCLE_MS = 7000

const files: Record<FacetKey, { file: string; note: string }> = {
  product: { file: 'launch-headline.docx', note: 'Say what it does for them, not what it is.' },
  writing: { file: 'payments-api.md', note: 'Developers skim. Lead with the answer.' },
  web: { file: 'home-page.html', note: 'One clear action, above the fold.' },
  education: { file: 'web3-lesson-3.slides', note: 'Every lesson ends with a quick check.' },
  business: { file: 'growth-plan.board', note: 'Build it so it runs without you.' },
}

// The collaborator card cycles through these on its own, independent of the tabs.
const photos = ['/personal photo/headshot6.jpg', '/hero/mine.jpeg', '/personal photo/headshot2.png', '/personal photo/headshot4.png', '/personal photo/headshot1.png']
const PHOTO_MS = 3200

/** onSelect's second argument is true when the visitor chose the tab (which stops the rotation). */
type Props = { active: FacetKey; onSelect: (key: FacetKey, byVisitor: boolean) => void; locked: boolean }

export default function CraftEditor({ active, onSelect, locked }: Props) {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [done, setDone] = useState(false)
  const [photo, setPhoto] = useState(0)

  // Keep the portrait changing the whole time, even after the visitor picks a craft.
  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => { if (!document.hidden) setPhoto(p => (p + 1) % photos.length) }, PHOTO_MS)
    return () => window.clearInterval(t)
  }, [reduce])

  // Rotate through the crafts until the visitor makes a choice.
  useEffect(() => {
    setDone(false)
    const finish = window.setTimeout(() => setDone(true), reduce ? 0 : 4200)
    if (locked || paused || reduce) return () => window.clearTimeout(finish)
    const next = window.setTimeout(() => {
      const i = facets.findIndex(f => f.key === active)
      onSelect(facets[(i + 1) % facets.length].key, false)
    }, CYCLE_MS)
    return () => { window.clearTimeout(finish); window.clearTimeout(next) }
  }, [active, locked, paused, reduce, onSelect])

  const meta = files[active]

  return <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="overflow-hidden rounded-[22px] border border-ink-border bg-surface shadow-[0_50px_110px_-40px_rgba(17,24,39,.5),0_2px_6px_rgba(17,24,39,.05)]">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-ink-border px-4 py-3">
        <span className="hidden gap-1.5 sm:flex" aria-hidden="true">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
        {/* Phones have no room for the collaborator card, so the changing portrait sits here */}
        <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30 md:hidden">
          {photos.map((src, i) => <Image key={src} src={src} alt="" fill sizes="28px" className={`object-cover object-[50%_18%] transition-opacity duration-700 ${i === photo ? 'opacity-100' : 'opacity-0'}`} />)}
        </span>
        <AnimatePresence mode="wait"><motion.span key={meta.file} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="truncate text-[13px] font-semibold">{meta.file}</motion.span></AnimatePresence>
        <span className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 font-head text-[9px] font-semibold uppercase tracking-wider transition-colors ${done ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>{done ? '✓ Done' : '✎ Editing'}</span>
      </div>

      {/* One tab per craft, with a timer bar on the active one */}
      <div role="tablist" aria-label="Crafts" className="flex overflow-x-auto border-b border-ink-border bg-surface-2/50 [scrollbar-width:none]">
        {facets.map(f => {
          const on = f.key === active
          return <button key={f.key} role="tab" aria-selected={on} type="button" onClick={() => onSelect(f.key, true)}
            className={`relative shrink-0 px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${on ? 'bg-surface text-parchment' : 'text-muted hover:text-parchment'}`}>
            {f.short}
            {on && <motion.span key={`${f.key}-${paused}-${locked}`} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-primary"
              initial={{ scaleX: locked || paused || reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: locked || paused || reduce ? 0 : CYCLE_MS / 1000, ease: 'linear' }} />}
          </button>
        })}
      </div>

      <div className="grid sm:grid-cols-[1fr_170px]">
        <div className="relative min-h-[290px] bg-paper p-5 md:min-h-[320px] md:p-7 lg:min-h-[400px]" role="tabpanel">
          <div aria-hidden="true" className="desk-dots absolute inset-0 opacity-50" />
          <AnimatePresence mode="wait">
            <motion.div key={active} className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              {active === 'product' && <ProductDemo />}
              {active === 'writing' && <WritingDemo />}
              {active === 'web' && <WebDemo />}
              {active === 'education' && <EducationDemo />}
              {active === 'business' && <BusinessDemo />}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Margin note from Ngozi */}
        <div className="hidden border-l border-ink-border bg-surface-2/40 p-3.5 sm:block">
          <p className="mb-2.5 font-head text-[9px] uppercase tracking-wider text-muted">Comment</p>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.5, duration: 0.35 }}
              className="rounded-xl border border-ink-border bg-surface p-3 shadow-sm">
              <div className="flex items-center gap-2"><span className="relative h-5 w-5 overflow-hidden rounded-full"><Image src="/hero/mine.jpeg" alt="" fill sizes="20px" className="object-cover object-top" /></span><span className="text-[11px] font-semibold">Ngozi</span></div>
              <p className="mt-2 text-[12px] leading-[1.45]">{meta.note}</p>
              {done && <p className="mt-2 text-[10px] font-semibold text-success">✓ Resolved</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>

    {/* Ngozi, pinned to the corner of the window like a collaborator */}
    {/* Sits over the empty foot of the comment column, never over the demo */}
    <div className="absolute -bottom-12 -right-5 hidden w-[132px] rotate-[4deg] rounded-2xl border border-ink-border bg-surface p-2 shadow-[0_24px_50px_-20px_rgba(17,24,39,.45)] transition-transform duration-500 hover:rotate-0 md:block">
      {/* All portraits stay mounted and crossfade, so switching never flashes empty */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-2">
        {photos.map((src, i) => <Image key={src} src={src} alt={i === photo ? 'Ngozi Peace Okafor' : ''} aria-hidden={i !== photo} fill sizes="132px"
          className={`object-cover object-[50%_18%] transition-[opacity,transform] duration-700 ${i === photo ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`} />)}
      </div>
      <p className="mt-2 flex items-center gap-1.5 px-0.5 text-[11px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-[#84CC16] motion-safe:animate-pulse" />Ngozi is editing</p>
    </div>
  </div>
}

/* ── The five demos ────────────────────────────── */

const step = (i: number, base = 0.3) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: base + i * 0.35, duration: 0.4 } })

/** Types text out once, starting after a delay. */
function Typed({ text, delay = 0, speed = 28 }: { text: string; delay?: number; speed?: number }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)
  useEffect(() => {
    if (reduce) return
    let i = 0, t = 0
    const tick = () => { i += 1; setN(i); if (i < text.length) t = window.setTimeout(tick, speed) }
    t = window.setTimeout(tick, delay * 1000)
    return () => window.clearTimeout(t)
  }, [text, delay, speed, reduce])
  return <>{text.slice(0, n)}{n < text.length && n > 0 && <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-pulse bg-primary" />}</>
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-head text-[9px] uppercase tracking-[.16em] text-muted">{children}</p>
}

function ProductDemo() {
  return <div>
    <Label>Launch headline · v2</Label>
    <div className="relative mt-4 font-display text-[1.45rem] font-semibold leading-snug tracking-[-.02em] text-muted md:text-[1.6rem]">
      Seamless cross-border value transfer infrastructure.
      <motion.span aria-hidden="true" className="absolute left-0 top-[52%] h-[2px] w-full origin-left bg-muted" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
    </div>
    <p className="mt-3 min-h-[2.2em] font-display text-[1.9rem] font-bold leading-tight tracking-[-.035em] text-primary md:text-[2.15rem]"><Typed text="Send money home in two minutes." delay={1.6} speed={38} /></p>
    <motion.div {...step(0, 3.2)} className="mt-5 flex flex-wrap gap-2 text-[11px]">
      <span className="rounded-full bg-success/10 px-2.5 py-1 font-semibold text-success">Benefit first</span>
      <span className="rounded-full bg-surface-2 px-2.5 py-1 text-muted">No jargon</span>
      <span className="rounded-full bg-surface-2 px-2.5 py-1 text-muted">6 words</span>
    </motion.div>
  </div>
}

function WritingDemo() {
  return <div>
    <Label>Payments API · Retries</Label>
    <motion.div {...step(0, 0.2)} className="mt-4 rounded-xl bg-[#0F172A] p-4 font-mono text-[11.5px] leading-6 text-[#CBD5E1] shadow-lg">
      <p><span className="text-[#93C5FD]">POST</span> /v1/payments</p>
      <p><span className="text-[#F9A8D4]">Idempotency-Key</span>: 8f2c…a91</p>
      <p className="text-[#64748B]">{'{ "amount": 5000, "currency": "NGN" }'}</p>
    </motion.div>
    <p className="mt-4 min-h-[3.2em] text-[15px] leading-6"><span className="font-semibold">In plain words: </span><Typed text="sent the same request twice by accident? You are only charged once." delay={1.1} speed={24} /></p>
  </div>
}

function WebDemo() {
  const blocks = [
    <div key="nav" className="flex items-center justify-between"><span className="h-2.5 w-16 rounded bg-parchment/80" /><span className="flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className="h-2 w-8 rounded bg-surface-2" />)}</span></div>,
    <p key="h" className="font-display text-[1.25rem] font-bold leading-tight tracking-[-.03em]">Find the right course in 30 seconds.</p>,
    <span key="cta" className="inline-flex rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold text-on-primary">Browse courses →</span>,
    <div key="cards" className="grid grid-cols-3 gap-2">{['Web3', 'Design', 'Writing'].map(c => <div key={c} className="rounded-lg border border-ink-border bg-surface p-2"><span className="block h-8 rounded bg-surface-2" /><span className="mt-1.5 block text-[10px] font-semibold">{c}</span></div>)}</div>,
  ]
  return <div>
    <Label>Home page · Layout</Label>
    <div className="mt-4 space-y-3.5 rounded-xl border border-ink-border bg-surface p-4 shadow-sm">
      {blocks.map((b, i) => <motion.div key={i} {...step(i, 0.3)}>{b}</motion.div>)}
    </div>
    <motion.p {...step(0, 2.2)} className="mt-3 text-[11px] text-muted">Main action visible without scrolling ✓</motion.p>
  </div>
}

function EducationDemo() {
  const options = ['Logs you into the website', 'Restores your wallet if you lose your phone', 'Makes transactions faster']
  return <div>
    <Label>Web3 basics · Module 3 of 5</Label>
    <p className="mt-4 font-display text-[1.3rem] font-bold tracking-[-.02em]">What does a seed phrase do?</p>
    <div className="mt-3.5 space-y-2">{options.map((o, i) => <motion.div key={o} {...step(i, 0.4)} className="flex items-center justify-between gap-2 rounded-xl border border-ink-border bg-surface px-3.5 py-2.5 text-[13px]">
      {o}
      {i === 1 && <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.4 }} className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Correct</motion.span>}
    </motion.div>)}</div>
    <div className="mt-4 flex gap-1.5">{[0, 1, 2, 3, 4].map(i => <motion.span key={i} className={`h-1.5 flex-1 rounded-full ${i < 3 ? 'bg-primary' : 'bg-ink-border'}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 + i * 0.1 }} style={{ originX: 0 }} />)}</div>
  </div>
}

function BusinessDemo() {
  const nodes = ['Offer', 'System', 'Revenue']
  const tasks = ['Pricing page live', 'Onboarding emails automated', 'Weekly numbers in one report']
  return <div>
    <Label>Growth plan · This quarter</Label>
    <div className="relative mt-5 flex items-center justify-between">
      <svg aria-hidden="true" className="absolute inset-x-6 top-1/2 h-2 -translate-y-1/2" preserveAspectRatio="none" viewBox="0 0 100 2">
        <motion.line x1="0" y1="1" x2="100" y2="1" stroke="rgb(var(--primary))" strokeWidth="2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1.2 }} />
      </svg>
      {nodes.map((n, i) => <motion.span key={n} {...step(i, 0.2)} className={`relative rounded-xl border px-3.5 py-2 text-[12px] font-semibold shadow-sm ${i === 2 ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-surface'}`}>{n}</motion.span>)}
    </div>
    <div className="mt-6 space-y-2">{tasks.map((t, i) => <motion.div key={t} {...step(i, 1.5)} className="flex items-center gap-2.5 rounded-xl border border-ink-border bg-surface px-3.5 py-2.5 text-[13px]">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 + i * 0.35, type: 'spring', stiffness: 400, damping: 18 }} className="flex h-[18px] w-[18px] items-center justify-center rounded-md bg-primary text-[10px] text-on-primary">✓</motion.span>{t}
    </motion.div>)}</div>
  </div>
}
