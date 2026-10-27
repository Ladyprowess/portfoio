'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { gradeLevel } from '@/lib/readability'

// "Watch a project move": four passes over one example project. On desktop the
// document on the right is pinned and changes as each step scrolls into view;
// on phones every step carries its own copy of the document.
const steps = [
  { key: 'listen', label: 'Listen', title: 'I start with what people actually say.', body: 'Founder notes, support tickets, sales calls, the questions users keep asking. The real problem is usually in there, in plain words.' },
  { key: 'untangle', label: 'Untangle', title: 'I find the words that lose people.', body: 'Every term a new user would have to look up gets flagged. If it needs a glossary, it is not ready for a homepage.' },
  { key: 'rewrite', label: 'Rewrite', title: 'I say it the way a person would.', body: 'Shorter sentences, everyday words, the benefit first. The meaning stays exact; only the friction goes.' },
  { key: 'ship', label: 'Ship', title: 'Then it goes into the product.', body: 'The same clarity runs through the landing page, onboarding, docs and launch emails, so the whole product speaks one language.' },
]

export default function ProcessStory() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step)) })
    }, { rootMargin: '-45% 0px -45% 0px' })
    refs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return <section id="process" className="relative mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
    <div className="mb-12 max-w-2xl md:mb-4">
      <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">How a project moves</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.75rem] md:leading-[1.08]">From a messy brief to a product people understand.</h2>
      <p className="mt-4 text-sm leading-6 text-muted">An example project: a crypto bill-payments app. Scroll through the four passes.</p>
    </div>

    <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
      <div>
        {steps.map((s, i) => <div key={s.key} ref={el => { refs.current[i] = el }} data-step={i} className="flex flex-col justify-center py-6 lg:min-h-[78vh] lg:py-0">
          <div className={`transition-opacity duration-500 ${active === i ? 'lg:opacity-100' : 'lg:opacity-35'}`}>
            <div className="flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border font-head text-xs font-semibold transition-colors ${active >= i ? 'border-primary bg-primary text-on-primary' : 'border-ink-border text-muted'}`}>0{i + 1}</span>
              <span className="font-head text-[11px] uppercase tracking-[.16em] text-primary">{s.label}</span>
            </div>
            <h3 className="mt-5 max-w-md font-display text-2xl font-semibold leading-tight tracking-[-.03em] md:text-3xl">{s.title}</h3>
            <p className="mt-4 max-w-md leading-7 text-muted">{s.body}</p>
          </div>
          <div className="mt-8 lg:hidden"><Stage step={i} /></div>
        </div>)}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div className="mb-4 flex gap-1.5">{steps.map((s, i) => <span key={s.key} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-primary' : 'bg-ink-border'}`} />)}</div>
          <Stage step={active} />
        </div>
      </div>
    </div>
  </section>
}

function Stage({ step }: { step: number }) {
  // Phones size the card to its content; the pinned desktop card has a fixed height.
  return <div className="relative overflow-hidden lg:h-[460px] rounded-[24px] border border-ink-border bg-surface shadow-[0_40px_100px_-40px_rgba(17,24,39,.35)]">
    <div className="desk-dots absolute inset-0 opacity-60" aria-hidden="true" />
    <AnimatePresence mode="wait">
      <motion.div key={step} className="relative p-6 md:p-8 lg:absolute lg:inset-0" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
        {step === 0 && <Listen />}
        {step === 1 && <Untangle />}
        {step === 2 && <Rewrite />}
        {step === 3 && <Ship />}
      </motion.div>
    </AnimatePresence>
  </div>
}

const pop = (i: number) => ({ initial: { opacity: 0, y: 12, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay: 0.15 + i * 0.14, duration: 0.4 } })

function Listen() {
  const notes = [
    { from: 'Founder', text: '“We’re a non-custodial settlement layer.”', rot: '-2deg', pos: 'lg:left-[6%] lg:top-[12%]' },
    { from: 'Support inbox', text: 'Lots of tickets asking what “off-ramp” means.', rot: '1.5deg', pos: 'lg:right-[6%] lg:top-[8%]' },
    { from: 'Analytics', text: 'People leave at the wallet-connect screen.', rot: '2deg', pos: 'lg:left-[10%] lg:bottom-[12%]' },
    { from: 'User interview', text: '“I just want to pay my light bill with USDT.”', rot: '-1.5deg', pos: 'lg:right-[8%] lg:bottom-[16%]' },
  ]
  // Pinned and scattered on desktop; a tidy two-column grid on phones.
  return <div className="relative lg:h-full">
    <p className="font-head text-[10px] uppercase tracking-wider text-muted">brief-notes.txt</p>
    <div className="mt-5 grid grid-cols-2 gap-3 lg:mt-0 lg:block">
      {notes.map((n, i) => <motion.div key={n.from} {...pop(i)} style={{ rotate: n.rot }} className={`relative rounded-xl border border-ink-border bg-paper p-3.5 shadow-[0_14px_30px_-12px_rgba(17,24,39,.3)] lg:absolute lg:w-[44%] lg:p-4 ${n.pos}`}>
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow" />
        <p className="font-head text-[9px] uppercase tracking-wider text-muted">{n.from}</p>
        <p className="mt-1.5 font-serif text-sm italic leading-5 lg:text-[15px] lg:leading-6">{n.text}</p>
      </motion.div>)}
    </div>
    {/* The insight drawn out of the notes */}
    {/* Positioned by the wrapper so the pop-in animation cannot override the centring. */}
    <div className="mt-5 lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-center lg:justify-center">
      <motion.div {...pop(4)} className="rounded-full bg-parchment px-4 py-2 text-center text-xs font-semibold text-bg shadow-lg lg:whitespace-nowrap">Real problem: nobody knows what it does</motion.div>
    </div>
  </div>
}

function Untangle() {
  const flags = [
    { word: 'non-custodial', note: 'New users won’t know this' },
    { word: 'settlement layer', note: 'Sounds like banking jargon' },
    { word: 'fiat off-ramping', note: 'The #1 support question' },
  ]
  return <div className="flex h-full flex-col">
    <p className="font-head text-[10px] uppercase tracking-wider text-muted">homepage.docx · 3 comments</p>
    <div className="mt-6 grid flex-1 gap-5 md:grid-cols-[1fr_190px]">
      <p className="rounded-2xl border border-ink-border bg-paper p-6 font-display text-2xl font-semibold leading-[1.5] tracking-[-.02em]">
        Our <Flag i={0}>non-custodial</Flag> <Flag i={1}>settlement layer</Flag> enables seamless <Flag i={2}>fiat off-ramping</Flag> for everyday transactions.
      </p>
      <div className="space-y-2.5">{flags.map((f, i) => <motion.div key={f.word} {...pop(i + 2)} className="rounded-xl border border-ink-border bg-surface p-3 shadow-sm">
        <p className="text-[11px] font-semibold text-primary">“{f.word}”</p><p className="mt-1 text-xs leading-5 text-muted">{f.note}</p>
      </motion.div>)}</div>
    </div>
  </div>
}

function Flag({ i, children }: { i: number; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return <span className="relative whitespace-nowrap">
    <motion.span aria-hidden="true" className="absolute inset-x-[-2px] bottom-[0.08em] top-[0.18em] -z-0 origin-left rounded bg-primary/20" initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 + i * 0.25, duration: 0.4 }} />
    <span className="relative">{children}</span>
  </span>
}

const BEFORE = 'Our non-custodial settlement layer enables seamless fiat off-ramping for everyday transactions.'
const AFTER = 'Pay your bills with crypto. Electricity, airtime and TV. We handle the conversion.'

function Rewrite() {
  return <div className="flex h-full flex-col">
    <p className="font-head text-[10px] uppercase tracking-wider text-muted">homepage.docx · suggesting</p>
    <div className="mt-6 flex flex-1 flex-col justify-center rounded-2xl border border-ink-border bg-paper p-6">
      <motion.p initial={{ opacity: 1 }} animate={{ opacity: 0.45 }} transition={{ delay: 0.3 }} className="font-display text-lg font-semibold leading-relaxed text-muted line-through decoration-muted/70">{BEFORE}</motion.p>
      <motion.p {...pop(3)} className="mt-5 font-display text-[2rem] font-bold leading-[1.15] tracking-[-.035em] text-primary">Pay your bills with crypto.</motion.p>
      <motion.p {...pop(5)} className="mt-2 font-display text-xl font-semibold tracking-[-.02em]">Electricity, airtime and TV. We handle the conversion.</motion.p>
    </div>
    <motion.div {...pop(7)} className="mt-4 flex flex-wrap gap-2 text-xs">
      <span className="rounded-full bg-success/10 px-3 py-1.5 font-semibold text-success">Reading grade {gradeLevel(BEFORE)} → {gradeLevel(AFTER)}</span>
      <span className="rounded-full bg-surface-2 px-3 py-1.5 text-muted">Benefit first</span>
      <span className="rounded-full bg-surface-2 px-3 py-1.5 text-muted">Zero jargon</span>
    </motion.div>
  </div>
}

function Ship() {
  return <div className="grid h-full items-center gap-6 md:grid-cols-[220px_1fr]">
    <motion.div {...pop(0)} className="mx-auto w-[210px] rounded-[30px] border-[6px] border-parchment bg-paper p-4 shadow-[0_30px_60px_-20px_rgba(17,24,39,.45)]">
      <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-ink-border" />
      <p className="font-display text-lg font-bold leading-tight tracking-[-.03em]">Pay your bills with crypto.</p>
      <p className="mt-1.5 text-[11px] leading-4 text-muted">Electricity, airtime and TV.</p>
      <div className="mt-4 space-y-2">{['⚡ Electricity', '📱 Airtime', '📺 TV'].map((b, i) => <motion.div key={b} {...pop(i + 2)} className="flex items-center justify-between rounded-lg border border-ink-border bg-surface px-3 py-2 text-[11px] font-medium">{b}<span className="text-muted">›</span></motion.div>)}</div>
      <div className="mt-4 rounded-full bg-primary py-2 text-center text-[11px] font-semibold text-on-primary">Pay a bill</div>
    </motion.div>
    <div className="space-y-2.5">
      <p className="font-head text-[10px] uppercase tracking-wider text-muted">Launch checklist</p>
      {['Landing page copy', 'Onboarding screens', 'Help centre articles', 'API docs for partners', 'Launch email'].map((item, i) => <motion.div key={item} {...pop(i + 2)} className="flex items-center gap-3 rounded-xl border border-ink-border bg-surface px-4 py-2.5 text-sm">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[11px] text-on-primary">✓</span>{item}
      </motion.div>)}
    </div>
  </div>
}
