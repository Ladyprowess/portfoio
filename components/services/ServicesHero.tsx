'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { services } from '@/lib/services-content'

const GREETING = 'Let me show you what I can do for your business.'

// Ngozi talks to the visitor: a typed message on the left, and on the right
// the problems they might have, in their own words, as a light list. Each one
// jumps to how she solves it. Phones: the message, then the list.
export default function ServicesHero() {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  const [typingDots, setTypingDots] = useState(true)

  useEffect(() => {
    if (reduce) { setN(GREETING.length); setTypingDots(false); return }
    let i = 0, t = 0
    const tick = () => { i += 1; setN(i); if (i < GREETING.length) t = window.setTimeout(tick, 32 + Math.random() * 30) }
    // A beat of "typing…" first, like a real message arriving.
    t = window.setTimeout(() => { setTypingDots(false); tick() }, 900)
    return () => window.clearTimeout(t)
  }, [reduce])

  const done = n >= GREETING.length

  return <section className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36">
    <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />

    <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div>
        <div className="flex items-center gap-3">
          <span className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-primary/30"><Image src="/personal photo/headshot6.jpg" alt="" fill sizes="44px" priority className="object-cover object-[50%_18%]" /></span>
          <div className="text-sm"><p className="font-semibold">Ngozi Peace Unegbu</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">{typingDots ? <>typing<span className="flex gap-0.5">{[0, 1, 2].map(d => <motion.span key={d} className="h-1 w-1 rounded-full bg-muted" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />)}</span></> : <><span className="h-1.5 w-1.5 rounded-full bg-[#84CC16]" />online</>}</p>
          </div>
        </div>

        <h1 className="mt-6 grid font-display text-[clamp(2.3rem,4.4vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
          <span className="sr-only">{GREETING}</span>
          <span aria-hidden="true" className="invisible select-none [grid-area:1/1]">{GREETING}</span>
          <span aria-hidden="true" className="select-none [grid-area:1/1]">
            {GREETING.slice(0, n).split('your business').map((part, i, arr) => <span key={i}>{part}{i < arr.length - 1 && <span className="text-primary">your business</span>}</span>)}
            {/* "your business" is only highlighted once it has been typed in full */}
            {!done && n > 0 && <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] animate-pulse bg-primary" />}
          </span>
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-7 text-muted md:text-base">AI adoption, product building, technical writing, websites and product marketing, each shown live below.</p>
      </div>

      {/* A small chat: Ngozi asks, and the visitor's possible problems are quick replies.
          Tapping one jumps to how she solves it. */}
      <div className="rounded-[1.75rem] border border-ink-border bg-surface/90 p-5 shadow-[0_30px_80px_-45px_rgba(17,24,39,.45)] backdrop-blur md:p-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-end gap-2.5">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full"><Image src="/personal photo/headshot6.jpg" alt="" fill sizes="32px" className="object-cover object-[50%_18%]" /></span>
          <p className="rounded-2xl rounded-bl-sm bg-surface-2 px-4 py-3 text-[15px] leading-6">Which of these sounds like you?</p>
        </motion.div>
        <ul className="mt-5 flex flex-col items-end gap-2">
          {services.map((s, i) => <motion.li key={s.key} initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5 + i * 0.12, duration: 0.35 }}>
            <a href={`#${s.key}`} title={s.name}
              className="block rounded-2xl rounded-br-sm border border-primary/30 bg-primary/[0.06] px-4 py-2.5 text-right text-[14px] font-medium leading-snug text-parchment transition hover:-translate-x-1 hover:border-primary hover:bg-primary hover:text-on-primary">“{s.problem}”</a>
          </motion.li>)}
        </ul>
        <p className="mt-4 text-center text-[11px] text-muted">Tap one to see how I’d fix it</p>
      </div>
    </div>
  </section>
}
