'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import posthog from 'posthog-js'
import { useEffect, useRef, useState } from 'react'
import { intents } from '@/lib/home-content'
import { Reveal, TypeHeading } from './Motion'
import { CV_URL } from '@/lib/site'

// The page ends the way it began: a conversation. Ngozi types a question when
// the section comes into view; the visitor answers, and it opens as an email.
export default function YourTurn({ intent }: { intent: string | null }) {
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { once: true, margin: '-120px' })
  const [asked, setAsked] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const chosen = intents.find(i => i.key === intent)

  useEffect(() => {
    if (!inView) return
    const t = window.setTimeout(() => setAsked(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1400)
    return () => window.clearTimeout(t)
  }, [inView])

  // If they said what brought them here, start the message for them. A new
  // choice replaces a suggestion, but never text they have typed themselves.
  const suggested = useRef('')
  useEffect(() => {
    if (!chosen) return
    if (!message.trim() || message === suggested.current) {
      suggested.current = `${chosen.label}. `
      setMessage(suggested.current)
    }
  }, [chosen]) // eslint-disable-line react-hooks/exhaustive-deps

  const ready = message.trim().length > 0
  const send = () => {
    if (!ready) return
    posthog.capture('home_message_sent', { intent })
    const subject = encodeURIComponent(`Hello from ${name.trim() || 'your website'}`)
    const body = encodeURIComponent(`Hi Ngozi,\n\n${message.trim()}\n\n${name.trim()}`)
    window.location.href = `mailto:hello@ladyprowess.com?subject=${subject}&body=${body}`
  }

  return <section id="contact" className="scroll-mt-24 bg-surface-2/60 py-14 md:py-28">
    <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
      <div>
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Your turn</p>
        <TypeHeading className="mt-3 max-w-md font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.9rem] md:leading-[1.05]" text="I typed first. Now it’s your turn." />
        <p className="mt-5 max-w-md leading-7 text-muted">Tell me what you are building and where it is stuck. A rough message is fine; making things clear is my job.</p>
        <div className="mt-7 flex flex-wrap gap-3 text-sm">
          <a href="mailto:hello@ladyprowess.com" className="font-semibold text-primary hover:underline">hello@ladyprowess.com</a>
          <span className="text-muted">·</span>
          <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary">View my résumé ↗</a>
        </div>
      </div>

      <Reveal y={40} className="min-w-0">
      <div ref={box} className="overflow-hidden rounded-[2rem] border border-ink-border bg-surface shadow-[0_40px_100px_-40px_rgba(17,24,39,.4)]">
        <div className="flex items-center gap-3 border-b border-ink-border px-5 py-4">
          <span className="relative h-10 w-10 overflow-hidden rounded-full"><Image src="/hero/mine.jpeg" alt="" fill sizes="40px" className="object-cover object-top" /></span>
          <div><p className="text-sm font-semibold">Ngozi Peace Okafor</p><p className="flex items-center gap-1.5 text-xs text-muted"><span className="h-1.5 w-1.5 rounded-full bg-[#84CC16]" />Available for selected projects</p></div>
        </div>

        <div className="min-h-[190px] space-y-3 bg-bg/60 p-5 md:p-6">
          <AnimatePresence mode="wait">
            {!asked ? <motion.div key="typing" exit={{ opacity: 0 }} className="flex w-max gap-1 rounded-2xl rounded-tl-sm bg-surface px-4 py-3.5 shadow-sm">
              {[0, 1, 2].map(d => <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />)}
            </motion.div> : <motion.div key="asked" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <p className="w-max max-w-[85%] rounded-2xl rounded-tl-sm bg-surface px-4 py-3 text-[15px] leading-6 shadow-sm">Thanks for staying this long.</p>
              <p className="w-max max-w-[85%] rounded-2xl rounded-tl-sm bg-surface px-4 py-3 text-[15px] leading-6 shadow-sm">What are you working on, and how can I help?</p>
            </motion.div>}
          </AnimatePresence>
          {message.trim() && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="ml-auto w-max max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-[15px] leading-6 text-on-primary">{message}</motion.p>}
        </div>

        <form onSubmit={e => { e.preventDefault(); send() }} className="border-t border-ink-border p-4 md:p-5">
          <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            {intents.map(i => <button key={i.key} type="button" onClick={() => setMessage(m => (m.trim() ? `${m.trim()} ${i.label}.` : `${i.label}.`))} className="shrink-0 whitespace-nowrap rounded-full border border-ink-border px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-primary">+ {i.label}</button>)}
          </div>
          <label htmlFor="your-turn-message" className="sr-only">Your message</label>
          <textarea id="your-turn-message" value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Type your message…" className="w-full resize-none rounded-2xl border border-ink-border bg-bg px-4 py-3 text-[15px] leading-6 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="your-turn-name" className="sr-only">Your name</label>
            <input id="your-turn-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="min-w-0 flex-1 rounded-full border border-ink-border bg-bg px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
            <button type="submit" disabled={!ready} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted">Send →</button>
          </div>
          <p className="mt-2.5 text-[11px] text-muted">Opens in your email app so you can check it before it goes.</p>
        </form>
      </div>
      </Reveal>
    </div>
  </section>
}
