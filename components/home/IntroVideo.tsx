'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import posthog from 'posthog-js'
import { useCallback, useEffect, useRef, useState } from 'react'

// Ngozi's video introduction, in a popup. Homepage only: it opens on every
// load or reload of the homepage, after the welcome screen closes. The
// "Watch my intro" button in the hero reopens it any time
// (by dispatching OPEN_INTRO_EVENT).
//
// Browsers only autoplay muted video, so it starts muted; the captions are
// burned into the video, and "Tap for sound" turns the audio on.

export const OPEN_INTRO_EVENT = 'lp:open-intro'
// Module state resets on every full page load, so a reload shows it again.
let shownThisLoad = false
const DURATION = '57 sec'

export function openIntro() {
  window.dispatchEvent(new Event(OPEN_INTRO_EVENT))
}

export default function IntroVideo() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ended, setEnded] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [src, setSrc] = useState('/intro/intro-1080.mp4')
  const video = useRef<HTMLVideoElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const opener = useRef<Element | null>(null)
  const how = useRef<'auto' | 'button'>('auto')

  const show = useCallback((by: 'auto' | 'button') => {
    how.current = by
    opener.current = document.activeElement
    setSrc(window.matchMedia('(max-width: 767px)').matches ? '/intro/intro-720.mp4' : '/intro/intro-1080.mp4')
    setEnded(false); setBlocked(false)
    // Opened by a click, the visitor chose to watch: start with sound.
    setMuted(by === 'auto')
    setOpen(true)
    if (by === 'auto') shownThisLoad = true
    posthog.capture('intro_video_opened', { trigger: by })
  }, [])

  const close = useCallback(() => {
    const v = video.current
    posthog.capture('intro_video_closed', { at_seconds: v ? Math.round(v.currentTime) : 0, completed: ended })
    v?.pause()
    setOpen(false)
    window.setTimeout(() => (opener.current as HTMLElement | null)?.focus?.(), 0)
  }, [ended])

  // Open automatically on each page load, after the welcome screen (homepage only) is out of the way.
  useEffect(() => {
    let timer = 0
    const html = document.documentElement
    const ready = () => html.dataset.welcome === 'done' || html.dataset.welcome === 'skip' || !document.querySelector('.welcome')
    const go = () => { if (!shownThisLoad) timer = window.setTimeout(() => { if (!shownThisLoad) show('auto') }, 700) }
    const observer = new MutationObserver(() => { if (ready()) { observer.disconnect(); go() } })
    if (ready()) go(); else observer.observe(html, { attributes: true, attributeFilter: ['data-welcome'] })

    const onOpen = () => show('button')
    window.addEventListener(OPEN_INTRO_EVENT, onOpen)
    return () => { observer.disconnect(); window.clearTimeout(timer); window.removeEventListener(OPEN_INTRO_EVENT, onOpen) }
  }, [show])

  // While open: start playback, lock page scroll, Escape closes, keep focus inside.
  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()
    const v = video.current
    if (v && !reduce) {
      v.muted = muted
      v.play().catch(() => {
        // Sound blocked: fall back to muted; if even that is blocked, show a play button.
        if (v && !v.muted) { v.muted = true; setMuted(true); v.play().catch(() => setBlocked(true)) } else setBlocked(true)
      })
    } else setBlocked(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const unmute = () => {
    const v = video.current
    if (!v) return
    // Restart so the visitor hears it from the beginning.
    if (v.currentTime > 2) v.currentTime = 0
    v.muted = false; setMuted(false)
    v.play().catch(() => setBlocked(true))
    posthog.capture('intro_video_unmuted')
  }
  const play = () => { const v = video.current; if (!v) return; setBlocked(false); setEnded(false); v.currentTime = ended ? 0 : v.currentTime; v.play().catch(() => setBlocked(true)) }
  const goTo = (hash: string) => { close(); window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 150) }

  return <AnimatePresence>
    {open && <motion.div key="intro" role="dialog" aria-modal="true" aria-label="Video introduction from Ngozi Peace Unegbu"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0C0D]/80 p-4 backdrop-blur-md md:p-8 print:hidden"
      onClick={e => { if (e.target === e.currentTarget) close() }}>

      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduce ? 0 : 12, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[1040px]">

        <div className="mb-3 flex items-center justify-between gap-4 text-white">
          <p className="flex items-center gap-2.5 text-sm">
            <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#60A5FA]/60 motion-reduce:hidden" /><span className="relative h-2 w-2 rounded-full bg-[#60A5FA]" /></span>
            <span className="font-semibold">Meet Ngozi</span><span className="text-white/55">· {DURATION}</span>
          </p>
          <button ref={closeBtn} type="button" onClick={close} aria-label="Close video"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#60A5FA]/50">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[1.25rem] bg-black shadow-[0_40px_120px_-30px_rgba(37,99,235,.45)] ring-1 ring-white/10 md:rounded-[1.75rem]">
          <video ref={video} src={src} poster="/intro/intro-poster.jpg" playsInline preload="auto" muted={muted}
            onEnded={() => { setEnded(true); posthog.capture('intro_video_completed', { muted }) }}
            className="block aspect-video w-full" />

          {/* Sound on: the most important control while muted */}
          {muted && !ended && !blocked && <button type="button" onClick={unmute}
            className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#0A0C0D] shadow-lg transition hover:bg-white/90 md:left-5 md:top-5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
            Tap for sound
          </button>}

          {/* Autoplay blocked or reduced motion: a plain play button */}
          {blocked && !ended && <button type="button" onClick={play} aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/20">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#0A0C0D] shadow-2xl"><svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
          </button>}

          {/* End: next steps */}
          <AnimatePresence>
            {ended && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0A0C0D]/85 px-6 text-center text-white">
              <p className="font-display text-2xl font-semibold tracking-[-.02em] md:text-3xl">Have a problem worth solving?</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => goTo('#contact')} className="rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Let’s talk</button>
                <a href="/work" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold hover:border-white/60">See what I’ve built</a>
                <button type="button" onClick={play} className="rounded-full px-5 py-3 text-sm font-semibold text-white/70 hover:text-white">↻ Replay</button>
              </div>
            </motion.div>}
          </AnimatePresence>
        </div>

        <div className="mt-3 flex justify-end">
          <button type="button" onClick={close} className="text-sm text-white/60 transition hover:text-white">Skip to the website →</button>
        </div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>
}
