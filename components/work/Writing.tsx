'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { writing } from '@/lib/work-content'
import { Heading } from './Websites'

// Some "screenshots" are wide logo banners; show those whole on white.
const isBanner = (src: string) => src.includes('/brands/')

export default function Writing() {
  const list = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })

  const move = (e: React.MouseEvent) => {
    const r = list.current!.getBoundingClientRect()
    x.set(e.clientX - r.left + 28)
    y.set(e.clientY - r.top - 110)
  }

  return <section id="writing" className="scroll-mt-40 border-y border-ink-border bg-surface-2/60 py-20 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <Heading eyebrow="02 · Writing" title="Writing that makes complex products easier to understand." body="Copywriting, technical articles, product education, industry analysis and tutorials, published under my name." />

      <div ref={list} onMouseMove={move} onMouseLeave={() => setHover(null)} className="relative border-t border-ink-border">
        {writing.map((w, i) => <a key={w.title} href={w.href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHover(i)}
          className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-ink-border py-5 transition-colors md:grid-cols-[3rem_1fr_1.3fr_auto] md:gap-8 md:py-7">
          <span className="hidden font-head text-xs text-muted md:block">{String(i + 1).padStart(2, '0')}</span>
          {/* Phones: a small thumbnail stands in for the hover preview */}
          <span className="relative h-12 w-16 overflow-hidden rounded-lg border border-ink-border bg-white md:hidden">
            <Image src={w.image} alt="" fill sizes="64px" className={isBanner(w.image) ? 'object-contain p-1' : 'object-cover object-top'} />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl font-semibold tracking-[-.02em] transition-colors group-hover:text-primary md:text-[1.75rem]">{w.title}</span>
            <span className="mt-1 block text-sm leading-6 text-muted md:hidden">{w.description}</span>
          </span>
          <span className="hidden text-[15px] leading-6 text-muted md:block">{w.description}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-border text-primary transition group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary">↗</span>
        </a>)}

        {/* Desktop: the preview card follows the cursor */}
        <motion.div aria-hidden="true" style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block">
          <AnimatePresence>
            {hover !== null && <motion.div key="preview" initial={{ opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
              className="relative h-[200px] w-[300px] overflow-hidden rounded-2xl border border-ink-border bg-white shadow-[0_30px_60px_-20px_rgba(17,24,39,.5)]">
              {writing.map((w, i) => <Image key={w.title} src={w.image} alt="" fill sizes="300px"
                className={`transition-opacity duration-300 ${isBanner(w.image) ? 'object-contain p-6' : 'object-cover object-top'} ${i === hover ? 'opacity-100' : 'opacity-0'}`} />)}
            </motion.div>}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  </section>
}
