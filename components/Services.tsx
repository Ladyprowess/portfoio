'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    num: '01',
    name: 'Copywriting',
    desc: 'Web copy, landing pages, email campaigns, ad copy, and brand messaging. Written to move people toward a decision - not just to fill space.',
    featured: true,
    color: 'from-primary/10 to-transparent',
  },
  {
    num: '02',
    name: 'Content Strategy',
    desc: 'Multi-platform content calendars and long-form planning across LinkedIn, YouTube, Instagram, TikTok, X, and more.',
    featured: false,
    color: 'from-violet-500/8 to-transparent',
  },
  {
    num: '03',
    name: 'Technical Writing',
    desc: 'Product docs, API guides, onboarding materials, and technical explainers. Complex information made accessible.',
    featured: false,
    color: 'from-amber/8 to-transparent',
  },
  {
    num: '04',
    name: 'Web3 Education',
    desc: 'Blockchain explainers, crypto onboarding, DeFi guides, and educational series for real audiences - not just insiders.',
    featured: false,
    color: 'from-primary/8 to-transparent',
  },
  {
    num: '05',
    name: 'Business Consulting',
    desc: 'Advisory, pitch decks, business frameworks, and training materials for African entrepreneurs at every stage.',
    featured: false,
    color: 'from-rose-500/8 to-transparent',
  },
  {
    num: '06',
    name: 'Brand Founding',
    desc: 'From product concept to market presence - full infrastructure including content, design, legal docs, and GTM strategy.',
    featured: false,
    color: 'from-amber/8 to-transparent',
  },
]

export default function Services() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="services" className="px-8 md:px-20 py-36 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">

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
              Six disciplines.
              <br />
              <em className="italic gradient-text">One standard.</em>
            </h2>
          </div>
          <p className="text-[0.95rem] text-muted max-w-xs leading-[1.8] mb-1">
            From strategy to execution - every engagement is treated as if the brand is my own.
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
      className={`group relative bg-surface p-10 overflow-hidden cursor-default transition-colors duration-300 hover:bg-surface-2 ${
        service.featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Per-card gradient wash */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Large decorative number - top right */}
      <span
        aria-hidden
        className="absolute top-4 right-6 font-display font-light text-[5rem] leading-none text-parchment/[0.03] select-none pointer-events-none group-hover:text-parchment/[0.06] transition-colors duration-500"
      >
        {service.num}
      </span>

      {/* Left accent line */}
      <div className="absolute left-0 top-0 w-px bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" style={{ height: '100%' }} />

      <div className="relative z-10">
        <span className="font-display italic text-primary/50 text-[0.95rem] block mb-6">
          {service.num}
        </span>
        <h3 className={`font-head font-bold text-parchment mb-4 tracking-wide ${service.featured ? 'text-2xl' : 'text-lg'}`}>
          {service.name}
        </h3>
        <p className="text-[0.92rem] text-muted leading-[1.85]">{service.desc}</p>
      </div>
    </motion.div>
  )
}
