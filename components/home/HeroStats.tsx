'use client'

import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// The hero's numbers. They count up when they come into view. Phones: a
// swipeable row of small cards (the next one peeks in). Larger screens: one
// row of five. Reduced motion shows the final numbers straight away.

const stats = [
  { value: '9+', label: 'Years of writing and building' },
  { value: '200+', label: 'People trained' },
  { value: '3', label: 'Ventures founded' },
  { value: '11', label: 'Companies I have worked with' },
  { value: '-45%', label: 'Repeat customer issues, in support' },
]

/** Animates the number inside a value like "200+" or "-45%", keeping its prefix and suffix. */
function CountUp({ value, start }: { value: string; start: boolean }) {
  const reduce = useReducedMotion()
  const m = value.match(/^(\D*)(\d+)(\D*)$/)
  const [prefix, target, suffix] = m ? [m[1], Number(m[2]), m[3]] : ['', 0, value]
  const [n, setN] = useState(reduce ? target : 0)
  useEffect(() => {
    if (!start || reduce) { if (reduce) setN(target); return }
    const controls = animate(0, target, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: v => setN(Math.round(v)) })
    return () => controls.stop()
  }, [start, reduce, target])
  // The final value is always in the accessible text, so screen readers never hear a half-counted number.
  return <><span aria-hidden="true">{prefix.replace('-', '−')}{n}{suffix}</span><span className="sr-only">{value}</span></>
}

export default function HeroStats() {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return <ul ref={ref} aria-label="At a glance"
    className="relative mx-auto mt-14 flex max-w-[1320px] snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mt-20 md:grid md:grid-cols-5 md:gap-0 md:overflow-visible md:px-8 md:pb-0">
    {stats.map((s, i) => <li key={s.label}
      className="flex w-[42%] shrink-0 snap-start flex-col rounded-2xl border border-ink-border bg-surface p-4 shadow-[0_12px_30px_-22px_rgba(17,24,39,.35)] sm:w-[30%] md:w-auto md:rounded-none md:border-0 md:border-l md:bg-transparent md:p-0 md:pl-5 md:shadow-none">
      <span className="font-display text-3xl font-bold tracking-[-.04em] md:text-4xl"><CountUp value={s.value} start={inView} /></span>
      <span className="mt-1 text-xs leading-5 text-muted">{s.label}</span>
      <span aria-hidden="true" className="mt-3 h-1 w-8 rounded-full bg-primary/30 md:hidden" style={{ width: `${18 + i * 6}px` }} />
    </li>)}
  </ul>
}
