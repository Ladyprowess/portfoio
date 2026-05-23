'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const proof = [
  { value: '10+', label: 'brands served across sectors' },
  { value: '6+', label: 'years across content, Web3 and business' },
  { value: '3', label: 'ventures built from idea to market' },
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
            'linear-gradient(to right, rgba(240,236,227,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(240,236,227,0.035) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      <div className="max-w-[1480px] mx-auto w-full relative z-10 pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-head text-[0.68rem] font-bold tracking-[0.2em] uppercase text-primary mb-8"
            >
              Copywriter / technical writer / founder
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-light text-parchment leading-[0.9] max-w-6xl"
                style={{ fontSize: 'clamp(4.6rem, 11vw, 12rem)' }}
              >
                Ngozi Peace
                <br />
                <em className="italic text-parchment/72">Okafor</em>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 max-w-2xl text-[1.08rem] md:text-[1.22rem] leading-[1.9] text-muted"
            >
              I help ambitious technology, Web3, fintech, and founder-led brands turn complex ideas
              into content systems, documentation, campaigns, and market narratives people can trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#work"
                className="inline-flex min-h-11 items-center justify-center font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase bg-primary text-bg px-7 py-4 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                View My Work
              </a>
              <a
                href="mailto:hello@ladyprowess.com"
                className="inline-flex min-h-11 items-center justify-center font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase text-parchment border border-ink-border px-7 py-4 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                Start a Project
              </a>
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
                    <div className="font-display text-[2.2rem] leading-none text-parchment">{item.value}</div>
                    <div className="mt-3 font-head text-[0.58rem] font-bold tracking-[0.12em] uppercase text-muted leading-relaxed">
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
