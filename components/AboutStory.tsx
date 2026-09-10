'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const journey = [
  { period: '2016 to 2022', title: 'I started with writing', copy: 'I began writing on my phone in 2016. I wrote seminar papers and assignments while at university, then took my first paid writing role in 2017. Alongside writing, I taught myself HTML, CSS, JavaScript, and PHP at a cyber café. In 2022, I joined WriteTech Hub as a Technical Writer.', tags: ['Writing', 'Web skills', 'WriteTech Hub'] },
  { period: '2022 to 2025', title: 'The work became global', copy: 'I created content and documentation for fintech, blockchain, and payment companies across different countries. My work has covered product education, API documentation, content strategy, copywriting, editorial operations, and developer guides.', tags: ['Fintech', 'Web3', 'Documentation'] },
  { period: '2023 to present', title: 'I started building businesses', copy: 'I founded Prowess Digital Solutions to help businesses communicate clearly and use digital tools well. I also built KivoraPay and Dritchwear. This gave me direct experience with product decisions, customer needs, marketing, operations, and growth.', tags: ['Prowess Digital Solutions', 'KivoraPay', 'Dritchwear'] },
  { period: 'Today', title: 'Everything now works together', copy: 'Today, I combine strategy, writing, WordPress design, education, AI, and business experience. I can understand an idea, shape the message, create the experience, and help people understand why it matters.', tags: ['Strategy', 'Design', 'Education'] },
]

function JourneyCard({ item, index }: { item: (typeof journey)[number]; index: number }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.article ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: index * 0.06 }} className="grid gap-5 border-t border-ink-border py-8 md:grid-cols-[190px_1fr] md:gap-10">
      <div><span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.15em] text-primary">{String(index + 1).padStart(2, '0')}</span><p className="mt-2 text-sm font-semibold text-muted">{item.period}</p></div>
      <div><h3 className="font-display text-xl font-extrabold text-parchment md:text-2xl">{item.title}</h3><p className="mt-4 max-w-3xl text-[0.94rem] leading-[1.85] text-muted">{item.copy}</p><div className="mt-5 flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="rounded-full border border-ink-border bg-white px-3 py-1.5 text-[0.68rem] font-semibold text-muted">{tag}</span>)}</div></div>
    </motion.article>
  )
}

export default function AboutStory() {
  return (
    <>
    <section className="border-b border-ink-border bg-white px-6 py-20 sm:px-8 md:px-20 md:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[0.55fr_1.45fr] md:gap-16">
        <div><span className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">My biography</span><h2 className="mt-4 max-w-sm font-display text-3xl font-extrabold leading-tight text-parchment md:text-4xl">Technology, content, and digital products.</h2></div>
        <div className="max-w-3xl space-y-5 text-base leading-8 text-muted">
          <p>Ngozi Peace Okafor is a Digital Product and Content Specialist with experience across technical writing, WordPress design, Web3, fintech, product communication, and content strategy.</p>
          <p>She works at the intersection of technology, content, and digital products, helping businesses turn complex ideas and systems into clear, functional experiences for their users. Her work ranges from designing and managing WordPress websites to creating technical documentation, developing content strategies, communicating fintech and Web3 products, and building digital solutions that support business operations.</p>
          <p>She has worked with companies across payments, blockchain, financial technology, and digital products, collaborating with product, engineering, marketing, and business teams. Her experience includes API and developer documentation, cross border payment systems, SEO, user education, website development, product messaging, and digital product implementation.</p>
          <p>Ngozi has also founded multiple products, where she works with businesses and individuals on digital strategy, content, and technology. Her approach is simple: understand the product, understand the user, and build or communicate the solution in a way that actually makes sense.</p>
        </div>
      </div>
    </section>
    <section className="border-b border-ink-border bg-bg px-6 py-20 sm:px-8 md:px-20 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-12 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div><span className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">My journey</span><h2 className="mt-4 max-w-md font-display text-3xl font-extrabold leading-tight text-parchment md:text-4xl">How the different parts of my work came together.</h2></div>
          <p className="max-w-xl text-[0.95rem] leading-[1.8] text-muted md:justify-self-end">My career did not follow one narrow path. Writing led me into technology. Technology led me into product work. Building products taught me more about business, customers, and communication.</p>
        </div>
        <div>{journey.map((item, index) => <JourneyCard key={item.title} item={item} index={index} />)}</div>
      </div>
    </section>
    </>
  )
}
