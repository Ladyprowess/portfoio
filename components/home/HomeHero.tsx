'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import posthog from 'posthog-js'
import { facets, intents, type EditorKey } from '@/lib/home-content'
import PenNib from './PenNib'
import CraftEditor from './CraftEditor'
import TypedHeadline from './TypedHeadline'

type Props = {
  intent: string | null
  onIntent: (key: string) => void
  onExplore: (facet: EditorKey | null) => void
  facet: EditorKey
  onFacet: (key: EditorKey, byVisitor: boolean) => void
  locked: boolean
}

export default function HomeHero({ intent, onIntent, onExplore, facet, onFacet, locked }: Props) {
  const reduce = useReducedMotion()
  const chosen = intents.find(i => i.key === intent) ?? null
  const lit = chosen?.facet ?? null
  const facetLabel = lit === 'support' ? 'support' : lit ? facets.find(f => f.key === lit)!.short.toLowerCase() : null

  return <section id="top" className="relative overflow-hidden pb-12 pt-24 md:pb-28 md:pt-36">
    <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    <div aria-hidden="true" className="absolute -right-40 -top-24 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />

    {/* Three blocks. Desktop: intro and question on the left, editor on the right.
        Phones: intro, then the editor, then the question, so the first screen is not all text. */}
    {/* grid-cols-1 (minmax(0,1fr)) stops the swipeable answer row from widening the page on phones */}
    <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-9 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-9">

      <div className="lg:col-start-1 lg:row-start-1">
        {/* Kept short on purpose: the editor beside it shows the crafts, so the words only need to name her and caption it. */}
        <p className="flex items-center gap-2 text-sm text-muted">
          <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#84CC16]/60 motion-reduce:hidden" /><span className="relative h-2 w-2 rounded-full bg-[#84CC16]" /></span>
          Ngozi Peace Okafor · available for projects
        </p>
        <TypedHeadline className="mt-4 font-display text-[clamp(2.1rem,3.7vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.04em] md:mt-5" />
      </div>

        {/* What brings you here? Ngozi answers, and the page follows. */}
        <div className="max-w-xl rounded-3xl border border-ink-border bg-surface/80 p-5 shadow-[0_24px_60px_-30px_rgba(17,24,39,.3)] backdrop-blur md:p-6 lg:col-start-1 lg:row-start-2">
          <p className="text-sm font-semibold">What brings you here?</p>
          {/* Phones: one swipeable row of answers instead of a tall stack */}
          <div className="-mx-5 mt-3.5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            {intents.map(i => <button key={i.key} type="button" onClick={() => { onIntent(i.key); posthog.capture('home_intent_chosen', { intent: i.key }) }} aria-pressed={intent === i.key}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-left text-[13px] transition md:shrink md:whitespace-normal ${intent === i.key ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-bg text-parchment/80 hover:border-primary/50 hover:text-parchment'}`}>{i.label}</button>)}
          </div>
          <AnimatePresence mode="wait">
            {chosen && <motion.div key={chosen.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }} className="mt-5 border-t border-ink-border pt-5" aria-live="polite">
              <div className="flex gap-3">
                <span className="relative mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-full"><Image src="/hero/mine.jpeg" alt="" fill sizes="32px" className="object-cover object-top" /></span>
                <p className="rounded-2xl rounded-tl-sm bg-primary/[0.08] px-4 py-3 text-[15px] leading-6">{chosen.reply}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 pl-11">
                <button type="button" onClick={() => onExplore(chosen.facet)} className="rounded-full bg-parchment px-4 py-2 text-xs font-semibold text-bg hover:opacity-90">See my {facetLabel} work ↓</button>
                <a href="#contact" className="rounded-full border border-ink-border px-4 py-2 text-xs font-semibold hover:border-muted">Tell me about it →</a>
              </div>
            </motion.div>}
          </AnimatePresence>
        </div>

      {/* The live editor: every craft, being done in real time */}
      {/* min-w-0 lets the column shrink on phones so the tab row scrolls instead of widening the page */}
      <div className="relative mx-auto w-full min-w-0 max-w-[600px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-4">
        {/* The logo's arc, sweeping over the editor and ending in the pen nib */}
        <svg aria-hidden="true" viewBox="0 0 600 120" className="absolute -top-16 left-0 hidden w-full overflow-visible md:block">
          <motion.path d="M30 118 C 120 -20, 470 -30, 560 70" fill="none" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeOpacity=".7"
            initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.3, ease: [0.65, 0, 0.35, 1] }} />
        </svg>
        <motion.div aria-hidden="true" initial={{ opacity: 0, y: reduce ? 0 : -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 0.4 }} className="absolute -top-[2px] right-[4%] hidden rotate-[-38deg] md:block">
          <PenNib className="h-8 w-5 drop-shadow-[0_6px_10px_rgba(37,99,235,.35)]" />
        </motion.div>
        <CraftEditor active={facet} onSelect={onFacet} locked={locked} />
      </div>
    </div>

    <dl className="relative mx-auto mt-12 grid max-w-[1320px] grid-cols-2 gap-y-6 px-5 md:mt-20 md:grid-cols-5 md:px-8">
      {[['9+', 'Years of writing and building'], ['200+', 'People trained'], ['3', 'Ventures founded'], ['11', 'Companies I have worked with'], ['−45%', 'Repeat customer issues, in support']].map(([v, l], i) => <div key={l} className={`flex flex-col-reverse border-l border-ink-border pl-5 ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
        <dt className="mt-1 text-xs text-muted">{l}</dt><dd className="font-display text-3xl font-bold tracking-[-.04em] md:text-4xl">{v}</dd>
      </div>)}
    </dl>
  </section>
}
