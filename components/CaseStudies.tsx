'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const studies = [
  {
    name: 'Prospult',
    desc: 'A written brand case study for a B2B prospecting platform, focused on positioning, messaging clarity, and product value.',
    href: 'https://docs.google.com/document/d/1sV_J_iikUSUtBztg6H3dezYifhoyEXZaX8YDkxAPTPg/edit?usp=sharing',
    image: '/service-proof/brand-case-prospult.jpg',
    accent: '#507B80',
  },
  {
    name: 'Three Movers',
    desc: 'A written case study for a relocation and moving services brand, shaped for clarity, search relevance, and reader confidence.',
    href: 'https://docs.google.com/document/d/1oZSJHBPZ8JBrAYQ5kfU5XOZucHAbV1ORX1S27ZZVdkc/edit?usp=sharing',
    image: '/service-proof/brand-case-three-movers.jpg',
    accent: '#35555A',
  },
  {
    name: 'Giftvant',
    desc: 'A written case study for a digital gifting and loyalty rewards platform, translating product use cases into a clear brand story.',
    href: 'https://docs.google.com/document/d/1L-47UUPHsd0reieSVOV2cex3_PV1Qh-XxuilbkIiwpA/edit?usp=sharing',
    image: '/service-proof/brand-case-giftvant.jpg',
    accent: '#507B80',
  },
  {
    name: 'UEEX',
    desc: 'A written case study for a centralised crypto trading platform, covering exchange education and technical product communication.',
    href: 'https://docs.google.com/document/d/1LwssJU3c6CfrqO2fW8Tvr1nm6OAYNLttNYa1Dgxnowc/edit?usp=sharing',
    image: '/service-proof/brand-case-ueex.jpg',
    accent: '#507B80',
  },
  {
    name: 'Solevant',
    desc: 'A written case study for a lifestyle brand, focused on brand identity, product language, and storytelling for its audience.',
    href: 'https://docs.google.com/document/d/19BrIcrzEP3RWCV89YtYub1ogclLR_Or5UZCKGOLHgeM/edit?tab=t.0',
    image: '/service-proof/brand-case-solevant.jpg',
    accent: '#35555A',
  },
  {
    name: 'UPay',
    desc: 'A written case study for a multi-currency payment solution, explaining product value, onboarding, and user education.',
    href: 'https://docs.google.com/document/d/1HNnhHOL3BQYMgUe4RW-73Bm8Nfq7IOME2Ca7eWJ3WVU/edit?usp=sharing',
    image: '/service-proof/brand-case-upay.jpg',
    accent: '#507B80',
  },
]

export default function CaseStudies() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="case-studies" className="border-t border-ink-border bg-bg px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1240px]">

        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Case Studies
            </span>
            <h2
              className="font-display font-extrabold leading-[1.04]"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.9rem)' }}
            >
              Case studies I wrote for companies.
            </h2>
          </div>
          <p className="mb-1 max-w-md text-sm leading-6 text-muted">
            I wrote these case studies for companies across technology, crypto, payments, lifestyle, and professional services. Each preview opens the original document I delivered as a writer.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink-border bg-white transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_45px_rgba(17,24,39,.08)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <Image src={study.image} alt={`Preview of the ${study.name} case study`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.025]" />
      </div>

      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${study.accent}10, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
        {/* Number */}
        <span
          className="font-head text-[10px] font-semibold uppercase tracking-[.14em]"
          style={{ color: study.accent, opacity: 0.6 }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Name */}
        <h3 className="font-display text-lg font-semibold text-parchment transition-colors duration-200 group-hover:text-primary">
          {study.name}
        </h3>

        {/* Description */}
        <p className="flex-1 text-sm leading-6 text-muted">{study.desc}</p>

        {/* CTA */}
        <div
          className="flex items-center gap-2 pt-2 mt-auto"
          style={{ color: study.accent }}
        >
          <span className="font-head text-[0.65rem] font-bold tracking-[0.1em] uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            Read Writing Sample
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
