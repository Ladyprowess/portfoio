'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import YourTurn from '@/components/home/YourTurn'
import { Reveal, TypeHeading } from '@/components/home/Motion'
import { services, steps } from '@/lib/services-content'
import ServicesHero from './ServicesHero'
import ServiceScene from './ServiceScene'

// The services page: Ngozi speaks to the visitor, they pick the problem that
// sounds like theirs, and each service shows the fix happening live.
// "I need this" starts their message in the chat at the bottom.
export default function ServicesPage() {
  const [intent, setIntent] = useState<string | null>(null)

  const start = (key: string) => {
    setIntent(key)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <main className="min-h-screen bg-bg text-parchment">
    <Nav />
    <ServicesHero />
    {services.map((s, i) => <ServiceScene key={s.key} service={s} index={i} onStart={start} />)}

    <section className="border-y border-ink-border bg-panel py-14 text-on-panel md:py-20">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-accent-invert">How we’ll work</p>
        <TypeHeading className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.6rem] md:leading-[1.08]" text="Simple, from the first message." />
        <ol className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((st, i) => <Reveal key={st.title} delay={i * 0.12}>
            <li className="h-full list-none rounded-3xl border border-border-invert bg-white/[0.03] p-6 md:p-7">
              <span className="font-display text-4xl font-bold text-transparent [-webkit-text-stroke:1.5px_rgb(var(--accent-invert))]">0{i + 1}</span>
              <p className="mt-5 font-display text-xl font-semibold tracking-[-.02em]">{st.title}</p>
              <p className="mt-2 text-sm leading-6 text-on-panel/60">{st.body}</p>
            </li>
          </Reveal>)}
        </ol>
      </div>
    </section>

    <YourTurn intent={intent} />
    <Footer />
  </main>
}
