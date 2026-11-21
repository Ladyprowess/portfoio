'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import posthog from 'posthog-js'
import { facets, intents, type EditorKey } from '@/lib/home-content'
import PenNib from './PenNib'
import CraftEditor from './CraftEditor'
import TypedHeadline from './TypedHeadline'
import { openIntro } from './IntroVideo'

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

  return <section id="top" className="relative overflow-hidden pb-10 pt-24 md:pb-28 md:pt-36">
    <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    <div aria-hidden="true" className="absolute -right-40 -top-24 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />

    {/* Three blocks. Desktop: intro and question on the left, editor on the right.
        Phones: intro, then the editor, then the question, so the first screen is not all text. */}
    {/* grid-cols-1 (minmax(0,1fr)) stops the swipeable answer row from widening the page on phones */}
    <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-9 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-x-12">

      <div className="lg:col-start-1 lg:row-start-1">
        {/* Kept short on purpose: the editor beside it shows the crafts, so the words only need to name her and caption it. */}
        <p className="flex items-center gap-2 text-sm text-muted">
          <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#84CC16]/60 motion-reduce:hidden" /><span className="relative h-2 w-2 rounded-full bg-[#84CC16]" /></span>
          Ngozi Peace Unegbu · AI Strategy & Digital Product Specialist
        </p>
        <TypedHeadline className="mt-4 font-display text-[clamp(2.1rem,3.7vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.04em] md:mt-5" />
        {/* What she does, in one line, so the first screen answers it. */}
        <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-muted md:text-base">I help businesses adopt AI, build digital products and write the documentation that makes them easy to use.</p>
        {/* Two next steps only: meet her, or see the work. */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
        <a href="/work" className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-[0_12px_30px_-12px_rgb(var(--primary)/.7)] transition hover:bg-primary-dim">See my work →</a>
        {/* Reopens the video introduction (components/home/IntroVideo.tsx) */}
        <button type="button" onClick={openIntro}
          className="group flex items-center gap-3 rounded-full border border-ink-border bg-surface py-1.5 pl-1.5 pr-5 text-left shadow-[0_12px_30px_-18px_rgba(17,24,39,.35)] transition hover:border-primary/50">
          <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-full">
            <Image src="/personal photo/headshot3.png" alt="" fill sizes="56px" className="object-cover object-[50%_22%]" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25"><svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 text-white" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
          </span>
          <span className="text-sm"><span className="block font-semibold">Watch my intro</span><span className="block text-xs text-muted">57 seconds</span></span>
        </button>
        </div>
      </div>

      {/* The live editor: every craft, being done in real time */}
      {/* min-w-0 lets the column shrink on phones so the tab row scrolls instead of widening the page */}
      <div className="relative mx-auto hidden w-full min-w-0 max-w-[600px] md:block lg:col-start-2 lg:row-start-1 lg:mt-4">
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

    <dl className="relative mx-auto mt-10 grid max-w-[1320px] grid-cols-3 gap-y-6 px-5 md:mt-20 md:grid-cols-5 md:px-8">
      {[['9+', 'Years of writing and building'], ['200+', 'People trained'], ['3', 'Ventures founded'], ['11', 'Companies I have worked with'], ['-45%', 'Repeat customer issues, in support']].map(([v, l], i) => <div key={l} className={`flex-col-reverse border-l border-ink-border pl-3 md:pl-5 ${i >= 3 ? 'hidden md:flex' : 'flex'}`}>
        <dt className="mt-1 text-[11px] leading-4 text-muted md:text-xs">{l}</dt><dd className="font-display text-2xl font-bold tracking-[-.04em] md:text-4xl">{v}</dd>
      </div>)}
    </dl>
  </section>
}
