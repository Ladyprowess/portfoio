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
  // Drag is for mouse users on wide screens; touch screens use native swiping.
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const q = window.matchMedia('(min-width: 1024px)')
    const update = () => setWide(q.matches)
    update()
    q.addEventListener('change', update)
    return () => q.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const measure = () => setLimit(Math.max(0, (strip.current?.scrollWidth ?? 0) - (viewport.current?.clientWidth ?? 0)))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return <section className="border-y border-ink-border bg-surface py-14 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="mb-7 flex flex-col justify-between gap-2 md:mb-10 md:flex-row md:items-end md:gap-4">
        <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Trusted by</p><h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.9rem] md:leading-[1.05]">Teams I have worked with.</h2></div>
        <p className="text-sm text-muted"><span className="md:hidden">Tap</span><span className="hidden md:inline">Hover</span> a logo to see what I did.</p>
      </div>
      {/* Phones: a compact 3-column wall; tiles flip on tap as well as hover */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 lg:grid-cols-4">
        {clients.map(c => <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.name}: ${c.did}`} className="group h-[76px] [perspective:900px] md:h-28">
          <span className="relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)] group-focus-visible:[transform:rotateX(180deg)]">
            <span className="absolute inset-0 flex items-center justify-center rounded-xl border border-ink-border bg-bg px-2 [backface-visibility:hidden] md:rounded-2xl">
              <span className="brand-plate flex items-center justify-center rounded-md px-1.5 py-1 md:rounded-lg md:px-2.5 md:py-1.5"><Image src={c.image} alt="" width={130} height={44} className="max-h-6 max-w-[84px] object-contain md:max-h-9 md:max-w-[130px]" /></span>
            </span>
            <span className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-primary px-2 text-center text-on-primary [backface-visibility:hidden] [transform:rotateX(180deg)] md:rounded-2xl md:px-4">
              <span className="text-[11px] font-semibold md:text-xs">{c.name}</span><span className="mt-0.5 line-clamp-2 text-[10px] leading-tight opacity-80 md:mt-1 md:text-[11px]">{c.did}</span>
            </span>
          </span>
        </a>)}
        <a href="/services" className="flex h-[76px] flex-col items-center justify-center rounded-xl border border-dashed border-ink-border px-2 text-center text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary/[0.04] md:h-28 md:rounded-2xl md:text-sm">See all my work →</a>
      </div>

      <div className="mt-14 flex items-end justify-between gap-4 md:mt-20">
        <h3 className="font-display text-2xl font-semibold tracking-[-.03em] md:text-3xl">In their words</h3>
        <p className="text-sm text-muted"><span className="lg:hidden">Swipe</span><span className="hidden lg:inline">Drag</span> →</p>
      </div>
      {/* Phones and tablets scroll natively with snapping; desktop drags */}
      <div ref={viewport} className="-mx-5 mt-5 snap-x snap-mandatory overflow-x-auto px-5 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:mt-6 lg:snap-none lg:overflow-hidden lg:px-0">
        <motion.div ref={strip} drag={reduce || !wide ? false : 'x'} dragConstraints={{ left: -limit, right: 0 }} dragElastic={0.08} className="flex w-max gap-3 md:gap-4 lg:cursor-grab lg:active:cursor-grabbing">
          {testimonials.map((t, i) => <figure key={t.name} className={`flex w-[82vw] max-w-[440px] shrink-0 snap-center select-none flex-col rounded-3xl p-6 md:p-9 ${i === 0 ? 'bg-primary text-on-primary' : 'border border-ink-border bg-bg'}`}>
            <span aria-hidden="true" className={`font-display text-5xl leading-none md:text-6xl ${i === 0 ? 'text-on-primary/50' : 'text-primary'}`}>“</span>
            <blockquote className="mt-1 font-serif text-lg leading-7 md:mt-2 md:text-xl md:leading-8">{t.quote}</blockquote>
            <figcaption className={`mt-auto pt-7 text-sm ${i === 0 ? 'text-on-primary/80' : 'text-muted'}`}><span className={`block font-semibold ${i === 0 ? 'text-on-primary' : 'text-parchment'}`}>{t.name}</span>{t.role}</figcaption>
          </figure>)}
        </motion.div>
      </div>
    </div>
  </section>
}
