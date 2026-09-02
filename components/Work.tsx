'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const projects = [
  {
    title: 'Kivora Pay',
    category: 'Fintech / Web3 Product',
    desc: 'A crypto bill payment platform for Africa. I shaped the product narrative, payment flows, launch content, and investor-facing materials from zero.',
    outcome: 'Founder-led product, brand, and go-to-market system',
    tag: 'Founder',
    href: 'https://kivorapay.com/',
    logo: '/brands/kivorapay.png',
  },
  {
    title: 'Prowess Digital Solutions',
    category: 'Business & Digital Solutions',
    desc: 'A consulting and training brand helping businesses use content, automation, and digital systems with more confidence.',
    outcome: '200+ businesses and individuals trained',
    tag: 'Founder',
    href: 'https://www.prowessdigitalsolutions.com',
    logo: '/brands/pds.png',
  },
  {
    title: 'Dritchwear',
    category: 'Merch / Branded Items',
    desc: 'A streetwear and branded merchandise label with a live ordering platform for individual buyers, companies, and events.',
    outcome: 'Commerce brand built from identity to ordering flow',
    tag: 'Founder',
    href: 'https://app.dritchwear.com/shop',
    logo: '/brands/dritchwear.png',
  },
]

export default function Work() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="work" className="px-6 py-28 sm:px-8 md:px-20 md:py-32 border-t border-ink-border">
      <div className="max-w-[1480px] mx-auto">

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end"
        >
          <div>
            <span className="font-head text-[0.64rem] font-semibold tracking-[0.2em] uppercase text-primary block mb-4">
              Featured Work
            </span>
            <h2
              className="font-display font-extrabold leading-[1.08]"
              style={{ fontSize: 'clamp(2.35rem, 4.3vw, 3.6rem)' }}
            >
              The ventures say more than a job title can.
            </h2>
          </div>
          <p className="max-w-xl text-[1rem] leading-[1.85] text-muted lg:ml-auto">
            My portfolio is built around ownership: products I founded, systems I shipped, and the
            communication layer that helped people understand why they mattered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/work"
            className="inline-flex min-h-12 items-center justify-center border border-ink-border bg-surface px-7 py-4 font-display text-[0.9rem] font-bold text-parchment motion-safe:transition-colors motion-safe:duration-150 hover:border-primary/50 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            View Full Work Page
          </a>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      className="group grid min-h-[260px] grid-cols-1 overflow-hidden border border-ink-border bg-surface motion-safe:transition-colors motion-safe:duration-150 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg lg:grid-cols-[0.78fr_1.22fr]"
    >
      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden border-b border-ink-border bg-surface-2 p-10 lg:border-b-0 lg:border-r">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(80,123,128,0.18),transparent_58%)] opacity-80 motion-safe:transition-opacity motion-safe:duration-150 group-hover:opacity-100"
        />
        <Image
          src={project.logo}
          alt={`${project.title} logo`}
          width={260}
          height={120}
          className="relative z-10 max-h-24 w-auto max-w-[78%] object-contain"
        />
      </div>

      <div className="flex flex-col gap-5 p-7 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-head text-[0.6rem] font-bold uppercase tracking-[0.12em] text-primary">
            {project.tag}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted/40" aria-hidden />
          <span className="font-head text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted">
            {project.category}
          </span>
        </div>

        <h3 className="font-display text-3xl font-extrabold leading-tight text-parchment motion-safe:transition-colors motion-safe:duration-150 group-hover:text-primary md:text-4xl">
          {project.title}
        </h3>
        <p className="max-w-2xl text-[0.98rem] leading-[1.85] text-muted">{project.desc}</p>

        <div className="mt-auto border-t border-ink-border pt-5">
          <p className="font-head text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">
            {project.outcome}
          </p>
        </div>

        <div className="flex items-center gap-2 text-primary">
          <span className="font-head text-[0.65rem] font-bold uppercase tracking-[0.1em]">
            Explore the Project
          </span>
          <span className="text-sm motion-safe:transition-transform motion-safe:duration-150 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </motion.a>
  )
}
