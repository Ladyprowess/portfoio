'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import { ventures, type Venture } from '@/lib/ventures'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Canvas, Count, DECK, Film, Loop, MEETING, Reveal, Stage, partner, toneVars } from '@/components/support/kit'
import { films, type VentureFilm } from '@/components/support/scenes'
import { RaiseBand } from '@/components/support/Hub'

const label = 'font-head text-[0.64rem] font-bold uppercase tracking-[0.18em]'
const btn = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition'
const wrap = 'px-6 sm:px-8 md:px-20'

export default function VentureDetail({ venture: v }: { venture: Venture }) {
  const f = films[v.slug]
  const next = ventures[(ventures.findIndex(x => x.slug === v.slug) + 1) % ventures.length]
  const primary = v.raise ? { href: MEETING, text: `Discuss the ${v.raise.amount} round` } : { href: partner(v.name), text: 'Discuss a partnership' }

  return (
    <main style={toneVars(f.tone)} className="min-h-screen overflow-x-clip bg-bg text-parchment">
      <Nav />

      {/* Hero: the film carries the explanation, the words carry the ask */}
      <section className={`relative overflow-hidden border-b border-ink-border bg-surface ${wrap} pb-16 pt-32 md:pb-20 md:pt-40`}>
        <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(60% 70% at 100% 0%, color-mix(in srgb, var(--t) 14%, transparent), transparent 70%), radial-gradient(50% 60% at 0% 100%, color-mix(in srgb, var(--a) 12%, transparent), transparent 70%)' }} />
        <div className="relative mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Link href="/support" className="text-xs font-semibold text-muted hover:text-parchment">← Founder portfolio</Link>
            <Reveal><span className="relative mt-8 block h-12 w-48"><Image src={v.logo} alt={v.name} fill priority sizes="192px" className="object-contain object-left" /></span></Reveal>
            <Reveal delay={0.1}><p className={`${label} t-ink mt-8`}>{v.eyebrow}</p></Reveal>
            <Reveal delay={0.15}><h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">{v.tagline}</h1></Reveal>
            <Reveal delay={0.25}><p className="mt-6 max-w-xl text-[1.02rem] leading-[1.85] text-muted md:text-[1.08rem]">{v.introduction}</p></Reveal>
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={primary.href} className={`${btn} bg-[var(--t)] text-white shadow-[0_14px_30px_-12px_var(--t)] hover:-translate-y-0.5`}>{primary.text}</a>
                {v.raise ? <a href={DECK} className={`${btn} border border-ink-border bg-surface hover:border-[var(--t)]`}>Request the deck</a> : <a href={v.website} target="_blank" rel="noopener noreferrer" className={`${btn} border border-ink-border bg-surface hover:border-[var(--t)]`}>Visit the website ↗</a>}
              </div>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full t-soft px-3.5 py-1.5 text-xs font-semibold"><span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-[var(--t)] opacity-60" /><span className="h-2 w-2 rounded-full bg-[var(--t)]" /></span>{v.status}</p>
            </Reveal>
          </div>
          <Reveal delay={0.2}><Film scenes={f.scenes} tone={f.tone} label={`${f.short}: ${f.title}`} /></Reveal>
        </div>
        <div className="relative mx-auto mt-14 grid max-w-[1280px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border md:grid-cols-4">
          {v.stats.map(s => <div key={s.label} className="bg-surface p-5 md:p-7"><p className="t-ink font-display text-3xl font-extrabold md:text-4xl"><Count value={s.value} /></p><p className="mt-2 text-xs leading-5 text-muted">{s.label}</p></div>)}
        </div>
      </section>

      {/* Why I built it */}
      <section className={`bg-bg ${wrap} py-20 md:py-28`}>
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.35fr_1fr]">
          <Reveal>
            <p className={`${label} t-ink`}>Why I built it</p>
            <div className="mt-6 flex items-center gap-3"><span className="relative h-12 w-12 overflow-hidden rounded-full bg-surface-2"><Image src="/personal%20photo/headshot2.png" alt="" fill sizes="48px" className="object-cover object-top" /></span><span className="text-sm"><b className="block">Ngozi Peace Okafor</b><span className="text-muted">Founder</span></span></div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.01em]"><span className="t-ink">“</span>{v.story[0]}</p>
            {v.story.slice(1).map(p => <p key={p} className="mt-6 max-w-3xl text-[1.02rem] leading-8 text-muted">{p}</p>)}
          </Reveal>
        </div>
      </section>

      {/* Problem → answer, shown as pictures first */}
      <section className={`border-y border-ink-border bg-surface ${wrap} py-20 md:py-28`}>
        <div className="mx-auto max-w-[1240px]">
          <Reveal className="mb-12 max-w-3xl"><p className={`${label} t-ink`}>The gap</p><h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-tight">What changes when {v.name} is there.</h2></Reveal>
          <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
            <Reveal className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-ink-border bg-bg">
                <Loop scene={f.scenes[0]} tone={f.tone} every={7000} />
                <div className="p-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E5484D]">Without it</p><p className="mt-3 text-[0.98rem] leading-8 text-muted">{v.problem}</p></div>
              </div>
            </Reveal>
            <div className="flex items-center justify-center"><motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="flex h-14 w-14 rotate-90 items-center justify-center rounded-full bg-[var(--t)] text-xl text-white shadow-lg lg:rotate-0">→</motion.span></div>
            <Reveal delay={0.15} className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-[1.8rem] border-2 border-[var(--t)] bg-bg">
                <Loop scene={f.scenes[f.steps[0].scene]} tone={f.tone} every={7000} />
                <div className="p-7"><p className="t-ink text-xs font-bold uppercase tracking-[0.14em]">With {f.short}</p><p className="mt-3 text-[0.98rem] leading-8">{v.solution}</p></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <HowItWorks v={v} f={f} />

      {/* Everything it offers */}
      <section className={`border-y border-ink-border bg-surface ${wrap} py-20 md:py-28`}>
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="mb-12 grid gap-5 md:grid-cols-2 md:items-end"><div><p className={`${label} t-ink`}>The product</p><h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-tight">Everything it offers today.</h2></div><p className="max-w-md text-[0.96rem] leading-7 text-muted md:justify-self-end">Live on <a href={v.website} target="_blank" rel="noopener noreferrer" className="t-ink font-semibold underline-offset-4 hover:underline">{v.website.replace(/^https:\/\/(www\.)?/, '').replace(/\/.*$/, '')}</a>.</p></Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {v.features.map((ft, n) => (
              <Reveal key={ft.title} delay={(n % 3) * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-ink-border bg-bg p-7 transition hover:-translate-y-1 hover:border-[var(--t)] hover:shadow-xl">
                  <span aria-hidden className="absolute -right-4 -top-6 font-display text-[6rem] font-extrabold leading-none text-transparent opacity-40 transition group-hover:opacity-100 [-webkit-text-stroke:1px_var(--t)]">{n + 1}</span>
                  <h3 className="relative mt-10 font-display text-lg font-extrabold">{ft.title}</h3>
                  <p className="relative mt-3 text-[0.86rem] leading-6 text-muted">{ft.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The business */}
      <section className={`bg-bg ${wrap} py-20 md:py-28`}>
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="mb-12 max-w-3xl"><p className={`${label} t-ink`}>The business</p><h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-tight">Who pays, how it earns, what comes next.</h2></Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal><div className="h-full rounded-[1.6rem] border border-ink-border bg-surface p-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Who it serves</p><div className="mt-5 flex flex-wrap gap-2">{v.audience.map(a => <span key={a} className="t-soft rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold">{a}</span>)}</div></div></Reveal>
            <Reveal delay={0.1}><div className="h-full rounded-[1.6rem] bg-[var(--t)] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">How it earns</p><ol className="mt-5 space-y-4">{v.model.map((m, n) => <li key={m} className="flex gap-4 text-[0.92rem] leading-6"><span className="font-head text-xs font-bold text-white/60">0{n + 1}</span>{m}</li>)}</ol></div></Reveal>
            <Reveal delay={0.2}><div className="h-full rounded-[1.6rem] border border-ink-border bg-surface p-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">What comes next</p><ol className="relative mt-5 space-y-4 border-l-2 border-ink-border pl-5">{v.priorities.map(p => <li key={p} className="relative text-[0.9rem] leading-6"><span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--t)] bg-surface" />{p}</li>)}</ol></div></Reveal>
          </div>
        </div>
      </section>

      {v.videos && (
        <section className={`border-y border-ink-border bg-surface ${wrap} py-20 md:py-28`}>
          <div className="mx-auto max-w-[1180px]">
            <Reveal><p className={`${label} t-ink`}>Real product recordings</p><h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-extrabold">See {v.name} in use.</h2><p className="mt-4 max-w-xl text-[0.96rem] leading-7 text-muted">Screen recordings of the live product, not mock-ups.</p></Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {v.videos.map((video, n) => <Reveal key={video.title} delay={n * 0.08}><article className="rounded-2xl border border-ink-border bg-bg p-3"><div className="h-[520px] overflow-hidden rounded-xl bg-surface-2"><iframe className="h-full w-full" src={video.src} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><p className="px-2 pb-2 pt-4 text-sm font-bold">{video.title}</p></article></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {/* The ask */}
      <section className={`bg-bg ${wrap} py-20 md:py-28`}>
        <div className="mx-auto max-w-[1240px]">
          {v.raise ? (
            <><Reveal className="mb-10 max-w-3xl"><p className={`${label} t-ink`}>The round</p><h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-tight">Back the next stage of {v.name}.</h2></Reveal><Reveal><RaiseBand /></Reveal></>
          ) : (
            <Reveal>
              <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-[var(--t)] p-8 text-white md:p-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <motion.div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
                <div className="relative"><p className={`${label} text-white/70`}>Open to partners</p><h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-tight">Help {v.name} reach more people.</h2><p className="mt-4 max-w-lg text-[0.98rem] leading-7 text-white/80">{v.status}.</p><a href={partner(v.name)} className={`${btn} mt-8 bg-white text-[var(--t)] hover:-translate-y-0.5`}>Discuss a partnership</a></div>
                <ul className="relative space-y-3">{v.support.map((s, n) => <motion.li key={s} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: n * 0.08 }} className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 text-[0.95rem] font-semibold backdrop-blur"><span className="font-head text-xs text-white/60">0{n + 1}</span>{s}</motion.li>)}</ul>
              </div>
            </Reveal>
          )}
          {v.raise && <Reveal><div className="mt-5 rounded-[1.6rem] border border-ink-border bg-surface p-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Beyond capital, also useful</p><div className="mt-4 flex flex-wrap gap-2">{v.support.slice(1).map(s => <span key={s} className="t-soft rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold">{s}</span>)}</div></div></Reveal>}
        </div>
      </section>

      {/* Next venture */}
      <section className={`border-t border-ink-border bg-surface ${wrap} py-16`}>
        <Link href={`/support/${next.slug}`} style={toneVars(films[next.slug].tone)} className="group mx-auto flex max-w-[1240px] flex-col gap-6 rounded-[1.8rem] border border-ink-border bg-bg p-7 transition hover:border-[var(--t)] hover:shadow-xl md:flex-row md:items-center md:justify-between md:p-10">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Next venture</p><p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-tight">{next.tagline}</p></div>
          <div className="flex items-center gap-5"><span className="relative block h-10 w-40"><Image src={next.logo} alt={next.name} fill sizes="160px" className="object-contain" /></span><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--t)] text-xl text-white transition group-hover:translate-x-1.5">→</span></div>
        </Link>
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-6 text-muted">Information on this page is provided for general discussion. It is not investment advice or a public offer.</p>
      </section>
      <Footer />
    </main>
  )
}

/** Pinned on desktop: the steps scroll past while the scene on the right changes with them. */
function HowItWorks({ v, f }: { v: Venture; f: VentureFilm }) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', p => setActive(Math.min(f.steps.length - 1, Math.floor(p * f.steps.length))))
  const step = f.steps[active]

  return (
    <>
      <section ref={ref} className="relative hidden bg-bg lg:block" style={{ height: `${f.steps.length * 85 + 15}vh` }}>
        <div className={`sticky top-0 flex h-screen items-center ${wrap}`}>
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-[0.8fr_1.2fr] items-center gap-14">
            <div>
              <p className={`${label} t-ink`}>How it works</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-tight">{f.title}, step by step.</h2>
              <ol className="mt-10 space-y-2">
                {f.steps.map((s, n) => (
                  <li key={s.title} className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ${n === active ? 'border-[var(--t)] bg-surface shadow-lg' : 'border-transparent opacity-45'}`}>
                    <div className="flex items-baseline gap-4"><span className="t-ink font-head text-xs font-bold">0{n + 1}</span><div><h3 className="font-display text-lg font-extrabold">{s.title}</h3><AnimatePresence initial={false}>{n === active && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2 text-[0.9rem] leading-7 text-muted">{s.body}</motion.p>}</AnimatePresence></div></div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="overflow-hidden rounded-[1.8rem] border border-ink-border shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)]">
              <Canvas><Stage><AnimatePresence mode="wait"><motion.div key={step.scene} className="absolute inset-0" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>{f.scenes[step.scene].view()}</motion.div></AnimatePresence></Stage></Canvas>
              <div className="flex gap-1.5 border-t border-ink-border bg-surface px-5 py-4">{f.steps.map((s, n) => <span key={s.title} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${n <= active ? 'bg-[var(--t)]' : 'bg-ink-border'}`} />)}</div>
            </div>
          </div>
        </div>
      </section>
      <section className={`bg-bg ${wrap} py-20 lg:hidden`}>
        <p className={`${label} t-ink`}>How it works</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">{f.title}, step by step.</h2>
        <ol className="mt-10 space-y-10">
          {f.steps.map((s, n) => (
            <Reveal key={s.title}>
              <li>
                <div className="overflow-hidden rounded-[1.4rem] border border-ink-border"><Loop scene={f.scenes[s.scene]} tone={f.tone} every={6500} /></div>
                <div className="mt-5 flex gap-4"><span className="t-ink font-head text-xs font-bold">0{n + 1}</span><div><h3 className="font-display text-xl font-extrabold">{s.title}</h3><p className="mt-2 text-[0.92rem] leading-7 text-muted">{s.body}</p></div></div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  )
}
