'use client'

import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export const MEETING = 'mailto:hello@ladyprowess.com?subject=Meeting%20request%20from%20your%20founder%20page'
export const DECK = 'mailto:hello@ladyprowess.com?subject=KivoraPay%20deck%20request'
export const partner = (name: string) => `mailto:hello@ladyprowess.com?subject=${encodeURIComponent(`Partnership with ${name}`)}`

export type Tone = { t: string; a: string }
export const toneVars = (tone: Tone) => ({ '--t': tone.t, '--a': tone.a }) as CSSProperties

export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

/** Rolls a number up from zero the first time it is seen. Keeps any prefix/suffix ("₦1.5M+", "500+"). */
export function Count({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/)
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value)
  useEffect(() => {
    if (!seen || !match) return setShown(value)
    const target = parseFloat(match[2].replace(/,/g, ''))
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
    const c = animate(0, target, { duration: 1.4, ease: 'easeOut', onUpdate: v => setShown(`${match[1]}${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${match[3]}`) })
    return () => c.stop()
  }, [seen]) // eslint-disable-line react-hooks/exhaustive-deps
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

/** The tinted stage every scene sits on. */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 85% 0%, color-mix(in srgb, var(--t) 16%, transparent), transparent 60%), radial-gradient(90% 80% at 0% 100%, color-mix(in srgb, var(--a) 14%, transparent), transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'linear-gradient(rgb(var(--border)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--border)) 1px, transparent 1px)', backgroundSize: '36px 36px', maskImage: 'radial-gradient(80% 70% at 50% 50%, black, transparent)' }} />
      {children}
    </div>
  )
}

export type Scene = { key: string; kicker: string; caption: string; view: () => ReactNode; ms?: number }

/**
 * A code-built film: scenes play in order with a segmented progress bar,
 * start when the film scrolls into view, and pause off screen.
 */
export function Film({ scenes, tone, label, onEnded, autoplay = true, chapters = false, className = '' }: { scenes: Scene[]; tone: Tone; label: string; onEnded?: () => void; autoplay?: boolean; chapters?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.45 })
  const reduce = useReducedMotion()
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
  const toggle = <PlayToggle on={playing && !reduce} onClick={() => setPlaying(p => !p)} />
  const stage = (
    <Canvas>
      <Stage>
        <AnimatePresence mode="wait">
          <motion.div key={scene.key} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45 }}>
            {scene.view()}
          </motion.div>
        </AnimatePresence>
      </Stage>
    </Canvas>
  )
  const caption = (
    <AnimatePresence mode="wait">
      <motion.div key={scene.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
        <p className="t-ink font-head text-[0.6rem] font-bold uppercase tracking-[0.16em]">{String(i + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')} · {scene.kicker}</p>
        <p className={`mt-1.5 font-display font-bold leading-snug ${chapters ? 'text-[1.15rem] md:text-[1.35rem]' : 'text-[1.02rem] md:text-[1.2rem]'}`}>{scene.caption}</p>
      </motion.div>
    </AnimatePresence>
  )

  // Chapter layout: the film on the left, an ordered list of its scenes on the right.
  if (chapters) return (
    <figure ref={ref} style={toneVars(tone)} className={`grid bg-surface lg:grid-cols-[1.6fr_1fr] ${className}`} aria-label={label}>
      <div className="relative flex items-center border-b border-ink-border bg-bg lg:border-b-0 lg:border-r"><div className="w-full">{stage}</div></div>
      <figcaption className="flex flex-col p-5 md:p-7">
        <div className="min-h-[5.5rem]">{caption}</div>
        <ol className="mt-4 hidden space-y-1 md:block">
          {scenes.map((s, n) => (
            <li key={s.key}>
              <button type="button" onClick={() => go(n)} className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-left text-sm transition ${n === i ? 't-soft font-bold' : 'text-muted hover:bg-surface-2'}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-head text-[0.62rem] font-bold ${n < i ? 'bg-[var(--t)] text-white' : n === i ? 'bg-surface text-parchment ring-2 ring-[var(--t)]' : 'bg-surface-2'}`}>{n < i ? '✓' : n + 1}</span>
                <span className="flex-1">{s.kicker}</span>
                {n === i && <span className="absolute inset-x-3 bottom-0 h-[2px] overflow-hidden rounded-full bg-ink-border"><Bar progress={progress} /></span>}
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-auto flex gap-1 pt-5 md:hidden">{scenes.map((s, n) => <button key={s.key} type="button" aria-label={`Scene ${n + 1}: ${s.kicker}`} onClick={() => go(n)} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-ink-border">{n < i && <span className="absolute inset-0 bg-[var(--t)]" />}{n === i && <Bar progress={progress} />}</button>)}</div>
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
            <button key={s.key} type="button" onClick={() => go(n)} aria-label={`Scene ${n + 1}: ${s.kicker}`} className="group relative h-6 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ink-border transition group-hover:h-[5px]">
                {n < i && <span className="absolute inset-0 bg-[var(--t)]" />}
                {n === i && <Bar progress={progress} />}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-2 min-h-[4.5rem]">{caption}</div>
      </figcaption>
    </figure>
  )
}

function PlayToggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={on ? 'Pause film' : 'Play film'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/90 text-parchment shadow ring-1 ring-ink-border backdrop-blur transition hover:scale-105">
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
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setN(v => v + 1), every)
    return () => clearInterval(t)
  }, [inView, every])
  return (
    <div ref={ref} style={toneVars(tone)} className={className}>
      <Canvas><Stage>{inView && <div key={n} className="absolute inset-0">{scene.view()}</div>}</Stage></Canvas>
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
