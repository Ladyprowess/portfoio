'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const docs = [
  { label: 'Download CV',        href: 'https://drive.google.com/file/d/1qWDoVGKY3sps03fPbmNgCeR0FpPj7A0c/view?usp=sharing' },
  { label: 'Recommendation',     href: 'https://drive.google.com/file/d/1AtpOwk6TLtV6mj10E2GkU8Ohfa20Q8Bd/view?usp=sharing' },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="contact"
      ref={ref}
      className="relative px-8 md:px-20 py-40 border-t border-ink-border overflow-hidden"
    >
      {/* Centered ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          className="w-[900px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, rgba(47,214,197,0.06) 0%, rgba(167,139,250,0.04) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Two-column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left - headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-6">
              Contact
            </span>
            <h2
              className="font-display font-light leading-[0.96] mb-8"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 7rem)' }}
            >
              Let&apos;s work
              <br />
              <em className="italic text-parchment/70">together</em>
            </h2>
            <p className="text-[1rem] text-muted leading-[1.85] max-w-sm">
              Whether it&apos;s a launch campaign, technical documentation, or a full brand build -
              I bring the same level of craft to every project.
            </p>
          </motion.div>

          {/* Right - action */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Email */}
            <a
              href="mailto:hello@ladyprowess.com"
              className="group block"
            >
              <span className="font-head text-[0.6rem] font-bold tracking-[0.16em] uppercase text-muted block mb-2">
                Email
              </span>
              <span
                className="font-display italic text-parchment group-hover:gradient-text transition-all duration-300 block"
                style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)' }}
              >
                hello@ladyprowess.com
              </span>
              <span className="block h-px bg-ink-border mt-2 w-full group-hover:bg-primary/40 transition-colors duration-300" />
            </a>

            {/* Primary CTA */}
            <a
              href="mailto:hello@ladyprowess.com"
              className="group self-start inline-flex items-center gap-3 font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase bg-primary text-bg px-8 py-4 hover:bg-primary/85 transition-colors duration-200"
            >
              Get In Touch
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            {/* CV + Recommendation */}
            <div className="flex items-center gap-4 flex-wrap">
              {docs.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-head text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted border border-ink-border px-4 py-2 hover:border-primary/40 hover:text-parchment transition-all duration-200"
                >
                  {d.label}
                  <span className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">↗</span>
                </a>
              ))}
            </div>

            <p className="font-head text-[0.6rem] tracking-[0.12em] uppercase text-muted/60 pt-2">
              Remote engagements / Lagos based / cross-border projects
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
