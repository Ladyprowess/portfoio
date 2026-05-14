'use client'

import { motion } from 'framer-motion'

const roles = [
  'Copywriter',
  'Content Strategist',
  'Technical Writer',
  'Web3 Educator',
  'Business Consultant',
  'Founder',
]

const pill = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.9 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-8 md:px-20 overflow-hidden"
    >
      {/* ── Ambient orb (background visual) ── */}
      <div
        aria-hidden
        className="orb absolute pointer-events-none"
        style={{
          top: '-10%',
          right: '-5%',
          width: 700,
          height: 700,
          background:
            'radial-gradient(circle, rgba(47,214,197,0.09) 0%, rgba(167,139,250,0.06) 50%, transparent 70%)',
          filter: 'blur(1px)',
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: '10%',
          left: '-10%',
          width: 500,
          height: 500,
          background:
            'radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 65%)',
        }}
      />

      {/* ── Fine grid ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(47,214,197,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,214,197,0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="max-w-[1400px] mx-auto w-full relative z-10 pt-28 pb-20">

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-12 px-4 py-2 rounded-full border border-primary/20 bg-primary/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-head text-[0.65rem] font-bold tracking-[0.18em] uppercase text-primary">
            Lagos, Nigeria - Available Worldwide
          </span>
        </motion.div>

        {/* ── Name ── */}
        <div className="overflow-hidden mb-2">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-parchment leading-[0.88]"
            style={{ fontSize: 'clamp(5.5rem, 14vw, 13rem)' }}
          >
            Ngozi Peace
          </motion.div>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light italic leading-[0.88] gradient-text"
            style={{ fontSize: 'clamp(5.5rem, 14vw, 13rem)' }}
          >
            Okafor
          </motion.div>
        </div>

        {/* ── Role pills ── */}
        <div className="flex flex-wrap gap-2 mb-12">
          {roles.map((role, i) => (
            <motion.span
              key={role}
              custom={i}
              variants={pill}
              initial="hidden"
              animate="visible"
              className="inline-block font-head text-[0.68rem] font-bold tracking-[0.1em] uppercase px-4 py-2 rounded-full border border-ink-border bg-surface text-muted hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 cursor-default"
            >
              {role}
            </motion.span>
          ))}
        </div>

        {/* ── CTA row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.35 }}
          className="flex items-center gap-6"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-3 font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase bg-primary text-bg px-8 py-4 hover:bg-primary/90 transition-colors duration-200"
          >
            View Selected Work
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#about"
            className="font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase text-muted hover:text-parchment transition-colors duration-200"
          >
            About Me
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="absolute bottom-8 right-8 md:right-12 flex items-center gap-3"
      >
        <span className="font-head text-[0.58rem] tracking-[0.16em] uppercase text-muted">Scroll</span>
        <div className="w-8 h-px bg-primary/40" />
      </motion.div>
    </section>
  )
}
