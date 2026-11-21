import Image from 'next/image'
import type { ReactNode } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Reveal } from '@/components/home/Motion'
import { KivoraMock } from '@/components/home/Ventures'
import { products, python } from '@/lib/builds-content'
import { learning, websites, writing } from '@/lib/work-content'
import WorkNav from './WorkNav'
import LazyLoopVideo from './LazyLoopVideo'
import VideoShowcase from './VideoShowcase'
import WebsiteMarquee from './WebsiteMarquee'
import TypingTerminal from './TypingTerminal'
import ProductSwitcher from './ProductSwitcher'

// The Work page: the one place for proof. Every project appears here once,
// as a picture and one line. Services (what she can do for you), About (her
// story) and the CV (for recruiters) link here instead of repeating it.

const wrap = 'mx-auto max-w-[1200px] px-5 md:px-8'
const kivora = products.find(p => p.id === 'kivorapay')!
// Chidexun is a client website, so it lives under Websites, not Products.
const otherProducts = products.filter(p => !['kivorapay', 'chidexun', 'portfolio', 'dritchwear'].includes(p.id))
// Prowess Digital Solutions is shown once, under Products; Dritchwear is a website.
const sites = websites.filter(w => w.title !== 'Prowess Digital Solutions')

// Videos she made with AI tools (web copies in /public/videos; originals in Downloads/Ai videos).
// No brand names and no links here, by request.
const aiVideos = [
  { src: '/videos/ai-4901.mp4', poster: '/videos/ai-4901.jpg', title: 'How we approach business problems', text: 'AI presenter video with captions.' },
  { src: '/videos/ai-payments.mp4', poster: '/videos/ai-payments.jpg', title: 'Payments, sorted', text: 'AI presenter video with captions.' },
  { src: '/videos/ai-bitcoin.mp4', poster: '/videos/ai-bitcoin.jpg', title: 'Buying Bitcoin? Know this first', text: 'AI presenter video for social, vertical format.' },
  { src: '/videos/ai-4903.mp4', poster: '/videos/ai-4903.jpg', title: 'The health of a business', text: 'AI presenter video with captions.' },
  { src: '/videos/ai-balance.mp4', poster: '/videos/ai-balance.jpg', title: 'Watching your balance', text: 'AI-generated product scene with captions.' },
  { src: '/videos/ai-4950.mp4', poster: '/videos/ai-4950.jpg', title: 'A client needs a logo…', text: 'AI-generated story scenes with captions.' },
]

const sections = [
  { id: 'products', label: 'Products' },
  { id: 'writing', label: 'Technical writing' },
  { id: 'websites', label: 'Websites' },
  { id: 'videos', label: 'Videos' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'coding', label: 'Coding' },
]

export default function WorkView() {
  return <main className="min-h-screen bg-bg text-parchment">
    <Nav />

    <header className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36">
      <div aria-hidden="true" className="desk-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[110px]" />
      <div className={`${wrap} relative grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16`}>
        <div>
          <p className="font-head text-[11px] uppercase tracking-[.18em] text-primary">Work</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-.045em]">Things I’ve built <span className="text-primary">and written.</span></h1>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-muted md:text-base">Real products, published writing and live websites. Every one is linked, so you can open it and see for yourself.</p>
        </div>

        {/* Three real screenshots, fanned like cards; they spread apart on hover. */}
        <div aria-hidden="true" className="group relative mx-auto h-[260px] w-full max-w-[520px] sm:h-[320px] lg:h-[360px]">
          {[
            { src: '/projects/chidexun.jpg', cls: 'left-0 top-10 -rotate-[8deg] group-hover:-translate-x-6 group-hover:-rotate-[11deg]' },
            { src: '/service-proof/prowess-digital-solutions.png', cls: 'right-0 top-4 rotate-[7deg] group-hover:translate-x-6 group-hover:rotate-[10deg]' },
            { src: '/projects/velantrii.jpg', cls: 'left-1/2 top-16 -translate-x-1/2 group-hover:-translate-y-3' },
          ].map(c => <div key={c.src} className={`absolute w-[72%] overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-[0_30px_70px_-30px_rgba(17,24,39,.45)] transition duration-500 ${c.cls}`}>
            <div className="flex gap-1 border-b border-ink-border px-3 py-2"><span className="h-1.5 w-1.5 rounded-full bg-[#F87171]" /><span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" /><span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" /></div>
            <div className="relative aspect-[16/10]"><Image src={c.src} alt="" fill sizes="380px" className="object-cover object-top" /></div>
          </div>)}
        </div>
      </div>
    </header>

    <WorkNav sections={sections} />

    {/* ── Products ─────────────────────────────────────── */}
    <Section id="products" label="Products" title="Products built with a touch of AI">
      <Reveal>
        <a href={kivora.href} target="_blank" rel="noopener noreferrer" className="group grid overflow-hidden rounded-[2rem] bg-[#0E223C] text-white lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col p-7 md:p-12">
            <span className="w-max rounded-full bg-[#84CC16]/20 px-2.5 py-1 text-[11px] font-semibold text-[#BEF264]">● Live · Product lead and builder</span>
            <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-.03em] md:text-5xl">KivoraPay</h3>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/75 md:text-base">{kivora.summary}</p>
            <p className="mt-3 text-sm text-white/55">Web app, Android app and payment automations.</p>
            <span className="mt-8 inline-flex w-max items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0E223C] transition group-hover:bg-white/90">Visit KivoraPay ↗</span>
          </div>
          <div className="relative min-h-[250px] md:min-h-[320px]"><KivoraMock /></div>
        </a>
      </Reveal>
      <div className="mt-8 md:hidden"><ProductSwitcher products={otherProducts} /></div>
      <div className="mt-16 hidden space-y-24 md:block">
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
      <div className="mt-4 flex flex-wrap gap-2 sm:hidden">
        {writing.map(w => <a key={w.title} href={w.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink-border bg-surface px-4 py-2 text-sm font-semibold transition active:scale-95 hover:border-primary hover:text-primary">{w.title} <span className="text-primary">↗</span></a>)}
      </div>
      <ul className="mt-4 hidden border-t border-ink-border sm:grid sm:grid-cols-2">
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
      <div className="sm:hidden"><WebsiteMarquee sites={sites} /></div>
      <div className="hidden sm:block"><Grid>
        {sites.map(w => <Card key={w.title} href={w.href} image={w.image} title={w.title} text={w.description} />)}
      </Grid></div>
    </Section>

    {/* ── Videos ───────────────────────────────────────── */}
    <Section id="videos" label="Videos" title="Videos made with AI" tint>
      <p className="-mt-4 mb-8 max-w-xl text-[15px] leading-7 text-muted">Short explainer videos produced with AI video tools.</p>
      <VideoShowcase videos={aiVideos} loops={['/videos/cc-1.mp4', '/videos/cc-2.mp4', '/videos/cc-3.mp4']} />

      <p className="mt-12 hidden font-head text-[11px] uppercase tracking-[.16em] text-muted lg:block">Animated explainers</p>
      <div className="mt-4 hidden max-w-[640px] grid-cols-3 gap-3 lg:grid">
        {['/videos/cc-1.mp4', '/videos/cc-2.mp4', '/videos/cc-3.mp4'].map(src => <LazyLoopVideo key={src} src={src}
          className="block aspect-[4/5] w-full rounded-2xl border border-ink-border bg-black object-cover" />)}
      </div>
    </Section>

    {/* ── Teaching ─────────────────────────────────────── */}
    <Section id="teaching" label="Teaching" title="Courses and resources">
      <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:block sm:overflow-visible sm:border-t sm:border-ink-border sm:px-0 sm:pb-0">
        {learning.map(l => <li key={l.title} className="w-[75%] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink-border bg-surface sm:w-auto sm:rounded-none sm:border-0 sm:border-b sm:bg-transparent">
          <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 sm:py-5">
            <span className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface-2 sm:aspect-auto sm:h-16 sm:w-24 sm:rounded-xl"><Image src={l.image} alt="" fill sizes="(max-width: 640px) 75vw, 96px" className="object-cover" /></span>
            <span className="flex-1 px-4 pb-4 sm:p-0"><span className="font-display text-lg font-semibold tracking-[-.01em] group-hover:text-primary">{l.title}</span><span className="mt-0.5 block text-sm text-muted">{l.description}</span></span>
            <span className="hidden shrink-0 text-primary sm:inline">↗</span>
          </a>
        </li>)}
      </ul>
    </Section>

    {/* ── Coding ───────────────────────────────────────── */}
    <Section id="coding" label="Coding" title="Tools that remove manual work">
      <div className="md:hidden"><TypingTerminal tools={python} /></div>
      <ul className="hidden overflow-hidden rounded-3xl bg-[#0B0F14] md:block">
        {python.map(t => <li key={t.id} className="grid w-[85%] shrink-0 snap-start content-start gap-2 rounded-2xl bg-[#0B0F14] px-5 py-5 text-[#E7EDF6] md:w-auto md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-8 md:rounded-none md:border-b md:border-white/10 md:px-8 md:last:border-0">
          <p className="truncate font-head text-[13px]"><span className="text-[#28C840]">$</span> {t.cmd}</p>
          <p className="text-sm leading-6 text-white/70"><span className="font-semibold text-white">{t.name}.</span> {t.summary}</p>
        </li>)}
      </ul>
      <p className="mt-8 max-w-2xl text-sm leading-6 text-muted">
        <span className="font-semibold text-parchment">How I build: </span>
        I use AI coding tools like Claude Code where they help, write the rules they work by, and test every state before anything ships.
      </p>
    </Section>

    {/* ── Next step ────────────────────────────────────── */}
    <section className={`${wrap} pb-24`}>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <a href="/recruiter" className="group rounded-[1.5rem] bg-panel p-5 text-on-panel transition hover:opacity-95 md:rounded-[2rem] md:p-10">
          <p className="font-head text-[11px] uppercase tracking-[.16em] text-accent-invert">Hiring?</p>
          <p className="mt-2 font-display text-lg font-semibold tracking-[-.02em] md:mt-3 md:text-2xl">See my CV →</p>
        </a>
        <a href="/services" className="group rounded-[1.5rem] bg-primary p-5 text-on-primary transition hover:bg-primary-dim md:rounded-[2rem] md:p-10">
          <p className="font-head text-[11px] uppercase tracking-[.16em] text-on-primary/70">Need help?</p>
          <p className="mt-2 font-display text-lg font-semibold tracking-[-.02em] md:mt-3 md:text-2xl">See how I can help →</p>
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
  // Phones: a swipeable row (the next card peeks in). Larger screens: a grid.
  return <div className={`-mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 ${cols4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>{children}</div>
}

/** The one card style used for every project: picture, name, one line, link. */
function Card({ href, image, title, text, tag, small = false }: { href?: string; image?: string; title: string; text: string; tag?: string; small?: boolean }) {
  const external = href?.startsWith('http')
  return <Reveal className="h-full w-[80%] shrink-0 snap-start sm:w-auto">
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
