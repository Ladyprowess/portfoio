'use client'

import { useEffect, useState } from 'react'

/**
 * The downward nudge on the article title screen. It retires as soon as the
 * reader takes the hint, and never returns for the rest of the page.
 */
export default function ScrollCue({ label = 'Read' }: { label?: string }) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setDismissed(true)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToBody = () => {
    document.getElementById('article-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={scrollToBody}
      tabIndex={dismissed ? -1 : 0}
      aria-hidden={dismissed}
      className={`group inline-flex flex-col items-center gap-2 text-muted transition-opacity duration-500 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-bg ${
        dismissed ? 'pointer-events-none opacity-0' : 'opacity-100'
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
