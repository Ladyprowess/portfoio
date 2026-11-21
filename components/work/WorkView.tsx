import Image from 'next/image'
import type { ReactNode } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Reveal } from '@/components/home/Motion'
import { KivoraMock } from '@/components/home/Ventures'
import { products, python } from '@/lib/builds-content'
import { learning, websites, writing } from '@/lib/work-content'

// The Work page: the one place for proof. Every project appears here once,
// as a picture and one line. Services (what she can do for you), About (her
// story) and the CV (for recruiters) link here instead of repeating it.

const wrap = 'mx-auto max-w-[1200px] px-5 md:px-8'
const kivora = products.find(p => p.id === 'kivorapay')!
// Chidexun is a client website, so it lives under Websites, not Products.
const otherProducts = products.filter(p => !['kivorapay', 'chidexun', 'portfolio'].includes(p.id))
// Prowess Digital Solutions and Dritchwear are shown once, under Products.
const sites = websites.filter(w => w.title !== 'Prowess Digital Solutions' && w.title !== 'Dritchwear')

const sections = [
  { id: 'products', label: 'Products' },
  { id: 'writing', label: 'Technical writing' },
  { id: 'websites', label: 'Websites' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'python', label: 'Python' },
]

export default function WorkView() {
  return <main className="min-h-screen bg-bg text-parchment">
    <Nav />

    <header className="relative overflow-hidden pb-10 pt-28 md:pb-14 md:pt-40">
      <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className={`${wrap} relative`}>
        <p className="font-head text-[11px] uppercase tracking-[.18em] text-primary">Work</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-.04em]">Things I’ve built and written.</h1>
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
          {sections.map(s => <a key={s.id} href={`#${s.id}`} className="rounded-full border border-ink-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:text-primary">{s.label}</a>)}
        </nav>
      </div>
    </header>

    {/* ── Products ─────────────────────────────────────── */}
    <Section id="products" label="Products" title="Products I built with AI coding agents">
      <Reveal>
        <a href={kivora.href} target="_blank" rel="noopener noreferrer" className="group grid overflow-hidden rounded-[2rem] bg-[#0E223C] text-white lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col p-7 md:p-12">
            <span className="w-max rounded-full bg-[#84CC16]/20 px-2.5 py-1 text-[11px] font-semibold text-[#BEF264]">● Live · Product lead and builder</span>
            <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-.03em] md:text-5xl">KivoraPay</h3>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/75 md:text-base">{kivora.summary}</p>
            <p className="mt-3 text-sm text-white/55">Web app, Android app and payment automations. 150+ commits.</p>
            <span className="mt-8 inline-flex w-max items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0E223C] transition group-hover:bg-white/90">Visit KivoraPay ↗</span>
          </div>
          <div className="relative min-h-[250px] md:min-h-[320px]"><KivoraMock /></div>
        </a>
      </Reveal>
      <div className="mt-16 space-y-16 md:space-y-24">
        {otherProducts.map((p, i) => <Reveal key={p.id}><Row flip={i % 2 === 1} href={p.href} image={p.image} title={p.name} tag={p.status} kind={p.kind} text={p.summary} /></Reveal>)}
      </div>
    </Section>

    {/* ── Technical writing ────────────────────────────── */}
    <Section id="writing" label="Technical writing" title="Documentation and articles" tint>
      <Reveal>
        <a href="/docs" className="group flex flex-col gap-6 rounded-[2rem] border border-ink-border bg-surface p-7 transition hover:border-primary/50 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <span className="font-head text-[11px] uppercase tracking-[.16em] text-primary">Interactive samples</span>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.02em] md:text-3xl">API references, developer guides and manuals</h3>
            <p className="mt-2 text-[15px] text-muted">The same kind of docs I wrote for zkSync, TxFusion and Rootstock.</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition group-hover:bg-primary-dim">Open the docs →</span>
        </a>
      </Reveal>
      <p className="mt-12 font-head text-[11px] uppercase tracking-[.16em] text-muted">Published on</p>
      <ul className="mt-4 grid border-t border-ink-border sm:grid-cols-2">
        {writing.map(w => <li key={w.title} className="border-b border-ink-border sm:odd:border-r sm:odd:pr-8 sm:even:pl-8">
          <a href={w.href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4 py-4">
            <span><span className="font-display text-lg font-semibold tracking-[-.01em] group-hover:text-primary">{w.title}</span><span className="mt-0.5 block text-sm text-muted">{w.description}</span></span>
            <span className="shrink-0 text-primary">↗</span>
          </a>
        </li>)}
      </ul>
    </Section>

    {/* ── Websites ─────────────────────────────────────── */}
    <Section id="websites" label="Websites" title="Websites I designed and built">
      <Grid>
        {sites.map(w => <Card key={w.title} href={w.href} image={w.image} title={w.title} text={w.description} />)}
      </Grid>
    </Section>

    {/* ── Teaching ─────────────────────────────────────── */}
    <Section id="teaching" label="Teaching" title="Courses and resources" tint>
      <ul className="border-t border-ink-border">
        {learning.map(l => <li key={l.title} className="border-b border-ink-border">
          <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 py-5">
            <span className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:block"><Image src={l.image} alt="" fill sizes="96px" className="object-cover" /></span>
            <span className="flex-1"><span className="font-display text-lg font-semibold tracking-[-.01em] group-hover:text-primary">{l.title}</span><span className="mt-0.5 block text-sm text-muted">{l.description}</span></span>
            <span className="shrink-0 text-primary">↗</span>
          </a>
        </li>)}
      </ul>
    </Section>

    {/* ── Python ───────────────────────────────────────── */}
    <Section id="python" label="Python" title="Tools that remove manual work">
      <ul className="overflow-hidden rounded-3xl bg-[#0B0F14] text-[#E7EDF6]">
        {python.map(t => <li key={t.id} className="grid gap-1 border-b border-white/10 px-6 py-5 last:border-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-8 md:px-8">
          <p className="truncate font-head text-[13px]"><span className="text-[#28C840]">$</span> {t.cmd}</p>
          <p className="text-sm leading-6 text-white/70"><span className="font-semibold text-white">{t.name}.</span> {t.summary}</p>
        </li>)}
      </ul>
      <p className="mt-8 max-w-2xl text-sm leading-6 text-muted">
        <span className="font-semibold text-parchment">How I build: </span>
        I direct AI coding agents (Claude Code) and write the rules they work by, then test every state before anything ships.
      </p>
    </Section>

    {/* ── Next step ────────────────────────────────────── */}
    <section className={`${wrap} pb-24`}>
      <div className="grid gap-4 md:grid-cols-2">
        <a href="/recruiter" className="group rounded-[2rem] bg-panel p-8 text-on-panel transition hover:opacity-95 md:p-10">
          <p className="font-head text-[11px] uppercase tracking-[.16em] text-accent-invert">Hiring?</p>
          <p className="mt-3 font-display text-2xl font-semibold tracking-[-.02em]">See my CV →</p>
        </a>
        <a href="/services" className="group rounded-[2rem] bg-primary p-8 text-on-primary transition hover:bg-primary-dim md:p-10">
          <p className="font-head text-[11px] uppercase tracking-[.16em] text-on-primary/70">Need help with a project?</p>
          <p className="mt-3 font-display text-2xl font-semibold tracking-[-.02em]">See how I can help →</p>
        </a>
      </div>
    </section>

    <Footer />
  </main>
}

function Section({ id, label, title, tint = false, children }: { id: string; label: string; title: string; tint?: boolean; children: ReactNode }) {
  return <section id={id} className={`scroll-mt-20 ${tint ? 'border-y border-ink-border bg-surface-2/50' : ''}`}>
    <div className={`${wrap} py-16 md:py-24`}>
      <p className="font-head text-[11px] uppercase tracking-[.16em] text-primary">{label}</p>
      <h2 className="mb-10 mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.4rem] md:leading-[1.1]">{title}</h2>
      {children}
    </div>
  </section>
}

/** A product shown big: picture on one side, a few words on the other. */
function Row({ flip, href, image, title, tag, kind, text }: { flip: boolean; href?: string; image?: string; title: string; tag?: string; kind: string; text: string }) {
  const external = href?.startsWith('http')
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group grid items-center gap-8 md:grid-cols-2 md:gap-14">
    <div className={`relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-ink-border bg-surface-2 shadow-[0_30px_70px_-40px_rgba(17,24,39,.4)] ${flip ? 'md:order-2' : ''}`}>
      {image && <Image src={image} alt={`${title} screenshot`} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover object-top transition duration-700 group-hover:scale-[1.02]" />}
    </div>
    <div>
      {tag && <span className={`text-xs font-semibold ${tag === 'Live' ? 'text-success' : 'text-muted'}`}>● {tag}</span>}
      <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-.03em]">{title}</h3>
      <p className="mt-1 text-sm text-muted">{kind}</p>
      <p className="mt-4 max-w-md text-[15px] leading-7 text-parchment/85">{text}</p>
      <span className="mt-5 inline-block text-sm font-semibold text-primary">{external ? 'Visit ↗' : 'Open →'}</span>
    </div>
  </a>
}

function Grid({ cols4 = false, children }: { cols4?: boolean; children: ReactNode }) {
  return <div className={`mt-6 grid gap-5 sm:grid-cols-2 ${cols4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>{children}</div>
}

/** The one card style used for every project: picture, name, one line, link. */
function Card({ href, image, title, text, tag, small = false }: { href?: string; image?: string; title: string; text: string; tag?: string; small?: boolean }) {
  const external = href?.startsWith('http')
  return <Reveal className="h-full">
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-border bg-surface transition hover:-translate-y-0.5 hover:border-primary/40">
      <div className={`relative overflow-hidden border-b border-ink-border bg-surface-2 ${small ? 'aspect-[16/10]' : 'aspect-[16/10]'}`}>
        {image && <Image src={image} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" />}
        {tag && <span className={`absolute bottom-3 left-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${tag === 'Live' ? 'text-success' : 'text-muted'}`}>● {tag}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-display font-semibold tracking-[-.01em] ${small ? 'text-base' : 'text-lg'}`}>{title}</h3>
        <p className={`mt-1.5 line-clamp-2 leading-6 text-muted ${small ? 'text-[13px]' : 'text-sm'}`}>{text}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-primary">{external ? 'Visit ↗' : 'Open →'}</span>
      </div>
    </a>
  </Reveal>
}
