'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { jargonExamples } from '@/lib/portfolio-content'
import { gradeLevel, wordCount } from '@/lib/readability'

// "Try me": pick a hard sentence, watch it come out plain. The rewrites are
// written by hand — this demonstrates the craft, it is not a generator.
export default function JargonTranslator() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [own, setOwn] = useState('')
  const example = jargonExamples[index]

  useEffect(() => {
    if (reduceMotion) { setTyped(example.plain.length); return }
    setTyped(0)
    let n = 0
    const tick = () => {
      n += 1
      setTyped(n)
      if (n < example.plain.length) timer = window.setTimeout(tick, 22)
    }
    let timer = window.setTimeout(tick, 650)
    return () => window.clearTimeout(timer)
  }, [example, reduceMotion])

  const pick = (i: number) => {
    setIndex(i)
    posthog.capture('jargon_example_viewed', { tag: jargonExamples[i].tag })
  }

  const before = { words: wordCount(example.jargon), grade: gradeLevel(example.jargon) }
  const after = { words: wordCount(example.plain), grade: gradeLevel(example.plain) }
  const done = typed >= example.plain.length
  const mailto = `mailto:hello@ladyprowess.com?subject=${encodeURIComponent('Can you make this clearer?')}&body=${encodeURIComponent(`Hi Ngozi,\n\nThis is the sentence I keep struggling with:\n\n"${own.trim()}"\n\n`)}`

  return <section id="try" className="scroll-mt-24 border-y border-ink-border bg-primary/[0.035] py-20 md:py-28"><div className="mx-auto max-w-[1320px] px-4 md:px-8">
    <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Try me</p><h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.035em] md:text-4xl">Hand me a sentence nobody understands.</h2></div>
      <p className="max-w-sm text-sm leading-6 text-muted">Pick an industry. Watch the jargon become something a real person would say.</p>
    </div>

    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Industries">
      {jargonExamples.map((e, i) => <button key={e.tag} role="tab" aria-selected={i === index} onClick={() => pick(i)}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${i === index ? 'border-parchment bg-parchment text-bg' : 'border-ink-border bg-surface text-muted hover:border-muted hover:text-parchment'}`}>{e.tag}</button>)}
    </div>

    <div className="mt-6 overflow-hidden rounded-3xl border border-ink-border bg-surface shadow-[0_24px_60px_rgba(17,24,39,.06)]" role="tabpanel">
      <div className="grid md:grid-cols-2">
        <div className="border-b border-ink-border p-7 md:border-b-0 md:border-r md:p-10">
          <p className="font-head text-[10px] uppercase tracking-wider text-muted">Before</p>
          <AnimatePresence mode="wait">
            <motion.p key={example.tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="mt-4 font-serif text-xl italic leading-9 text-muted decoration-primary/35 decoration-wavy underline-offset-[6px] [text-decoration-line:underline] [text-decoration-skip-ink:none]">{example.jargon}</motion.p>
          </AnimatePresence>
        </div>
        <div className="relative bg-primary/[0.035] p-7 md:p-10">
          <p className="font-head text-[10px] uppercase tracking-wider text-primary">After</p>
          <p className="mt-4 min-h-[5.5rem] font-display text-2xl font-semibold leading-snug tracking-[-.02em] md:text-[1.7rem]" aria-live="polite">
            {example.plain.slice(0, typed)}{!done && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-1 animate-pulse bg-primary" />}
          </p>
        </div>
      </div>

      <div className="grid gap-6 border-t border-ink-border p-7 sm:grid-cols-2 md:px-10">
        <Meter label="Words" before={before.words} after={after.words} max={Math.max(before.words, 1)} show={done} percent />
        <Meter label="Reading grade" before={before.grade} after={after.grade} max={20} show={done} note="lower is easier" />
      </div>
    </div>

    <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-dashed border-ink-border p-5 md:flex-row md:items-center md:p-6">
      <label htmlFor="own-jargon" className="shrink-0 text-sm font-semibold">Got one of your own?</label>
      <input id="own-jargon" value={own} onChange={e => setOwn(e.target.value)} placeholder="Paste the sentence your users keep tripping over…" className="min-w-0 flex-1 rounded-full border border-ink-border bg-surface px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
      <a href={own.trim() ? mailto : undefined} aria-disabled={!own.trim()} onClick={() => own.trim() && posthog.capture('jargon_submitted')}
        className={`shrink-0 rounded-full px-6 py-3 text-center text-sm font-semibold transition ${own.trim() ? 'bg-primary text-on-primary hover:bg-primary-dim' : 'pointer-events-none bg-surface-2 text-muted'}`}>Send it to me →</a>
    </div>
  </div></section>
}

function Meter({ label, before, after, max, show, note, percent }: { label: string; before: number; after: number; max: number; show: boolean; note?: string; percent?: boolean }) {
  const change = Math.round(((before - after) / before) * 100)
  return <div>
    <div className="flex items-baseline justify-between text-sm"><span className="font-semibold">{label}{note && <span className="ml-1.5 text-xs font-normal text-muted">({note})</span>}</span><span className="font-head text-xs text-muted">{before} → <strong className="text-primary">{show ? after : '…'}</strong>{show && percent && change > 0 && <span className="ml-2 text-success">−{change}%</span>}</span></div>
    <div className="mt-3 space-y-1.5">
      <div className="h-2 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-muted/40" initial={false} animate={{ width: `${Math.min(100, (before / max) * 100)}%` }} /></div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: show ? `${Math.min(100, (after / max) * 100)}%` : '0%' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} /></div>
    </div>
  </div>
}
