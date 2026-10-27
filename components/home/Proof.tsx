'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { clients, testimonials } from '@/lib/home-content'

// Who I have worked with (tiles flip to say what I did) and what they said
// (cards you can drag sideways).
export default function Proof() {
  const viewport = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const [limit, setLimit] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const measure = () => setLimit(Math.max(0, (strip.current?.scrollWidth ?? 0) - (viewport.current?.clientWidth ?? 0)))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return <section className="border-y border-ink-border bg-surface py-20 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Trusted by</p><h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-[-.04em] md:text-[2.9rem] md:leading-[1.05]">Teams I have worked with.</h2></div>
        <p className="text-sm text-muted">Hover a logo to see what I did.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {clients.map(c => <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.name}: ${c.did}`} className="group h-28 [perspective:900px]">
          <span className="relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)] group-focus-visible:[transform:rotateX(180deg)]">
            <span className="absolute inset-0 flex items-center justify-center rounded-2xl border border-ink-border bg-bg [backface-visibility:hidden]">
              <span className="brand-plate flex items-center justify-center rounded-lg px-2.5 py-1.5"><Image src={c.image} alt="" width={130} height={44} className="max-h-9 max-w-[130px] object-contain" /></span>
            </span>
            <span className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-primary px-4 text-center text-on-primary [backface-visibility:hidden] [transform:rotateX(180deg)]">
              <span className="text-xs font-semibold">{c.name}</span><span className="mt-1 text-[11px] opacity-80">{c.did}</span>
            </span>
          </span>
        </a>)}
        <a href="/services" className="flex h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-ink-border text-center text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/[0.04]">See all my work →</a>
      </div>

      <div className="mt-20 flex items-end justify-between gap-4">
        <h3 className="font-display text-2xl font-bold tracking-[-.03em] md:text-3xl">In their words</h3>
        <p className="text-sm text-muted">Drag →</p>
      </div>
      <div ref={viewport} className="mt-6 overflow-hidden">
        <motion.div ref={strip} drag={reduce ? false : 'x'} dragConstraints={{ left: -limit, right: 0 }} dragElastic={0.08} className="flex w-max cursor-grab gap-4 active:cursor-grabbing">
          {testimonials.map((t, i) => <figure key={t.name} className={`flex w-[min(82vw,440px)] shrink-0 select-none flex-col rounded-3xl p-7 md:p-9 ${i === 0 ? 'bg-primary text-on-primary' : 'border border-ink-border bg-bg'}`}>
            <span aria-hidden="true" className={`font-display text-6xl leading-none ${i === 0 ? 'text-on-primary/50' : 'text-primary'}`}>“</span>
            <blockquote className="mt-2 font-serif text-xl leading-8">{t.quote}</blockquote>
            <figcaption className={`mt-auto pt-7 text-sm ${i === 0 ? 'text-on-primary/80' : 'text-muted'}`}><span className={`block font-semibold ${i === 0 ? 'text-on-primary' : 'text-parchment'}`}>{t.name}</span>{t.role}</figcaption>
          </figure>)}
        </motion.div>
      </div>
    </div>
  </section>
}
