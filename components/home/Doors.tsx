'use client'

import posthog from 'posthog-js'
import { Reveal } from './Motion'

// Right after the hero: three clear ways forward, so every visitor knows where
// to go next. Each door leads to the one page that does that job.
const doors = [
  { href: '/recruiter', kicker: 'Hiring?', title: 'See my CV', text: 'Experience, skills and results on one page.', tone: 'bg-panel text-on-panel', sub: 'text-on-panel/65', k: 'text-accent-invert' },
  { href: '/work', kicker: 'Want proof?', title: 'See my work', text: 'Products, docs, websites and Python tools.', tone: 'bg-surface border border-ink-border', sub: 'text-muted', k: 'text-primary' },
  { href: '/services', kicker: 'Need help?', title: 'Work with me', text: 'AI adoption, products, docs and websites.', tone: 'bg-primary text-on-primary', sub: 'text-on-primary/75', k: 'text-on-primary/70' },
]

export default function Doors() {
  return <section aria-label="Where to go next" className="mx-auto max-w-[1320px] px-5 pb-16 md:px-8 md:pb-24">
    <h2 className="mb-6 font-display text-2xl font-semibold tracking-[-.03em] md:mb-8 md:text-3xl">Where would you like to start?</h2>
    <div className="grid gap-4 md:grid-cols-3">
      {doors.map((d, i) => <Reveal key={d.href} delay={i * 0.08} className="h-full">
        <a href={d.href} onClick={() => posthog.capture('home_door_clicked', { door: d.href })}
          className={`group flex h-full flex-col rounded-[1.75rem] p-7 transition hover:-translate-y-1 md:p-8 ${d.tone}`}>
          <span className={`font-head text-[11px] uppercase tracking-[.16em] ${d.k}`}>{d.kicker}</span>
          <span className="mt-3 font-display text-2xl font-semibold tracking-[-.02em]">{d.title} <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
          <span className={`mt-2 text-[15px] leading-6 ${d.sub}`}>{d.text}</span>
        </a>
      </Reveal>)}
    </div>
  </section>
}
