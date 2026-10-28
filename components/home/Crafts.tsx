'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, TypeHeading } from './Motion'
import { facets, type FacetKey } from '@/lib/home-content'

// Five crafts as panels: on desktop the open one widens and shows its work;
// on phones they stack. The hero's "What brings you here?" opens one.
export default function Crafts({ open, onOpen }: { open: FacetKey; onOpen: (key: FacetKey) => void }) {
  return <section id="crafts" className="scroll-mt-24 bg-surface-2/60 py-14 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="mb-7 flex flex-col justify-between gap-3 md:mb-10 md:flex-row md:items-end md:gap-4">
        <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Five crafts</p><TypeHeading className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.9rem] md:leading-[1.05]" text="Multifaceted, on purpose." /></div>
        <p className="max-w-sm text-sm leading-6 text-muted">Most problems are not only a writing problem or only a design problem. Being able to do all five means nothing gets lost between them.</p>
      </div>

      <Reveal className="flex flex-col gap-3 lg:h-[600px] lg:flex-row">
        {facets.map((f, i) => {
          const isOpen = open === f.key
          return <motion.article key={f.key} onMouseEnter={() => onOpen(f.key)}
            className={`relative overflow-hidden rounded-3xl border border-ink-border bg-surface transition-[flex-grow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${isOpen ? 'lg:flex-[5]' : 'lg:flex-[1]'}`}>
            <button type="button" onClick={() => onOpen(f.key)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-6 text-left lg:hidden">
              <span><span className="font-head text-[10px] text-muted">0{i + 1}</span><span className="ml-3 font-display text-lg font-semibold">{f.label}</span></span>
              <span className={`text-primary transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>

            {/* Desktop: closed panels show a vertical label */}
            <button type="button" onClick={() => onOpen(f.key)} aria-expanded={isOpen} aria-label={f.label}
              className={`absolute inset-0 hidden flex-col items-center justify-between py-7 transition-opacity duration-300 lg:flex ${isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
              <span className="font-head text-[11px] text-muted">0{i + 1}</span>
              <span className="font-display text-lg font-semibold [writing-mode:vertical-rl] rotate-180">{f.label}</span>
              <span className="h-2 w-2 rounded-full bg-primary" />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && <motion.div key="body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
                className="grid h-full lg:grid-cols-[1.1fr_1fr]">
                {/* The button is pinned to the bottom of the column, so long titles or many tags can never push it out of view */}
                <div className="flex min-h-0 flex-col px-6 pb-7 lg:p-8">
                  <div className="min-h-0 flex-1">
                    <p className="hidden font-head text-[11px] uppercase tracking-[.14em] text-primary lg:block">0{i + 1} · {f.label}</p>
                    <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-.03em] lg:mt-4 lg:text-[1.65rem]">{f.title}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-muted">{f.body}</p>
                    <p className="mt-6 font-head text-[10px] uppercase tracking-wider text-muted">Done for</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">{f.proof.map(p => <span key={p} className="rounded-full border border-ink-border bg-bg px-2.5 py-1 text-xs">{p}</span>)}</div>
                  </div>
                  <a href="/services" className="mt-6 inline-flex w-max shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-[0_10px_30px_-10px_rgb(var(--primary)/.6)] transition hover:bg-primary-dim">See the work <span aria-hidden="true">→</span></a>
                </div>
                <div className="relative mx-6 mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2 lg:m-3 lg:ml-0 lg:aspect-auto">
                  <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
                    <Image src={f.image} alt={f.imageAlt} fill sizes="(max-width: 1024px) 90vw, 480px" className="object-cover object-top" />
                  </motion.div>
                </div>
              </motion.div>}
            </AnimatePresence>
          </motion.article>
        })}
      </Reveal>
    </div>
  </section>
}
