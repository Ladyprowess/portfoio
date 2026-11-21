'use client'

import posthog from 'posthog-js'

// Right after the hero: three clear ways forward, so every visitor knows where
// to go next. A light list (no boxes): a label, the link and an arrow, with
// thin dividers. Phones: one row each. Larger screens: three columns.
const doors = [
  { href: '/recruiter', kicker: 'Hiring?', title: 'See my CV', text: 'Experience, skills and results on one page.' },
  { href: '/work', kicker: 'Want proof?', title: 'See my work', text: 'Products, docs, websites and Python tools.' },
  { href: '/services', kicker: 'Need help?', title: 'Work with me', text: 'AI adoption, products, docs and websites.' },
]

export default function Doors() {
  return <section aria-label="Where to go next" className="mx-auto max-w-[1320px] px-5 pb-16 md:px-8 md:pb-20">
    <h2 className="mb-4 font-display text-2xl font-semibold tracking-[-.03em] md:mb-6 md:text-3xl">Where would you like to start?</h2>
    <ul className="border-y border-ink-border md:grid md:grid-cols-3">
      {doors.map(d => <li key={d.href} className="border-b border-ink-border last:border-b-0 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0 md:last:pr-0">
        <a href={d.href} onClick={() => posthog.capture('home_door_clicked', { door: d.href })}
          className="group flex items-center justify-between gap-4 py-5 md:py-7">
          <span>
            <span className="block font-head text-[11px] uppercase tracking-[.16em] text-primary">{d.kicker}</span>
            <span className="mt-1.5 block font-display text-xl font-semibold tracking-[-.02em] transition-colors group-hover:text-primary md:text-2xl">{d.title}</span>
            <span className="mt-1 hidden text-sm leading-6 text-muted md:block">{d.text}</span>
          </span>
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-border text-lg transition group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary">→</span>
        </a>
      </li>)}
    </ul>
  </section>
}
