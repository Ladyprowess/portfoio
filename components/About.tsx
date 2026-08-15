'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const stats = [
  { num: '2', label: 'Businesses Founded', sub: 'Kivora Pay, Prowess Digital Solutions' },
  { num: '200+', label: 'Businesses & Individuals Trained', sub: 'through Prowess Digital Solutions' },
  { num: '5', label: 'Countries Worked Across', sub: 'Nigeria, Europe, the UK, Serbia, Brazil' },
  { num: '9+', label: 'Years Building & Writing', sub: 'since 2016' },
]

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  return (
    <section id="about" className="px-8 md:px-20 py-32 border-t border-ink-border">
      <div className="max-w-[1480px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-24 items-center">

          <Reveal delay={0.1}>
            <div className="relative w-full overflow-hidden border border-ink-border" style={{ aspectRatio: '4/5' }}>
              <Image
                src="/personal%20photo/headshot2.png"
                alt="Ngozi Peace Okafor"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="font-head text-[0.64rem] font-semibold tracking-[0.2em] uppercase text-primary block mb-6">
                About Me
              </span>
              <h2
                className="font-display font-extrabold leading-[1.08] mb-6"
                style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)' }}
              >
                I&apos;m Peace, a builder with a passion for <span className="text-primary">impact.</span>
              </h2>
              <p className="text-[1.02rem] text-muted leading-[1.9] max-w-xl">
                I found writing on a phone screen with no audience in 2016, taught myself to code at a
                cyber café, and spent nine years turning that into technical documentation, content
                strategy, and two ventures I founded and now run: Kivora Pay and Prowess Digital
                Solutions.
              </p>
            </Reveal>

            <div ref={statsRef} className="grid grid-cols-2 gap-6 mt-12 pt-10 border-t border-ink-border">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="border border-ink-border bg-surface p-6"
                >
                  <div className="font-display font-extrabold text-primary leading-none" style={{ fontSize: '2.4rem' }}>
                    {s.num}
                  </div>
                  <div className="font-head text-[0.78rem] font-bold text-parchment mt-3">{s.label}</div>
                  <div className="font-body text-[0.75rem] text-muted mt-1">{s.sub}</div>
                </motion.div>
              ))}
            </div>

            <Reveal delay={0.3}>
              <a
                href="/about"
                className="group inline-flex items-center gap-2 font-head text-[0.68rem] font-bold tracking-[0.14em] uppercase text-primary hover:text-parchment focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200 mt-8"
              >
                Read My Full Story
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
