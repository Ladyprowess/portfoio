'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  {
    target: 200,
    suffix: '+',
    desc: 'Businesses and individuals trained through Prowess Digital Solutions.',
  },
  {
    target: 200,
    suffix: '%',
    desc: 'Engagement growth driven for Bullring Finance in a short content strategy sprint.',
  },
  {
    target: 5,
    suffix: '',
    desc: 'Countries worked across in the last five years: Nigeria, Serbia, the UK, Europe, Brazil.',
  },
  {
    target: 25,
    suffix: '%',
    desc: "Developer satisfaction increase after redocumenting txFusion's cross-border payment APIs.",
  },
  {
    target: 6,
    suffix: '',
    desc: 'Years self-taught, writing and coding, before the first full-time role.',
  },
  {
    target: 20,
    suffix: '%',
    desc: "Faster documentation turnaround after restructuring WriteTech Hub's workflow.",
  },
]

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function RollingFigure({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setValue(target)
      return
    }

    const duration = 1300
    let raf: number
    let start: number | null = null

    const frame = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(easeOutExpo(progress) * target))
      if (progress < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return (
    <span className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}

export default function Impact() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  const listRef = useRef(null)
  const listInView = useInView(listRef, { once: true, margin: '-100px' })

  return (
    <section className="px-8 md:px-20 py-32 border-t border-ink-border">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-head text-[0.62rem] font-semibold tracking-[0.1em] uppercase text-primary block mb-4">
            Impact
          </span>
          <h2
            className="font-display font-extrabold leading-[1.08] mb-12"
            style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}
          >
            Numbers instead of adjectives.
          </h2>
        </motion.div>

        <div ref={listRef} className="flex flex-col">
          {stats.map((s, i) => (
            <motion.div
              key={s.desc}
              initial={{ opacity: 0, y: 14 }}
              animate={listInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-6 py-5 border-t border-ink-border last:border-b"
            >
              <span
                className={`font-display font-extrabold text-[1.7rem] tracking-tight ${
                  i % 2 === 0 ? 'text-primary' : 'text-parchment'
                }`}
              >
                <RollingFigure target={s.target} suffix={s.suffix} active={listInView} />
              </span>
              <span className="text-[0.95rem] text-muted self-center">{s.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
