'use client'

import { animate, motion, useInView, useMotionValue, useReducedMotion, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { testimonials } from '@/lib/home-content'
import { TypeHeading } from './Motion'

const AUTO_MS = 5000

// "In their words" as a carousel: it moves on its own, loops, pauses on hover
// or when off screen, and can be swiped, dragged or stepped with the buttons
// and dots. The card in focus is the blue one.
export default function Testimonials() {
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLElement>(null)
  const inView = useInView(root, { margin: '-80px' })
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [step, setStep] = useState(0)
  const x = useMotionValue(0)
  const count = testimonials.length

  // One step = one card width plus the gap.
  useEffect(() => {
    const measure = () => { if (card.current) setStep(card.current.offsetWidth + (window.innerWidth >= 768 ? 16 : 12)) }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const controls = animate(x, -index * step, reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 })
    return () => controls.stop()
  }, [index, step, x, reduce])

  const go = useCallback((i: number) => setIndex((i + count) % count), [count])

  // Advance on its own while visible and not being interacted with.
  useEffect(() => {
    if (reduce || paused || !inView) return
    const t = window.setTimeout(() => { if (!document.hidden) go(index + 1) }, AUTO_MS)
    return () => window.clearTimeout(t)
  }, [index, paused, inView, reduce, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (swipe < -50) go(index + 1)
    else if (swipe > 50) go(index - 1)
    else animate(x, -index * step, { type: 'spring', stiffness: 260, damping: 32 })
    setPaused(false)
  }

  return <div ref={root} className="mt-14 md:mt-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="flex items-end justify-between gap-4">
      <TypeHeading as="h3" className="font-display text-2xl font-semibold tracking-[-.03em] md:text-3xl" text="In their words" />
      <div className="flex gap-2">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-border bg-bg transition hover:border-primary hover:text-primary">←</button>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary transition hover:bg-primary-dim">→</button>
      </div>
    </div>

    <div className="-mx-5 mt-6 overflow-hidden px-5 md:-mx-8 md:px-8 lg:mx-0 lg:px-0" aria-roledescription="carousel" aria-label="Testimonials">
      <motion.div style={{ x }} drag="x" dragConstraints={{ left: -(count - 1) * step, right: 0 }} dragElastic={0.12}
        onDragStart={() => setPaused(true)} onDragEnd={onDragEnd} className="flex w-max cursor-grab gap-3 active:cursor-grabbing md:gap-4">
        {testimonials.map((t, i) => {
          const on = i === index
          return <figure key={t.name} ref={i === 0 ? card : undefined} aria-hidden={!on} onClick={() => go(i)}
            className={`flex w-[82vw] max-w-[440px] shrink-0 select-none flex-col rounded-3xl p-6 transition-[background-color,color,transform,opacity] duration-500 md:p-9 ${on ? 'scale-100 bg-primary text-on-primary shadow-[0_30px_60px_-30px_rgb(var(--primary)/.7)]' : 'scale-[.97] border border-ink-border bg-bg opacity-80'}`}>
            <span aria-hidden="true" className={`font-display text-5xl leading-none md:text-6xl ${on ? 'text-on-primary/50' : 'text-primary'}`}>“</span>
            <blockquote className="mt-1 font-serif text-lg leading-7 md:mt-2 md:text-xl md:leading-8">{t.quote}</blockquote>
            <figcaption className={`mt-auto pt-7 text-sm ${on ? 'text-on-primary/80' : 'text-muted'}`}><span className={`block font-semibold ${on ? 'text-on-primary' : 'text-parchment'}`}>{t.name}</span>{t.role}</figcaption>
          </figure>
        })}
      </motion.div>
    </div>

    {/* Dots; the active one fills up as the timer runs */}
    <div className="mt-6 flex items-center gap-2" role="group" aria-label="Choose a testimonial">
      {testimonials.map((t, i) => <button key={t.name} type="button" onClick={() => go(i)} aria-label={`Show testimonial ${i + 1}`} aria-pressed={i === index}
        className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 ${i === index ? 'w-10 bg-primary/25' : 'w-2 bg-muted/35 hover:bg-muted/60'}`}>
        {i === index && <motion.span key={`${index}-${paused}-${inView}`} className="absolute inset-y-0 left-0 bg-primary"
          initial={{ width: paused || !inView || reduce ? '100%' : '0%' }} animate={{ width: '100%' }} transition={{ duration: paused || !inView || reduce ? 0 : AUTO_MS / 1000, ease: 'linear' }} />}
      </button>)}
      <span className="ml-2 font-head text-[10px] text-muted">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
    </div>
  </div>
}
