'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    num: '01',
    title: 'Kivora Pay',
    desc: 'Founded and launched a crypto bill payment platform for Africa. Led product architecture, wallet infrastructure, payment integrations, and all go-to-market content including pitch decks and a 14-day social calendar.',
    tag: 'Founder / Web3',
    gradient: 'from-[#2fd6c5]/20 via-[#a78bfa]/10 to-transparent',
    accent: '#2fd6c5',
  },
  {
    num: '02',
    title: 'Prowess Digital Solutions',
    desc: 'Built five autonomous outreach scripts, three PDF training manuals, a full Next.js site with four service pillars, a team management dashboard, and a business planning calculator tool.',
    tag: 'Consulting / Tech',
    gradient: 'from-[#f5a623]/20 via-[#ff6b6b]/10 to-transparent',
    accent: '#f5a623',
  },
  {
    num: '03',
    title: 'Dritchwear Collections',
    desc: 'Full content calendar across three pillars, Canva campaign production, and mobile app in React Native with Supabase integration - real-time notifications and utility bill payments included.',
    tag: 'Brand / Tech',
    gradient: 'from-[#a78bfa]/20 via-[#2fd6c5]/10 to-transparent',
    accent: '#a78bfa',
  },
]

export default function Work() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="work" className="px-8 md:px-20 py-36 border-t border-ink-border">
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
              Selected Work
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Projects that
              <br />
              <em className="italic gradient-text">shipped and delivered</em>
            </h2>
          </div>
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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-surface border border-ink-border overflow-hidden flex flex-col cursor-default hover:border-primary/30 transition-colors duration-300"
    >
      {/* Gradient header area */}
      <div className={`relative h-36 bg-gradient-to-br ${project.gradient} flex items-end p-5`}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${project.accent}18, transparent 70%)`,
          }}
        />
        <div className="relative z-10 flex items-end justify-between w-full">
          <span
            className="font-display font-light italic text-[4rem] leading-none"
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
        <h3
          className="font-head font-bold text-xl text-parchment group-hover:text-primary transition-colors duration-200"
          style={{ color: '' }}
        >
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
    </motion.div>
  )
}
