'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    num: '01',
    name: 'Technical & Product Documentation',
    desc: 'API references, product guides, and technical explainers that make complex systems easy to use and easy to adopt.',
  },
  {
    num: '02',
    name: 'Content Strategy & Copywriting',
    desc: 'Editorial calendars, brand voice, and conversion-focused copy across landing pages, campaigns, and long-form content.',
  },
  {
    num: '03',
    name: 'Web3 & Fintech Education',
    desc: 'Blockchain explainers, crypto onboarding, and DeFi content built for real audiences, not just people already in the space.',
  },
  {
    num: '04',
    name: 'Business & Founder Consulting',
    desc: 'Advisory, training, and hands-on venture building, from Prowess Digital Solutions to Kivora Pay.',
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
            <span className="font-head text-[0.64rem] font-semibold tracking-[0.2em] uppercase text-primary block mb-4">
              What I Do
            </span>
            <h2
              className="font-display font-extrabold leading-[1.08]"
              style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)' }}
            >
              How I can help bring
              <br />
              <span className="text-primary">your ideas to life.</span>
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-surface border border-ink-border p-8 md:p-10 overflow-hidden transition-colors duration-300 hover:border-primary/40"
    >
      <div className="absolute left-0 top-0 w-px bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out h-full" />
      <span className="font-display font-extrabold text-primary/60 text-[0.95rem] block mb-6">
        {service.num}
      </span>
      <h3 className="font-head font-bold text-parchment mb-4 tracking-wide text-lg">
        {service.name}
      </h3>
      <p className="text-[0.92rem] text-muted leading-[1.85]">{service.desc}</p>
    </motion.div>
  )
}
