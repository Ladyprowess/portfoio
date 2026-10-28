'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import posthog from 'posthog-js'
import { useCallback, useEffect, useRef, useState } from 'react'

// The cinematic welcome: a dark screen where Ngozi "types" a note to the
// visitor, then opens the portfolio. Shown once per browser session.
// The server always renders it, so a first visit opens straight onto the dark
// screen; the bootstrap script in lib/welcome.ts hides it before paint for
// anyone who has already seen it this session.

import { WELCOME_KEY } from '@/lib/welcome'

type Step = { line: number; type?: string; erase?: number; pause?: number; mark?: boolean }

const LINES = 3
// The script. Line 3 writes a jargon phrase, highlights it, deletes it and
// writes the plain version: the work, in miniature.
const script: Step[] = [
  { line: 0, type: 'Hi there.', pause: 700 },
  { line: 1, type: 'You took time out of your day to come here. Thank you.', pause: 800 },
  { line: 2, type: 'I’m Ngozi, a multifaceted creative who makes complicated products ', pause: 150 },
  { line: 2, type: 'synergistically consumable.', pause: 650 },
  { line: 2, mark: true, pause: 700 },
  { line: 2, erase: 'synergistically consumable.'.length, pause: 250 },
  { line: 2, type: 'easy to understand.', pause: 500 },
]
const FINAL = ['Hi there.', 'You took time out of your day to come here. Thank you.', 'I’m Ngozi, a multifaceted creative who makes complicated products easy to understand.']
const JARGON = 'synergistically consumable.'

export default function Welcome() {
  const [open, setOpen] = useState(true)
  const [lines, setLines] = useState<string[]>(Array(LINES).fill(''))
  const [active, setActive] = useState(0)
  const [typing, setTyping] = useState(false)
  const [marked, setMarked] = useState(false)
  const [done, setDone] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    try { sessionStorage.setItem(WELCOME_KEY, '1') } catch { /* storage blocked: it just shows again */ }
    setOpen(false)
    // "done" releases the scroll lock but, unlike "skip", does not hide the
    // screen with CSS, so the lift-away exit animation can play.
    document.documentElement.dataset.welcome = 'done'
  }, [])

  // Recruiters go straight to the one-page summary. Mark the welcome as seen so
  // "See the full portfolio" brings them back to the page, not the intro again.
  const toRecruiter = () => {
    try { sessionStorage.setItem(WELCOME_KEY, '1') } catch { /* storage blocked */ }
    posthog.capture('recruiter_view_opened', { from: 'welcome' })
  }

  useEffect(() => {
    if (document.documentElement.dataset.welcome === 'skip') { setOpen(false); return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setLines(FINAL); setDone(true); return }

    let cancelled = false
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
    ;(async () => {
      await wait(900)
      setTyping(true)
      await wait(1300)
      for (const step of script) {
        if (cancelled) return
        setActive(step.line)
        if (step.type) {
          for (const ch of step.type) {
            if (cancelled) return
            setLines(ls => ls.map((l, i) => (i === step.line ? l + ch : l)))
            await wait(/[,.]/.test(ch) ? 220 : 18 + Math.random() * 28)
          }
        }
        if (step.mark) setMarked(true)
        if (step.erase) {
          setMarked(false)
          for (let k = 0; k < step.erase; k++) {
            if (cancelled) return
            setLines(ls => ls.map((l, i) => (i === step.line ? l.slice(0, -1) : l)))
            await wait(16)
          }
        }
        await wait(step.pause ?? 300)
      }
      setTyping(false)
      setDone(true)
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => { if (done) button.current?.focus({ preventScroll: true }) }, [done])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  return <AnimatePresence>
    {open && <motion.div key="welcome" role="dialog" aria-modal="true" aria-label="Welcome"
      className="welcome fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#06080B] text-[#F2F1ED]"
      exit={{ y: '-100%', borderBottomLeftRadius: '40%', borderBottomRightRadius: '40%' }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
      {/* Light: a slow drifting glow in the brand blue, and a vignette */}
      <motion.div aria-hidden="true" className="absolute -left-1/4 top-1/4 h-[70vmax] w-[70vmax] rounded-full bg-[#2563EB]/20 blur-[140px]"
        animate={{ x: ['0%', '18%', '0%'], y: ['0%', '-10%', '0%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.75))]" />
      {/* Letterbox bars, drawn in on arrival */}
      <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-[7vh] bg-black" initial={{ y: '-100%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
      <motion.div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[7vh] bg-black" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />

      <div className="relative z-10 flex items-center justify-between px-6 pt-[calc(7vh+1rem)] md:px-12">
        <span className="font-head text-[10px] uppercase tracking-[.3em] text-white/50">Lady Prowess</span>
        <div className="flex items-center gap-2">
          {/* Available from the first second, so a busy recruiter never waits for the typing */}
          <a href="/recruiter" onClick={toRecruiter} className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20">Recruiter view</a>
          <button type="button" onClick={close} className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition hover:border-white/40 hover:text-white">
            Skip <kbd className="hidden font-head text-[9px] text-white/40 sm:inline">Esc</kbd>
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 md:px-12">
        <p className="sr-only">{FINAL.join(' ')}</p>
        <div aria-hidden="true" className="space-y-4 md:space-y-5">
          {lines.map((text, i) => (text || active === i) && i <= active ? <p key={i}
            className={`font-display tracking-[-0.035em] ${i === 2 ? 'text-[clamp(1.6rem,4.4vw,3.4rem)] font-bold leading-[1.12] text-white' : 'text-[clamp(1.2rem,2.6vw,1.9rem)] font-medium leading-snug text-white/70'}`}>
            {renderLine(text, i === 2 && marked)}
            {i === active && !done && <span className="ml-1 inline-block h-[0.95em] w-[3px] translate-y-[0.12em] animate-pulse bg-[#60A5FA]" />}
          </p> : null)}
        </div>

        <div className="mt-10 h-14">
          <AnimatePresence mode="wait">
            {!done && typing && <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-sm text-white/55">
              <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white/10"><Image src="/hero/mine.jpeg" alt="" fill sizes="32px" className="object-cover object-top" /></span>
              Ngozi is typing
              <span className="flex gap-1">{[0, 1, 2].map(d => <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-white/60" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />)}</span>
            </motion.div>}
            {done && <motion.div key="cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex flex-wrap items-center gap-4">
              <button ref={button} type="button" onClick={close}
                className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#0A0C0D] shadow-[0_0_60px_rgba(96,165,250,.35)] transition hover:shadow-[0_0_80px_rgba(96,165,250,.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#60A5FA]/60">
                Open my portfolio <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <a href="/recruiter" onClick={toRecruiter} className="group flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5">
                Hiring? See the 60-second version <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>}
  </AnimatePresence>
}

/** Highlights the jargon phrase, like a selection, just before it is deleted. */
function renderLine(text: string, marked: boolean) {
  const at = text.indexOf(JARGON)
  if (!marked || at < 0) return text
  return <>{text.slice(0, at)}<span className="rounded bg-[#2563EB]/70 px-0.5">{JARGON}</span>{text.slice(at + JARGON.length)}</>
}
