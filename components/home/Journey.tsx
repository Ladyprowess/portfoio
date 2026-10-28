'use client'

import Image from 'next/image'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { journey } from '@/lib/home-content'
import { TypeHeading } from './Motion'
import PenNib from './PenNib'

// "From a phone screen": the real milestones. On desktop the section pins and
// the years slide sideways as you scroll down; on phones and tablets it is a
// carousel that moves on its own and can be swiped or stepped.
export default function Journey() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const nib = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const measure = () => setDistance(track.current && window.innerWidth >= 1024 ? Math.max(0, track.current.scrollWidth - window.innerWidth + 80) : 0)
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  /* ── Phones and tablets: the row is a carousel ── */
  const reduce = useReducedMotion()
  const carousel = distance === 0
  const inView = useInView(section, { margin: '-20% 0px' })
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const resume = useRef(0)

  const goTo = useCallback((i: number) => {
    const el = track.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
  }, [reduce])

  // Keep the dots in step with swiping.
  const onScroll = () => {
    const el = track.current
    if (!el || !carousel) return
    const mid = el.scrollLeft + el.clientWidth / 2
    let best = 0, bestGap = Infinity
    Array.from(el.children).forEach((c, i) => { const card = c as HTMLElement; const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid); if (gap < bestGap) { bestGap = gap; best = i } })
    setIndex(best)
  }

  // Move on its own while on screen; a touch pauses it for a few seconds.
  useEffect(() => {
    if (!carousel || reduce || held || !inView) return
    const t = window.setTimeout(() => goTo((index + 1) % journey.length), 3800)
    return () => window.clearTimeout(t)
  }, [carousel, reduce, held, inView, index, goTo])

  const hold = () => { window.clearTimeout(resume.current); setHeld(true) }
  const release = () => { window.clearTimeout(resume.current); resume.current = window.setTimeout(() => setHeld(false), 5000) }

  return <section id="story" ref={section} className="relative bg-panel text-on-panel" style={distance ? { height: `calc(100vh + ${distance}px)` } : undefined}>
    <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
      <div className="mx-auto w-full max-w-[1320px] px-5 pt-14 md:px-8 md:pt-20 lg:pt-16">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end md:gap-4">
          <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-accent-invert">My story</p><TypeHeading className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.9rem] md:leading-[1.05]" text="It started on a phone screen." /></div>
          <a href="/blog/from-a-phone-screen-to-a-movement" className="text-sm font-semibold text-accent-invert hover:underline">Read the full story →</a>
        </div>
      </div>

      {/* Phones: a carousel (auto-moving, swipeable). Desktop: a track moved sideways by page scroll. */}
      <motion.div ref={track} style={{ x }} onScroll={onScroll} onTouchStart={hold} onTouchEnd={release} className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-14 [scrollbar-width:none] md:mt-12 md:px-8 md:pb-20 lg:w-max lg:snap-none lg:gap-5 lg:overflow-visible lg:pb-0 lg:pl-[max(2rem,calc((100vw-1320px)/2+2rem))]">
        {journey.map((m, i) => <article key={m.year} className={`relative flex min-h-[290px] w-[78vw] max-w-[340px] shrink-0 snap-center flex-col rounded-3xl border border-border-invert p-6 transition-[opacity,transform] duration-500 md:p-7 lg:h-[340px] lg:w-[340px] lg:max-w-none lg:scale-100 lg:opacity-100 ${carousel && i !== index ? 'scale-[.95] opacity-50' : ''} ${i === journey.length - 1 ? 'bg-primary text-on-primary lg:w-[420px]' : 'bg-white/[0.03]'}`}>
          <p className={`font-display text-5xl font-bold tracking-[-.05em] md:text-6xl ${i === journey.length - 1 ? '' : 'text-transparent [-webkit-text-stroke:1.5px_rgb(var(--accent-invert))]'}`}>{m.year}</p>
          <h3 className="mt-auto pt-8 font-display text-xl font-semibold tracking-[-.02em]">{m.title}</h3>
          <p className={`mt-2 text-sm leading-6 ${i === journey.length - 1 ? 'text-on-primary/80' : 'text-on-panel/60'}`}>{m.body}</p>
          {i === 0 && <span className="absolute right-6 top-7 h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/10"><Image src="/hero/mine.jpeg" alt="" fill sizes="48px" className="object-cover object-top" /></span>}
        </article>)}
      </motion.div>
      {/* Carousel controls (phones and tablets) */}
      <div className="-mt-6 flex items-center gap-3 px-5 pb-14 md:-mt-10 md:px-8 lg:hidden" role="group" aria-label="Choose a year">
        <button type="button" onClick={() => { hold(); release(); goTo((index - 1 + journey.length) % journey.length) }} aria-label="Previous year" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-invert transition hover:border-accent-invert">←</button>
        <div className="flex flex-1 items-center justify-center gap-1.5">
          {journey.map((m, i) => <button key={m.year} type="button" onClick={() => { hold(); release(); goTo(i) }} aria-label={`Show ${m.year}`} aria-pressed={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-accent-invert' : 'w-1.5 bg-on-panel/25'}`} />)}
        </div>
        <span className="w-12 text-center font-head text-xs text-accent-invert">{journey[index].year}</span>
        <button type="button" onClick={() => { hold(); release(); goTo((index + 1) % journey.length) }} aria-label="Next year" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-invert text-panel transition hover:opacity-90">→</button>
      </div>

      {/* Progress: the pen nib writes along the line as you scroll */}
      <div aria-hidden="true" className="relative mx-auto mt-12 hidden h-px w-[calc(100%-4rem)] max-w-[1256px] bg-border-invert lg:block">
        <motion.div className="absolute left-0 top-0 h-px bg-accent-invert" style={{ width: nib }} />
        <motion.div className="absolute -top-6" style={{ left: nib }}><PenNib className="h-6 w-4 -translate-x-1/2" /></motion.div>
      </div>
    </div>
  </section>
}
