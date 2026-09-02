'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    num: '01',
    name: 'Product & Technical Clarity',
    desc: 'API references, product guides, onboarding content, and technical explainers that help users understand complex systems quickly.',
  },
  {
    num: '02',
    name: 'Launch Narratives',
    desc: 'Positioning, landing-page copy, campaigns, pitch materials, and content systems for teams bringing something new into the market.',
  },
  {
    num: '03',
    name: 'Web3 & Fintech Education',
    desc: 'Blockchain explainers, crypto onboarding, and DeFi education built for real people, not only insiders who already speak the language.',
  },
  {
    num: '04',
    name: 'Founder Systems',
    desc: 'Hands-on support with business structure, service design, training, digital operations, and practical execution for growing ventures.',
  },
]

export default function Services() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="services" className="px-6 py-28 sm:px-8 md:px-20 md:py-32 border-t border-ink-border">
      <div className="max-w-[1480px] mx-auto">

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end"
        >
          <div>
            <span className="font-head text-[0.64rem] font-semibold tracking-[0.2em] uppercase text-primary block mb-4">
              What I Do
            </span>
            <h2
              className="font-display font-extrabold leading-[1.08]"
              style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)' }}
            >
              I work best where the idea is ambitious and the message needs discipline.
            </h2>
          </div>
          <p className="max-w-xl text-[1rem] leading-[1.85] text-muted lg:ml-auto">
            I am not only a writer, and not only a founder. The edge is the combination: strategy,
            product sense, technical understanding, and the patience to make things usable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 border-l border-t border-ink-border md:grid-cols-2">
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
      className="group relative min-h-[250px] overflow-hidden border-b border-r border-ink-border bg-surface p-7 motion-safe:transition-colors motion-safe:duration-150 hover:bg-surface-2 md:p-10"
    >
      <div className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-primary motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-y-100" />
      <span className="font-display font-extrabold text-primary/60 text-[0.95rem] block mb-6">
        {service.num}
      </span>
      <h3 className="mb-4 max-w-md font-display text-2xl font-extrabold leading-tight text-parchment">
        {service.name}
      </h3>
      <p className="max-w-lg text-[0.95rem] leading-[1.85] text-muted">{service.desc}</p>
    </motion.div>
  )
}
