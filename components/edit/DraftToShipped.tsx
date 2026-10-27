'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import posthog from 'posthog-js'
import { useState } from 'react'
import { projects } from '@/lib/portfolio-content'

// Each venture is a card with two sides: the first-draft idea, and what shipped.
export default function DraftToShipped() {
  const [flipped, setFlipped] = useState<boolean[]>(projects.map(() => false))
  const allShipped = flipped.every(Boolean)

  const flip = (i: number) => {
    setFlipped(f => f.map((v, j) => (j === i ? !v : v)))
    if (!flipped[i]) posthog.capture('project_details_viewed', { project_name: projects[i].name, project_type: projects[i].type })
  }

  return <section id="work" className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
    <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Selected work</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.035em] md:text-4xl">From first draft to shipped.</h2><p className="mt-3 max-w-md text-sm leading-6 text-muted">Ventures I built and founded from scratch. Flip a card to see what the idea became.</p></div>
      <div className="flex rounded-full border border-ink-border bg-surface p-1 text-xs font-semibold" role="group" aria-label="Show all cards as">
        <button type="button" onClick={() => setFlipped(projects.map(() => false))} aria-pressed={!flipped.some(Boolean)} className={`rounded-full px-4 py-2 transition ${!flipped.some(Boolean) ? 'bg-parchment text-bg' : 'text-muted hover:text-parchment'}`}>Drafts</button>
        <button type="button" onClick={() => setFlipped(projects.map(() => true))} aria-pressed={allShipped} className={`rounded-full px-4 py-2 transition ${allShipped ? 'bg-primary text-on-primary' : 'text-muted hover:text-parchment'}`}>Shipped</button>
      </div>
    </div>

    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => <FlipCard key={p.name} project={p} index={i} flipped={flipped[i]} onFlip={() => flip(i)} />)}
    </div>
  </section>
}

function FlipCard({ project: p, index, flipped, onFlip }: { project: (typeof projects)[number]; index: number; flipped: boolean; onFlip: () => void }) {
  const reduceMotion = useReducedMotion()
  return <div className="h-[450px] [perspective:1400px]">
    <motion.div className="relative h-full w-full [transform-style:preserve-3d]" initial={false} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
      {/* Draft side */}
      <div className="ruled absolute inset-0 flex flex-col rounded-3xl border border-ink-border bg-paper p-7 shadow-[0_18px_45px_rgba(17,24,39,.06)] [backface-visibility:hidden]" aria-hidden={flipped} style={{ backgroundPosition: '0 70px' }}>
        <div className="flex items-center justify-between"><span className="font-head text-[10px] uppercase tracking-wider text-muted">v0.1 · the idea</span><span className="font-head text-[10px] text-muted">0{index + 1}</span></div>
        <p className="mt-8 font-serif text-[1.45rem] italic leading-9 text-parchment/85">“{p.draft}”</p>
        <button type="button" onClick={onFlip} tabIndex={flipped ? -1 : 0} className="mt-auto flex items-center justify-between rounded-full border border-parchment px-5 py-3 text-sm font-semibold transition hover:bg-parchment hover:text-bg">
          See what shipped <span aria-hidden="true">↻</span>
        </button>
      </div>

      {/* Shipped side */}
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-ink-border bg-surface shadow-[0_18px_45px_rgba(17,24,39,.08)] [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!flipped}>
        <div className={`flex h-28 shrink-0 items-center justify-center px-8 text-[#121212] ${p.colour}`}>
          {p.name === 'KivoraPay' ? <div className="font-display text-2xl font-extrabold tracking-[-0.06em]"><span>Kivora</span><span className="text-[#2DD4A0]">Pay</span></div> : <Image src={p.image} alt={`${p.name} logo`} width={210} height={86} className={`w-auto object-contain ${p.name === 'Dritchwear' ? 'max-h-11 max-w-[200px]' : 'max-h-16 max-w-[210px]'}`} />}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between"><span className="font-head text-[10px] uppercase tracking-wider text-muted">{p.type}</span><span className="rounded-full bg-success/10 px-2.5 py-0.5 font-head text-[10px] font-semibold uppercase text-success">Shipped</span></div>
          <h3 className="mt-2 font-display text-xl font-semibold">{p.name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{p.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{p.work.map(w => <span key={w} className="rounded-full border border-ink-border px-2.5 py-1 text-[11px] text-muted">{w}</span>)}</div>
          <div className="mt-auto flex items-center justify-between pt-4">
            <button type="button" onClick={onFlip} tabIndex={flipped ? 0 : -1} className="text-sm text-muted hover:text-parchment">↺ Draft</button>
            <a href={p.href} target="_blank" rel="noopener noreferrer" tabIndex={flipped ? 0 : -1} onClick={() => posthog.capture('project_website_visited', { project_name: p.name, project_type: p.type })} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">Visit ↗</a>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
}
