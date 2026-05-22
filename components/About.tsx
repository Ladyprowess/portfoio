'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const stats = [
  { num: 'Web3',  label: 'Technical markets', sub: 'crypto, fintech, SaaS' },
  { num: 'Africa', label: 'Founder lens', sub: 'market insight, practical execution' },
  { num: 'Remote', label: 'Delivery', sub: 'cross-border and async' },
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

        {/* ── Section label ── */}
        <Reveal>
          <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary">
            About
          </span>
        </Reveal>

        {/* ── Pull quote - the real opener ── */}
        <Reveal delay={0.1} className="mt-8 mb-16">
          <blockquote
            className="font-display font-light leading-[1.1] max-w-6xl"
            style={{ fontSize: 'clamp(2.4rem, 5.2vw, 5.8rem)' }}
          >
            I operate where language, product, and trust meet.
          </blockquote>
        </Reveal>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-24 items-start">

          {/* Portrait */}
          <Reveal delay={0.15}>
            <div className="border border-ink-border bg-surface p-4">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '5/6' }}>
                <Image
                  src="/NST_2067.jpg"
                  alt="Ngozi Peace Okafor"
                  fill
                  className="object-cover object-top grayscale-[20%]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
              <p className="font-head text-[0.6rem] font-bold tracking-[0.16em] uppercase text-muted mt-4">
                Lagos, Nigeria / Remote engagements
              </p>
            </div>
          </Reveal>

          {/* Copy */}
          <div className="space-y-6">
            <Reveal delay={0.2}>
              <p className="font-display font-light text-[1.5rem] leading-[1.7] text-parchment/90">
                I am <span className="text-parchment font-normal">Ngozi Peace Okafor</span>, known
                professionally as Lady Prowess. I write for companies that need more than content volume:
                they need positioning, education, conversion, and credibility working together.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="text-[0.98rem] text-muted leading-[1.95]">
                My background spans copywriting, technical writing, Web3 education, business consulting,
                and product building. I have written for crypto, fintech, and technology brands while also
                operating on the founder side. I built and launched{' '}
                <span className="text-parchment font-medium">Kivora Pay</span>, a crypto bill payment
                platform for Africa, and run{' '}
                <span className="text-parchment font-medium">Prowess Digital Solutions</span>, a
                business consulting firm serving African entrepreneurs across multiple service pillars.{' '}
                <span className="text-parchment font-medium">Dritchwear Collections</span>, my branded
                streetwear company, operates with its own mobile app.
              </p>
              <p className="text-[0.98rem] text-muted leading-[1.95] mt-4">
                That founder lens matters. I understand what it means for writing to carry growth,
                onboarding, trust, and revenue pressure at the same time.
              </p>
            </Reveal>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-6 pt-8 border-t border-ink-border mt-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="font-display font-light text-parchment leading-none" style={{ fontSize: '2.2rem' }}>
                    {s.num}
                  </div>
                  <div className="font-head text-[0.7rem] font-bold tracking-[0.06em] text-parchment mt-1">
                    {s.label}
                  </div>
                  <div className="font-body text-[0.75rem] text-muted">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
