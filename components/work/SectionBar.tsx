'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { sections } from './WorkHero'

// Sticks under the site nav and highlights the section in view.
export default function SectionBar() {
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-40% 0px -55% 0px' })
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return <div className="sticky top-[var(--nav-h)] z-30 border-y border-ink-border bg-bg/85 backdrop-blur-xl">
    <nav aria-label="Work sections" className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] md:px-8">
      {sections.map(s => <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}
        className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === s.id ? 'text-on-primary' : 'text-muted hover:text-parchment'}`}>
        {active === s.id && <motion.span layoutId="work-tab" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
        <span className="relative">{s.label} <span className="opacity-60">{s.count}</span></span>
      </a>)}
    </nav>
  </div>
}
