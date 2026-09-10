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
  { number: '01', title: 'Documentation', description: 'I turn complex products and processes into information people can understand and use.', tools: ['API Documentation', 'User Guides', 'Integration Manuals', 'Whitepapers'] },
  { number: '02', title: 'Strategy and Growth', description: 'I connect audience needs, content, and distribution to help brands communicate with purpose.', tools: ['SEO', 'Audience Analysis', 'Content Strategy', 'Community Management'] },
  { number: '03', title: 'Workflow and Automation', description: 'I create practical systems that make publishing, collaboration, and delivery easier to manage.', tools: ['Jenkins', 'GitHub Actions', 'Editorial Calendars', 'AI Workflows'] },
  { number: '04', title: 'Writing and Quality', description: 'I shape the message, improve clarity, and keep the final work consistent across every channel.', tools: ['Copywriting', 'Proofreading', 'Consistency Audits', 'Team Collaboration'] },
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

      <section className="relative overflow-hidden bg-white px-6 py-20 sm:px-8 md:px-20 md:py-28">
        <div aria-hidden className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="relative mb-12 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div><span className="mb-4 block font-head text-[0.64rem] font-bold uppercase tracking-[0.2em] text-primary">Tools and skills</span><h2 className="font-display text-3xl font-extrabold leading-tight text-parchment md:text-4xl">How I approach the work.</h2></div>
            <p className="max-w-xl text-[0.94rem] leading-[1.8] text-muted md:justify-self-end">These skills do not sit separately. I combine them based on what a product, business, or audience needs.</p>
          </Reveal>

          <div className="relative grid gap-4 md:grid-cols-2">
            {toolGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 0.06} className="group rounded-2xl border border-ink-border bg-bg p-6 transition duration-300 hover:border-primary/30 hover:bg-white hover:shadow-[0_18px_50px_rgba(18,18,18,0.06)] md:p-7">
                <div className="flex items-start gap-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-head text-[0.65rem] font-bold text-primary">{group.number}</span><div><h3 className="font-display text-lg font-extrabold text-parchment">{group.title}</h3><p className="mt-2 text-[0.86rem] leading-6 text-muted">{group.description}</p></div></div>
                <div className="mt-6 grid grid-cols-1 gap-2 border-t border-ink-border pt-5 sm:grid-cols-2">
                  {group.tools.map((tool) => (
                    <span key={tool} className="flex items-center gap-2 text-[0.78rem] font-semibold text-parchment"><span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />{tool}</span>
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
