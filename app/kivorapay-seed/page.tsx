import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'KivoraPay Seed Round - Lady Prowess',
  description:
    'A founder-led investor interest page from Ngozi Peace Okafor for the KivoraPay seed round.',
}

const stats = [
  { value: '26M+', label: 'Nigerians holding crypto' },
  { value: '10+', label: 'Active bill categories' },
  { value: '$1K', label: 'Monthly recurring revenue' },
  { value: '$500B+', label: 'Africa bill payments market' },
]

const productPoints = [
  {
    title: 'Pay bills directly',
    body: 'Electricity, airtime, data, cable TV, flights, education fees, gift cards, and betting accounts payable with crypto.',
  },
  {
    title: 'Receive with links',
    body: 'Users get a permanent payment link and QR code to receive crypto, then spend the balance on real-world bills.',
  },
  {
    title: 'Invoice in crypto',
    body: 'Freelancers and businesses can create invoices with built-in crypto payment links and faster settlement.',
  },
  {
    title: 'Card layer next',
    body: 'Virtual card development is underway, with a physical card planned for crypto-funded everyday spending.',
  },
]

const timing = [
  'Crypto adoption in Africa has grown rapidly, with Nigeria consistently ranking high for stablecoin use.',
  'Banking restrictions and currency pressure keep pushing people toward alternative financial rails.',
  'No dominant platform owns the bridge between crypto holding and everyday bill payment.',
  'KivoraPay is already live, transacting, and serving real users paying real bills.',
]

const funds = [
  { percent: '40%', label: 'Product and engineering' },
  { percent: '30%', label: 'Growth and acquisition' },
  { percent: '20%', label: 'Operations and compliance' },
  { percent: '10%', label: 'Reserve' },
]

const videos = [
  {
    title: 'Crypto invoice flow',
    src: 'https://www.youtube-nocookie.com/embed/3jajJ3nSWHM?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3',
  },
  {
    title: 'Wallet top-up flow',
    src: 'https://www.youtube-nocookie.com/embed/oLnbfwoeNBU?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3',
  },
  {
    title: 'Bill payment flow',
    src: 'https://www.youtube-nocookie.com/embed/12gAqZI4-RQ?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3',
  },
]

export default function KivoraPaySeedPage() {
  return (
    <main className="min-h-screen bg-bg text-parchment">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-ink-border bg-bg/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
          <Link href="/" className="font-display text-[1.05rem] font-semibold italic text-parchment hover:text-primary">
            Lady Prowess
          </Link>
          <a
            href="#interest"
            className="inline-flex min-h-10 items-center justify-center bg-primary px-5 font-head text-[0.68rem] font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Email Ngozi
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(240,236,227,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(240,236,227,0.04) 1px, transparent 1px)',
            backgroundSize: '88px 88px',
          }}
        />
        <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-[1.08fr_0.72fr] lg:items-center">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-4 py-2 font-head text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Founder-led seed round
            </div>
            <h1
              className="font-display font-light leading-[0.98] text-parchment"
              style={{ fontSize: 'clamp(3.15rem, 7vw, 7rem)' }}
            >
              A personal invitation to invest in KivoraPay.
            </h1>
            <p className="mt-8 max-w-2xl text-[1.06rem] leading-[1.9] text-muted md:text-[1.18rem]">
              I am Ngozi Peace Okafor, known professionally as Lady Prowess. I am raising for KivoraPay,
              the spending layer for Crypto; a platform I founded to help Africans receive crypto, pay everyday
              bills, create invoices, and use stablecoins in real life.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#interest"
                className="inline-flex min-h-12 items-center justify-center bg-primary px-8 py-4 font-head text-[0.72rem] font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Express Interest
              </a>
              <a
                href="https://kivorapay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center border border-ink-border px-8 py-4 font-head text-[0.72rem] font-bold uppercase tracking-[0.14em] text-parchment transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                See Product
              </a>
            </div>
          </div>

          <aside className="border border-ink-border bg-surface p-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
              <Image
                src="/personal%20photo/headshot2.png"
                alt="Ngozi Peace Okafor, founder of KivoraPay"
                fill
                priority
                className="object-cover object-top grayscale-[10%]"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
            <div className="border-t border-ink-border pt-5">
              <p className="font-head text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary">
                Ngozi Peace Okafor
              </p>
              <p className="mt-2 text-[0.95rem] leading-[1.8] text-muted">
              Founder KivoraPay | Helping Africans spend crypto in real life | Visioner Prowess Digital Solutions and Dritchwear Collections.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-ink-border bg-surface px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-ink-border md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface p-6 text-center">
              <div className="font-head text-[2rem] font-extrabold leading-none text-parchment">{stat.value}</div>
              <div className="mt-3 font-head text-[0.58rem] font-bold uppercase tracking-[0.12em] text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
              The Opportunity
            </span>
            <h2 className="mt-5 font-display text-[2.8rem] font-light leading-[1.05] md:text-[4.8rem]">
              The infrastructure for spending crypto in Africa is still early.
            </h2>
            <p className="mt-6 text-[1rem] leading-[1.9] text-muted">
              The tools for receiving and storing crypto are strong. But when people need to use crypto for
              real bills, they still depend on slow P2P workarounds. KivoraPay closes that gap.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {productPoints.map((point, index) => (
              <article key={point.title} className="border border-ink-border bg-surface p-7">
                <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-head text-xl font-bold text-parchment">{point.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.85] text-muted">{point.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink-border bg-surface/45 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
              Product Recordings
            </span>
            <h2 className="mt-5 font-display text-[2.8rem] font-light leading-[1.05] md:text-[4.8rem]">
              See how KivoraPay works.
            </h2>
            <p className="mt-6 max-w-2xl text-[1rem] leading-[1.85] text-muted">
              Short product recordings showing core user flows: creating invoices, topping up a wallet,
              and paying bills with crypto.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {videos.map((video) => (
              <div key={video.title} className="flex h-full flex-col border border-ink-border bg-bg p-4">
                <div className="h-[520px] bg-surface-2 md:h-[560px]">
                  <iframe
                    className="h-full w-full"
                    src={video.src}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="mt-4 font-head text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted">
                  {video.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
              Why Now
            </span>
            <h2 className="mt-5 font-display text-[2.8rem] font-light leading-[1.05] md:text-[4.8rem]">
              The timing is practical, not theoretical.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px bg-ink-border md:grid-cols-2">
            {timing.map((item, index) => (
              <div key={item} className="bg-surface p-7">
                <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 text-[0.98rem] leading-[1.85] text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl border border-ink-border bg-surface p-8 text-center md:p-14">
          <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
            The Raise
          </span>
          <div className="mt-7 font-display text-[4.5rem] font-light leading-none md:text-[7rem]">
            $500K
          </div>
          <p className="mt-4 font-head text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted">
            Seed round / 18 month runway
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-px bg-ink-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Seed', 'Round stage'],
              ['$2.5M', 'Valuation cap'],
              ['Delaware', 'US C-Corp'],
              ['18 months', 'Runway'],
            ].map(([value, label]) => (
              <div key={label} className="bg-surface-2 p-5">
                <div className="font-head text-xl font-bold text-parchment">{value}</div>
                <div className="mt-2 font-head text-[0.58rem] font-bold uppercase tracking-[0.14em] text-muted">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {funds.map((fund) => (
              <div key={fund.label} className="border border-ink-border bg-bg p-5 text-left">
                <div className="font-head text-2xl font-extrabold text-primary">{fund.percent}</div>
                <div className="mt-2 text-[0.86rem] leading-[1.55] text-muted">{fund.label}</div>
              </div>
            ))}
          </div>

          <a
            href="#interest"
            className="mt-10 inline-flex min-h-12 items-center justify-center bg-primary px-8 py-4 font-head text-[0.72rem] font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            I Want to Invest
          </a>
        </div>
      </section>

      <section id="interest" className="border-t border-ink-border px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[3rem] font-light leading-[1.05] md:text-[5.5rem]">
            Interested in the round?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1rem] leading-[1.85] text-muted">
            Send me a direct message and I will respond with more details, including the full investor deck.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:hello@ladyprowess.com?subject=KivoraPay%20Seed%20Round%20Interest"
              className="inline-flex min-h-12 items-center justify-center border border-ink-border bg-surface px-7 py-4 font-head text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary/50"
            >
              hello@ladyprowess.com
            </a>
            <a
              href="https://x.com/ladyprowess"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center border border-ink-border bg-surface px-7 py-4 font-head text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary/50"
            >
              @ladyprowess
            </a>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-[0.78rem] leading-[1.7] text-muted/75">
            This page is for investor interest and information sharing only. It is not investment advice or a public offer of securities.
          </p>
        </div>
      </section>

      <footer className="border-t border-ink-border px-6 py-8 text-center text-[0.82rem] text-muted">
        © 2026 Ngozi Peace Okafor / KivoraPay /{' '}
        <a href="https://kivorapay.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          kivorapay.com
        </a>
      </footer>
    </main>
  )
}
