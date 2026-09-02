'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

export default function AboutHero() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative px-8 md:px-20 pt-40 pb-24 border-b border-ink-border overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(20,32,31,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,32,31,0.05) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-6">
              About
            </span>
            <h1
              className="font-display font-extrabold leading-[0.98] text-parchment"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.6rem)' }}
            >
              Ngozi Peace
              <br />
              <em className="not-italic text-primary">Okafor.</em>
            </h1>
            <p className="mt-8 font-head text-[0.72rem] font-bold tracking-[0.16em] uppercase text-muted">
              Copywriter / Technical Writer / Founder
            </p>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.9] text-muted">
              Nine years ago I was writing on a phone screen with no audience. Today I write for
              fintech and Web3 platforms across four continents, and I build the products I used to
              only write about.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/work"
                className="inline-flex min-h-11 items-center justify-center font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase bg-primary text-bg px-7 py-4 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                View My Work
              </a>
              <a
                href="https://drive.google.com/file/d/1qWDoVGKY3sps03fPbmNgCeR0FpPj7A0c/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase text-parchment border border-ink-border px-7 py-4 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                Download CV
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="border border-ink-border bg-surface p-4">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/personal%20photo/headshot3.png"
                  alt="Ngozi Peace Okafor"
                  fill
                  className="object-cover object-top grayscale-[15%]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority
                />
              </div>
              <p className="font-head text-[0.6rem] font-bold tracking-[0.16em] uppercase text-muted mt-4">
                Lagos, Nigeria / Remote engagements
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
