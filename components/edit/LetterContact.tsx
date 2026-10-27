'use client'

import posthog from 'posthog-js'
import { useState } from 'react'
import { CV_URL } from '@/lib/site'
import PenNib from './PenNib'

const starters = [
  'I am launching a product and the messaging is not landing.',
  'I need API docs developers can actually follow.',
  'I need a WordPress site that turns visitors into customers.',
  'My team needs Web3 or AI training.',
]

// Contact as a letter: write the first line, it opens in the visitor's email app.
export default function LetterContact() {
  const [body, setBody] = useState('')
  const [name, setName] = useState('')
  const ready = body.trim().length > 0

  const add = (line: string) => setBody(b => (b.trim() ? `${b.trim()} ${line}` : line))
  const mailto = `mailto:hello@ladyprowess.com?subject=${encodeURIComponent(`A letter from ${name.trim() || 'your website'}`)}&body=${encodeURIComponent(`Dear Ngozi,\n\n${body.trim()}\n\nWarmly,\n${name.trim()}`)}`

  return <section id="contact" className="scroll-mt-24 border-t border-ink-border bg-surface-2/60 py-20 md:py-28">
    <div className="mx-auto grid max-w-[1320px] gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
      <div>
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Have something to build?</p>
        <h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.6rem] md:leading-[1.1]">You write the first draft. I will help with the rest.</h2>
        <p className="mt-5 max-w-md leading-7 text-muted">Tell me what you are building, what is not working and where you need support. Rough is fine. Rough is where I start.</p>
        <div className="mt-7 flex flex-wrap gap-3 text-sm">
          <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink-border bg-surface px-5 py-2.5 font-semibold hover:border-muted">Résumé ↗</a>
          <a href="mailto:hello@ladyprowess.com" className="rounded-full px-2 py-2.5 font-semibold text-primary hover:underline">hello@ladyprowess.com</a>
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); if (!ready) return; posthog.capture('letter_sent'); window.location.href = mailto }}
        className="relative rounded-[1.75rem] border border-ink-border bg-paper p-7 shadow-[0_30px_70px_rgba(17,24,39,.1)] md:p-10">
        <PenNib className="absolute -right-3 -top-4 h-10 w-7 rotate-[28deg] drop-shadow-[0_6px_10px_rgba(37,99,235,.3)]" />
        <p className="font-serif text-2xl italic">Dear Ngozi,</p>
        <label htmlFor="letter-body" className="sr-only">Your message</label>
        <textarea id="letter-body" value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder="I am building… and I need help with…"
          className="ruled mt-4 w-full resize-none bg-transparent font-serif text-lg leading-9 outline-none placeholder:text-muted/60"
          style={{ backgroundAttachment: 'local' }} />
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="w-full font-head text-[10px] uppercase tracking-wider text-muted">Stuck? Start with one of these</span>
          {starters.map(s => <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-ink-border bg-surface px-3 py-1.5 text-left text-xs text-muted transition hover:border-primary hover:text-primary">+ {s}</button>)}
        </div>
        <div className="mt-7 flex flex-col gap-4 border-t border-dashed border-ink-border pt-6 sm:flex-row sm:items-end">
          <div className="flex-1">
            <p className="font-serif text-lg italic">Warmly,</p>
            <label htmlFor="letter-name" className="sr-only">Your name</label>
            <input id="letter-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="mt-1 w-full border-b border-ink-border bg-transparent py-1 font-serif text-xl outline-none transition placeholder:text-muted/60 focus:border-primary" />
          </div>
          <button type="submit" disabled={!ready} className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-on-primary shadow-[0_10px_30px_rgb(var(--primary)/.25)] transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted disabled:shadow-none">Send letter →</button>
        </div>
        <p className="mt-3 text-[11px] text-muted">Opens in your email app, so you can read it over before it goes.</p>
      </form>
    </div>
  </section>
}
