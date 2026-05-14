'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const studies = [
  {
    name: 'Prospult',
    desc: 'Content strategy and copywriting for a B2B prospecting platform — positioning, messaging hierarchy, and conversion-focused web copy.',
    href: 'https://docs.google.com/document/d/1sV_J_iikUSUtBztg6H3dezYifhoyEXZaX8YDkxAPTPg/edit?usp=sharing',
    accent: '#2fd6c5',
  },
  {
    name: 'Three Movers',
    desc: 'SEO-driven editorial content and brand voice development for a relocation and moving services company.',
    href: 'https://docs.google.com/document/d/1oZSJHBPZ8JBrAYQ5kfU5XOZucHAbV1ORX1S27ZZVdkc/edit?usp=sharing',
    accent: '#a78bfa',
  },
  {
    name: 'Giftvant',
    desc: 'Go-to-market copy, onboarding content, and email sequences for a digital gifting and loyalty rewards platform.',
    href: 'https://docs.google.com/document/d/1L-47UUPHsd0reieSVOV2cex3_PV1Qh-XxuilbkIiwpA/edit?usp=sharing',
    accent: '#f5a623',
  },
  {
    name: 'UEEX',
    desc: 'Blog content, exchange education series, and technical explainers for a centralised crypto trading platform.',
    href: 'https://docs.google.com/document/d/1LwssJU3c6CfrqO2fW8Tvr1nm6OAYNLttNYa1Dgxnowc/edit?usp=sharing',
    accent: '#2fd6c5',
  },
  {
    name: 'Solevant',
    desc: 'Brand identity copy, product descriptions, and social media content strategy for a fashion-forward lifestyle brand.',
    href: 'https://docs.google.com/document/d/19BrIcrzEP3RWCV89YtYub1ogclLR_Or5UZCKGOLHgeM/edit?tab=t.0',
    accent: '#a78bfa',
  },
  {
    name: 'UPay',
    desc: 'Technical documentation, user onboarding flows, and educational content for a multi-currency payment solution.',
    href: 'https://docs.google.com/document/d/1HNnhHOL3BQYMgUe4RW-73Bm8Nfq7IOME2Ca7eWJ3WVU/edit?usp=sharing',
    accent: '#f5a623',
  },
]

export default function CaseStudies() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="case-studies" className="px-8 md:px-20 py-36 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Case Studies
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Proof in
              <br />
              <em className="italic gradient-text">the work</em>
            </h2>
          </div>
          <p className="text-[0.95rem] text-muted max-w-xs leading-[1.8] mb-1">
            Deep-dives into real projects — the brief, the approach, and the outcome.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {studies.map((s, i) => (
            <CaseCard key={s.name} study={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseCard({ study, index }: { study: (typeof studies)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      href={study.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col bg-surface border border-ink-border overflow-hidden hover:border-primary/30 transition-colors duration-300 cursor-pointer"
    >
      {/* Top accent */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${study.accent}, transparent)` }}
      />

      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${study.accent}10, transparent 60%)`,
        }}
      />

      <div className="p-8 flex flex-col gap-4 flex-1 relative z-10">
        {/* Number */}
        <span
          className="font-display italic text-[0.9rem] font-light"
          style={{ color: study.accent, opacity: 0.6 }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Name */}
        <h3 className="font-head font-bold text-xl text-parchment group-hover:text-primary transition-colors duration-200">
          {study.name}
        </h3>

        {/* Description */}
        <p className="text-[0.88rem] text-muted leading-[1.8] flex-1">{study.desc}</p>

        {/* CTA */}
        <div
          className="flex items-center gap-2 pt-2 mt-auto"
          style={{ color: study.accent }}
        >
          <span className="font-head text-[0.65rem] font-bold tracking-[0.1em] uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            View Case Study
          </span>
          <span className="text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
            ↗
          </span>
        </div>
      </div>

      {/* Bottom line sweep */}
      <div
        className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{ background: study.accent }}
      />
    </motion.a>
  )
}
