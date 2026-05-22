'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const awards = [
  {
    title: 'Most Problem Solver',
    src: '/Award/problem%20solver.jpg',
    alt: 'WriteTech Hub Award of Appreciation recognizing Ngozi Peace Okafor as Most Problem Solver in 2024.',
  },
  {
    title: 'Most Likely to Say, This Could Be an Email',
    src: '/Award/email.jpg',
    alt: 'WriteTech Hub Award of Appreciation recognizing Ngozi Peace Okafor as Most Likely to Say, This Could Be an Email in 2024.',
  },
  {
    title: 'Mood Booster',
    src: '/Award/mood%20boaster.jpg',
    alt: 'WriteTech Hub Award of Appreciation recognizing Ngozi Peace Okafor as Mood Booster in 2024.',
  },
]

export default function Awards() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' })

  return (
    <section id="awards" className="px-8 md:px-20 py-32 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Awards
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Recognition from
              <br />
              <em className="italic text-parchment/70">the teams I serve.</em>
            </h2>
          </div>
          <p className="text-[0.95rem] text-muted max-w-sm leading-[1.8] mb-1">
            Appreciation awards from WriteTech Hub highlighting problem-solving, team presence, and practical communication.
          </p>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {awards.map((award, index) => (
            <motion.figure
              key={award.title}
              initial={{ opacity: 0, y: 24 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-surface border border-ink-border overflow-hidden"
            >
              <div className="relative aspect-[2000/1414] bg-parchment">
                <Image
                  src={award.src}
                  alt={award.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-4 border-t border-ink-border p-5">
                <span className="font-head text-[0.68rem] font-bold tracking-[0.12em] uppercase text-parchment">
                  {award.title}
                </span>
                <span className="font-head text-[0.58rem] font-bold tracking-[0.14em] uppercase text-muted">
                  2024
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
