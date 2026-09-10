'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

export default function AboutHero() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative overflow-hidden border-b border-ink-border bg-white px-6 pb-20 pt-32 sm:px-8 md:px-20 md:pb-24 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(37,99,235,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.045) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1320px]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="mb-5 block font-head text-[0.64rem] font-bold uppercase tracking-[0.2em] text-primary">About me</span>
            <h1
              className="max-w-2xl font-display font-extrabold leading-[1.08] text-parchment"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.45rem)' }}
            >
              I build, explain, and grow digital ideas.
            </h1>
            <p className="mt-6 max-w-2xl text-[1rem] leading-[1.85] text-muted md:text-[1.06rem]">
              I am Ngozi Peace Okafor, also known as Lady Prowess. I work across product marketing,
              WordPress design, technical writing, copywriting, business education, and practical AI.
              My role changes with the problem, but the goal stays the same: make useful ideas clear,
              credible, and ready to work.
            </p>

            <div className="mt-8 grid max-w-2xl grid-cols-3 border-y border-ink-border py-5">
              {[['9+', 'Years of experience'], ['200+', 'People trained'], ['3', 'Ventures built']].map(([value, label]) => (
                <div key={label} className="border-r border-ink-border px-3 first:pl-0 last:border-r-0 sm:px-5">
                  <p className="font-display text-xl font-extrabold text-primary sm:text-2xl">{value}</p>
                  <p className="mt-1 text-[0.68rem] leading-5 text-muted sm:text-xs">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/services"
                className="inline-flex min-h-11 items-center justify-center bg-primary px-7 py-3.5 font-display text-sm font-bold text-white transition-colors hover:bg-primary-dim focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                View my work
              </a>
              <a
                href="https://drive.google.com/file/d/1VhYNSzSsOgS_nyyNS0fbmquKZxPCkPde/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center border border-ink-border bg-white px-7 py-3.5 font-display text-sm font-bold text-parchment transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                View resume
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-[540px]">
              <div className="absolute -bottom-5 -left-5 h-32 w-32 bg-blue-100" aria-hidden />
              <div className="relative overflow-hidden border border-ink-border bg-surface p-3 shadow-[0_24px_70px_rgba(18,18,18,0.09)] sm:p-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2 sm:aspect-[5/4]">
                <Image
                  src="/personal%20photo/headshot3.png"
                  alt="Ngozi Peace Okafor"
                  fill
                  className="object-cover object-[center_18%]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority
                />
              </div>
              <div className="flex items-center justify-between gap-4 pt-4">
                <div><p className="font-display text-sm font-bold text-parchment">Ngozi Peace Okafor</p><p className="mt-1 text-xs text-muted">Founder and multidisciplinary digital professional</p></div>
                <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-[0.65rem] font-semibold text-primary sm:block">Lagos, Nigeria</span>
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
