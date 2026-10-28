'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { services } from '@/lib/services-content'

const GREETING = 'Now that you’re here, let me show you what I can do for your brand.'

const icons: Record<string, string> = { product: '💬', writing: '</>', web: '🖥', education: '🎓', business: '⚙︎' }

// Ngozi talks to the visitor: a typed message, then the problems they might
// have, in their own words. Each one jumps to how she solves it.
export default function ServicesHero() {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  const [typingDots, setTypingDots] = useState(true)

  useEffect(() => {
    if (reduce) { setN(GREETING.length); setTypingDots(false); return }
    let i = 0, t = 0
    const tick = () => { i += 1; setN(i); if (i < GREETING.length) t = window.setTimeout(tick, GREETING[i - 1] === ',' ? 260 : 32 + Math.random() * 30) }
    // A beat of "typing…" first, like a real message arriving.
    t = window.setTimeout(() => { setTypingDots(false); tick() }, 1300)
    return () => window.clearTimeout(t)
  }, [reduce])

  const done = n >= GREETING.length

  return <section className="relative overflow-hidden pb-14 pt-24 md:pb-20 md:pt-36">
    <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />

    <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
      <div className="flex items-center gap-3">
        <span className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-primary/30"><Image src="/personal photo/headshot6.jpg" alt="" fill sizes="44px" priority className="object-cover object-[50%_18%]" /></span>
        <div className="text-sm"><p className="font-semibold">Ngozi Peace Okafor</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">{typingDots ? <>typing<span className="flex gap-0.5">{[0, 1, 2].map(d => <motion.span key={d} className="h-1 w-1 rounded-full bg-muted" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />)}</span></> : <><span className="h-1.5 w-1.5 rounded-full bg-[#84CC16]" />online</>}</p>
        </div>
      </div>

      <h1 className="mt-6 grid font-display text-[clamp(2rem,4.6vw,3.9rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
        <span className="sr-only">{GREETING}</span>
        <span aria-hidden="true" className="invisible select-none [grid-area:1/1]">{GREETING}</span>
        <span aria-hidden="true" className="select-none [grid-area:1/1]">
          {GREETING.slice(0, n).split('your brand').map((part, i, arr) => <span key={i}>{part}{i < arr.length - 1 && <span className="text-primary">your brand</span>}</span>)}
          {/* "your brand" is only highlighted once it has been typed in full */}
          {!done && n > 0 && <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] animate-pulse bg-primary" />}
        </span>
      </h1>

      <AnimatePresence>{done && <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted md:text-lg">Which of these sounds like you? Pick one and I’ll show you how I’d fix it.</p>
        {/* Phones: one swipeable row. Desktop: a grid. */}
        <div className="-mx-5 mt-7 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {services.map((s, i) => <motion.a key={s.key} href={`#${s.key}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
            className="group flex w-[70vw] max-w-[260px] shrink-0 snap-start flex-col rounded-2xl border border-ink-border bg-surface/90 p-4 backdrop-blur transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_40px_-24px_rgba(17,24,39,.45)] md:w-auto md:max-w-none">
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 font-mono text-sm font-bold text-primary">{icons[s.key]}</span>
            <span className="mt-4 text-[15px] font-semibold leading-snug">“{s.problem}”</span>
            <span className="mt-auto pt-4 text-xs font-semibold text-primary">{s.name} <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span></span>
          </motion.a>)}
        </div>
      </motion.div>}</AnimatePresence>
    </div>
  </section>
}
