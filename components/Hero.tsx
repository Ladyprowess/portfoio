'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen px-8 md:px-20 overflow-hidden bg-dark border-b border-dark-border"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 900px 600px at 80% 10%, rgba(80,123,128,0.20), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(242,241,237,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,241,237,0.04) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      <div className="max-w-[1480px] mx-auto w-full relative z-10 pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-stretch">
          <div className="flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-head text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-primary mb-8"
            >
              Founder. Builder. Problem Solver.
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-extrabold text-dark-ink leading-[1.05] max-w-3xl"
                style={{ fontSize: 'clamp(2.6rem, 5.4vw, 4.4rem)' }}
              >
                I build digital products and brands that solve real problems and create{' '}
                <span className="text-primary">impact.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-xl text-[1.05rem] md:text-[1.15rem] leading-[1.8] text-dark-muted"
            >
              Founder of{' '}
              <span className="text-dark-ink font-medium">Prowess Digital Solutions</span>,{' '}
              <span className="text-dark-ink font-medium">Kivora Pay</span>, and{' '}
              <span className="text-dark-ink font-medium">Dritchwear</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#work"
                className="inline-flex min-h-11 items-center justify-center font-display text-[0.9rem] font-bold bg-primary text-dark px-7 py-4 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark transition-colors duration-200"
              >
                View My Work →
              </a>
              <a
                href="https://drive.google.com/file/d/1qWDoVGKY3sps03fPbmNgCeR0FpPj7A0c/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center font-display text-[0.9rem] font-bold text-dark-ink border border-dark-border px-7 py-4 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark transition-colors duration-200"
              >
                Download Resume ↓
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[420px] lg:min-h-0"
          >
            <div className="absolute inset-0 border border-dark-border bg-dark-surface overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(10,12,13,0.85) 100%)' }}
              />
              <Image
                src="/personal%20photo/headshot1.png"
                alt="Ngozi Peace Okafor"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 560px"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
