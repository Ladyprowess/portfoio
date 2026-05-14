'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const stats = [
  { num: '6+',  label: 'Years',    sub: 'of experience' },
  { num: '3',   label: 'Ventures', sub: 'active & growing' },
  { num: '10+', label: 'Brands',   sub: 'served globally' },
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
    <section id="about" className="px-8 md:px-20 py-36 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">

        {/* ── Section label ── */}
        <Reveal>
          <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary">
            About
          </span>
        </Reveal>

        {/* ── Pull quote - the real opener ── */}
        <Reveal delay={0.1} className="mt-8 mb-20">
          <blockquote
            className="font-display font-light italic leading-[1.1] max-w-5xl"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
          >
            &ldquo;I understand the difference between{' '}
            <span className="gradient-text not-italic font-semibold">
              writing for visibility
            </span>{' '}
            and{' '}
            <span className="gradient-text not-italic font-semibold">
              writing for action
            </span>
            - and I build content strategies around that distinction.&rdquo;
          </blockquote>
        </Reveal>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-14 lg:gap-24 items-start">

          {/* Portrait */}
          <Reveal delay={0.15}>
            <div className="relative">
              {/* Portrait */}
              <div className="relative w-full border border-ink-border overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] z-10"
                  style={{ background: 'linear-gradient(90deg, #2fd6c5, #a78bfa)' }}
                />
                <Image
                  src="/NST_2067.jpg"
                  alt="Ngozi Peace Okafor — Lady Prowess"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="font-head text-[0.56rem] tracking-[0.12em] uppercase text-parchment/80 bg-bg/60 backdrop-blur-sm px-2 py-1">
                    Ngozi Peace Okafor
                  </span>
                </div>
              </div>
              {/* Offset accent */}
              <div
                className="absolute -bottom-3 -right-3 w-full border border-primary/10 pointer-events-none"
                style={{ aspectRatio: '3/4' }}
              />
            </div>
          </Reveal>

          {/* Copy */}
          <div className="space-y-6">
            <Reveal delay={0.2}>
              <p className="font-display font-light text-[1.5rem] leading-[1.7] text-parchment/90">
                I am <span className="text-parchment font-normal">Ngozi Peace Okafor</span>, known
                professionally as Lady Prowess - a Lagos-based copywriter, technical writer, and Web3
                educator with a background that spans crypto content, business consulting, and product
                building.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="text-[0.98rem] text-muted leading-[1.95]">
                I also operate on the founder side. I built and launched{' '}
                <span className="text-parchment font-medium">Kivora Pay</span>, a crypto bill payment
                platform for Africa, and run{' '}
                <span className="text-parchment font-medium">Prowess Digital Solutions</span>, a
                business consulting firm serving African entrepreneurs across four service pillars.{' '}
                <span className="text-parchment font-medium">Dritchwear Collections</span>, my branded
                streetwear company, operates with its own mobile app.
              </p>
              <p className="text-[0.98rem] text-muted leading-[1.95] mt-4">
                If the work requires clear thinking and precise communication, I handle it.
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
                  <div className="font-display font-light gradient-text leading-none" style={{ fontSize: '2.4rem' }}>
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
