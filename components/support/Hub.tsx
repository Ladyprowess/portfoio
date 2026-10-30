'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { clients, testimonials } from '@/lib/home-content'
import { ventures, type Venture } from '@/lib/ventures'
import { Count, DECK, Film, Loop, MEETING, Reveal, ScrollWords, partner, toneVars } from './kit'
import { films } from './scenes'
import Donate from './Donate'
import { investmentStories } from './InvestorIntro'

const label = 'font-head text-[0.64rem] font-bold uppercase tracking-[0.18em]'
const btn = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition'
const kivora = ventures.find(v => v.slug === 'kivorapay')!

/* ── 1. Meet the founder ─────────────────────── */

export function FounderHero() {
  const lines = [['I', 'build', 'businesses'], ['from', 'problems'], ['I\u2019ve', 'lived.']]
  let w = 0
  return (
    <section className="relative overflow-hidden border-b border-ink-border bg-surface px-6 pb-16 pt-32 sm:px-8 md:px-20 md:pb-20 md:pt-36">
      <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgb(var(--border)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--border)) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(70% 60% at 70% 40%, black, transparent)' }} />
      <motion.div aria-hidden className="absolute -right-32 -top-32 h-[38rem] w-[38rem] rounded-full bg-primary/[0.10] blur-3xl" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 12 }} />
      <div aria-hidden className="absolute -bottom-40 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#F5A70E]/[0.08] blur-3xl" />

      <div className="relative mx-auto grid max-w-[1240px] gap-16 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12">
        <div>
          <Reveal>
            <a href="#invest" className="inline-flex items-center gap-2.5 rounded-full border border-ink-border bg-surface py-1.5 pl-1.5 pr-4 text-xs font-semibold shadow-sm transition hover:border-primary/40">
              <span className="relative flex h-6 items-center gap-1.5 rounded-full bg-primary px-2.5 text-[0.68rem] font-bold text-on-primary"><span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 animate-ping rounded-full bg-white/80" /><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>Raising</span>
              KivoraPay $500K seed round <span className="text-muted">→</span>
            </a>
          </Reveal>
          <h1 className="mt-7 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            {lines.map((line, l) => (
              <span key={l} className="block">
                {line.map(word => {
                  const n = w++
                  return <motion.span key={word} initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.1 + n * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className={`mr-[0.22em] inline-block ${l === 2 ? 'bg-[linear-gradient(100deg,#2563EB,#0E9AA0_55%,#D9900B)] bg-clip-text pb-1 text-transparent' : ''}`}>{word}</motion.span>
                })}
              </span>
            ))}
          </h1>
          <Reveal delay={0.45}><p className="mt-7 max-w-[34rem] text-[1.04rem] leading-[1.8] text-muted md:text-[1.1rem]">I&apos;m Ngozi Peace Okafor. For nine years I&apos;ve written, marketed and shaped products for fintech and Web3 teams. Now I&apos;m building three companies of my own, each born from a problem I hit first.</p></Reveal>
          <Reveal delay={0.6}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={MEETING} className={`${btn} bg-primary text-on-primary shadow-[0_14px_30px_-12px_rgba(37,99,235,0.7)] hover:-translate-y-0.5 hover:bg-primary-dim`}>Arrange a conversation</a>
              <Donate className={`${btn} border border-ink-border bg-surface hover:border-primary/40`}>Donate to our cause</Donate>
            </div>
          </Reveal>
        </div>
        <Portrait />
      </div>

      <Reveal delay={0.8} className="relative mx-auto mt-20 max-w-[1240px] lg:mt-24">
        <dl className="grid grid-cols-2 overflow-hidden rounded-[1.6rem] border border-ink-border bg-surface/80 backdrop-blur md:grid-cols-4">
          {[['9+', 'years writing and building'], [`${clients.length}`, 'teams in fintech, Web3 and tech'], ['200+', 'people trained'], ['3', 'ventures live']].map(([v, l], n) => (
            <div key={l} className={`flex flex-col-reverse gap-1 p-6 md:p-7 ${n % 2 ? 'border-l border-ink-border' : ''} ${n > 1 ? 'border-t border-ink-border md:border-t-0' : ''} ${n === 2 ? 'md:border-l' : ''}`}>
              <dt className="text-xs leading-5 text-muted">{l}</dt>
              <dd className="font-display text-3xl font-extrabold tracking-[-0.02em] md:text-4xl"><Count value={v} /></dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}

const rail = [
  { slug: 'kivorapay', name: 'KivoraPay', line: 'Crypto payments', c: '#1D4ED8' },
  { slug: 'prowess-digital-solutions', name: 'PDS', line: 'Business support', c: '#2F6E72' },
  { slug: 'dritchwear', name: 'Dritchwear', line: 'Custom merch', c: '#4A2D82' },
]

function Portrait() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] pb-12">
      <div aria-hidden className="absolute -inset-10 top-10 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.18),transparent)] blur-2xl" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] bg-surface-2 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.55)] ring-[6px] ring-surface">
        <Image src="/personal%20photo/headshot2.png" alt="Ngozi Peace Okafor" fill priority sizes="(max-width: 1024px) 90vw, 440px" className="object-cover object-top" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3.5 py-1.5 text-xs font-bold shadow backdrop-blur">Ngozi Peace Okafor · Founder</span>
      </motion.div>
      <div className="absolute inset-x-[-6%] bottom-0 grid grid-cols-3 gap-2 sm:inset-x-[-10%]">
        {rail.map((r, n) => (
          <motion.div key={r.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + n * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <Link href={`/support/${r.slug}`} className="group block rounded-2xl border border-ink-border bg-surface p-3 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 sm:p-4">
              <span className="block h-1 w-8 rounded-full" style={{ background: r.c }} />
              <b className="mt-2.5 block truncate font-display text-[0.86rem] font-extrabold sm:text-[0.95rem]">{r.name}</b>
              <span className="block truncate text-[0.7rem] text-muted sm:text-xs">{r.line}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── 2. Track record ─────────────────────────── */

export function Credibility() {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(v => (v + 1) % testimonials.length), 6500); return () => clearInterval(id) }, [])
  const half = Math.ceil(clients.length / 2)
  const rows = [clients.slice(0, half), clients.slice(half)]
  return (
    <section className="overflow-hidden border-b border-ink-border bg-surface py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <p className={`${label} text-primary`}>Execution, proven on other people&apos;s products first</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">{clients.length} teams trusted me to explain what they built.</h2>
        <p className="mx-auto mt-5 max-w-xl text-[0.98rem] leading-8 text-muted">Developer documentation, content strategy, product marketing and websites, mostly for fintech and Web3. That is how I learned what makes a product trusted.</p>
      </Reveal>

      <div className="relative mt-14 space-y-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="group flex w-max gap-4 motion-safe:animate-[brand-marquee_48s_linear_infinite] hover:[animation-play-state:paused]" style={{ animationDirection: r ? 'reverse' : 'normal' }}>
            {[...row, ...row].map((c, n) => (
              <a key={`${c.name}-${n}`} href={c.href} target="_blank" rel="noopener noreferrer" aria-hidden={n >= row.length} tabIndex={n >= row.length ? -1 : undefined} className="flex h-[88px] w-[340px] shrink-0 items-center gap-4 rounded-2xl border border-ink-border bg-bg px-5 transition hover:border-primary/40 hover:shadow-lg">
                <span className="relative flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-ink-border"><Image src={c.image} alt="" fill sizes="96px" className="object-contain p-1.5" /></span>
                <span className="min-w-0"><b className="block truncate text-[0.95rem]">{c.name}</b><span className="block truncate text-[0.78rem] text-muted">{c.did}</span></span>
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 grid max-w-[1180px] gap-4 px-6 sm:px-8 md:grid-cols-4 md:px-12">
        <Reveal className="md:col-span-2">
          <div className="relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.8rem] bg-primary p-8 text-on-primary">
            <AnimatePresence mode="wait">
              <motion.blockquote key={t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }}>
                <p className="font-display text-lg font-bold leading-snug md:text-xl">&ldquo;{testimonials[t].quote}&rdquo;</p>
                <footer className="mt-5 text-sm text-on-primary/80">{testimonials[t].name} · {testimonials[t].role}</footer>
              </motion.blockquote>
            </AnimatePresence>
            <div className="mt-6 flex gap-1.5">{testimonials.map((_, n) => <button key={n} type="button" aria-label={`Testimonial ${n + 1}`} onClick={() => setT(n)} className={`h-1.5 rounded-full transition-all ${n === t ? 'w-6 bg-on-primary' : 'w-1.5 bg-on-primary/40'}`} />)}</div>
          </div>
        </Reveal>
        {[['45%', 'fewer repeat customer issues, fixed at the root cause at Soofluffy'], ['200+', 'businesses and people trained through Prowess Digital Solutions']].map(([v, l], n) => (
          <Reveal key={v} delay={0.1 + n * 0.1}>
            <div className="flex h-full min-h-[260px] flex-col justify-between rounded-[1.8rem] border border-ink-border bg-bg p-8">
              <p className="font-display text-5xl font-extrabold tracking-[-0.03em] text-primary"><Count value={v} /></p>
              <p className="text-sm leading-6 text-muted">{l}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── 3. The pattern ──────────────────────────── */

export function Pattern() {
  return (
    <section className="bg-bg px-6 py-24 sm:px-8 md:px-20 md:py-36">
      <div className="mx-auto max-w-[1080px]">
        <p className={`${label} mb-8 text-primary`}>Why these three</p>
        <ScrollWords
          text="I tried to pay an electricity bill with crypto and needed a trader to do it. I watched good business ideas stall for lack of structure. I saw teams struggle to find a merch supplier they could trust. So I built the fix. Three times."
          highlight={[{ word: 'crypto', color: '#2563EB' }, { word: 'structure', color: '#0E9AA0' }, { word: 'merch', color: '#D9900B' }, { word: 'Three', color: '#2563EB' }]}
        />
      </div>
    </section>
  )
}

/* ── 4. What I'm building ────────────────────── */

const order = ['kivorapay', 'prowess-digital-solutions', 'dritchwear']

export function Theatre() {
  const [i, setI] = useState(0)
  const film = films[order[i]]
  return (
    <section id="films" className="scroll-mt-20 border-t border-ink-border bg-bg px-4 py-20 sm:px-8 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="mb-10 px-2">
          <p className={`${label} text-primary`}>What I&apos;m building</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold leading-none tracking-[-0.03em]">See the problem. Understand the business.</h2>
          <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-muted">Choose a venture and follow its product story. Explore each step at your own pace, then see who it serves, how it earns and what comes next.</p>
        </Reveal>
        <Reveal>
          <div style={toneVars(film.tone)} className="overflow-hidden rounded-[2rem] border border-ink-border bg-surface shadow-[0_40px_90px_-45px_rgba(15,23,42,0.5)]">
            <div aria-label="Choose a product story" className="grid grid-cols-3 border-b border-ink-border">
              {order.map((slug, n) => {
                const f = films[slug]
                const v = ventures.find(x => x.slug === slug)!
                const on = n === i
                return (
                  <button key={slug} aria-pressed={on} type="button" onClick={() => setI(n)} style={toneVars(f.tone)} className={`relative flex flex-col items-start gap-1.5 px-3 py-4 text-left transition sm:px-6 md:flex-row md:items-center md:gap-4 ${n ? 'border-l border-ink-border' : ''} ${on ? 'bg-surface' : 'bg-bg/70 hover:bg-surface'}`}>
                    <span className="flex items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--t)] transition ${on ? '' : 'opacity-40'}`} /><span className={`font-display text-[0.95rem] font-extrabold ${on ? '' : 'text-muted'}`}>{f.short}</span></span>
                    <span className={`hidden text-sm md:block ${on ? 'text-parchment' : 'text-muted'}`} aria-label={v.name}>{f.title}</span>
                    {on && <motion.span layoutId="film-tab" className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--t)]" />}
                  </button>
                )
              })}
            </div>
            <Film key={order[i]} chapters scenes={film.scenes} tone={film.tone} label={`${film.short}: ${film.title}`} />
            <dl className="grid gap-5 border-t border-ink-border px-6 py-6 md:grid-cols-3">
              {[['Who it serves', investmentStories[order[i]].customer], ['Business model', investmentStories[order[i]].revenue], ['Where you fit', investmentStories[order[i]].support]].map(([title, text]) => <div key={title}><dt className="text-xs font-bold uppercase tracking-widest text-muted">{title}</dt><dd className="mt-2 text-sm font-semibold leading-6">{text}</dd></div>)}
            </dl>
            <div className="flex items-center justify-between gap-4 border-t border-ink-border bg-bg/60 px-5 py-4 md:px-7">
              <p className="hidden text-xs text-muted sm:block">Product illustration · Select any chapter to explore</p>
              <Link href={`/support/${order[i]}`} className="t-ink text-sm font-bold hover:underline">Read the {film.short} investment story →</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const loopScene: Record<string, number> = { kivorapay: 2, 'prowess-digital-solutions': 2, dritchwear: 1 }

export function VentureStack() {
  const wrap = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  return (
    <section className="border-t border-ink-border bg-bg px-4 pb-16 pt-16 sm:px-8 md:px-12 md:pb-24 md:pt-24">
      <Reveal className="mx-auto mb-8 max-w-[1240px] px-2 md:mb-10">
        <p className={`${label} text-primary`}>Each venture up close</p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.8rem,4vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">Traction, revenue and where support goes.</h2>
      </Reveal>
      <div ref={wrap} className="mx-auto max-w-[1240px]">
        {ventures.map((v, n) => (
          <StackItem key={v.slug} n={n} count={ventures.length} progress={scrollYProgress}>
            <VentureCard v={v} n={n} />
          </StackItem>
        ))}
      </div>
    </section>
  )
}

/** Each card pins below the nav; the next one slides over it while it shrinks back. */
function StackItem({ n, count, progress, children }: { n: number; count: number; progress: MotionValue<number>; children: ReactNode }) {
  const depth = count - 1 - n
  const scale = useTransform(progress, [n / count, 1], [1, 1 - depth * 0.05])
  const filter = useTransform(progress, [n / count, 1], ['brightness(1)', `brightness(${1 - depth * 0.08})`])
  return (
    <div className="sticky pb-5 md:pb-8" style={{ top: `calc(var(--nav-h) + 12px + ${n * 18}px)` }}>
      <motion.div style={{ scale, filter, transformOrigin: 'top center' }}>{children}</motion.div>
    </div>
  )
}

function VentureCard({ v, n }: { v: Venture; n: number }) {
  const f = films[v.slug]
  return (
    <article style={toneVars(f.tone)} className="relative grid overflow-hidden rounded-[1.8rem] border border-ink-border bg-surface shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] lg:min-h-[500px] lg:grid-cols-[0.95fr_1.05fr]">
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 0% 0%, color-mix(in srgb, var(--t) 10%, transparent), transparent 70%)' }} />
      <div className="relative order-2 flex flex-col p-5 md:p-9 lg:order-1">
        <div className="flex items-center justify-between gap-4">
          <span className="relative block h-8 w-32 md:h-10 md:w-40"><Image src={v.logo} alt={v.name} fill sizes="160px" className="object-contain object-left" /></span>
          <span className="font-head text-xs font-bold text-muted">0{n + 1} / 03</span>
        </div>
        <h3 className="mt-4 font-display text-[clamp(1.4rem,2.6vw,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] md:mt-6">{v.tagline}</h3>
        <p className="mt-3 hidden text-[0.95rem] leading-7 text-muted md:block">{v.summary}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 border-y border-ink-border py-4 md:mt-6 md:py-5">
          {v.stats.slice(0, 3).map(s => <div key={s.label}><p className="t-ink font-display text-xl font-extrabold md:text-2xl"><Count value={s.value} /></p><p className="mt-1 text-[0.68rem] leading-4 text-muted">{s.label}</p></div>)}
        </div>
        <div className="mt-4 hidden flex-wrap gap-2 md:flex">{v.model.slice(0, 3).map(m => <span key={m} className="t-soft rounded-full px-3 py-1 text-[0.74rem] font-semibold">{m}</span>)}</div>
        <div className="mt-auto flex flex-wrap gap-3 pt-5 md:pt-7">
          <Link href={`/support/${v.slug}`} className={`${btn} min-h-11 flex-1 bg-[var(--t)] px-5 py-3 text-white hover:-translate-y-0.5 hover:opacity-95 sm:flex-none`}>Explore {f.short} →</Link>
          {v.raise ? <a href={DECK} className={`${btn} hidden border border-ink-border hover:border-[var(--t)] sm:inline-flex`}>Request the deck</a> : <a href={partner(v.name)} className={`${btn} hidden border border-ink-border hover:border-[var(--t)] sm:inline-flex`}>Discuss a partnership</a>}
        </div>
      </div>
      <div className="relative order-1 flex items-center p-3 pb-0 md:p-8 lg:order-2 lg:pl-0">
        <div className="w-full overflow-hidden rounded-[1.3rem] border border-ink-border shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)]">
          <Loop scene={f.scenes[loopScene[v.slug]]} tone={f.tone} every={6500} />
          <p className="hidden border-t border-ink-border bg-surface px-4 py-3 text-xs font-semibold text-muted md:block"><span className="t-ink">Product illustration</span> · {f.scenes[loopScene[v.slug]].caption}</p>
        </div>
      </div>
    </article>
  )
}

/* ── 5. The opportunity ──────────────────────── */

export function Opportunity() {
  return (
    <section id="invest" className="scroll-mt-20 border-t border-ink-border bg-surface px-6 py-20 sm:px-8 md:px-20 md:py-28">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="mb-12 max-w-3xl">
          <p className={`${label} text-primary`}>The opportunity</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-extrabold leading-[1.04] tracking-[-0.02em]">One round open. Two ventures open to partners.</h2>
        </Reveal>
        <Reveal><RaiseBand /></Reveal>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {ventures.filter(v => !v.raise).map((v, n) => {
            const f = films[v.slug]
            return (
              <Reveal key={v.slug} delay={n * 0.1}>
                <article style={toneVars(f.tone)} className="group flex h-full flex-col rounded-[1.8rem] border border-ink-border bg-bg p-7 transition hover:-translate-y-1 hover:shadow-xl md:p-9">
                  <div className="flex items-center justify-between"><span className="relative block h-10 w-40"><Image src={v.logo} alt={v.name} fill sizes="160px" className="object-contain object-left" /></span><span className="t-soft t-ink rounded-full px-3 py-1 text-xs font-bold">Open to partners</span></div>
                  <h3 className="mt-6 font-display text-2xl font-extrabold">{v.tagline}</h3>
                  <ul className="mt-5 space-y-2.5">{v.support.map(s => <li key={s} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--t)]" />{s}</li>)}</ul>
                  <div className="mt-auto flex flex-wrap gap-3 pt-8">
                    <a href={partner(v.name)} className={`${btn} bg-[var(--t)] text-white hover:opacity-95`}>Discuss a partnership</a>
                    <Link href={`/support/${v.slug}`} className={`${btn} border border-ink-border hover:border-[var(--t)]`}>Explore {f.short}</Link>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function RaiseBand() {
  const raise = kivora.raise!
  const colors = ['#2563EB', '#60A5FA', '#93C5FD', '#DBEAFE']
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1D4ED8,#2563EB_45%,#1E3A8A)] p-7 text-white md:p-12">
      <motion.div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
      <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div>
          <span className="relative block h-9 w-36 rounded-lg bg-white px-2"><Image src="/brands/kivorapay.png" alt="KivoraPay" fill sizes="144px" className="object-contain p-1.5" /></span>
          <p className="mt-8 text-sm font-semibold text-white/75">KivoraPay seed round</p>
          <p className="font-display text-[clamp(4rem,9vw,7.5rem)] font-extrabold leading-none tracking-[-0.04em]"><Count value={raise.amount} /></p>
          <p className="mt-4 max-w-md text-[0.98rem] leading-7 text-white/80">To take crypto spending from early traction to a reliable, compliant product people use every week.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={MEETING} className={`${btn} bg-white text-[#1D4ED8] hover:-translate-y-0.5`}>Discuss the round</a>
            <a href={DECK} className={`${btn} border border-white/40 hover:bg-white/10`}>Request the deck</a>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/20">
            {raise.details.map(d => <div key={d.label} className="bg-[#1E40AF]/60 p-5 backdrop-blur"><p className="font-display text-xl font-extrabold">{d.value}</p><p className="mt-1 text-xs text-white/70">{d.label}</p></div>)}
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-white/70">Use of funds</p>
          <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-white/15">
            {raise.allocation.map((a, n) => <motion.div key={a.label} initial={{ width: 0 }} whileInView={{ width: a.percent }} viewport={{ once: true }} transition={{ delay: 0.3 + n * 0.2, duration: 0.8 }} style={{ background: colors[n] }} />)}
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {raise.allocation.map((a, n) => <li key={a.label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[n] }} /><b>{a.percent}</b><span className="text-white/75">{a.label}</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ── 6. Start a conversation ─────────────────── */

export function Conversation() {
  const options = [
    { title: 'Arrange a conversation', body: 'Walk through the ventures, the numbers and where you could fit.', href: MEETING, cta: 'Arrange a conversation', main: true },
    { title: 'Donate to our cause', body: 'Give through crypto with KivoraPay, PayPal or Payoneer.', href: '', cta: 'Choose how to give', donate: true },
    { title: 'Partner or sponsor', body: 'Training, tools, production, distribution or corporate merch with PDS or Dritchwear.', href: partner('Prowess Digital Solutions or Dritchwear'), cta: 'Start the conversation' },
  ]
  return (
    <section className="relative overflow-hidden bg-bg px-6 py-24 sm:px-8 md:px-20 md:py-32">
      <div aria-hidden className="absolute left-1/2 top-0 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-3xl" />
      <div className="relative mx-auto max-w-[1180px] text-center">
        <Reveal>
          <p className={`${label} text-primary`}>Start a conversation</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2.2rem,4.6vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.025em]">Let&apos;s talk about where you fit.</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 text-left md:grid-cols-3">
          {options.map((o, n) => (
            <Reveal key={o.title} delay={n * 0.1}>
              {(() => {
                const cls = `group flex h-full w-full flex-col rounded-[1.8rem] border p-8 text-left transition hover:-translate-y-1.5 hover:shadow-2xl ${o.main ? 'border-primary bg-primary text-on-primary' : 'border-ink-border bg-surface hover:border-primary/40'}`
                const body = <>
                  <span className={`font-head text-xs font-bold ${o.main ? 'text-on-primary/70' : 'text-primary'}`}>0{n + 1}</span>
                  <h3 className="mt-6 font-display text-2xl font-extrabold">{o.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${o.main ? 'text-on-primary/85' : 'text-muted'}`}>{o.body}</p>
                  <span className="mt-auto pt-8 text-sm font-bold">{o.cta} <span className="inline-block transition group-hover:translate-x-1">→</span></span>
                </>
                return o.donate ? <Donate className={cls}>{body}</Donate> : <a href={o.href} className={cls}>{body}</a>
              })()}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
