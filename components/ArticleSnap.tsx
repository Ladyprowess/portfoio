'use client'

import { useEffect } from 'react'
import { TITLE_SCREEN_THRESHOLD } from '@/lib/reading'

/**
 * The title screen is deliberately one quiet viewport, but nobody wants to
 * hand-scroll through it. The first downward gesture made while sitting at the
 * top jumps straight to the body; after that scrolling is completely normal.
 * Returning to the top re-arms it.
 */
export default function ArticleSnap({ targetId = 'article-body' }: { targetId?: string }) {
  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    // Only intercept while the reader has not left the title screen.
    const atTop = () => window.scrollY <= TITLE_SCREEN_THRESHOLD
    let locked = false

    const jump = () => {
      if (locked) return
      locked = true
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      // Hold the lock just long enough for the scroll to settle, so a trackpad
      // flick made of a dozen wheel events does not queue a dozen jumps.
      window.setTimeout(() => { locked = false }, reduced ? 0 : 620)
    }

    const onWheel = (event: WheelEvent) => {
      if (locked) { event.preventDefault(); return }
      if (event.deltaY <= 0 || !atTop()) return
      event.preventDefault()
      jump()
    }

    let touchStartY = 0
    const onTouchStart = (event: TouchEvent) => { touchStartY = event.touches[0].clientY }
    const onTouchMove = (event: TouchEvent) => {
      if (locked) { event.preventDefault(); return }
      if (!atTop()) return
      // Finger travelling up the screen means "scroll down".
      if (touchStartY - event.touches[0].clientY < 12) return
      event.preventDefault()
      jump()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!atTop() || locked) return
      const el = event.target as HTMLElement | null
      // Never steal keys from a field or from someone operating a control.
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(el.tagName))) return
      if (!['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(event.key)) return
      event.preventDefault()
      jump()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [targetId])

  return null
}
