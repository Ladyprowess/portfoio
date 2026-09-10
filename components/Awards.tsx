'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

type Award = { title: string; year: string; src: string; alt: string }
type AwardGroup = { brand: string; initials: string; description: string; awards: Award[] }

const awardGroups: AwardGroup[] = [
  {
    brand: 'WriteTech Hub',
    initials: 'WTH',
    description: 'Recognition for problem solving, communication, and the energy I brought to the team.',
    awards: [
      { title: 'Most Problem Solver', year: '2024', src: '/Award/problem%20solver.jpg', alt: 'WriteTech Hub Award of Appreciation recognising Ngozi Peace Okafor as Most Problem Solver in 2024.' },
      { title: 'Most Likely to Say, This Could Be an Email', year: '2024', src: '/Award/email.jpg', alt: 'WriteTech Hub Award of Appreciation recognising Ngozi Peace Okafor for practical communication in 2024.' },
      { title: 'Mood Booster', year: '2024', src: '/Award/mood%20boaster.jpg', alt: 'WriteTech Hub Award of Appreciation recognising Ngozi Peace Okafor as Mood Booster in 2024.' },
    ],
  },
]

export default function Awards() {
  const [selectedAward, setSelectedAward] = useState<(Award & { brand: string }) | null>(null)
  const totalAwards = awardGroups.reduce((total, group) => total + group.awards.length, 0)

  useEffect(() => {
    document.body.style.overflow = selectedAward ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedAward])

  return (
    <>
      <section className="border-b border-ink-border bg-white px-6 pb-20 pt-28 sm:px-8 md:px-20 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">Awards and recognition</p>
              <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,4vw,3.6rem)] font-extrabold leading-[1.08]">Recognition from the organisations I have worked with.</h1>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border">
              <div className="bg-bg p-5"><p className="font-display text-2xl font-extrabold text-primary">{awardGroups.length}</p><p className="mt-1 text-xs text-muted">Recognising brand</p></div>
              <div className="bg-bg p-5"><p className="font-display text-2xl font-extrabold text-primary">{totalAwards}</p><p className="mt-1 text-xs text-muted">Awards received</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg px-6 py-16 sm:px-8 md:px-20 md:py-24">
        <div className="mx-auto max-w-[1240px] space-y-16">
          {awardGroups.map((group, groupIndex) => (
            <motion.section key={group.brand} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay: groupIndex * 0.08 }}>
              <div className="mb-7 grid gap-5 border-b border-ink-border pb-7 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-head text-xs font-extrabold tracking-[0.1em] text-white">{group.initials}</div>
                <div><h2 className="font-display text-2xl font-extrabold md:text-3xl">{group.brand}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{group.description}</p></div>
                <span className="w-fit rounded-full border border-ink-border bg-white px-4 py-2 text-xs font-semibold text-muted">{group.awards.length} {group.awards.length === 1 ? 'award' : 'awards'}</span>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {group.awards.map((award, index) => (
                  <motion.button key={award.title} type="button" onClick={() => setSelectedAward({ ...award, brand: group.brand })} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="group overflow-hidden rounded-3xl border border-ink-border bg-white text-left transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(17,24,39,.08)]">
                    <div className="relative aspect-[2000/1414] bg-[#F3F5F8] p-3"><Image src={award.src} alt={award.alt} fill className="object-contain p-3" sizes="(max-width: 768px) 100vw, 33vw" /></div>
                    <div className="border-t border-ink-border p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-primary">{group.brand}</p><h3 className="mt-2 font-display text-lg font-bold leading-6 text-parchment">{award.title}</h3></div><span className="shrink-0 text-xs font-semibold text-muted">{award.year}</span></div><p className="mt-5 text-xs font-semibold text-muted transition group-hover:text-primary">View certificate</p></div>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedAward && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1117]/90 p-4 backdrop-blur-sm md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={selectedAward.title} onClick={() => setSelectedAward(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }} className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between gap-5 border-b border-ink-border px-5 py-4 md:px-7"><div><p className="text-xs font-semibold text-primary">{selectedAward.brand}</p><h2 className="mt-1 font-display text-lg font-bold">{selectedAward.title}</h2></div><button type="button" onClick={() => setSelectedAward(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-border text-xl" aria-label="Close certificate">×</button></div>
              <div className="relative max-h-[78vh] aspect-[2000/1414] bg-[#F3F5F8]"><Image src={selectedAward.src} alt={selectedAward.alt} fill priority className="object-contain p-3 md:p-6" sizes="(max-width: 1024px) 100vw, 1024px" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
