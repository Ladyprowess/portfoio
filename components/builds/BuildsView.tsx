import Image from 'next/image'
import type { ReactNode } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Reveal } from '@/components/home/Motion'
import { KivoraMock } from '@/components/home/Ventures'
import { answers, automations, products, python, tools, workflow, type Build } from '@/lib/builds-content'

// The Builds page: evidence that Ngozi builds, not only explains. One clear
// path down the page: quick answers, a featured build, the other applications,
// how she works with AI agents, Python tools, automations, toolbox.

const wrap = 'mx-auto max-w-[1200px] px-5 md:px-8'
const featured = products[0]
const others = products.slice(1)

const jump = [
  { href: '#applications', label: 'Applications' },
  { href: '#ai-agents', label: 'AI agents' },
  { href: '#python', label: 'Python' },
  { href: '#automation', label: 'Automation' },
]

export default function BuildsView() {
  return <main className="min-h-screen bg-bg text-parchment">
    <Nav />

    {/* ── Header ─────────────────────────────────────────── */}
    <header className="relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-40">
      <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />
      <div className={`${wrap} relative`}>
        <p className="font-head text-[11px] uppercase tracking-[.18em] text-primary">Builds</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-.04em]">I build working products with AI, not just content about them.</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted md:text-base">Applications, AI agent workflows, Python tools and automations. Each one solves a real problem for a real business, including my own.</p>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <dl className="flex gap-8 md:gap-12">
            {[[products.length, 'Applications'], [python.length, 'Python tools'], [automations.length, 'Automations']].map(([v, l]) => <div key={l} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-muted">{l}</dt>
              <dd className="font-display text-4xl font-semibold tracking-[-.04em] md:text-5xl">{v}</dd>
            </div>)}
          </dl>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {jump.map(j => <a key={j.href} href={j.href} className="rounded-full border border-ink-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:text-primary">{j.label}</a>)}
          </nav>
        </div>
      </div>
    </header>

    {/* ── Quick answers ──────────────────────────────────── */}
    <section className="border-y border-ink-border bg-surface">
      <div className={`${wrap} py-10 md:py-12`}>
        <p className="font-head text-[11px] uppercase tracking-[.16em] text-muted">The short answers</p>
        <dl className="mt-6 grid gap-6 md:grid-cols-3 md:gap-10">
          {answers.map(a => <div key={a.q} className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
            </span>
            <div>
              <dt className="text-[15px] font-semibold leading-snug">{a.q}</dt>
              <dd className="mt-1.5 text-sm leading-6 text-muted"><span className="font-semibold text-parchment">Yes. </span>{a.a}</dd>
            </div>
          </div>)}
        </dl>
      </div>
    </section>

    {/* ── Applications ───────────────────────────────────── */}
    <section id="applications" className={`${wrap} scroll-mt-24 py-20 md:py-28`}>
      <Heading label="Applications" title="Products I have built" intro="Built with AI coding agents, from first requirements to launch." />

      {/* Featured */}
      <Reveal>
        <article id={featured.id} className="grid scroll-mt-28 overflow-hidden rounded-[2rem] bg-[#0E223C] text-white lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col p-7 md:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#84CC16]/20 px-2.5 py-1 text-[11px] font-semibold text-[#BEF264]">● {featured.status}</span>
              <span className="text-xs text-white/60">{featured.kind}</span>
            </div>
            <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-.03em] md:text-5xl">{featured.name}</h3>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-white/75 md:text-base">{featured.summary}</p>
            <ul className="mt-6 space-y-3">
              {featured.did.map(d => <li key={d} className="flex gap-3 text-sm leading-6 text-white/80"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8DBBFF]" />{d}</li>)}
            </ul>
            <Stack items={featured.stack} dark />
            {featured.href && <a href={featured.href} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex w-max items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0E223C] transition hover:bg-white/90">{featured.linkLabel} ↗</a>}
          </div>
          <div className="relative min-h-[340px] lg:min-h-full"><KivoraMock /></div>
        </article>
      </Reveal>

      {/* The rest */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {others.map((b, i) => <Reveal key={b.id} delay={(i % 2) * 0.08} className="h-full"><AppCard b={b} /></Reveal>)}
      </div>
    </section>

    {/* ── AI agents ──────────────────────────────────────── */}
    <section id="ai-agents" className="scroll-mt-20 bg-panel text-on-panel">
      <div className={`${wrap} py-20 md:py-28`}>
        <p className="font-head text-[11px] uppercase tracking-[.16em] text-accent-invert">AI agents</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.6rem] md:leading-[1.08]">How I direct AI coding agents</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-on-panel/65">I brief agents the way I would brief an engineering team, and I write the rules they work by. This is AI-assisted development: I direct the agents rather than build them from scratch.</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
          <ol className="relative space-y-7 border-l border-border-invert pl-8">
            {workflow.map((w, i) => <li key={w.step} className="relative">
              <span className="absolute -left-[45px] flex h-7 w-7 items-center justify-center rounded-full bg-primary font-head text-[11px] font-bold text-on-primary">{i + 1}</span>
              <p className="font-display text-lg font-semibold">{w.step}</p>
              <p className="mt-1 text-[15px] leading-6 text-on-panel/65">{w.text}</p>
            </li>)}
          </ol>
          <div className="min-w-0 self-start overflow-hidden rounded-2xl border border-border-invert bg-[#0B0F14]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-head text-xs text-white/50">AGENTS.md · Prowess Digital Solutions</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-head text-[12.5px] leading-6 text-[#E7EDF6]">{`# Working on this live product

- When fixing an issue, inspect the complete
  affected user journey and all sibling features
  that could share the same defect.
- Check signed-in and signed-out behaviour,
  payments, emails, error and success states.
- Report what was verified, remaining
  limitations, and whether changes are local
  or deployed. Never imply a live fix without
  deployment evidence.`}</pre>
          </div>
        </div>
      </div>
    </section>

    {/* ── Python ─────────────────────────────────────────── */}
    <section id="python" className={`${wrap} scroll-mt-24 py-20 md:py-28`}>
      <Heading label="Python" title="Practical Python tools" intro="Small scripts that remove slow, manual work from real projects." />
      <div className="grid gap-6 md:grid-cols-3">
        {python.map((b, i) => <Reveal key={b.id} delay={i * 0.08} className="h-full">
          <article id={b.id} className="flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-ink-border bg-surface">
            <div className="bg-[#0B0F14] px-4 py-3.5">
              <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" /></div>
              <p className="mt-3 truncate font-head text-[12.5px] text-[#E7EDF6]"><span className="text-[#28C840]">$</span> {b.cmd}</p>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-semibold text-primary">{b.kind}</p>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-[-.01em]">{b.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{b.summary}</p>
              <p className="mt-3 text-sm leading-6 text-parchment/85">{b.did[0]}</p>
              <div className="mt-auto pt-5"><Stack items={b.stack} /></div>
            </div>
          </article>
        </Reveal>)}
      </div>
    </section>

    {/* ── Automation + toolbox ───────────────────────────── */}
    <section id="automation" className="scroll-mt-20 border-t border-ink-border bg-surface-2/50">
      <div className={`${wrap} py-20 md:py-28`}>
        <Heading label="Automation" title="Jobs that run without me" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {automations.map(a => <div key={a.title} className="rounded-3xl border border-ink-border bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v5l3 2" /><circle cx="12" cy="12" r="8.5" /></svg>
            </span>
            <h3 className="mt-4 text-[15px] font-semibold">{a.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted">{a.text}</p>
          </div>)}
        </div>

        <div className="mt-16">
          <p className="font-head text-[11px] uppercase tracking-[.16em] text-muted">Toolbox</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map(t => <div key={t.group}>
              <p className="text-sm font-semibold">{t.group}</p>
              <Stack items={t.items} />
            </div>)}
          </div>
        </div>
      </div>
    </section>

    {/* ── Call to action ─────────────────────────────────── */}
    <section className={`${wrap} py-20 md:py-24`}>
      <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-primary p-8 text-on-primary md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[-.02em] md:text-3xl">Have a problem worth solving?</p>
          <p className="mt-2 max-w-lg text-[15px] leading-7 text-on-primary/80">Tell me about your product, workflow or AI adoption plans.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:hello@ladyprowess.com?subject=Let%27s%20talk" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1D4ED8] transition hover:bg-white/90">Email me</a>
          <a href="/recruiter" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold transition hover:bg-white/10">View my CV</a>
        </div>
      </div>
    </section>

    <Footer />
  </main>
}

function Heading({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <div className="mb-10 max-w-2xl">
    <p className="font-head text-[11px] uppercase tracking-[.16em] text-primary">{label}</p>
    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.6rem] md:leading-[1.08]">{title}</h2>
    {intro && <p className="mt-3 text-[15px] leading-7 text-muted">{intro}</p>}
  </div>
}

function Stack({ items, dark = false }: { items: string; dark?: boolean }) {
  return <ul className="mt-3 flex flex-wrap gap-1.5">
    {items.split(',').map(s => s.trim()).filter(Boolean).map(s => <li key={s}
      className={`rounded-full px-2.5 py-1 text-xs ${dark ? 'bg-white/10 text-white/80' : 'border border-ink-border bg-bg text-parchment/80'}`}>{s}</li>)}
  </ul>
}

/** One application: a picture on top, then what it is, what was built and the link. */
function AppCard({ b }: { b: Build }) {
  const live = b.status === 'Live'
  const external = b.href?.startsWith('http')
  return <article id={b.id} className="flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[1.75rem] border border-ink-border bg-surface">
    <div className="relative aspect-[16/9] overflow-hidden border-b border-ink-border bg-surface-2">
      {b.image
        ? <Image src={b.image} alt={`${b.name} screenshot`} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover object-top" />
        : <div className="absolute inset-0 flex flex-col items-start justify-end bg-[radial-gradient(circle_at_80%_10%,rgb(var(--primary)/.18),transparent_60%)] p-6">
            <span className="font-head text-[11px] uppercase tracking-[.16em] text-primary">{b.kind.split('·')[0].trim()}</span>
            <span className="mt-1 font-display text-3xl font-semibold tracking-[-.03em]">{b.name}</span>
          </div>}
      {b.status && <span className={`absolute bottom-4 left-4 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${live ? 'bg-surface/90 text-success' : 'bg-surface/90 text-muted'}`}>● {b.status}</span>}
    </div>
    <div className="flex flex-1 flex-col p-6 md:p-7">
      <p className="text-xs text-muted">{b.kind}</p>
      <h3 className="mt-1.5 font-display text-xl font-semibold tracking-[-.02em]">{b.name}</h3>
      <p className="mt-2 text-[15px] leading-6 text-parchment/85">{b.summary}</p>
      <ul className="mt-4 space-y-2">
        {b.did.map(d => <li key={d} className="flex gap-2.5 text-sm leading-6 text-muted"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />{d}</li>)}
      </ul>
      <div className="mt-auto pt-5">
        <Stack items={b.stack} />
        {b.href && <a href={b.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">{b.linkLabel ?? 'Open'} {external ? '↗' : '→'}</a>}
      </div>
    </div>
  </article>
}
