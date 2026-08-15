'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const facts = [
  {
    label: 'Builder, not observer',
    body: 'Founded and shipped Kivora Pay and Prowess Digital Solutions instead of just writing about the industries they sit in.',
  },
  {
    label: 'Cross-border',
    body: 'Documented and written for teams across Nigeria, Europe, the UK, Serbia, and Brazil.',
  },
  {
    label: 'Technical-to-business',
    body: 'Written for engineers without losing the business or user context.',
  },
]

const proof = [
  { value: '200+', label: 'businesses and individuals trained' },
  { value: '6', label: 'years self-taught before full-time' },
  { value: '5', label: 'countries worked across' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen px-8 md:px-20 overflow-hidden border-b border-ink-border"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(20,32,31,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,32,31,0.05) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      <div className="max-w-[1480px] mx-auto w-full relative z-10 pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-start">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-head text-[0.72rem] font-medium tracking-[0.05em] text-muted mb-6"
            >
              Hi, I&apos;m Ngozi Peace Okafor.
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-extrabold text-parchment leading-[1.02] tracking-tight max-w-4xl"
                style={{ fontSize: 'clamp(2.6rem, 6.2vw, 4.6rem)' }}
              >
                I&apos;ve documented the systems.
                <br />
                I&apos;ve also <span className="text-primary">built inside them.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-2xl text-[1.05rem] md:text-[1.18rem] leading-[1.85] text-muted"
            >
              Nine years into this, I own the full range, from{' '}
              <strong className="text-parchment font-semibold">
                API documentation, content strategy, and Web3 education
              </strong>{' '}
              to the fintech product and consulting agency I built to prove I understand these
              systems, not just describe them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#work"
                className="inline-flex min-h-11 items-center justify-center font-display text-[0.9rem] font-bold bg-primary text-bg px-7 py-4 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                Explore My Work
              </a>
              <a
                href="/about"
                className="inline-flex min-h-11 items-center justify-center font-display text-[0.9rem] font-bold text-parchment border border-ink-border px-7 py-4 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                How I Got Here →
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-ink-border"
            >
              {facts.map((f) => (
                <div key={f.label}>
                  <p className="font-display font-bold text-[1rem] text-primary mb-2">{f.label}</p>
                  <p className="text-[0.88rem] text-muted leading-[1.7]">{f.body}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pb-3"
          >
            <div className="relative border border-ink-border bg-surface">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/personal%20photo/headshot1.png"
                  alt="Ngozi Peace Okafor"
                  fill
                  className="object-cover object-top grayscale-[15%]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority
                />
              </div>
              <div className="grid grid-cols-3 border-t border-ink-border">
                {proof.map((item) => (
                  <div key={item.label} className="p-5 border-r border-ink-border last:border-r-0">
                    <div className="font-display font-extrabold text-[1.8rem] leading-none text-parchment">{item.value}</div>
                    <div className="mt-3 font-head text-[0.58rem] font-semibold tracking-[0.06em] uppercase text-muted leading-relaxed">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
