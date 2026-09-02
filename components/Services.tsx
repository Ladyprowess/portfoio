'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    num: '01',
    name: 'Product & Technical Clarity',
    desc: 'API references, product guides, onboarding content, and technical explainers that help users understand complex systems quickly.',
    detail: 'For APIs, fintech tools, Web3 products, and teams with complex ideas.',
  },
  {
    num: '02',
    name: 'Launch Narratives',
    desc: 'Positioning, landing-page copy, campaigns, pitch materials, and content systems for teams bringing something new into the market.',
    detail: 'For founders who need the market to understand what they are building.',
  },
  {
    num: '03',
    name: 'Web3 & Fintech Education',
    desc: 'Blockchain explainers, crypto onboarding, and DeFi education built for real people, not only insiders who already speak the language.',
    detail: 'For education, community, content, and adoption-focused products.',
  },
  {
    num: '04',
    name: 'Founder Systems',
    desc: 'Hands-on support with business structure, service design, training, digital operations, and practical execution for growing ventures.',
    detail: 'For early teams turning scattered ideas into repeatable execution.',
  },
]

export default function Services() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="services" className="border-t border-ink-border bg-surface px-6 py-24 sm:px-8 md:px-20 md:py-28">
      <div className="max-w-[1480px] mx-auto">

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_0.85fr] lg:items-end"
        >
          <div>
            <span className="font-head text-[0.64rem] font-semibold tracking-[0.2em] uppercase text-primary block mb-5">
              What I Do
            </span>
            <h2
              className="max-w-3xl font-display text-4xl font-extrabold leading-[1.04] text-parchment md:text-5xl"
            >
              Clear thinking for products that need people to believe, understand, and act.
            </h2>
          </div>
          <p className="max-w-xl text-[1rem] leading-[1.85] text-muted lg:ml-auto">
            I am not only a writer, and not only a founder. The edge is the combination: strategy,
            product sense, technical understanding, and the patience to make things usable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
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
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      className="group relative min-h-[230px] overflow-hidden border border-ink-border bg-bg p-7 motion-safe:transition-[background-color,border-color,transform] motion-safe:duration-150 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-surface md:p-9"
    >
      <div className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-primary motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-y-100" />
      <div className="flex items-start gap-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink-border bg-surface font-head text-[0.68rem] font-bold text-primary">
          {service.num}
        </span>
        <div>
          <h3 className="max-w-md font-display text-2xl font-extrabold leading-tight text-parchment">
            {service.name}
          </h3>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.75] text-muted">{service.desc}</p>
          <p className="mt-6 border-t border-ink-border pt-4 font-head text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-primary-dim">
            {service.detail}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
