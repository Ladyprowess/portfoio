'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    num: '01',
    name: 'Market Narrative',
    desc: 'Positioning, messaging architecture, landing-page copy, sales pages, and campaign language for brands that need to explain why they matter.',
    featured: true,
  },
  {
    num: '02',
    name: 'Content Systems',
    desc: 'Editorial pillars, multi-platform calendars, founder-led content, social campaigns, and long-form strategy built around measurable business goals.',
    featured: false,
  },
  {
    num: '03',
    name: 'Technical Writing',
    desc: 'Product docs, API guides, onboarding flows, knowledge bases, and technical explainers that make complex products easier to adopt.',
    featured: false,
  },
  {
    num: '04',
    name: 'Web3 Education',
    desc: 'Crypto, DeFi, wallet, exchange, and blockchain education written for users who need clarity before they commit trust or capital.',
    featured: false,
  },
  {
    num: '05',
    name: 'Founder Collateral',
    desc: 'Pitch decks, launch plans, training manuals, service frameworks, and business materials that help teams communicate and execute.',
    featured: false,
  },
  {
    num: '06',
    name: 'Go-to-Market Support',
    desc: 'Product launches, offer refinement, conversion journeys, email sequences, and GTM content for founder-led companies.',
    featured: false,
  },
]

export default function Services() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="services" className="px-8 md:px-20 py-32 border-t border-ink-border">
      <div className="max-w-[1480px] mx-auto">

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              What I Do
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Strategic writing
              <br />
              <em className="italic text-parchment/70">for serious brands.</em>
            </h2>
          </div>
          <p className="text-[0.98rem] text-muted max-w-md leading-[1.85] mb-1">
            I am strongest where the subject is technical, the audience is discerning, and the business needs words that carry commercial weight.
          </p>
        </motion.div>

        {/* Bento grid: first card spans 2 cols on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-border border border-ink-border">
          {services.map((s, i) => (
            <ServiceCard key={s.num} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative bg-surface p-8 md:p-10 overflow-hidden cursor-default transition-colors duration-300 hover:bg-surface-2 ${
        service.featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Large decorative number - top right */}
      <span
        aria-hidden
        className="absolute top-4 right-6 font-display font-light text-[5rem] leading-none text-parchment/[0.03] select-none pointer-events-none group-hover:text-parchment/[0.06] transition-colors duration-500"
      >
        {service.num}
      </span>

      <div className="absolute left-0 top-0 w-px bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" style={{ height: '100%' }} />

      <div className="relative z-10">
        <span className="font-display italic text-primary/50 text-[0.95rem] block mb-6">
          {service.num}
        </span>
        <h3 className={`font-head font-bold text-parchment mb-4 tracking-wide ${service.featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          {service.name}
        </h3>
        <p className="text-[0.92rem] text-muted leading-[1.85]">{service.desc}</p>
      </div>
    </motion.div>
  )
}
