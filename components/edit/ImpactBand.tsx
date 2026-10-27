'use client'

import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { brands, stats } from '@/lib/portfolio-content'

const figures = [...stats, { value: `${brands.length}`, label: 'Companies supported' }]

// A dark slab between the light sections, with the numbers counting up.
export default function ImpactBand() {
  return <section className="relative overflow-hidden bg-panel py-20 text-on-panel md:py-24">
    <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-[120px]" />
    <div className="relative mx-auto grid max-w-[1320px] gap-12 px-4 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
      <div>
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-accent-invert">Since 2016</p>
        <h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.6rem] md:leading-[1.1]">Years of turning hard things into clear things.</h2>
        <p className="mt-4 max-w-md leading-7 text-on-panel/60">It started with writing on a phone. It grew into product marketing, documentation, websites, training and three companies of my own.</p>
        <a href="/about" className="mt-6 inline-flex text-sm font-semibold text-accent-invert hover:underline">Read the full story →</a>
      </div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border-invert bg-border-invert">
        {figures.map(f => <div key={f.label} className="flex flex-col-reverse bg-panel p-6 md:p-8">
          <dt className="mt-2 text-sm text-on-panel/60">{f.label}</dt>
          <dd className="font-display text-5xl font-bold tracking-[-.04em] md:text-6xl"><CountUp value={f.value} /></dd>
        </div>)}
      </dl>
    </div>
  </section>
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const target = parseInt(value, 10)
  const suffix = value.replace(/^\d+/, '')
  const [n, setN] = useState(reduce ? target : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, target, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: v => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, target])
  return <span ref={ref}>{n}<span className="text-accent-invert">{suffix}</span></span>
}
