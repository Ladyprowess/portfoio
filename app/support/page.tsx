import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { ventures } from '@/lib/ventures'

export const metadata: Metadata = {
  title: 'Venture Support | Lady Prowess',
  description: 'Explore the businesses founded by Ngozi Peace Okafor and learn how to support their growth.',
}

const waysToSupport = [
  { number: '01', title: 'Fund', copy: 'Invest in a current raise, provide a grant, sponsor a programme, or contribute directly to a defined business need.' },
  { number: '02', title: 'Partner', copy: 'Build a product, education, distribution, production, or community partnership with one of the ventures.' },
  { number: '03', title: 'Open a door', copy: 'Introduce the business to customers, merchants, organisations, investors, or people with relevant expertise.' },
  { number: '04', title: 'Book a consultation', copy: 'Ask detailed questions and understand the founder, product, opportunity, and current priorities before deciding.' },
]

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-bg text-parchment">
      <Nav />

      <section className="relative overflow-hidden border-b border-ink-border bg-white px-6 pb-20 pt-36 sm:px-8 md:px-20 md:pb-28 md:pt-44">
        <div aria-hidden className="absolute left-[-12rem] top-[-6rem] h-[34rem] w-[34rem] rounded-full bg-blue-100/60 blur-3xl" />
        <div aria-hidden className="absolute bottom-[-12rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-slate-100 blur-3xl" />
        <div className="relative mx-auto max-w-[1280px]">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div><p className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">Founder venture hub</p><h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,4.5vw,4rem)] font-extrabold leading-[1.05]">Meet the businesses I am building and the problems behind them.</h1><p className="mt-6 max-w-2xl text-[1rem] leading-[1.85] text-muted md:text-[1.08rem]">I built each venture from a problem I understood directly. This hub gives you the short version first, then lets you open a detailed page for the full story, product, progress, business model, and support need.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#ventures" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white hover:bg-primary-dim">Explore the businesses</a><a href="mailto:hello@ladyprowess.com?subject=Book%20a%20venture%20consultation" className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink-border bg-white px-7 py-3.5 text-sm font-bold hover:border-primary/40">Book a consultation</a></div></div>
            <div className="relative"><div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-3xl bg-blue-100" aria-hidden /><div className="relative rounded-[2rem] border border-ink-border bg-bg p-4 shadow-[0_28px_80px_rgba(18,18,18,0.1)]"><div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-surface-2"><Image src="/personal%20photo/headshot2.png" alt="Ngozi Peace Okafor" fill priority className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 520px" /></div><div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-ink-border mt-4">{ventures.map(venture => <div key={venture.name} className="flex min-h-20 items-center justify-center bg-white p-3"><div className="relative h-10 w-full"><Image src={venture.logo} alt={venture.name} fill className="object-contain" sizes="120px" /></div></div>)}</div></div></div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink-border px-6 py-20 sm:px-8 md:px-20 md:py-24"><div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20"><div><p className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">The founder</p><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">My work connects content, products, education, and business.</h2></div><div className="space-y-5 text-[0.98rem] leading-[1.9] text-muted"><p>I am Ngozi Peace Okafor, also known as Lady Prowess. I am a product marketer, WordPress designer, technical writer, copywriter, business educator, and founder.</p><p>Working with technology companies taught me how to explain products and build trust. Building my own businesses taught me what happens after the idea: customer research, product decisions, operations, growth, and the responsibility of making something useful.</p><p>These ventures are different, but they share one principle. Each one is designed to remove a practical problem and make the next step easier for the customer.</p><Link href="/about" className="inline-flex font-semibold text-primary hover:text-primary-dim">Read my full story →</Link></div></div></section>

      <section id="ventures" className="border-b border-ink-border bg-white px-6 py-20 sm:px-8 md:px-20 md:py-28"><div className="mx-auto max-w-[1180px]"><div className="mb-12 max-w-2xl"><p className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">The businesses</p><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">Choose a venture to understand it fully.</h2><p className="mt-4 text-[0.94rem] leading-7 text-muted">Every business has a dedicated page. You can see more than a summary before you contact me.</p></div><div className="grid gap-5 lg:grid-cols-3">{ventures.map((venture, index) => <article key={venture.slug} className="group flex flex-col overflow-hidden rounded-3xl border border-ink-border bg-bg transition duration-300 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(18,18,18,0.08)]"><div className="flex min-h-52 items-center justify-center bg-white p-9"><div className="relative h-24 w-full max-w-[230px]"><Image src={venture.logo} alt={venture.name} fill className="object-contain transition duration-300 group-hover:scale-105" sizes="230px" /></div></div><div className="flex flex-1 flex-col border-t border-ink-border p-6"><p className="font-head text-[0.58rem] font-bold uppercase tracking-[0.15em] text-primary">{String(index + 1).padStart(2, '0')} / {venture.status}</p><h3 className="mt-4 font-display text-xl font-extrabold">{venture.name}</h3><p className="mt-3 flex-1 text-[0.86rem] leading-6 text-muted">{venture.summary}</p><div className="mt-6 flex flex-col gap-2"><Link href={`/support/${venture.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dim">Read the full business story</Link><a href={venture.website} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink-border bg-white px-5 py-3 text-sm font-bold hover:border-primary/40">Visit website ↗</a></div></div></article>)}</div></div></section>

      <section className="border-b border-ink-border px-6 py-20 sm:px-8 md:px-20 md:py-24"><div className="mx-auto max-w-[1180px]"><div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">Ways to support</p><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">There is more than one useful way to help.</h2></div><div className="grid gap-3 sm:grid-cols-2">{waysToSupport.map(item => <article key={item.title} className="rounded-2xl border border-ink-border bg-white p-6"><span className="font-head text-[0.6rem] font-bold text-primary">{item.number}</span><h3 className="mt-3 font-display text-lg font-extrabold">{item.title}</h3><p className="mt-2 text-[0.84rem] leading-6 text-muted">{item.copy}</p></article>)}</div></div></div></section>

      <section className="bg-parchment px-6 py-20 text-white sm:px-8 md:px-20 md:py-24"><div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-center"><div><p className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-blue-300">Have questions?</p><h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight md:text-4xl">Understand the business before you decide how to support it.</h2><p className="mt-5 max-w-2xl text-[0.94rem] leading-7 text-gray-300">Choose the venture you want to discuss. I can walk you through the product, progress, needs, and next stage.</p></div><div className="rounded-3xl border border-gray-700 bg-white/5 p-6"><p className="text-sm font-bold">Book a venture consultation</p><p className="mt-2 text-sm leading-6 text-gray-400">Send an email with the business name and the questions you want us to cover.</p><a href="mailto:hello@ladyprowess.com?subject=Book%20a%20venture%20consultation" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-dim">Send consultation request</a></div></div></section>

      <Footer />
    </main>
  )
}
