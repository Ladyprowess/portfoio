'use client'

import { useEffect, useState } from 'react'

/**
 * Hairline progress rail pinned under the nav. Reads how far through the
 * article element the viewport has travelled, not the whole document, so the
 * footer and newsletter block do not count as "still reading".
 */
export default function ReadingProgress({ targetId = 'article-body' }: { targetId?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const target = document.getElementById(targetId)
      if (!target) return

      const { top, height } = target.getBoundingClientRect()
      const travelled = -top
      const distance = height - window.innerHeight

      if (distance <= 0) {
        setProgress(travelled > 0 ? 1 : 0)
        return
      }

      setProgress(Math.min(1, Math.max(0, travelled / distance)))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div className="fixed inset-x-0 top-[var(--nav-h,4.75rem)] z-40 h-px bg-transparent" aria-hidden="true">
      <div
        className="h-full origin-left bg-primary transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
