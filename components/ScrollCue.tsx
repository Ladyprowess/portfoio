'use client'

import { useEffect, useState } from 'react'
import { TITLE_SCREEN_THRESHOLD } from '@/lib/reading'

/**
 * The downward nudge on the article title screen. It steps aside as soon as the
 * reader takes the hint, and comes back if they return to the top — where the
 * gesture it stands for is armed again.
 */
export default function ScrollCue({ label = 'Read' }: { label?: string }) {
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setAtTop(window.scrollY <= TITLE_SCREEN_THRESHOLD)
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const scrollToBody = () => {
    document.getElementById('article-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={scrollToBody}
      tabIndex={atTop ? 0 : -1}
      aria-hidden={!atTop}
      className={`group inline-flex flex-col items-center gap-2 text-muted transition-opacity duration-500 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-bg ${
        atTop ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span className="font-head text-[0.58rem] font-bold uppercase tracking-[0.22em]">{label}</span>
      <svg
        className="animate-cue h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 9 7 7 7-7" />
      </svg>
    </button>
  )
}
