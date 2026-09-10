import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Support My Ventures | Lady Prowess',
  description: 'Learn about the ventures founded by Ngozi Peace Okafor and explore ways to support their growth.',
}

const ventures = [
  {
    name: 'KivoraPay',
    label: 'Currently seeking support',
    image: '/brands/kivorapay.png',
    website: 'https://kivorapay.com',
    summary: 'A crypto payment platform that helps Africans use digital assets for everyday needs.',
    problem: 'People can receive and hold crypto, but using it for ordinary bills often requires extra steps, changing rates, and third party traders.',
    idea: 'KivoraPay connects crypto to real life. Users can pay bills, receive payments, create invoices, and manage merchant sales from one platform.',
    support: 'Funding will support product development, compliance, operations, merchant tools, and responsible customer growth.',
    supportUrl: 'mailto:hello@ladyprowess.com?subject=I%20want%20to%20support%20KivoraPay',
  },
  {
    name: 'Prowess Digital Solutions',
    label: 'Business education and digital tools',
    image: '/brands/pds.png',
    website: 'https://www.prowessdigitalsolutions.com',
    summary: 'A digital solutions business helping entrepreneurs build with more clarity and structure.',
    problem: 'Many small businesses have useful ideas but lack affordable guidance, systems, websites, and practical tools for execution.',
    idea: 'Prowess Digital Solutions brings education, business tools, websites, content, and digital support into one accessible platform.',
    support: 'Support can expand the learning library, improve business tools, sponsor training, and help more entrepreneurs access practical resources.',
    supportUrl: 'mailto:hello@ladyprowess.com?subject=I%20want%20to%20support%20Prowess%20Digital%20Solutions',
  },
  {
    name: 'Dritchwear',
    label: 'Streetwear and custom merchandise',
    image: '/brands/dritchwear.png',
    website: 'https://app.dritchwear.com/shop',
    summary: 'A Nigerian streetwear and merchandise business serving individuals, teams, companies, and events.',
    problem: 'Finding dependable, well made clothing and branded merchandise can be difficult for people, teams, and growing companies.',
    idea: 'Dritchwear combines everyday menswear with custom merchandise, corporate gifts, event kits, and a digital ordering experience.',
    support: 'Support can strengthen production, improve fulfilment, expand the product range, and help the business serve larger orders.',
    supportUrl: 'mailto:hello@ladyprowess.com?subject=I%20want%20to%20support%20Dritchwear',
  },
]

const supportTypes = [
  ['Fund', 'Provide investment, a grant, sponsorship, or a direct contribution to a venture.'],
  ['Partner', 'Open access to organisations, communities, distribution, or useful business relationships.'],
  ['Advise', 'Share relevant expertise in product, compliance, growth, operations, or manufacturing.'],
  ['Share', 'Introduce the work to people who may benefit from it or want to support its growth.'],
]

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-bg text-parchment">
      <Nav />

      <section className="relative overflow-hidden border-b border-ink-border bg-white px-6 pb-20 pt-36 sm:px-8 md:px-20 md:pb-24 md:pt-44">
        <div aria-hidden className="absolute right-[-8rem] top-12 h-[30rem] w-[30rem] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <span className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">Venture support</span>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.3rem,4.3vw,3.8rem)] font-extrabold leading-[1.06]">I am building practical businesses around real problems.</h1>
            <p className="mt-6 max-w-2xl text-[1rem] leading-[1.85] text-muted md:text-[1.08rem]">This page brings my main ventures together. You can understand what each business does, why I built it, and where support can help it grow.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#ventures" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white hover:bg-primary-dim">Explore the ventures</a><a href="mailto:hello@ladyprowess.com?subject=Venture%20support" className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink-border bg-white px-7 py-3.5 text-sm font-bold hover:border-primary/40">Discuss support</a></div>
          </div>
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-3xl bg-blue-100" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-border bg-white p-3 shadow-[0_24px_70px_rgba(18,18,18,0.1)]"><div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-surface-2"><Image src="/personal%20photo/headshot2.png" alt="Ngozi Peace Okafor" fill priority className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 500px" /></div><div className="p-4"><p className="font-display text-base font-extrabold">Ngozi Peace Okafor</p><p className="mt-1 text-sm text-muted">Founder of Prowess Digital Solutions, KivoraPay, and Dritchwear</p></div></div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink-border px-6 py-20 sm:px-8 md:px-20 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div><span className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">About the founder</span><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">I know the work because I am doing the work.</h2></div>
          <div className="space-y-5 text-[0.96rem] leading-[1.9] text-muted"><p>I am a product marketer, WordPress designer, technical writer, copywriter, business educator, and founder. My work has helped technology companies explain complex products, reach their audiences, and create better digital experiences.</p><p>Building my own ventures moved me beyond advice. I have worked through product decisions, customer feedback, operations, marketing, and the pressure of turning an idea into something people can actually use.</p><a href="/about" className="inline-flex items-center font-semibold text-primary hover:text-primary-dim">Read my full story →</a></div>
        </div>
      </section>

      <section id="ventures" className="bg-white px-6 py-20 sm:px-8 md:px-20 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12 max-w-2xl"><span className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">The ventures</span><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">Three businesses. Three clear needs.</h2><p className="mt-4 text-[0.94rem] leading-7 text-muted">Each venture has its own purpose, audience, and path to growth.</p></div>
          <div className="space-y-6">{ventures.map((venture, index) => <article key={venture.name} className="overflow-hidden rounded-3xl border border-ink-border bg-bg"><div className="grid lg:grid-cols-[0.42fr_0.58fr]"><div className="flex min-h-[280px] items-center justify-center bg-white p-10"><div className="relative h-28 w-full max-w-[260px]"><Image src={venture.image} alt={venture.name} fill className="object-contain" sizes="260px" /></div></div><div className="p-7 md:p-10"><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary">{String(index + 1).padStart(2, '0')} / {venture.label}</span><a href={venture.website} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-muted hover:text-primary">Visit website ↗</a></div><h3 className="mt-5 font-display text-2xl font-extrabold md:text-3xl">{venture.name}</h3><p className="mt-3 text-[0.96rem] leading-7 text-muted">{venture.summary}</p><div className="mt-7 grid gap-5 border-t border-ink-border pt-6 md:grid-cols-3"><div><p className="text-xs font-bold text-parchment">The problem</p><p className="mt-2 text-[0.78rem] leading-6 text-muted">{venture.problem}</p></div><div><p className="text-xs font-bold text-parchment">The idea</p><p className="mt-2 text-[0.78rem] leading-6 text-muted">{venture.idea}</p></div><div><p className="text-xs font-bold text-parchment">Where support helps</p><p className="mt-2 text-[0.78rem] leading-6 text-muted">{venture.support}</p></div></div><a href={venture.supportUrl} className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dim">Support {venture.name}</a></div></div></article>)}</div>
        </div>
      </section>

      <section className="border-y border-ink-border bg-bg px-6 py-20 sm:px-8 md:px-20 md:py-24"><div className="mx-auto max-w-[1180px]"><div className="grid gap-5 md:grid-cols-[0.75fr_1.25fr]"><div><span className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">Ways to help</span><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">Support is more than money.</h2></div><div className="grid gap-3 sm:grid-cols-2">{supportTypes.map(([title, copy]) => <div key={title} className="rounded-2xl border border-ink-border bg-white p-5"><h3 className="font-display font-extrabold">{title}</h3><p className="mt-2 text-[0.82rem] leading-6 text-muted">{copy}</p></div>)}</div></div></div></section>

      <section className="bg-primary px-6 py-20 text-center text-white sm:px-8 md:px-20"><div className="mx-auto max-w-2xl"><span className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-blue-100">Start a conversation</span><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">Interested in supporting one of these ventures?</h2><p className="mx-auto mt-5 max-w-xl text-[0.94rem] leading-7 text-blue-100">Tell me which business you are interested in and the kind of support you have in mind.</p><a href="mailto:hello@ladyprowess.com?subject=Venture%20support" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary">Email hello@ladyprowess.com</a><p className="mt-6 text-xs leading-5 text-blue-100">Information on this page is shared for general interest. It is not investment advice or a public offer.</p></div></section>

      <Footer />
    </main>
  )
}
