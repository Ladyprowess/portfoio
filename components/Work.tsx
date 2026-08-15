'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    num: '01',
    title: 'Kivora Pay',
    desc: 'Founded and launched a crypto bill payment platform for Africa, shaping the product narrative, wallet/payment flows, pitch materials, and launch content.',
    tag: 'Founder / Web3',
    href: 'https://kivorapay.com/',
    accent: '#507B80',
  },
  {
    num: '02',
    title: 'Prowess Digital Solutions',
    desc: 'Built a consulting brand with service architecture, training materials, automated outreach systems, a full website, and internal business tools.',
    tag: 'Consulting / Tech',
    href: 'https://www.prowessdigitalsolutions.com',
    accent: '#35555A',
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
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Founder Projects
            </span>
            <h2
              className="font-display font-extrabold leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Ventures I
              <br />
              <em className="not-italic text-primary">built from scratch.</em>
            </h2>
          </div>
          <p className="text-[0.98rem] text-muted max-w-md leading-[1.85] mb-1">
            These are businesses and products I founded, shaped, launched, and continue to build.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.num} project={p} index={i} />
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
      className="group relative bg-surface border border-ink-border overflow-hidden flex flex-col hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-300"
    >
      {/* Gradient header area */}
      <div className="relative h-36 flex items-end p-5 border-b border-ink-border">
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${project.accent}18, transparent 70%)`,
          }}
        />
        <div className="relative z-10 flex items-end justify-between w-full">
          <span
            className="font-display font-extrabold text-[4rem] leading-none"
            style={{ color: project.accent, opacity: 0.4 }}
          >
            {project.num}
          </span>
          <span
            className="font-head text-[0.58rem] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border text-parchment/70"
            style={{ borderColor: `${project.accent}40`, background: `${project.accent}12` }}
          >
            {project.tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col gap-3 flex-1">
        <h3 className="font-head font-bold text-xl text-parchment group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-[0.9rem] text-muted leading-[1.8] flex-1">{project.desc}</p>

        {/* Arrow indicator */}
        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="font-head text-[0.65rem] font-bold tracking-[0.1em] uppercase text-primary">
            Read more
          </span>
          <span className="text-primary text-sm">→</span>
        </div>
      </div>

      {/* Bottom accent line that grows on hover */}
      <div
        className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
      />
    </motion.a>
  )
}
