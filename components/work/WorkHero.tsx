'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { caseStudies, learning, websites, writing } from '@/lib/work-content'

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')

// Everything shown in the hero's browser window, in turn.
const reel = [...websites.slice(0, 3), writing[0], learning[0], websites[5]]

export const sections = [
  { id: 'websites', label: 'Websites', count: websites.length },
  { id: 'writing', label: 'Writing', count: writing.length },
  { id: 'learning', label: 'Learning', count: learning.length },
  { id: 'case-studies', label: 'Case studies', count: caseStudies.length },
]

export default function WorkHero() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const item = reel[i]

  useEffect(() => {
    if (reduce || paused) return
    const t = window.setInterval(() => { if (!document.hidden) setI(v => (v + 1) % reel.length) }, 3600)
    return () => window.clearInterval(t)
  }, [reduce, paused])

  return <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
    <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    <div aria-hidden="true" className="absolute -right-40 -top-24 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />

    <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[.95fr_1.05fr]">
      <div>
        <p className="font-head text-[10px] uppercase tracking-[.22em] text-muted">My work</p>
        <h1 className="mt-5 font-display text-[clamp(2.1rem,3.7vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
          Real projects, <span className="text-primary">shipped and live.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-muted md:text-lg">Websites I designed, writing I publish for brands, learning I created and case studies I wrote. Every one links to the real thing, so you can judge the work yourself.</p>

        <nav aria-label="Jump to" className="mt-9 grid max-w-lg grid-cols-2 gap-3">
          {sections.map(s => <a key={s.id} href={`#${s.id}`} className="group flex items-center justify-between rounded-2xl border border-ink-border bg-surface/80 px-5 py-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_18px_40px_-24px_rgba(17,24,39,.4)]">
            <span><span className="block font-display text-2xl font-semibold tracking-[-.03em]">{s.count}</span><span className="text-sm text-muted">{s.label}</span></span>
            <span className="text-primary transition-transform group-hover:translate-y-0.5">↓</span>
          </a>)}
        </nav>
      </div>

      {/* A browser window cycling through the real work */}
      <div className="relative min-w-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[20px] border border-ink-border bg-surface shadow-[0_50px_110px_-40px_rgba(17,24,39,.5)]">
          <div className="flex items-center gap-3 border-b border-ink-border px-4 py-3">
            <span className="hidden gap-1.5 sm:flex" aria-hidden="true">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
            <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-surface-2 px-3.5 py-1.5 text-xs text-muted">
              <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="currentColor" aria-hidden="true"><path d="M8 1a3 3 0 0 0-3 3v2H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3Zm-2 5V4a2 2 0 1 1 4 0v2H6Z" /></svg>
              <AnimatePresence mode="wait"><motion.span key={item.href} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="truncate">{host(item.href)}</motion.span></AnimatePresence>
            </span>
          </div>
          <div className="relative aspect-[16/10] bg-surface-2">
            {reel.map((r, k) => <Image key={r.title} src={r.image} alt={k === i ? `${r.title} preview` : ''} aria-hidden={k !== i} fill priority={k === 0} sizes="(max-width: 1024px) 92vw, 640px"
              className={`object-cover object-top transition-[opacity,transform] duration-700 ${k === i ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'}`} />)}
          </div>
        </a>
        {/* Caption card for the project on screen */}
        <div className="absolute -bottom-8 left-4 right-4 flex items-center gap-4 rounded-2xl border border-ink-border bg-surface/95 p-4 shadow-[0_24px_50px_-20px_rgba(17,24,39,.45)] backdrop-blur sm:left-auto sm:right-[-12px] sm:w-[340px]">
          <AnimatePresence mode="wait">
            <motion.div key={item.title} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="min-w-0 flex-1">
              <p className="truncate font-display text-[15px] font-semibold">{item.title}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted">{item.description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex shrink-0 gap-1" role="group" aria-label="Choose a project">
            {reel.map((r, k) => <button key={r.title} type="button" onClick={() => setI(k)} aria-label={`Show ${r.title}`} aria-pressed={k === i}
              className={`h-1.5 rounded-full transition-all ${k === i ? 'w-5 bg-primary' : 'w-1.5 bg-muted/40 hover:bg-muted'}`} />)}
          </div>
        </div>
      </div>
    </div>
  </section>
}
