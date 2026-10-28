'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import posthog from 'posthog-js'
import { useState, type ReactNode } from 'react'
import Nav from '@/components/Nav'
import { CV_URL, RECOMMENDATION_URL } from '@/lib/site'
import { certifications, education, experience, glance, headline, LINKEDIN_URL, openTo, pitch, proof, quote, skills } from '@/lib/recruiter-content'

// The recruiter view: one scannable page with everything a hiring manager
// needs, and the main actions (CV, email, LinkedIn) never more than a glance away.
export default function RecruiterView() {
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2000) } catch { /* clipboard blocked */ }
    posthog.capture('recruiter_link_copied')
  }

  const rise = (i: number) => reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }

  return <main className="min-h-screen bg-bg text-parchment">
    <div className="print:hidden"><Nav /></div>
    <div aria-hidden="true" className="desk-dots pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,black,transparent)] print:hidden" />

    <div className="relative mx-auto max-w-[1100px] px-5 pb-20 pt-24 md:px-8 md:pt-32 print:pt-6">
      <motion.p {...rise(0)} className="flex flex-wrap items-center gap-2 font-head text-[10px] uppercase tracking-[.2em] text-primary print:hidden">
        Recruiter view · the 60-second version
        <a href="/" className="rounded-full border border-ink-border px-2.5 py-1 normal-case tracking-normal text-muted hover:text-parchment">See the full portfolio →</a>
      </motion.p>

      {/* Header card */}
      <motion.section {...rise(1)} className="mt-5 overflow-hidden rounded-[28px] border border-ink-border bg-surface shadow-[0_40px_100px_-50px_rgba(17,24,39,.45)]">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:gap-8 md:p-9">
          <div className="relative h-28 w-28 overflow-hidden rounded-3xl bg-surface-2 md:h-36 md:w-36">
            <Image src="/personal photo/headshot4.png" alt="Ngozi Peace Okafor" fill priority sizes="144px" className="object-cover object-[50%_15%]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.6rem]">Ngozi Peace Okafor</h1>
              <span className="flex items-center gap-1.5 rounded-full bg-[#84CC16]/15 px-3 py-1 text-xs font-semibold text-[#3F6212] dark:text-[#BEF264]"><span className="h-1.5 w-1.5 rounded-full bg-[#84CC16]" />Open to work · Remote</span>
            </div>
            <p className="mt-1 text-base font-semibold text-parchment/80">{headline}</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 md:text-base">{pitch}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{openTo.map(r => <span key={r} className="rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1 text-xs font-semibold text-primary">{r}</span>)}</div>
          </div>
        </div>
        {/* The main actions */}
        <div className="flex flex-wrap gap-2 border-t border-ink-border bg-surface-2/50 p-4 md:px-9 print:hidden">
          <a href={CV_URL} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('recruiter_cv_opened')} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-[0_10px_30px_-12px_rgb(var(--primary)/.7)] hover:bg-primary-dim">Download CV ↗</a>
          <a href="mailto:hello@ladyprowess.com?subject=Role%20at%20" onClick={() => posthog.capture('recruiter_email_clicked')} className="rounded-full border border-ink-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-muted">Email me</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-muted">LinkedIn ↗</a>
          <a href={RECOMMENDATION_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-muted">Recommendation letter ↗</a>
          <button type="button" onClick={copyLink} className="rounded-full px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/[0.07] sm:ml-auto">{copied ? '✓ Link copied' : 'Copy link to share'}</button>
        </div>
      </motion.section>

      {/* At a glance */}
      <motion.dl {...rise(2)} className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {glance.map(g => <div key={g.label} className="flex flex-col-reverse rounded-2xl border border-ink-border bg-surface p-5">
          <dt className="mt-1 text-xs text-muted">{g.label}<span className="block text-[11px] text-muted/70">{g.where}</span></dt><dd className="font-display text-3xl font-semibold tracking-[-.04em] text-primary">{g.value}</dd>
        </div>)}
      </motion.dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        {/* Experience */}
        <Card title="Experience" i={3} rise={rise}>
          <ol className="relative space-y-6 border-l border-ink-border pl-6">
            {experience.map(e => <li key={e.role + e.when} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-primary" />
              <p className="font-head text-[10px] uppercase tracking-wider text-primary">{e.when} · {e.where}</p>
              <p className="mt-1 font-display text-lg font-semibold leading-snug tracking-[-.02em]">{e.role} <span className="font-normal text-muted">at</span> {e.org}</p>
              <ul className="mt-2 space-y-1.5">{e.points.map(pt => <li key={pt} className="flex gap-2 text-sm leading-6 text-muted"><span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-muted" />{pt}</li>)}</ul>
            </li>)}
          </ol>
        </Card>

        <div className="space-y-5">
          <Card title="Skills & tools" i={4} rise={rise}>
            <div className="space-y-4">{skills.map(s => <div key={s.group}>
              <p className="text-xs font-semibold text-muted">{s.group}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{s.items.map(item => <span key={item} className="rounded-full border border-ink-border bg-bg px-2.5 py-1 text-xs">{item}</span>)}</div>
            </div>)}</div>
          </Card>
          <Card title="Education & certifications" i={5} rise={rise}>
            <ul className="space-y-3 text-sm">
              {education.map(e => <li key={e.title}><p className="font-semibold">{e.title}</p><p className="text-muted">{e.org} · {e.year}</p></li>)}
              {certifications.map(c => <li key={c.title} className="flex justify-between gap-3 border-t border-ink-border pt-3"><span className="font-medium">{c.title}</span><span className="text-right text-muted">{c.org}</span></li>)}
            </ul>
          </Card>
        </div>
      </div>

      {/* Proof and a reference */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <Card title="See the work" i={6} rise={rise}>
          <div className="grid gap-3 sm:grid-cols-3">
            {proof.map(p => <a key={p.title} href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-ink-border bg-bg p-4 transition hover:-translate-y-0.5 hover:border-primary/50">
              <span className="font-head text-[10px] uppercase tracking-wider text-primary">{p.label}</span>
              <span className="mt-2 text-sm font-semibold leading-snug">{p.title}</span>
              <span className="mt-auto pt-3 text-xs font-semibold text-primary">Open <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
            </a>)}
          </div>
        </Card>
        <motion.figure {...rise(7)} className="flex flex-col rounded-3xl bg-primary p-6 text-on-primary md:p-7">
          <span aria-hidden="true" className="font-display text-5xl leading-none text-on-primary/50">“</span>
          <blockquote className="mt-1 font-serif text-lg leading-7">{quote.text}</blockquote>
          <figcaption className="mt-auto pt-5 text-sm text-on-primary/80"><span className="block font-semibold text-on-primary">{quote.name}</span>{quote.role}</figcaption>
        </motion.figure>
      </div>

      <p className="mt-10 text-center text-sm text-muted print:hidden">Want the full story? <a href="/" className="font-semibold text-primary hover:underline">See the full portfolio →</a></p>
    </div>
  </main>
}

function Card({ title, i, rise, children }: { title: string; i: number; rise: (i: number) => object; children: ReactNode }) {
  return <motion.section {...rise(i)} className="rounded-3xl border border-ink-border bg-surface p-6 md:p-7">
    <h2 className="mb-5 font-head text-[11px] uppercase tracking-[.16em] text-muted">{title}</h2>
    {children}
  </motion.section>
}
