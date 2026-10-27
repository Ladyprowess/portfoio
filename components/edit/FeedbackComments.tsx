'use client'

import { AnimatePresence, motion } from 'framer-motion'
import posthog from 'posthog-js'
import { useState } from 'react'
import { launchConfetti } from '@/lib/confetti'
import { testimonials } from '@/lib/portfolio-content'

const initials = (name: string) => name.split(' ').map(w => w[0]).filter(c => /[A-Z]/.test(c)).slice(0, 2).join('')

// Testimonials as review comments. Resolve them one by one; resolving the last
// one throws a little party and points at the contact letter.
export default function FeedbackComments() {
  const [resolved, setResolved] = useState<number[]>([])
  const open = testimonials.map((_, i) => i).filter(i => !resolved.includes(i))
  const allDone = open.length === 0

  const resolve = (i: number, button: HTMLElement) => {
    const next = [...resolved, i]
    setResolved(next)
    if (next.length === testimonials.length) {
      launchConfetti(button)
      posthog.capture('testimonials_all_resolved')
    }
  }

  return <section className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
    <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Feedback</p>
        <h2 className="mt-3 max-w-sm font-display text-3xl font-semibold tracking-[-.035em] md:text-4xl">Comments from people I have worked with.</h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-muted">Read each one, then resolve it. That is how every project with me ends.</p>
        <div className="mt-7 max-w-sm">
          <div className="flex justify-between text-xs text-muted"><span>{resolved.length} of {testimonials.length} resolved</span>{resolved.length > 0 && <button type="button" onClick={() => setResolved([])} className="font-semibold text-primary hover:underline">Reopen all</button>}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-success" animate={{ width: `${(resolved.length / testimonials.length) * 100}%` }} /></div>
        </div>
      </div>

      <div className="space-y-3" aria-live="polite">
        <AnimatePresence initial={false}>
          {open.map((i, position) => {
            const t = testimonials[i]
            return <motion.article key={t.name} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginTop: 0, transition: { duration: 0.35 } }}
              className={`overflow-hidden rounded-2xl border bg-surface ${position === 0 ? 'border-primary/40 shadow-[0_18px_45px_rgba(37,99,235,.1)]' : 'border-ink-border'}`}>
              <div className={`flex gap-4 p-5 md:p-6 ${position === 0 ? '' : 'opacity-70'}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{initials(t.name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold">{t.name} <span className="font-normal text-muted">· {t.role}</span></p><span className="font-head text-[10px] uppercase tracking-wider text-muted">Comment</span></div>
                  <p className={`mt-2 leading-7 ${position === 0 ? 'font-serif text-lg' : 'line-clamp-2 text-sm text-muted'}`}>“{t.quote}”</p>
                  {position === 0 && <button type="button" onClick={e => resolve(i, e.currentTarget)} className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-border px-4 py-2 text-sm font-semibold transition hover:border-success hover:bg-success/10 hover:text-success">✓ Resolve</button>}
                </div>
              </div>
            </motion.article>
          })}
        </AnimatePresence>

        <AnimatePresence>{allDone && <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          className="rounded-2xl bg-panel p-8 text-on-panel md:p-10">
          <p className="font-head text-[10px] uppercase tracking-wider text-accent-invert">All comments resolved</p>
          <p className="mt-3 font-display text-2xl font-semibold tracking-[-.03em] md:text-3xl">Your project could be the next thread.</p>
          <a href="#contact" className="mt-6 inline-flex rounded-full bg-surface px-6 py-3 text-sm font-semibold text-parchment hover:bg-primary/[0.07]">Write me a letter →</a>
        </motion.div>}</AnimatePresence>

        {resolved.length > 0 && <div className="flex flex-wrap gap-2 pt-2">
          {resolved.map(i => <button key={i} type="button" onClick={() => setResolved(r => r.filter(x => x !== i))} className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/15" title="Reopen">✓ {testimonials[i].name}</button>)}
        </div>}
      </div>
    </div>
  </section>
}
