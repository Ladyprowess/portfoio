'use client'

import { AnimatePresence, motion } from 'framer-motion'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'

// A small, always-there way into the recruiter view for anyone who skipped the
// welcome screen. Appears after a moment, and hides near the contact section
// where it would only get in the way.
export default function RecruiterPill() {
  const [show, setShow] = useState(false)
  const [nearEnd, setNearEnd] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 2500)
    const contact = document.getElementById('contact')
    const observer = new IntersectionObserver(([e]) => setNearEnd(e.isIntersecting), { rootMargin: '0px 0px -20% 0px' })
    if (contact) observer.observe(contact)
    return () => { window.clearTimeout(t); observer.disconnect() }
  }, [])

  // The wrapper positions it (centred on phones, bottom-left on desktop) so the
  // slide-in animation's transform cannot undo the centring.
  return <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center md:bottom-6 md:justify-start md:px-6">
    <AnimatePresence>
      {show && !nearEnd && <motion.a key="pill" href="/recruiter" onClick={() => posthog.capture('recruiter_view_opened', { from: 'pill' })}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex items-center gap-2.5 whitespace-nowrap rounded-full border border-ink-border bg-surface/95 py-2 pl-2 pr-4 text-sm font-semibold shadow-[0_20px_50px_-15px_rgba(17,24,39,.45)] backdrop-blur-xl transition-colors hover:border-primary/50">
        <span className="flex h-7 items-center rounded-full bg-primary px-2.5 text-[11px] text-on-primary">Hiring?</span>
        Recruiter view · 60 sec <span aria-hidden="true">→</span>
      </motion.a>}
    </AnimatePresence>
  </div>
}
