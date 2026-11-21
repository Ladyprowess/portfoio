'use client'

import { useEffect, useRef, useState } from 'react'

// A short silent clip that loops, but only downloads and plays once it is
// near the screen, so it never slows the first load of the page.
export default function LazyLoopVideo({ src, className = '' }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setNear(true)
      if (!el.src) return
      if (e.isIntersecting) el.play().catch(() => {}); else el.pause()
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={near ? src : undefined} autoPlay muted loop playsInline preload="none" aria-hidden="true" className={className} />
}
