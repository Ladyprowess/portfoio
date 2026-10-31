'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ventures } from '@/lib/ventures'
import { films } from './scenes'
import { DECK, MEETING, Reveal, partner, toneVars, useMotionPreference } from './kit'

export const investmentStories: Record<string, { category: string; customer: string; revenue: string; support: string; work: string; outcome: string; question: string }> = {
  kivorapay: { category: 'Payments & commerce', customer: 'Crypto earners, freelancers and merchants', revenue: 'Payment fees and merchant plans', support: 'Capital + payment partners', work: 'Strengthen payments, compliance and merchant tools', outcome: 'Make everyday crypto spending more dependable', question: 'Payment volume, repeat usage, transaction margins and operational readiness' },
  'prowess-digital-solutions': { category: 'Business & career support', customer: 'Entrepreneurs, job seekers and learners', revenue: 'Digital products, training and business services', support: 'Sponsors + distribution partners', work: 'Expand practical tools, learning and business support', outcome: 'Help more people turn a goal into a practical next step', question: 'Paid service demand, learning participation and programme outcomes' },
  dritchwear: { category: 'Branded merchandise', customer: 'Companies, events, communities and creators', revenue: 'Custom orders, corporate gifts and apparel sales', support: 'Production funding + buyer introductions', work: 'Build production capacity and improve fulfilment', outcome: 'Serve more teams with consistent, repeatable orders', question: 'Order margins, production capacity, delivery performance and reorders' },
}

const button = 'inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-bold transition-colors'

export function InvestorIntro() {
  return (
    <section className="border-b border-ink-border bg-surface px-6 pb-12 pt-32 sm:px-8 md:px-16 md:pt-40">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ink-border pb-5 text-xs">
          <p className="font-head font-bold uppercase tracking-[0.18em]">The venture portfolio <span className="mx-3 text-muted">/</span> Ngozi Peace Okafor</p>
          <a href="#invest" className="flex min-h-10 items-center gap-2 font-semibold text-primary"><span className="h-2 w-2 rounded-full bg-primary" />KivoraPay · Seed round open ↗</a>
        </div>
        <div className="grid gap-12 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Three businesses. Practical problems. Room to grow.</p>
            <h1 className="mt-6 font-display text-[clamp(3rem,6.4vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">Built from life.<br /><span className="text-primary">Ready for<br className="hidden lg:block" /> what’s next.</span></h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-muted">Making crypto useful. Helping people build businesses and careers. Bringing brands into the real world. Explore what I’m building-and where your support can make a difference.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#films" className={`${button} bg-primary text-on-primary hover:bg-primary-dim`}>See the ventures <span aria-hidden>↓</span></a><a href={MEETING} className={`${button} border border-ink-border hover:bg-bg`}>Let’s talk <span aria-hidden>↗</span></a></div>
            <div className="mt-10 flex items-center gap-4 border-t border-ink-border pt-6"><Image src="/personal%20photo/headshot2.png" alt="Ngozi Peace Okafor" width={52} height={52} className="h-14 w-14 rounded-full object-cover object-top" /><p className="text-sm"><b className="block">Ngozi Peace Okafor</b><span className="mt-1 block text-muted">Founder · 9+ years writing, marketing and building</span></p></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-ink-border bg-bg p-5 sm:p-7">
              <div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">A first look</p><span className="font-head text-xs text-muted">01 - 03</span></div>
              {ventures.map((v, n) => {
                const story = investmentStories[v.slug]
                return <Link href={`/support/${v.slug}`} key={v.slug} style={toneVars(films[v.slug].tone)} className="group block border-b border-ink-border py-6 last:border-0 last:pb-2">
                  <div className="flex items-center justify-between gap-4"><span className="t-ink text-xs font-bold uppercase tracking-widest">0{n + 1} / {story.category}</span><span className="text-muted transition-transform group-hover:translate-x-1" aria-hidden>↗</span></div>
                  <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight">{v.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{n === 0 ? 'From crypto in a wallet to bills paid and business moving.' : n === 1 ? 'From a business or career goal to tools, skills and practical help.' : 'From a brand idea to merchandise people can wear, use and keep.'}</p>
                  <span className="t-ink mt-4 inline-block text-xs font-bold">{v.raise ? `${v.raise.amount} seed round` : 'Partnership opportunities'}</span>
                </Link>
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function SupportImpact({ slug }: { slug?: string }) {
  const [selected, setSelected] = useState(slug ?? ventures[0].slug)
  const [active, setActive] = useState(0)
  const reduce = useMotionPreference()
  const v = ventures.find(item => item.slug === (slug ?? selected))!
  const story = investmentStories[v.slug]
  const steps = [
    { title: 'You bring', text: story.support, icon: '↗' },
    { title: 'We put it to work', text: story.work, icon: '◎' },
    { title: 'The goal', text: story.outcome, icon: '→' },
  ]
  return <section id="support-impact" style={toneVars(films[v.slug].tone)} className="scroll-mt-24 border-y border-ink-border bg-surface px-6 py-20 sm:px-8 md:px-16 md:py-24">
    <div className="mx-auto max-w-[1240px]">
      <div className="grid gap-6 md:grid-cols-2 md:items-end"><div><p className="t-ink text-xs font-bold uppercase tracking-[0.18em]">Your part in the next chapter</p><h2 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">What your support<br />helps make possible.</h2></div><p className="max-w-md text-base leading-7 text-muted md:justify-self-end">Choose where you can contribute. Follow the path from your involvement to the work ahead and the outcome we’re building towards.</p></div>
      {!slug && <div className="mt-9 flex flex-wrap gap-2" aria-label="Choose a venture">{ventures.map(item => <button type="button" key={item.slug} aria-pressed={v.slug === item.slug} onClick={() => { setSelected(item.slug); setActive(0) }} className={`min-h-11 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${v.slug === item.slug ? 'border-[var(--t)] bg-[var(--t)] text-white' : 'border-ink-border hover:bg-bg'}`}>{films[item.slug].short}</button>)}</div>}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, n) => <button type="button" key={`${v.slug}-${step.title}`} aria-pressed={active === n} onClick={() => setActive(n)} className={`relative flex min-h-56 flex-col items-stretch overflow-hidden rounded-2xl border p-7 text-left transition-colors ${active === n ? 'border-[var(--t)] bg-bg' : 'border-ink-border bg-surface'}`}>
          <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-muted">0{n + 1} / {step.title}</span><span aria-hidden className="t-ink text-3xl">{step.icon}</span></div><p className="mt-8 font-display text-xl font-bold leading-snug">{step.text}</p>
          {active === n && <motion.span key={v.slug} initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduce ? 0 : 0.7 }} className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[var(--t)]" />}
        </button>)}
      </div>
      <div className="mt-6 grid gap-6 rounded-2xl bg-bg p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-bold uppercase tracking-widest text-muted">A useful first conversation</p><p className="mt-2 max-w-2xl text-sm leading-7">{story.question}. Let’s discuss the evidence, priorities and the role you could play.</p></div><a href={v.raise ? DECK : partner(v.name)} target={v.raise ? '_blank' : undefined} rel="noopener noreferrer" className={`${button} bg-[var(--t)] text-white hover:opacity-90`}>{v.raise ? 'View the investor deck' : 'Explore a partnership'} ↗</a></div>
    </div>
  </section>
}
