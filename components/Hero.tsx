'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { CV_URL } from '@/lib/site'

// Add future hero photos here after placing their files in public/hero.
const heroPhotos = [
  { src: '/hero/mine.jpeg', alt: 'Ngozi Peace Okafor' },
]

const proofPoints = [
  { label: 'Ventures founded', value: '3' },
  { label: 'People trained', value: '200+' },
  { label: 'Years shipping', value: '9+' },
]

const focusAreas = ['Fintech', 'Web3 education', 'Technical content', 'Founder advisory']

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const [activePhoto, setActivePhoto] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduceMotion || paused || heroPhotos.length < 2) return

    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActivePhoto((current) => (current + 1) % heroPhotos.length)
      }
    }, 5000)

    return () => window.clearInterval(timer)
  }, [paused, reduceMotion])
  const enter = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.23, 1, 0.32, 1] }

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-bg border-b border-ink-border"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 880px 620px at 78% 14%, rgba(37,99,235,0.16), transparent 62%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(18,18,18,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,18,18,0.045) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-6 pb-10 pt-28 sm:px-8 md:px-20 md:pb-12 md:pt-32">
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
          <div className="order-2 max-w-4xl lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={enter}
              className="mb-6 font-head text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary"
            >
              Ngozi Peace Okafor / Lady Prowess
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { ...enter, delay: 0.08 }}
              className="max-w-3xl font-display text-3xl font-extrabold leading-[1.08] text-parchment sm:text-4xl lg:text-5xl"
            >
              I turn messy ideas into products, stories, and businesses people can trust.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { ...enter, delay: 0.18 }}
              className="mt-8 max-w-2xl text-base leading-[1.85] text-muted md:text-lg"
            >
              I am a founder, technical writer, content strategist, and Web3 educator building across
              fintech, commerce, and digital education. My work sits where clarity, execution, and
              ownership meet.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { ...enter, delay: 0.28 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#work"
                className="inline-flex min-h-12 items-center justify-center bg-primary px-7 py-4 font-display text-[0.9rem] font-bold text-on-primary motion-safe:transition-colors motion-safe:duration-150 hover:bg-primary-dim focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                See the Work
              </a>
              <a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog.capture('resume_downloaded', { placement: 'hero' })}
                className="inline-flex min-h-12 items-center justify-center border border-ink-border bg-surface px-7 py-4 font-display text-[0.9rem] font-bold text-parchment motion-safe:transition-colors motion-safe:duration-150 hover:border-primary/60 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Download Resume
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { ...enter, delay: 0.38 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="border border-ink-border bg-surface px-3 py-2 font-head text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  {area}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { ...enter, delay: 0.16 }}
            className="relative order-1 mx-auto w-full max-w-[560px] lg:order-2 lg:ml-auto"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-ink-border bg-surface">
              <div
                aria-hidden
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, transparent 44%, rgba(18,18,18,0.82) 100%)' }}
              />
              {heroPhotos.map((photo, index) => (
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  aria-hidden={index !== activePhoto}
                  fill
                  className={`object-cover object-top motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-in-out ${index === activePhoto ? 'opacity-100' : 'opacity-0'}`}
                  sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) 560px, 45vw"
                  priority={index === 0}
                  loading={index === 0 ? undefined : 'eager'}
                />
              ))}
              {heroPhotos.length > 1 && (
                <div className="absolute right-3 top-3 z-20 flex items-center bg-surface text-parchment">
                  {!reduceMotion && (
                    <button
                      type="button"
                      onClick={() => setPaused((current) => !current)}
                      className="min-h-10 px-3 text-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                      aria-label={paused ? 'Resume photo slideshow' : 'Pause photo slideshow'}
                    >
                      {paused ? 'Play' : 'Pause'}
                    </button>
                  )}
                  {heroPhotos.map((photo, index) => (
                    <button
                      key={photo.src}
                      type="button"
                      aria-label={`Show photo ${index + 1}`}
                      aria-pressed={index === activePhoto}
                      onClick={() => {
                        setActivePhoto(index)
                        setPaused(true)
                      }}
                      className="flex h-10 w-10 items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    >
                      <span className={`h-2 w-2 rounded-full ${index === activePhoto ? 'bg-primary' : 'bg-muted'}`} />
                    </button>
                  ))}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
                <p className="font-head text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  Current focus
                </p>
                <p className="mt-2 max-w-sm font-display text-2xl font-extrabold leading-tight text-dark-ink md:text-3xl">
                  Building useful products and clearer ways to explain them.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 border-x border-b border-ink-border bg-surface">
              {proofPoints.map((point) => (
                <div key={point.label} className="border-r border-ink-border p-4 last:border-r-0 md:p-5">
                  <p className="font-display text-2xl font-extrabold leading-none text-primary md:text-3xl">
                    {point.value}
                  </p>
                  <p className="mt-2 font-head text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-muted">
                    {point.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-10 border-t border-ink-border pt-6">
          <p className="max-w-4xl font-head text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Founder of Kivora Pay, Prowess Digital Solutions, and Dritchwear. Trusted by teams across
            Web3, fintech, technical writing, and digital commerce.
          </p>
        </div>
      </div>
    </section>
  )
}
