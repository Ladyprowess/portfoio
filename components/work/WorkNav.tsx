'use client'

import { useEffect, useState } from 'react'

// The Work page's section bar: sticks under the site menu while scrolling and
// highlights the section on screen. Phones: one swipeable row.
export default function WorkNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter((e): e is HTMLElement => Boolean(e))
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-35% 0px -55% 0px' })
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return <nav aria-label="On this page" className="sticky top-[var(--nav-h)] z-30 border-y border-ink-border bg-bg/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] md:px-8">
      {sections.map(s => <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${active === s.id ? 'bg-parchment text-bg' : 'text-muted hover:bg-surface hover:text-parchment'}`}>{s.label}</a>)}
    </div>
  </nav>
}
