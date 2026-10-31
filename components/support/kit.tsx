'use client'

import { AnimatePresence, MotionConfig, animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/** Keep server and first client render identical before applying OS preferences. */
export function useMotionPreference() {
  const preference = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && Boolean(preference)
}

export function SupportMotion({ children }: { children: ReactNode }) {
  const reduce = useMotionPreference()
  return <MotionConfig reducedMotion="user" transition={reduce ? { duration: 0, delay: 0 } : undefined}>{children}</MotionConfig>
}

export const MEETING = 'mailto:hello@ladyprowess.com?subject=Meeting%20request%20from%20your%20founder%20page'
// The KivoraPay pitch deck, published from Google Slides.
export const DECK = 'https://docs.google.com/presentation/d/e/2PACX-1vSiie8eemgLX8hCgbVUIitTVZhD-eeiUmfjrEHpqBeBccXwahwGazqVv_LxAW6SOw/pub?start=true&loop=true&delayms=3000'
export const partner = (name: string) => `mailto:hello@ladyprowess.com?subject=${encodeURIComponent(`Partnership with ${name}`)}`

/** t: brand colour, a: accent, f: the solid background the films play on. */
export type Tone = { t: string; a: string; f?: string }
export const toneVars = (tone: Tone) => ({ '--t': tone.t, '--a': tone.a, '--f': tone.f ?? tone.t }) as CSSProperties

export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useMotionPreference()
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

/** Rolls a number up from zero the first time it is seen. Keeps any prefix/suffix ("₦1.5M+", "500+"). */
export function Count({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  const reduce = useMotionPreference()
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/)
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value)
  useEffect(() => {
    if (!seen || !match || reduce) return setShown(value)
    const target = parseFloat(match[2].replace(/,/g, ''))
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
    const c = animate(0, target, { duration: 1.4, ease: 'easeOut', onUpdate: v => setShown(`${match[1]}${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${match[3]}`) })
    return () => c.stop()
  }, [seen, reduce]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className={className}>{shown}</span>
}

/* ── Scene canvas ──────────────────────────────
   Scenes are drawn on a fixed 720×450 board and scaled to fit, so the
   motion graphics keep their composition on every screen size. */
export const W = 720
export const H = 450

export function Canvas({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [s, setS] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: `${W}/${H}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${s})`, opacity: s ? 1 : 0 }}>{children}</div>
    </div>
  )
}

/** The light, brand-tinted stage the films play on. */
export function Stage({ children }: { bg?: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface text-parchment">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 85% 0%, color-mix(in srgb, var(--t) 14%, transparent), transparent 60%), radial-gradient(90% 80% at 0% 100%, color-mix(in srgb, var(--a) 12%, transparent), transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'linear-gradient(rgb(var(--border)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--border)) 1px, transparent 1px)', backgroundSize: '36px 36px', maskImage: 'radial-gradient(80% 70% at 50% 50%, black, transparent)' }} />
      {children}
    </div>
  )
}

export type Scene = { key: string; kicker: string; caption: string; view: () => ReactNode; ms?: number; bg?: string }

/**
 * A code-built film: scenes play in order with a segmented progress bar,
 * start when the film scrolls into view, and pause off screen.
 */
export function Film({ scenes, tone, label, onEnded, autoplay = true, chapters = false, className = '' }: { scenes: Scene[]; tone: Tone; label: string; onEnded?: () => void; autoplay?: boolean; chapters?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.45 })
  const reduce = useMotionPreference()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(autoplay)
  const progress = useMotionValue(0)
  const run = inView && playing && !reduce
  const scene = scenes[i]

  useEffect(() => { setI(0); progress.set(0) }, [scenes, progress])

  useEffect(() => {
    if (!run) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const next = progress.get() + (now - last) / (scene.ms ?? 4600)
      last = now
      if (next >= 1) {
        progress.set(0)
        // Films never stop on their own: roll into the next film, or loop.
        if (i === scenes.length - 1) { onEnded ? onEnded() : setI(0); return }
        setI(i + 1)
        return
      }
      progress.set(next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, i, scene, scenes.length, progress, onEnded])

  const go = (n: number) => { progress.set(0); setI(n); setPlaying(true) }
  const toggle = reduce ? <span className="text-xs text-muted">Manual playback</span> : <PlayToggle on={playing} onClick={() => { if (progress.get() >= 1) { progress.set(0); setI(0) } setPlaying(p => !p) }} />
  const stage = (
    <Canvas>
      <Stage bg={scene.bg}>
        <AnimatePresence mode="wait">
          <motion.div key={scene.key} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {scene.view()}
          </motion.div>
        </AnimatePresence>
      </Stage>
    </Canvas>
  )

  // Chapter layout: the film on the left, an ordered list of its scenes on the right.
  if (chapters) return (
    <figure ref={ref} style={toneVars(tone)} className={`grid bg-surface lg:grid-cols-[1.6fr_1fr] ${className}`} aria-label={label}>
      <div className="relative flex items-center border-b border-ink-border bg-bg lg:border-b-0 lg:border-r"><div className="w-full">{stage}</div></div>
      <figcaption className="flex flex-col p-5 md:p-7">
        <p className="t-ink font-head text-[0.62rem] font-bold uppercase tracking-[0.16em]">Scenes</p>
        <ol className="mt-3 space-y-1">
          {scenes.map((s, n) => (
            <li key={s.key}>
              <button type="button" aria-pressed={n === i} onClick={() => go(n)} className={`relative flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-left text-sm transition ${n === i ? 't-soft font-bold' : 'text-muted hover:bg-surface-2'}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-head text-[0.62rem] font-bold ${n < i ? 'bg-[var(--t)] text-white' : n === i ? 'bg-surface text-parchment ring-2 ring-[var(--t)]' : 'bg-surface-2'}`}>{n < i ? '✓' : n + 1}</span>
                <span className="flex-1">{s.kicker}</span>
                {n === i && <span className="absolute inset-x-3 bottom-0 h-[2px] overflow-hidden rounded-full bg-ink-border"><Bar progress={progress} /></span>}
              </button>
            </li>
          ))}
        </ol>
        <div className="hidden">{scenes.map((s, n) => <button key={s.key} type="button" aria-label={`Scene ${n + 1}: ${s.kicker}`} onClick={() => go(n)} className="relative h-11 flex-1 overflow-hidden rounded-full bg-ink-border">{n < i && <span className="absolute inset-0 bg-[var(--t)]" />}{n === i && <Bar progress={progress} />}</button>)}</div>
      </figcaption>
    </figure>
  )

  return (
    <figure ref={ref} style={toneVars(tone)} className={`overflow-hidden rounded-[1.75rem] border border-ink-border bg-surface shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] ${className}`} aria-label={label}>
      <div className="relative">
        {stage}
        <div className="absolute right-3 top-3">{toggle}</div>
      </div>
      <figcaption className="border-t border-ink-border px-5 pb-5 pt-4 md:px-7">
        <div className="flex gap-1.5">
          {scenes.map((s, n) => (
            <button key={s.key} type="button" onClick={() => go(n)} aria-label={`Scene ${n + 1}: ${s.kicker}`} aria-pressed={n === i} className="group relative h-11 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ink-border transition group-hover:h-[5px]">
                {n < i && <span className="absolute inset-0 bg-[var(--t)]" />}
                {n === i && <Bar progress={progress} />}
              </span>
            </button>
          ))}
        </div>
        <p className="t-ink mt-1 font-head text-[0.62rem] font-bold uppercase tracking-[0.16em]">{String(i + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')} · {scene.kicker}</p>
      </figcaption>
    </figure>
  )
}

function PlayToggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={on ? 'Pause film' : 'Play film'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface/90 text-parchment shadow ring-1 ring-ink-border backdrop-blur transition hover:scale-105">
      {on ? <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10" rx="1" /><rect x="7" y="1" width="3" height="10" rx="1" /></svg> : <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5v9l7.5-4.5z" /></svg>}
    </button>
  )
}

function Bar({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, v => `${v * 100}%`)
  return <motion.span className="absolute inset-y-0 left-0 bg-[var(--t)]" style={{ width }} />
}

/** Replays one scene on a loop: used where a single picture says enough. */
export function Loop({ scene, tone, every = 6000, className = '' }: { scene: Scene; tone: Tone; every?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [n, setN] = useState(0)
  const reduce = useMotionPreference()
  useEffect(() => {
    if (!inView || reduce) return
    const t = setInterval(() => setN(v => v + 1), every)
    return () => clearInterval(t)
  }, [inView, every, reduce])
  return (
    <div ref={ref} style={toneVars(tone)} className={className}>
      <Canvas><Stage bg={scene.bg}>{inView && <div key={n} className="absolute inset-0">{scene.view()}</div>}</Stage></Canvas>
    </div>
  )
}

/** Words that light up as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, highlight = [] }: { text: string; highlight?: { word: string; color: string }[] }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className="flex flex-wrap font-display text-[clamp(1.7rem,3.6vw,3.2rem)] font-extrabold leading-[1.18] tracking-[-0.02em]">
      {words.map((w, n) => {
        const hit = highlight.find(h => w.toLowerCase().startsWith(h.word.toLowerCase()))
        return <Word key={n} progress={scrollYProgress} range={[n / words.length, (n + 1) / words.length]} color={hit?.color}>{w}</Word>
      })}
    </p>
  )
}

function Word({ children, progress, range, color }: { children: string; progress: MotionValue<number>; range: [number, number]; color?: string }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return <motion.span style={{ opacity, color }} className="mr-[0.26em]">{children}</motion.span>
}
