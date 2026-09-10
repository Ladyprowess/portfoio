'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const education = [
  { year: '2022', title: 'Open Source Contributor (Contract)', org: 'Jenkins' },
  { year: '2021', title: 'BSc, Home Economics', org: 'University of Uyo, Nigeria' },
]

const certifications = [
  { title: 'Developer Relations', org: 'DXMentorship' },
  { title: 'Attention to Detail', org: 'TestDome' },
  { title: 'Blockchain and Web3 Development', org: 'Women in Blockchain Africa' },
  { title: 'Open Source Contribution', org: 'She Code Africa' },
]

const expertise = [
  {
    num: '01',
    title: 'Technical Documentation',
    desc: 'Clear documentation for fintech and blockchain products, including API references, integration guides, system manuals, and technical whitepapers.',
  },
  {
    num: '02',
    title: 'Content Strategy & Copywriting',
    desc: 'Copy, editorial planning, SEO content, and messaging systems that keep brands clear and consistent.',
  },
  {
    num: '03',
    title: 'Web3 & Fintech Education',
    desc: 'Blockchain explainers, crypto guides, workshops, and learning experiences that make complex ideas easier to understand.',
  },
  {
    num: '04',
    title: 'Business and Product Strategy',
    desc: 'Practical support for founders, from shaping an offer and its message to planning the customer experience.',
  },
]

const toolGroups = [
  { title: 'Documentation', tools: ['API Documentation', 'User Guides', 'System Integration Manuals', 'Whitepapers'] },
  { title: 'Strategy & Growth', tools: ['SEO', 'Audience Analysis', 'Content Strategy', 'Community Management'] },
  { title: 'Workflow and Automation', tools: ['Jenkins', 'GitHub Actions', 'Editorial Calendars'] },
  { title: 'Craft', tools: ['Copywriting', 'Proofreading', 'Consistency Audits', 'Team Collaboration'] },
]

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutCredentials() {
  return (
    <>
      <section className="border-b border-ink-border bg-white px-6 py-20 sm:px-8 md:px-20 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="mb-10">
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Background
            </span>
            <h2
              className="font-display font-extrabold leading-[1.04]"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.6rem)' }}
            >
              Education and credentials.
            </h2>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-2">
          <Reveal delay={0.1} className="rounded-2xl border border-ink-border bg-bg p-6 md:p-8">
            <span className="mb-5 block font-head text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted">Education and experience</span>
            {education.map((e) => (
              <div
                key={e.title}
                className="flex flex-col gap-2 border-b border-ink-border py-5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="font-head text-[0.7rem] font-bold tracking-[0.1em] text-primary w-16 shrink-0">
                  {e.year}
                </span>
                <span className="font-head font-bold text-[1rem] text-parchment flex-1">{e.title}</span>
                <span className="font-body text-[0.85rem] text-muted">{e.org}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="rounded-2xl border border-ink-border bg-bg p-6 md:p-8">
            <span className="font-head text-[0.6rem] font-bold tracking-[0.14em] uppercase text-muted block mb-5">
              Certifications and training
            </span>
            <div className="flex flex-col gap-1">
              {certifications.map((c) => (
                <div
                  key={c.title}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8 py-4 border-b border-ink-border last:border-b-0"
                >
                  <span className="font-head font-bold text-[0.92rem] text-parchment flex-1">{c.title}</span>
                  <span className="font-body text-[0.82rem] text-muted">{c.org}</span>
                </div>
              ))}
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-ink-border bg-bg px-6 py-20 sm:px-8 md:px-20 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="mb-10">
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Areas of Expertise
            </span>
            <h2
              className="font-display font-extrabold leading-[1.04]"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.6rem)' }}
            >
              What I can help you do.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {expertise.map((item, i) => (
              <Reveal key={item.num} delay={i * 0.08} className="rounded-2xl border border-ink-border bg-white p-7 transition-shadow hover:shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
                <span className="font-display font-extrabold text-primary/60 text-[0.9rem]">{item.num}</span>
                <h3 className="font-head font-bold text-lg text-parchment mt-2 mb-3">{item.title}</h3>
                <p className="text-[0.9rem] text-muted leading-[1.85]">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 sm:px-8 md:px-20 md:py-24">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="mb-10">
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Tools &amp; Skills
            </span>
            <h2
              className="font-display font-extrabold leading-[1.04]"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.6rem)' }}
            >
              Skills I use in practice.
            </h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {toolGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 0.06}>
                <span className="font-head text-[0.6rem] font-bold tracking-[0.14em] uppercase text-muted block mb-4">
                  {group.title}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {group.tools.map((tool) => (
                    <span
                      key={tool}
                      className="font-head text-[0.68rem] font-bold tracking-[0.05em] text-parchment border border-ink-border px-4 py-2 hover:border-primary/40 transition-colors duration-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
