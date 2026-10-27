'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CV_URL } from '@/lib/site'
import { gradeLevel, wordCount } from '@/lib/readability'
import PenNib from './PenNib'

// The hero is a document editor. The headline arrives as a jargon-heavy draft
// and edits itself, tracked-changes style, into the real headline, while
// comments in the margin react to it. Each change: strike the old words,
// collapse them, write in the new ones. Then the edits are accepted.
const changes: { del: string; ins: string; keepAfter?: string }[] = [
  { del: 'Leveraging omnichannel, user-centric content paradigms to optimise end-to-end', ins: 'I help digital products become easier to' },
  { del: 'product comprehension,', ins: 'understand,' },
  { del: 'adoption', ins: 'use', keepAfter: 'and' },
  { del: 'scalable growth.', ins: 'grow.' },
]

const DRAFT = changes.map(c => [c.del, c.keepAfter].filter(Boolean).join(' ')).join(' ')
const FINAL = changes.map(c => [c.ins, c.keepAfter].filter(Boolean).join(' ')).join(' ')
const ACCEPTED = changes.length + 1

const heroPhotos = ['/hero/mine.jpeg', '/hero/headshot1.png']

export default function RewriteHero() {
  const reduceMotion = useReducedMotion()
  // 0 = draft, 1..n = that many changes made, n+1 = all accepted.
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [photo, setPhoto] = useState(0)
  const timers = useRef<number[]>([])
  const box = useRef<HTMLDivElement>(null)
  const anchors = useRef<(HTMLSpanElement | null)[]>([])
  const nibX = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })
  const nibY = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })
  const accepted = stage >= ACCEPTED

  const clear = () => { timers.current.forEach(t => window.clearTimeout(t)); timers.current = [] }

  const play = useCallback(() => {
    clear()
    setStage(0)
    setPlaying(true)
    // Hold the draft long enough to read it, then edit.
    for (let i = 1; i <= ACCEPTED; i++) timers.current.push(window.setTimeout(() => setStage(i), 2400 + (i - 1) * 1300 + (i === ACCEPTED ? 300 : 0)))
    timers.current.push(window.setTimeout(() => setPlaying(false), 2400 + ACCEPTED * 1300))
  }, [])

  useEffect(() => {
    if (reduceMotion) setStage(ACCEPTED)
    else play()
    return clear
  }, [reduceMotion, play])

  useEffect(() => {
    const t = window.setInterval(() => { if (!document.hidden) setPhoto(p => (p + 1) % heroPhotos.length) }, 6000)
    return () => window.clearInterval(t)
  }, [])

  // The pen nib follows the edit as it happens: above the first word before
  // anything changes, then at the end of whatever is visible in the change being
  // made, so it looks like it is writing the new words in. Tracked every frame
  // because the words are still collapsing and growing.
  useEffect(() => {
    if (accepted || reduceMotion) return
    let frame = 0
    const track = () => {
      // At stage i, change i-1 is the one being made.
      const group = anchors.current[Math.max(0, stage - 1)]
      if (group && box.current) {
        const words = Array.from(group.querySelectorAll<HTMLElement>('[data-word]')).filter(w => w.getBoundingClientRect().width > 2)
        const word = stage === 0 ? words[0] : words[words.length - 1]
        if (word) {
          const a = word.getBoundingClientRect(), b = box.current.getBoundingClientRect()
          nibX.set(a.left - b.left + (stage === 0 ? a.width * 0.5 : a.width) - 6)
          nibY.set(a.top - b.top - 20)
        }
      }
      frame = requestAnimationFrame(track)
    }
    frame = requestAnimationFrame(track)
    return () => cancelAnimationFrame(frame)
  }, [stage, accepted, reduceMotion, nibX, nibY])

  const showDraft = () => { clear(); setPlaying(false); setStage(0) }
  const showFinal = () => { clear(); setPlaying(false); setStage(ACCEPTED) }

  return <section id="top" className="relative overflow-hidden bg-surface-2/60 pb-16 pt-24 md:pb-24 md:pt-32">
    <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    <div aria-hidden="true" className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[110px]" />
    <div aria-hidden="true" className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-accent-invert/20 blur-[120px]" />

    <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-muted">
        <span className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#84CC16]/60 motion-reduce:hidden" /><span className="relative h-2 w-2 rounded-full bg-[#84CC16]" /></span>Available for selected projects</span>
        <span className="hidden font-head text-[10px] uppercase tracking-[.16em] md:inline">Ngozi Peace Okafor · Digital Product &amp; Content Specialist</span>
      </div>

      <div className="relative">
        {/* The editor window */}
        <div className="relative overflow-hidden rounded-[22px] border border-ink-border bg-surface shadow-[0_50px_120px_-40px_rgba(17,24,39,.45),0_2px_6px_rgba(17,24,39,.05)] md:rounded-[28px]">
          {/* Title bar */}
          <div className="flex items-center gap-3 border-b border-ink-border px-4 py-3 md:px-5">
            <span className="hidden gap-1.5 sm:flex" aria-hidden="true">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}</span>
            <span className="truncate text-sm font-semibold">homepage-headline.docx</span>
            <motion.span key={accepted ? 'final' : 'suggesting'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className={`shrink-0 rounded-full px-2.5 py-0.5 font-head text-[10px] font-semibold uppercase tracking-wider ${accepted ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>{accepted ? '✓ Final' : '✎ Suggesting'}</motion.span>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden -space-x-2 sm:flex">
                <span className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-surface"><Image src="/hero/mine.jpeg" alt="" fill sizes="28px" className="object-cover object-top" /></span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-[8px] font-bold text-muted ring-2 ring-surface">You</span>
              </div>
              <a href="#contact" className="whitespace-nowrap rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-dim">Work with me</a>
            </div>
          </div>

          {/* Toolbar: the draft / edit switch lives here */}
          <div className="flex flex-wrap items-center gap-2 border-b border-ink-border bg-surface-2/50 px-4 py-2 md:px-5">
            <div className="hidden items-center gap-0.5 font-display text-sm text-muted md:flex" aria-hidden="true">
              <span className="rounded px-2 py-1 font-bold">B</span><span className="rounded px-2 py-1 italic">I</span><span className="rounded px-2 py-1 underline">U</span>
              <span className="mx-2 h-4 w-px bg-ink-border" />
              <span className="rounded px-2 py-1 text-xs">H1</span><span className="rounded px-2 py-1 text-xs">Aa</span>
              <span className="mx-2 h-4 w-px bg-ink-border" />
            </div>
            <div className="flex rounded-full border border-ink-border bg-surface p-0.5 text-xs font-semibold" role="group" aria-label="Headline version">
              <button type="button" onClick={showDraft} aria-pressed={stage === 0} className={`rounded-full px-3 py-1 transition ${stage === 0 ? 'bg-parchment text-bg' : 'text-muted hover:text-parchment'}`}>Their draft</button>
              <button type="button" onClick={showFinal} aria-pressed={accepted} className={`rounded-full px-3 py-1 transition ${accepted ? 'bg-primary text-on-primary' : 'text-muted hover:text-parchment'}`}>My edit</button>
            </div>
            <button type="button" onClick={play} disabled={playing} className="rounded-full px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/[0.08] disabled:opacity-40">↺ Watch the edit</button>
          </div>

          {/* Ruler */}
          <div aria-hidden="true" className="hidden h-5 border-b border-ink-border bg-surface md:block" style={{ backgroundImage: 'repeating-linear-gradient(to right, rgb(var(--muted) / .35) 0 1px, transparent 1px 12px)', backgroundSize: '100% 5px', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />

          <div className="grid lg:grid-cols-[1fr_320px]">
            {/* The page */}
            <div className="bg-paper px-6 py-10 sm:px-10 md:px-14 md:py-14">
              <p className="font-head text-[10px] uppercase tracking-[.18em] text-muted">Headline · draft 3 of 3</p>
              <h1 className="sr-only">{FINAL}</h1>
              <div ref={box} aria-hidden="true" className="relative mt-5 max-w-[17em] font-display text-[clamp(2rem,4.3vw,3.9rem)] font-bold leading-[1.12] tracking-[-0.045em]">
                <motion.div className="pointer-events-none absolute left-0 top-0 z-10" style={{ x: nibX, y: nibY }} animate={{ opacity: !accepted && !reduceMotion ? 1 : 0 }} transition={{ duration: 0.3 }}>
                  <PenNib className="h-6 w-4 drop-shadow-[0_4px_8px_rgba(37,99,235,.35)]" />
                </motion.div>
                {changes.map((c, i) => {
                  const made = stage > i
                  return <span key={i} ref={el => { anchors.current[i] = el }}>
                    {c.del.split(' ').map((w, j) => <motion.span key={`d${j}`} data-word className="relative inline-block overflow-hidden whitespace-nowrap align-bottom"
                      initial={false} animate={made ? { width: 0, marginRight: 0, opacity: 0 } : { width: 'auto', marginRight: '0.26em', opacity: 1 }}
                      transition={{ duration: reduceMotion ? 0 : 0.45, delay: made && !reduceMotion ? 0.42 : 0, ease: [0.22, 1, 0.36, 1] }}>
                      <span className={made ? 'text-muted' : 'text-parchment/80'}>{w}</span>
                      <motion.span className="absolute left-0 right-0 top-[55%] h-[0.07em] origin-left bg-muted" initial={false} animate={{ scaleX: made ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.35 }} />
                    </motion.span>)}
                    {c.ins.split(' ').map((w, j) => <motion.span key={`i${j}`} data-word className={`inline-block overflow-hidden whitespace-nowrap align-bottom transition-colors duration-500 ${accepted ? 'text-parchment' : 'text-primary underline decoration-primary/40 decoration-[0.06em] underline-offset-[0.14em]'}`}
                      initial={false} animate={made ? { width: 'auto', marginRight: '0.26em', opacity: 1 } : { width: 0, marginRight: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.4, delay: made && !reduceMotion ? 0.62 + j * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>)}
                    {c.keepAfter && <span className="mr-[0.26em] inline-block">{c.keepAfter}</span>}
                  </span>
                })}
              </div>
              <p className="mt-7 max-w-2xl text-base leading-8 text-muted md:text-lg">I’m Ngozi, a Digital Product and Content Specialist. I take products that are hard to explain and make them easy to understand, trust and use.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#try" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-[0_10px_30px_rgb(var(--primary)/.25)] hover:bg-primary-dim">Give me some jargon ↓</a>
                <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink-border bg-surface px-6 py-3 text-sm font-semibold hover:border-muted">View résumé ↗</a>
              </div>
            </div>

            {/* The margin: comments react to the edit as it happens */}
            <aside aria-label="Comments" className="border-t border-ink-border bg-surface-2/40 p-4 md:p-5 lg:border-l lg:border-t-0">
              <p className="mb-3 flex items-center justify-between font-head text-[10px] uppercase tracking-wider text-muted"><span>Comments</span><span>{accepted ? '0 open' : '2 open'}</span></p>
              <div className="space-y-3">
                <Comment who="A first-time reader" initials="R" resolved={accepted}>I read this twice. What does this company actually do?</Comment>
                <AnimatePresence>{stage >= 1 && <Comment key="ngozi" who="Ngozi" photo resolved={accepted}>Cut the jargon. Say what it does and who it helps.</Comment>}</AnimatePresence>
                <AnimatePresence>{accepted && <Comment key="reply" who="A first-time reader" initials="R" tone="success">Oh. Now I get it.</Comment>}</AnimatePresence>
              </div>
            </aside>
          </div>

          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-ink-border bg-surface px-4 py-2.5 font-head text-[10px] uppercase tracking-wider text-muted md:px-5 xl:pr-36">
            <span>Reading grade <span className="text-parchment">{gradeLevel(DRAFT)}</span> → <span className={accepted ? 'text-success' : 'text-parchment'}>{accepted ? gradeLevel(FINAL) : '…'}</span></span>
            <span>Words <span className="text-parchment">{wordCount(DRAFT)}</span> → <span className={accepted ? 'text-success' : 'text-parchment'}>{accepted ? wordCount(FINAL) : '…'}</span></span>
            <span className="ml-auto flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${accepted ? 'bg-success' : 'bg-primary motion-safe:animate-pulse'}`} />{accepted ? 'All changes saved' : 'Editing…'}</span>
          </div>
        </div>

        {/* A photo pinned to the corner of the window, like a collaborator card */}
        <div className="absolute -bottom-14 -right-8 hidden w-[150px] rotate-[3deg] rounded-2xl border border-ink-border bg-surface p-2.5 shadow-[0_30px_60px_-20px_rgba(17,24,39,.4)] transition-transform duration-500 hover:rotate-0 xl:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-2">
            {heroPhotos.map((src, i) => <Image key={src} src={src} alt="Ngozi Peace Okafor" aria-hidden={i !== photo} fill priority={i === 0} sizes="200px" className={`object-cover object-top transition-opacity duration-700 ${i === photo ? 'opacity-100' : 'opacity-0'}`} />)}
          </div>
          <p className="mt-2.5 flex items-center gap-1.5 px-1 text-xs font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-[#84CC16]" />Ngozi is editing</p>
        </div>
      </div>
    </div>
  </section>
}

function Comment({ who, initials, photo, resolved, tone, children }: { who: string; initials?: string; photo?: boolean; resolved?: boolean; tone?: 'success'; children: React.ReactNode }) {
  return <motion.div layout initial={{ opacity: 0, x: 16 }} animate={{ opacity: resolved ? 0.55 : 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
    className={`rounded-xl border bg-surface p-3.5 shadow-[0_6px_20px_rgba(17,24,39,.05)] ${tone === 'success' ? 'border-success/40' : 'border-ink-border'}`}>
    <div className="flex items-center gap-2">
      {photo ? <span className="relative h-6 w-6 overflow-hidden rounded-full"><Image src="/hero/mine.jpeg" alt="" fill sizes="24px" className="object-cover object-top" /></span>
        : <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-[10px] font-bold text-muted">{initials}</span>}
      <span className="text-xs font-semibold">{who}</span>
      {resolved && <span className="ml-auto text-[10px] font-semibold text-success">✓ Resolved</span>}
    </div>
    <p className={`mt-2 text-sm leading-5 ${tone === 'success' ? 'text-success' : ''}`}>{children}</p>
  </motion.div>
}
