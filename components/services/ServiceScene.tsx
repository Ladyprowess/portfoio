'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { services } from '@/lib/services-content'
import { TypeHeading } from '@/components/home/Motion'
import LiveDemo from './demos'

type Service = (typeof services)[number]

// One service: the visitor's problem, what Ngozi does about it, and a live
// demo of the fix. Scenes alternate sides on desktop.
export default function ServiceScene({ service: s, index, onStart }: { service: Service; index: number; onStart: (intent: string) => void }) {
  const reduce = useReducedMotion()
  const flip = index % 2 === 1
  return <section id={s.key} className={`scroll-mt-24 py-14 md:py-24 ${flip ? 'bg-surface-2/60' : ''}`}>
    <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
      <div className={flip ? 'lg:order-2' : ''}>
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">0{index + 1} · {s.name}</p>
        <p className="mt-4 inline-block rounded-2xl rounded-bl-sm bg-surface px-4 py-2.5 text-[15px] italic text-muted shadow-sm ring-1 ring-ink-border">You: “{s.problem}”</p>
        <TypeHeading className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-[-.04em] md:text-[2.6rem]" text={s.title} />
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted md:text-base">{s.body}</p>

        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {s.includes.map((item, i) => <motion.li key={item} initial={reduce ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.1 }}
            className="flex items-start gap-2.5 text-sm"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] text-on-primary">✓</span>{item}</motion.li>)}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => onStart(s.intent)} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-[0_10px_30px_-10px_rgb(var(--primary)/.6)] transition hover:bg-primary-dim">I need this →</button>
          <details className="group">
            <summary className="cursor-pointer list-none rounded-full border border-ink-border px-5 py-3 text-sm font-semibold transition hover:border-muted">{s.proofTitle} <span className="inline-block text-primary transition-transform group-open:rotate-45">+</span></summary>
            <ul className="mt-3 flex max-w-xl flex-wrap gap-2">
              {s.proof.map(p => <li key={p.href}><a href={p.href} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-ink-border bg-bg px-3 py-1.5 text-xs transition hover:border-primary hover:text-primary">{p.label} ↗</a></li>)}
            </ul>
          </details>
        </div>
      </div>

      <motion.div className={`min-w-0 ${flip ? 'lg:order-1' : ''}`} initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <LiveDemo service={s.key} />
      </motion.div>
    </div>
  </section>
}
