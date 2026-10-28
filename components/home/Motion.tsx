'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { createElement, useEffect, useRef, useState, type ReactNode } from 'react'

// Scroll-driven motion for the homepage. Phones cannot hover, so the page
// comes alive as it is scrolled instead: headings type themselves out (like the
// hero) and blocks slide in as they enter the screen.

/** A heading that types itself once it scrolls into view. Space is reserved, so nothing jumps. */
export function TypeHeading({ text, as = 'h2', className = '' }: { text: string; as?: 'h2' | 'h3'; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) { setN(text.length); return }
    let i = 0, t = 0
    const tick = () => { i += 1; setN(i); if (i < text.length) t = window.setTimeout(tick, text[i - 1] === ' ' ? 55 : 30 + Math.random() * 35) }
    t = window.setTimeout(tick, 200)
    return () => window.clearTimeout(t)
  }, [inView, reduce, text])

  const typing = inView && n < text.length
  return createElement(as, { ref, className: `grid ${className}` },
    <span key="sr" className="sr-only">{text}</span>,
    <span key="ghost" aria-hidden="true" className="invisible select-none [grid-area:1/1]">{text}<span className="ml-[0.04em] inline-block w-[3px]" /></span>,
    <span key="typed" aria-hidden="true" className="select-none [grid-area:1/1]">
      {text.slice(0, n)}
      {(typing || (inView && n >= text.length)) && <span className={`ml-[0.04em] inline-block h-[0.8em] w-[3px] translate-y-[0.08em] bg-primary ${typing ? '' : 'animate-[cursor-out_1.6s_ease_forwards]'}`} />}
    </span>,
  )
}

/** Fades and slides its children in when they scroll into view. */
export function Reveal({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
}
