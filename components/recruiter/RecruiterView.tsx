'use client'

import Image from 'next/image'
import posthog from 'posthog-js'
import { useState, type ReactNode } from 'react'
import Nav from '@/components/Nav'
import { CV_URL, RECOMMENDATION_URL } from '@/lib/site'
import { achievements, awards, certifications, education, experience, headline, LINKEDIN_URL, pitch, projects, skills, workTypes } from '@/lib/recruiter-content'

const EMAIL = 'hello@ladyprowess.com'

// The CV page, laid out like a printed CV: one column, a fixed label column on
// the left, the same rhythm in every section and hairlines between them.
export default function RecruiterView() {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2000) } catch { /* clipboard blocked */ }
    posthog.capture('recruiter_link_copied')
  }

  return <main className="min-h-screen bg-bg text-parchment">
    <div className="print:hidden"><Nav /></div>

    <article className="mx-auto max-w-[860px] px-5 pb-24 pt-28 md:px-8 md:pt-36 print:max-w-none print:px-0 print:pt-0">
      {/* Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-2 md:h-24 md:w-24">
          <Image src="/personal photo/headshot4.png" alt="Ngozi Peace Unegbu" fill priority sizes="96px" className="object-cover object-[50%_15%]" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold tracking-[-.03em] md:text-4xl">Ngozi Peace Unegbu</h1>
          <p className="mt-1.5 text-[15px] font-medium text-primary">{headline}</p>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
            <a href={`mailto:${EMAIL}`} className="hover:text-parchment">{EMAIL}</a>
            <span aria-hidden="true">·</span>
            <a href="/" className="hover:text-parchment">ladyprowess.com</a>
            <span aria-hidden="true">·</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-parchment">LinkedIn</a>
          </p>
          <p className="mt-1 text-sm text-muted">{workTypes}</p>
        </div>
      </header>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
        <a href={CV_URL} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('recruiter_cv_opened')} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">Download CV</a>
        <a href={`mailto:${EMAIL}?subject=Role%20at%20`} onClick={() => posthog.capture('recruiter_email_clicked')} className="rounded-full border border-ink-border px-5 py-2.5 text-sm font-semibold hover:border-muted">Email me</a>
        <a href={RECOMMENDATION_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink-border px-5 py-2.5 text-sm font-semibold hover:border-muted">Recommendation letter</a>
        <button type="button" onClick={copyLink} className="text-sm font-semibold text-muted hover:text-parchment sm:ml-auto">{copied ? 'Link copied' : 'Copy page link'}</button>
      </div>

      <Section title="Profile">
        <p className="text-[15px] leading-7 text-parchment/85">{pitch}</p>
      </Section>

      <Section title="Experience">
        <ol className="space-y-9">
          {experience.map(e => <li key={e.role + e.org}>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h3 className="font-display text-[17px] font-semibold leading-snug tracking-[-.01em]">{e.role} <span className="font-normal text-muted">·</span> {e.org}</h3>
              <p className="shrink-0 text-sm text-muted sm:text-right">{e.when}</p>
            </div>
            {e.where && <p className="mt-0.5 text-sm text-muted">{e.where}</p>}
            <ul className="mt-3 space-y-2">
              {e.points.map(pt => <li key={pt} className="relative pl-4 text-[15px] leading-7 text-parchment/85 before:absolute before:left-0 before:top-[13px] before:h-1 before:w-1 before:rounded-full before:bg-muted">{pt}</li>)}
            </ul>
          </li>)}
        </ol>
      </Section>

      <Section title="Achievements">
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {achievements.map(a => <div key={a.label}>
            <dt className="text-sm font-semibold">{a.label}</dt>
            <dd className="mt-0.5 text-[15px] leading-6 text-muted">{a.text}</dd>
          </div>)}
        </dl>
      </Section>

      <Section title="Skills">
        <dl className="space-y-3">
          {skills.map(s => <div key={s.group} className="grid gap-0.5 sm:grid-cols-[140px_1fr] sm:gap-4">
            <dt className="text-sm font-semibold">{s.group}</dt>
            <dd className="text-[15px] leading-6 text-muted">{s.items}</dd>
          </div>)}
        </dl>
      </Section>

      <Section title="Projects">
        <ul className="space-y-4">
          {projects.map(p => <li key={p.title}>
            <p className="text-[15px] font-semibold">
              {p.href ? <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{p.title} ↗</a> : p.title}
            </p>
            <p className="mt-0.5 text-[15px] leading-6 text-muted">{p.text}</p>
          </li>)}
        </ul>
        <a href="/builds" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline print:hidden">See everything I have built →</a>
      </Section>

      <Section title="Education">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <p className="text-[15px] font-semibold">{education.title}</p>
          <p className="shrink-0 text-sm text-muted">{education.year}</p>
        </div>
        <p className="mt-0.5 text-[15px] text-muted">{education.org}</p>
        <p className="mt-2 text-sm italic text-muted">{education.note}</p>
      </Section>

      <Section title="Certifications">
        <List items={certifications} />
      </Section>

      <Section title="Awards">
        <List items={awards} />
      </Section>

      <Section title="Languages">
        <p className="text-[15px]">English <span className="text-muted">· Fluent</span></p>
      </Section>

      <p className="mt-14 text-center text-sm text-muted print:hidden">
        <a href={CV_URL} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('recruiter_cv_opened', { placement: 'footer' })} className="font-semibold text-primary hover:underline">Download the full CV</a>
        <span className="mx-2" aria-hidden="true">·</span>
        <a href="/" className="font-semibold text-primary hover:underline">See the full portfolio</a>
      </p>
    </article>
  </main>
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-12 grid gap-4 border-t border-ink-border pt-8 md:grid-cols-[160px_1fr] md:gap-10 print:mt-6 print:pt-4">
    <h2 className="font-head text-[11px] uppercase tracking-[.16em] text-muted md:pt-1">{title}</h2>
    <div className="min-w-0">{children}</div>
  </section>
}

function List({ items }: { items: { title: string; org: string }[] }) {
  return <ul className="divide-y divide-ink-border">
    {items.map(i => <li key={i.title} className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-6">
      <span className="text-[15px] font-medium">{i.title}</span>
      <span className="text-sm text-muted sm:text-right">{i.org}</span>
    </li>)}
  </ul>
}
