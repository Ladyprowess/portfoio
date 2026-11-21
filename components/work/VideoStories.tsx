'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type Story = { src: string; poster?: string; title: string; loop?: boolean }

// Phones: the videos as Stories. One at a time in a phone-style frame, with
// progress bars on top. Swipe left for the next video, right for the previous
// one; tap to play or pause. When one ends, the next starts. Nothing downloads
// until the first tap.
export default function VideoStories({ stories }: { stories: Story[] }) {
  const [i, setI] = useState(0)
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const s = stories[i]
  const reduce = useReducedMotion()
  const dragged = useRef(false)

  const go = (n: number) => { setI((n + stories.length) % stories.length); setProgress(0); setPaused(false) }

  // Play the current story once the visitor has started; short loops advance after one pass.
  useEffect(() => {
    const v = video.current
    if (!v || !started) return
    v.currentTime = 0
    v.play().catch(() => setPaused(true))
  }, [i, started])

  // A tap plays or pauses; a swipe (handled by the drag below) changes video.
  const tap = () => {
    if (dragged.current) { dragged.current = false; return }
    const v = video.current
    if (!started) { setStarted(true); return }
    if (v) { if (v.paused) { v.play(); setPaused(false) } else { v.pause(); setPaused(true) } }
  }

  return <div className="mx-auto w-full max-w-[360px]">
    <div className="relative overflow-hidden rounded-[2.25rem] border-[6px] border-[#0B0F14] bg-black shadow-[0_40px_90px_-40px_rgba(17,24,39,.7)]">
      {/* Progress bars */}
      <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
        {stories.map((_, n) => <span key={n} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
          <span className="block h-full rounded-full bg-white" style={{ width: n < i ? '100%' : n === i ? `${progress * 100}%` : '0%' }} />
        </span>)}
      </div>
      <p className="absolute inset-x-4 top-6 z-20 truncate text-[13px] font-semibold text-white drop-shadow">{s.title}</p>

      <motion.div role="button" tabIndex={0} aria-label={started ? 'Swipe for the next video; tap to pause' : `Play ${s.title}`}
        drag={reduce ? false : 'x'} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.35} dragSnapToOrigin
        onDragStart={() => { dragged.current = true }}
        onDragEnd={(_, info) => {
          const swipe = Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 400
          if (swipe) { if (!started) setStarted(true); go(info.offset.x < 0 ? i + 1 : i - 1) }
          window.setTimeout(() => { dragged.current = false }, 0)
        }}
        onClick={tap} onKeyDown={e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'Enter' || e.key === ' ') tap() }}
        className="relative aspect-[4/5] w-full cursor-grab touch-pan-y active:cursor-grabbing">
        {started
          ? <video ref={video} key={s.src} src={s.src} poster={s.poster} playsInline muted={s.loop} preload="auto"
              onTimeUpdate={e => { const v = e.currentTarget; if (v.duration) setProgress(v.currentTime / v.duration) }}
              onEnded={() => go(i + 1)}
              className={`absolute inset-0 h-full w-full ${s.loop ? 'object-cover' : 'object-contain'}`} />
          : s.poster
            ? <Image src={s.poster} alt="" fill sizes="360px" draggable={false} className="pointer-events-none select-none object-cover" />
            : <div className="absolute inset-0 bg-[#0B0F14]" />}

        {(!started || paused) && <span className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/35 text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#0A0C0D] shadow-2xl"><svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
          {!started && <span className="text-sm font-semibold">Tap to watch</span>}
        </span>}
      </motion.div>
    </div>
  </div>
}
