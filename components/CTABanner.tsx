'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTABanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" ref={ref} className="bg-bg px-6 py-16 sm:px-8 md:px-20 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-[1240px] flex-col gap-8 rounded-3xl bg-parchment p-8 text-white md:flex-row md:items-center md:justify-between md:p-12"
      >
        <div>
          <h2
            className="font-display font-semibold leading-[1.1] text-white"
            style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)' }}
          >
            Have a project in mind?
          </h2>
          <p className="mt-3 max-w-lg text-[0.95rem] text-white/65">
            Tell me what you are building and where you need clarity.
          </p>
        </div>
        <a
          href="mailto:hello@ladyprowess.com"
          className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-[0.85rem] font-semibold text-parchment transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-primary"
        >
          Let&apos;s Work Together
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </motion.div>
    </section>
  )
}
