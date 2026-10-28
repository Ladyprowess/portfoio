'use client'

import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { TypeHeading } from './Motion'
import Testimonials from './Testimonials'
import { clients } from '@/lib/home-content'

// Who I have worked with (tiles flip to say what I did) and what they said
// (a carousel, in Testimonials.tsx).
export default function Proof() {
  const reduce = useReducedMotion()
  // Touch screens cannot hover, so the tiles flip on their own, one at a time, while the wall is on screen.
  const wall = useRef<HTMLDivElement>(null)
  const wallInView = useInView(wall, { margin: '-80px' })
  const [flipped, setFlipped] = useState(-1)
  useEffect(() => {
    if (reduce || !wallInView || !window.matchMedia('(hover: none)').matches) { setFlipped(-1); return }
    let i = 0
    const t = window.setInterval(() => { setFlipped(i % clients.length); i += 1 }, 1400)
    return () => window.clearInterval(t)
  }, [wallInView, reduce])


  return <section className="border-y border-ink-border bg-surface py-14 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="mb-7 flex flex-col justify-between gap-2 md:mb-10 md:flex-row md:items-end md:gap-4">
        <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Trusted by</p><TypeHeading className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.9rem] md:leading-[1.05]" text="Teams I have worked with." /></div>
        <p className="text-sm text-muted"><span className="md:hidden">Each logo flips to show what I did.</span><span className="hidden md:inline">Hover a logo to see what I did.</span></p>
      </div>
      {/* Phones: a compact 3-column wall; tiles flip on tap as well as hover */}
      <div ref={wall} className="grid grid-cols-3 gap-2 md:gap-3 lg:grid-cols-4">
        {clients.map((c, i) => <motion.a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.name}: ${c.did}`} className="group h-[76px] [perspective:900px] md:h-28"
          initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}>
          <span className={`relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)] group-focus-visible:[transform:rotateX(180deg)] ${flipped === i ? '[transform:rotateX(180deg)]' : ''}`}>
            <span className="absolute inset-0 flex items-center justify-center rounded-xl border border-ink-border bg-bg px-2 [backface-visibility:hidden] md:rounded-2xl">
              <span className="brand-plate flex items-center justify-center rounded-md px-1.5 py-1 md:rounded-lg md:px-2.5 md:py-1.5"><Image src={c.image} alt="" width={130} height={44} className="max-h-6 max-w-[84px] object-contain md:max-h-9 md:max-w-[130px]" /></span>
            </span>
            <span className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-primary px-2 text-center text-on-primary [backface-visibility:hidden] [transform:rotateX(180deg)] md:rounded-2xl md:px-4">
              <span className="text-[11px] font-semibold md:text-xs">{c.name}</span><span className="mt-0.5 line-clamp-2 text-[10px] leading-tight opacity-80 md:mt-1 md:text-[11px]">{c.did}</span>
            </span>
          </span>
        </motion.a>)}
        <a href="/services" className="flex h-[76px] flex-col items-center justify-center rounded-xl border border-dashed border-ink-border px-2 text-center text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary/[0.04] md:h-28 md:rounded-2xl md:text-sm">See all my work →</a>
      </div>

      <Testimonials />
    </div>
  </section>
}
