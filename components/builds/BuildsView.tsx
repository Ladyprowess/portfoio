import type { ReactNode } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { answers, automations, products, python, tools, workflow, type Build } from '@/lib/builds-content'

// What Ngozi has built. It opens with direct answers to the questions hiring
// teams ask about AI and Python, then shows the evidence for each. Same quiet
// document layout as the CV page: a label column, hairlines, no cards.
export default function BuildsView() {
  return <main className="min-h-screen bg-bg text-parchment">
    <Nav />

    <article className="mx-auto max-w-[920px] px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <header className="max-w-2xl">
        <p className="font-head text-[11px] uppercase tracking-[.16em] text-primary">Builds</p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-.03em] md:text-[2.6rem]">I build working products with AI, not just content about them.</h1>
        <p className="mt-4 text-[15px] leading-7 text-muted md:text-base">Applications, agent workflows, Python scripts and automations. Each one solves a real problem for a real business, including my own.</p>
      </header>

      {/* Direct answers to the screening questions */}
      <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border md:grid-cols-3">
        {answers.map(a => <div key={a.q} className="bg-surface p-6">
          <dt className="text-sm font-semibold leading-snug">{a.q}</dt>
          <dd className="mt-3 text-sm leading-6 text-muted"><span className="font-semibold text-primary">Yes. </span>{a.a}</dd>
        </div>)}
      </dl>

      <Section title="How I work with AI agents">
        <ol className="space-y-4">
          {workflow.map((p, i) => <li key={p.step} className="grid grid-cols-[28px_1fr] gap-3">
            <span className="font-head text-xs text-primary pt-1">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-[15px] leading-7"><span className="font-semibold">{p.step}. </span><span className="text-muted">{p.text}</span></p>
          </li>)}
        </ol>
      </Section>

      <Section title="Applications">
        <BuildList items={products} />
      </Section>

      <Section title="Python">
        <BuildList items={python} />
      </Section>

      <Section title="Automation">
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {automations.map(a => <div key={a.title}>
            <dt className="text-[15px] font-semibold">{a.title}</dt>
            <dd className="mt-0.5 text-[15px] leading-6 text-muted">{a.text}</dd>
          </div>)}
        </dl>
      </Section>

      <Section title="Tools">
        <dl className="space-y-3">
          {tools.map(t => <div key={t.group} className="grid gap-0.5 sm:grid-cols-[120px_1fr] sm:gap-4">
            <dt className="text-sm font-semibold">{t.group}</dt>
            <dd className="text-[15px] leading-6 text-muted">{t.items}</dd>
          </div>)}
        </dl>
      </Section>

      <div className="mt-16 flex flex-col items-start gap-4 border-t border-ink-border pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-[15px] leading-7 text-muted">Want to see how I would approach your product, workflow or AI adoption?</p>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:hello@ladyprowess.com?subject=Let%27s%20talk" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dim">Email me</a>
          <a href="/recruiter" className="rounded-full border border-ink-border px-5 py-2.5 text-sm font-semibold hover:border-muted">View my CV</a>
        </div>
      </div>
    </article>

    <Footer />
  </main>
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-14 grid gap-5 border-t border-ink-border pt-8 md:grid-cols-[170px_1fr] md:gap-10">
    <h2 className="font-head text-[11px] uppercase tracking-[.16em] text-muted md:pt-1">{title}</h2>
    <div className="min-w-0">{children}</div>
  </section>
}

function BuildList({ items }: { items: Build[] }) {
  return <ul className="space-y-10">
    {items.map(b => <li key={b.name}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="font-display text-lg font-semibold tracking-[-.01em]">{b.name}</h3>
        {b.href && <a href={b.href} target={b.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="shrink-0 text-sm font-semibold text-primary hover:underline">{b.linkLabel ?? 'Open'}{b.href.startsWith('http') ? ' ↗' : ''}</a>}
      </div>
      <p className="mt-0.5 text-sm text-muted">{b.kind}</p>
      <p className="mt-3 text-[15px] leading-7">{b.summary}</p>
      <ul className="mt-2 space-y-1.5">
        {b.did.map(d => <li key={d} className="relative pl-4 text-[15px] leading-7 text-muted before:absolute before:left-0 before:top-[13px] before:h-1 before:w-1 before:rounded-full before:bg-muted">{d}</li>)}
      </ul>
      <p className="mt-3 text-sm text-muted"><span className="font-semibold text-parchment">Stack: </span>{b.stack}</p>
    </li>)}
  </ul>
}
