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
    title: 'API & Technical Documentation',
    desc: 'End-to-end documentation for fintech and blockchain products: API references, integration guides, system manuals, and technical whitepapers.',
  },
  {
    num: '02',
    title: 'Content Strategy & Copywriting',
    desc: 'Editorial calendars, SEO-led copy, and consistency audits that keep brand voice aligned across every channel.',
  },
  {
    num: '03',
    title: 'Web3 & Fintech Education',
    desc: 'Blockchain explainers, crypto onboarding guides, and DeFi content that make complex financial products make sense to real audiences.',
  },
  {
    num: '04',
    title: 'Founder & Business Consulting',
    desc: 'Advisory, training, and hands-on venture building, from Prowess Digital Solutions to Kivora Pay.',
  },
]

const toolGroups = [
  { title: 'Documentation', tools: ['API Documentation', 'User Guides', 'System Integration Manuals', 'Whitepapers'] },
  { title: 'Strategy & Growth', tools: ['SEO', 'Audience Analysis', 'Content Strategy', 'Community Management'] },
  { title: 'Workflow & Automation', tools: ['Jenkins', 'GitHub Actions', 'Editorial Calendars'] },
  { title: 'Craft', tools: ['Copywriting', 'Proofreading', 'Consistency Audits', 'Cross-functional Collaboration'] },
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
      {/* Education & Recognition */}
      <section className="px-8 md:px-20 py-32 border-b border-ink-border">
        <div className="max-w-[1100px] mx-auto">
          <Reveal className="mb-14">
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Education &amp; Recognition
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)' }}
            >
              Where the foundation
              <br />
              <em className="italic text-parchment/70">was built.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="border-t border-ink-border">
            {education.map((e) => (
              <div
                key={e.title}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 py-6 border-b border-ink-border"
              >
                <span className="font-head text-[0.7rem] font-bold tracking-[0.1em] text-primary w-16 shrink-0">
                  {e.year}
                </span>
                <span className="font-head font-bold text-[1rem] text-parchment flex-1">{e.title}</span>
                <span className="font-body text-[0.85rem] text-muted">{e.org}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <span className="font-head text-[0.6rem] font-bold tracking-[0.14em] uppercase text-muted block mb-5">
              Certifications
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
      </section>

      {/* Areas of Expertise */}
      <section className="px-8 md:px-20 py-32 border-b border-ink-border">
        <div className="max-w-[1100px] mx-auto">
          <Reveal className="mb-14">
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Areas of Expertise
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)' }}
            >
              Where I bring
              <br />
              <em className="italic text-parchment/70">the most value.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {expertise.map((item, i) => (
              <Reveal key={item.num} delay={i * 0.08} className="bg-surface border border-ink-border p-8">
                <span className="font-display italic font-light text-primary/60 text-[0.9rem]">{item.num}</span>
                <h3 className="font-head font-bold text-lg text-parchment mt-2 mb-3">{item.title}</h3>
                <p className="text-[0.9rem] text-muted leading-[1.85]">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Skills */}
      <section className="px-8 md:px-20 py-32">
        <div className="max-w-[1100px] mx-auto">
          <Reveal className="mb-14">
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Tools &amp; Skills
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)' }}
            >
              What I work
              <br />
              <em className="italic text-parchment/70">with day to day.</em>
            </h2>
          </Reveal>

          <div className="flex flex-col gap-10">
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
