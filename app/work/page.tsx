import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const ventures = [
  {
    title: 'Kivora Pay',
    category: 'Fintech / Web3 Product',
    logo: '/brands/kivorapay.png',
    href: 'https://kivorapay.com/',
    summary:
      'A crypto bill payment platform for Africa, built to make everyday payments possible with digital assets.',
    role: 'Founder, product storyteller, launch strategist',
    scope: ['Product narrative', 'Wallet and payment flow communication', 'Launch content', 'Pitch materials'],
    result: 'Built the product story and go-to-market foundation from zero.',
  },
  {
    title: 'Prowess Digital Solutions',
    category: 'Business & Digital Solutions',
    logo: '/brands/pds.png',
    href: 'https://www.prowessdigitalsolutions.com',
    summary:
      'A consulting and training brand helping businesses use content, automation, and digital systems with more confidence.',
    role: 'Founder, trainer, systems builder',
    scope: ['Service architecture', 'Training materials', 'Website direction', 'Digital operations'],
    result: 'Trained 200+ businesses and individuals across digital skills and business execution.',
  },
  {
    title: 'Dritchwear',
    category: 'Commerce / Branded Merchandise',
    logo: '/brands/dritchwear.png',
    href: 'https://app.dritchwear.com/shop',
    summary:
      'A streetwear and branded merchandise label with a live ordering platform for customers, companies, and events.',
    role: 'Founder, brand operator, commerce builder',
    scope: ['Brand identity', 'Customer ordering experience', 'Bulk merch workflows', 'Sales content'],
    result: 'Built a commerce brand from identity to ordering flow.',
  },
]

const writingSamples = [
  {
    title: 'Prospult',
    type: 'B2B Product Case Study',
    href: 'https://docs.google.com/document/d/1sV_J_iikUSUtBztg6H3dezYifhoyEXZaX8YDkxAPTPg/edit?usp=sharing',
  },
  {
    title: 'UEEX',
    type: 'Crypto Exchange Education',
    href: 'https://docs.google.com/document/d/1LwssJU3c6CfrqO2fW8Tvr1nm6OAYNLttNYa1Dgxnowc/edit?usp=sharing',
  },
  {
    title: 'UPay',
    type: 'Multi-Currency Payment Writing',
    href: 'https://docs.google.com/document/d/1HNnhHOL3BQYMgUe4RW-73Bm8Nfq7IOME2Ca7eWJ3WVU/edit?usp=sharing',
  },
  {
    title: 'Giftvant',
    type: 'Digital Gifting Story',
    href: 'https://docs.google.com/document/d/1L-47UUPHsd0reieSVOV2cex3_PV1Qh-XxuilbkIiwpA/edit?usp=sharing',
  },
]

export const metadata: Metadata = {
  title: 'Work - Lady Prowess',
  description:
    'Selected founder-led ventures, product work, technical writing, and case studies by Ngozi Peace Okafor.',
}

export default function WorkPage() {
  return (
    <main>
      <Nav />
      <section className="relative overflow-hidden border-b border-ink-border bg-bg px-6 pb-20 pt-36 sm:px-8 md:px-20 md:pb-24 md:pt-40">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(20,32,31,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,32,31,0.045) 1px, transparent 1px)',
            backgroundSize: '96px 96px',
          }}
        />
        <div className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 lg:grid-cols-[0.95fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-5 font-head text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
              Selected Work
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[0.98] text-parchment sm:text-6xl lg:text-7xl">
              Founder-led ventures, product stories, and technical clarity.
            </h1>
          </div>
          <div className="border-l border-ink-border pl-6">
            <p className="max-w-xl text-base leading-[1.85] text-muted md:text-lg">
              This page brings the portfolio into one place: the businesses I founded, the systems I
              helped shape, and the writing samples that show how I translate complex ideas into
              usable narratives.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-20 sm:px-8 md:px-20 md:py-24">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 font-head text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Ventures
              </p>
              <h2 className="font-display text-4xl font-extrabold leading-tight text-parchment md:text-5xl">
                Built, shaped, and launched.
              </h2>
            </div>
            <p className="max-w-lg text-[0.96rem] leading-[1.8] text-muted">
              These are not passive portfolio entries. They represent ownership across product,
              message, operations, and market education.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {ventures.map((venture, index) => (
              <article
                key={venture.title}
                className="grid overflow-hidden border border-ink-border bg-bg lg:grid-cols-[0.54fr_1fr]"
              >
                <div className="relative flex min-h-[260px] items-center justify-center border-b border-ink-border bg-surface-2 p-10 lg:border-b-0 lg:border-r">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(80,123,128,0.16),transparent_58%)]"
                  />
                  <Image
                    src={venture.logo}
                    alt={`${venture.title} logo`}
                    width={300}
                    height={132}
                    className="relative z-10 max-h-28 w-auto max-w-[78%] object-contain"
                  />
                </div>

                <div className="p-7 md:p-10">
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="font-head text-[0.6rem] font-bold uppercase tracking-[0.12em] text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted/40" aria-hidden />
                    <span className="font-head text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted">
                      {venture.category}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl font-extrabold leading-tight text-parchment md:text-5xl">
                    {venture.title}
                  </h3>
                  <p className="mt-5 max-w-3xl text-[1rem] leading-[1.85] text-muted">{venture.summary}</p>

                  <div className="mt-8 grid grid-cols-1 gap-6 border-t border-ink-border pt-7 md:grid-cols-[0.72fr_1fr]">
                    <div>
                      <p className="font-head text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
                        Role
                      </p>
                      <p className="mt-2 font-display text-xl font-extrabold leading-tight text-parchment">
                        {venture.role}
                      </p>
                    </div>

                    <div>
                      <p className="font-head text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
                        Scope
                      </p>
                      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {venture.scope.map((item) => (
                          <li key={item} className="border border-ink-border bg-surface px-4 py-3 text-sm text-muted">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col gap-5 border-t border-ink-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl font-head text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-primary-dim">
                      {venture.result}
                    </p>
                    <a
                      href={venture.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center bg-primary px-5 py-3 font-display text-[0.86rem] font-bold text-white motion-safe:transition-colors motion-safe:duration-150 hover:bg-primary-dim focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      Visit Project
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-border bg-bg px-6 py-20 sm:px-8 md:px-20 md:py-24">
        <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="mb-4 font-head text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
              Writing Samples
            </p>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-parchment md:text-5xl">
              Case studies and technical communication.
            </h2>
            <p className="mt-5 max-w-lg text-[0.96rem] leading-[1.8] text-muted">
              Selected samples across B2B software, crypto, payments, gifting, and product education.
            </p>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-ink-border sm:grid-cols-2">
            {writingSamples.map((sample) => (
              <a
                key={sample.title}
                href={sample.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group min-h-40 border-b border-r border-ink-border bg-surface p-6 motion-safe:transition-colors motion-safe:duration-150 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <p className="font-head text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-primary">
                  {sample.type}
                </p>
                <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight text-parchment">
                  {sample.title}
                </h3>
                <p className="mt-5 font-head text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted group-hover:text-primary">
                  Read Sample -&gt;
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-16 sm:px-8 md:px-20">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-head text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/80">
              Work With Me
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Need a product story, technical content, or founder-level clarity?
            </h2>
          </div>
          <a
            href="mailto:hello@ladyprowess.com"
            className="inline-flex min-h-12 shrink-0 items-center justify-center bg-surface px-8 py-4 font-display text-[0.95rem] font-bold text-parchment motion-safe:transition-colors motion-safe:duration-150 hover:bg-bg focus-visible:ring-2 focus-visible:ring-parchment focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Let&apos;s Talk
          </a>
        </div>
      </section>
      <Footer />
    </main>
  )
}
