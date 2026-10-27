'use client'

import { useEffect, useState } from 'react'

// The hero headline, typed out like the welcome screen. Each segment keeps its
// own styling. The full headline is laid out invisibly underneath so the page
// never jumps while letters appear, and screen readers get the whole sentence.

const segments: { text: string; className?: string }[] = [
  { text: 'I make ' },
  { text: 'complicated', className: 'text-muted decoration-primary/40 decoration-wavy underline-offset-[10px] [text-decoration-line:underline] [text-decoration-thickness:2px]' },
  { text: ' products ' },
  { text: 'easy to understand.', className: 'text-primary' },
]
const FULL = segments.map(s => s.text).join('')

/** Resolves once the welcome screen is out of the way (or was never shown). */
function useWelcomeDone() {
  const [done, setDone] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const check = () => { if (root.dataset.welcome || !document.querySelector('.welcome')) setDone(true) }
    check()
    const observer = new MutationObserver(check)
    observer.observe(root, { attributes: true, attributeFilter: ['data-welcome'] })
    return () => observer.disconnect()
  }, [])
  return done
}

export default function TypedHeadline({ className = '' }: { className?: string }) {
  const ready = useWelcomeDone()
  const [n, setN] = useState(0)
  const [reduce, setReduce] = useState(false)

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])

  useEffect(() => {
    if (!ready) return
    if (reduce) { setN(FULL.length); return }
    let i = 0, t = 0
    const tick = () => {
      i += 1
      setN(i)
      if (i < FULL.length) t = window.setTimeout(tick, FULL[i - 1] === ' ' ? 70 : 45 + Math.random() * 45)
    }
    // A short beat after the welcome lifts, so the page has settled.
    t = window.setTimeout(tick, 650)
    return () => window.clearTimeout(t)
  }, [ready, reduce])

  const typing = n < FULL.length
  let left = n

  return <h1 className={`grid ${className}`}>
    <span className="sr-only">{FULL}</span>
    {/* Invisible full headline: reserves the final size */}
    <span aria-hidden="true" className="invisible [grid-area:1/1]">{segments.map((s, i) => <span key={i} className={s.className}>{s.text}</span>)}<span className="ml-[0.04em] inline-block w-[3px]" /></span>
    {/* The typed copy, drawn on top */}
    <span aria-hidden="true" className="[grid-area:1/1]">
      {segments.map((s, i) => {
        const shown = s.text.slice(0, Math.max(0, left))
        left -= s.text.length
        return shown ? <span key={i} className={s.className}>{shown}</span> : null
      })}
      <span className={`ml-[0.04em] inline-block h-[0.85em] w-[3px] translate-y-[0.1em] bg-primary ${typing ? '' : 'animate-pulse'}`} />
    </span>
  </h1>
}
