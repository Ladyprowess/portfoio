'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTABanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" ref={ref} className="bg-primary px-8 md:px-20 py-24 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1480px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8"
      >
        <div>
          <h2
            className="font-display font-extrabold text-dark leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}
          >
            Have a project in mind?
          </h2>
          <p className="mt-3 text-[1.05rem] text-dark/80 max-w-lg">
            Let&apos;s build something amazing together.
          </p>
        </div>
        <a
          href="mailto:hello@ladyprowess.com"
          className="group inline-flex shrink-0 min-h-12 items-center justify-center gap-3 font-display text-[0.95rem] font-bold bg-surface text-parchment px-8 py-4 hover:bg-bg focus-visible:ring-2 focus-visible:ring-parchment focus-visible:ring-offset-2 focus-visible:ring-offset-primary transition-colors duration-200"
        >
          Let&apos;s Work Together
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </motion.div>
    </section>
  )
}
