'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    title: 'Kivora Pay',
    category: 'Fintech / Web3 Product',
    desc: 'Founded and launched a crypto bill payment platform for Africa. Shaped the product narrative, wallet and payment flows, pitch materials, and launch content from zero.',
    tag: 'Founder',
    href: 'https://kivorapay.com/',
    accent: '#507B80',
  },
  {
    title: 'Prowess Digital Solutions',
    category: 'Business & Digital Solutions',
    desc: 'Built a consulting brand with a full service architecture, training materials, automated outreach systems, a website, and internal business tools. Has trained 200+ businesses and individuals.',
    tag: 'Founder',
    href: 'https://www.prowessdigitalsolutions.com',
    accent: '#35555A',
  },
  {
    title: 'Dritchwear',
    category: 'Merch / Branded Items',
    desc: 'Founded a streetwear and branded merchandise label selling premium apparel direct to customers, plus a live ordering platform that handles bulk merch for companies and events.',
    tag: 'Founder',
    href: 'https://app.dritchwear.com/shop',
    accent: '#507B80',
  },
]

export default function Work() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="work" className="px-8 md:px-20 py-32 border-t border-ink-border">
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
              Featured Work
            </span>
            <h2
              className="font-display font-extrabold leading-[1.08]"
              style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)' }}
            >
              Products and brands
              <br />
              <span className="text-primary">I&apos;m proud of.</span>
            </h2>
          </div>
          <p className="text-[0.98rem] text-muted max-w-md leading-[1.85] mb-1">
            Three ventures I founded, shaped, launched, and continue to build, told as case studies rather
            than a résumé line.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
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
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-surface border border-ink-border overflow-hidden flex flex-col hover:border-primary/40 transition-colors duration-300"
    >
      <div className="relative h-56 flex items-center justify-center border-b border-ink-border overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500 opacity-70 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${project.accent}30, transparent 70%)`,
          }}
        />
        <span
          className="relative z-10 font-display font-extrabold text-[5.5rem] leading-none select-none"
          style={{ color: project.accent, opacity: 0.5 }}
        >
          {project.title.charAt(0)}
        </span>
      </div>

      <div className="p-8 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-muted">
            {project.category}
          </span>
          <span
            className="font-head text-[0.58rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full border"
            style={{ borderColor: `${project.accent}50`, background: `${project.accent}14`, color: project.accent }}
          >
            {project.tag}
          </span>
        </div>

        <h3 className="font-display font-extrabold text-2xl text-parchment group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-[0.92rem] text-muted leading-[1.8] flex-1">{project.desc}</p>

        <div className="flex items-center gap-2 mt-2 text-primary">
          <span className="font-head text-[0.65rem] font-bold tracking-[0.1em] uppercase">
            Explore the Project
          </span>
          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.a>
  )
}
