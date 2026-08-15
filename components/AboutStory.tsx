'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const chapters = [
  {
    num: '01',
    title: 'The Origin',
    years: '2016 – 2022',
    accent: '#2fd6c5',
    paragraphs: [
      'I started writing on my phone in 2016 with no audience and no plan, just because I loved putting words together. To get through university, I wrote seminar papers and assignments for other students, then landed my first paid writing role in 2017: five blog posts a day, six days a week, for five thousand naira a month.',
      'I taught myself HTML, CSS, JavaScript, and PHP at a cyber café after school, freelanced wherever the payment platforms would let me, and kept writing through a pandemic, a business that collapsed, and years without steady income. In July 2022, that six-year stretch became my first full-time role, as a Technical Writer at WriteTech Hub.',
    ],
    stats: [{ value: '6 yrs', label: 'self-taught before my first full-time role' }],
    chips: ['WriteTech Hub'],
  },
  {
    num: '02',
    title: 'The Work',
    years: '2022 – 2025',
    accent: '#f5a623',
    paragraphs: [
      "Since then I've documented and written for fintech, blockchain, and cross-border payment products across five countries. At WriteTech Hub I managed a technical writing team and cut documentation turnaround time by 20%. At Cwallet, my blog posts, newsletters, and technical guides drove a 50% increase in user engagement.",
      'At Hawkish Group I built content strategy for client-facing business and technical documentation. At txFusion I documented complex cross-border payment APIs and automated content deployment with Jenkins and GitHub Actions, lifting developer satisfaction by 25% and cutting support queries by 15%. At Bullring Finance, a short content strategy sprint grew user engagement by 200%.',
    ],
    stats: [
      { value: '200%', label: 'engagement growth, Bullring Finance' },
      { value: '25%', label: 'developer satisfaction increase, txFusion' },
      { value: '20%', label: 'faster documentation turnaround, WriteTech Hub' },
    ],
    chips: ['WriteTech Hub', 'Cwallet', 'Hawkish Group', 'txFusion', 'Bullring Finance'],
  },
  {
    num: '03',
    title: 'The Founder',
    years: '2023 – Present',
    accent: '#a78bfa',
    paragraphs: [
      "In July 2023 I founded Prowess Digital Solutions, a remote consulting agency producing technical writing, content strategy, and digital marketing for fintech and emerging-market clients. I've since trained over 200 businesses and individuals across that work.",
      'I also built and launched Kivora Pay, a crypto bill payment platform for Africa, taking a product from idea to a live venture rather than just writing about one.',
    ],
    stats: [{ value: '200+', label: 'businesses and individuals trained' }],
    chips: ['Prowess Digital Solutions', 'Kivora Pay'],
  },
  {
    num: '04',
    title: 'The Community',
    years: '2022 – Present',
    accent: '#2fd6c5',
    paragraphs: [
      "Alongside client work, I contributed to Jenkins' open-source documentation, updating version-control guides and improving clarity across the project. I've since built on that through certifications in developer relations, blockchain and Web3 development, and open-source contribution, staying close to the communities that first showed me what was possible.",
    ],
    stats: [{ value: '4', label: 'certifications across dev relations, blockchain, and open source' }],
    chips: ['Jenkins', 'She Code Africa', 'Women in Blockchain Africa', 'DXMentorship'],
  },
]

export default function AboutStory() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section className="px-8 md:px-20 py-32 border-b border-ink-border">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
            The Story
          </span>
          <h2
            className="font-display font-extrabold leading-[1.04]"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
          >
            From a phone screen
            <br />
            <em className="not-italic text-primary">to a career.</em>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {chapters.map((chapter, i) => (
            <ChapterCard key={chapter.num} chapter={chapter} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ChapterCard({ chapter, index }: { chapter: (typeof chapters)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-surface border border-ink-border overflow-hidden"
    >
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${chapter.accent}, transparent)` }} />

      <div className="p-8 md:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
          <div className="flex items-baseline gap-4">
            <span
              className="font-display font-extrabold text-[1.1rem]"
              style={{ color: chapter.accent, opacity: 0.7 }}
            >
              {chapter.num}
            </span>
            <h3 className="font-head font-bold text-2xl text-parchment">{chapter.title}</h3>
          </div>
          <span className="font-head text-[0.62rem] font-bold tracking-[0.14em] uppercase text-muted">
            {chapter.years}
          </span>
        </div>

        <div className="flex flex-col gap-4 max-w-3xl">
          {chapter.paragraphs.map((p, i) => (
            <p key={i} className="text-[0.95rem] text-muted leading-[1.9]">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-ink-border flex flex-wrap gap-x-10 gap-y-4">
          {chapter.stats.map((s) => (
            <div key={s.label}>
              <div
                className="font-display font-extrabold leading-none"
                style={{ fontSize: '1.7rem', color: chapter.accent }}
              >
                {s.value}
              </div>
              <div className="font-body text-[0.75rem] text-muted mt-1 max-w-[180px]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {chapter.chips.map((chip) => (
            <span
              key={chip}
              className="font-head text-[0.6rem] font-bold tracking-[0.1em] uppercase text-muted border border-ink-border px-3 py-1.5"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
