'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import VideoStories from './VideoStories'

type Video = { src: string; poster: string; title: string; text: string }

// Desktop: one big player with a playlist beside it; picking a video loads it
// into the player. Phones: Stories (components/work/VideoStories.tsx).
// Nothing downloads until someone presses play.
export default function VideoShowcase({ videos, loops = [] }: { videos: Video[]; loops?: string[] }) {
  const [active, setActive] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const player = useRef<HTMLDivElement>(null)
  const v = videos[active]

  const pick = (i: number) => {
    setActive(i); setAutoplay(true)
    // On phones the player is above the list: bring it into view.
    if (window.matchMedia('(max-width: 1023px)').matches) player.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Phones: Stories (one at a time, tap to move on), with the looping explainers at the end.
  const mobile = <div className="lg:hidden">
    <VideoStories stories={[...videos, ...loops.map(src => ({ src, title: 'Animated explainer', loop: true }))]} />
  </div>

  return <>{mobile}<div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
    <div ref={player} className="min-w-0 scroll-mt-32">
      <div className="overflow-hidden rounded-[1.75rem] border border-ink-border bg-black shadow-[0_40px_90px_-45px_rgba(17,24,39,.6)]">
        <video key={v.src} src={v.src} poster={v.poster} controls playsInline preload="none" autoPlay={autoplay}
          className="block aspect-square max-h-[620px] w-full bg-black object-contain" />
      </div>
      <p className="mt-4 font-display text-xl font-semibold tracking-[-.02em]">{v.title}</p>
      <p className="mt-1 text-sm text-muted">{v.text}</p>
    </div>

    <div className="min-w-0">
      <p className="font-head text-[11px] uppercase tracking-[.16em] text-muted">Playlist</p>
      <ol className="-mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:max-h-[620px] lg:flex-col lg:gap-2 lg:overflow-y-auto lg:px-0 lg:pb-0">
        {videos.map((item, i) => {
          const on = i === active
          return <li key={item.src} className="w-[34%] shrink-0 snap-start sm:w-[24%] lg:w-auto">
            <button type="button" onClick={() => pick(i)} aria-current={on ? 'true' : undefined}
              className={`group flex w-full flex-col gap-2 rounded-2xl p-2 text-left transition lg:flex-row lg:items-center lg:gap-4 ${on ? 'bg-surface shadow-[0_12px_30px_-18px_rgba(17,24,39,.4)] ring-1 ring-primary/40' : 'hover:bg-surface'}`}>
              <span className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-black lg:w-24">
                <Image src={item.poster} alt="" fill sizes="(max-width: 1024px) 45vw, 96px" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className={`absolute inset-0 flex items-center justify-center transition ${on ? 'bg-primary/30' : 'bg-black/20 group-hover:bg-black/10'}`}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0A0C0D]">
                    {on ? <span aria-hidden="true" className="flex gap-[3px]">{[0, 1, 2].map(b => <span key={b} className="h-3 w-[3px] rounded-full bg-primary motion-safe:animate-pulse" style={{ animationDelay: `${b * 150}ms` }} />)}</span>
                      : <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>}
                  </span>
                </span>
              </span>
              <span className="min-w-0 px-1 lg:px-0">
                <span className={`block text-xs font-semibold leading-snug lg:text-[15px] ${on ? 'text-primary' : ''}`}>{item.title}</span>
                <span className="mt-0.5 hidden text-xs text-muted lg:block">{item.text}</span>
              </span>
            </button>
          </li>
        })}
      </ol>
    </div>
  </div></>
}
