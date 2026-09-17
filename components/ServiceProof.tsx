'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

type Proof = {
  title: string
  description: string
  image: string
  href?: string
  linkLabel: string
}

const lwCommercePages = [
  { title: 'Departments', links: [['All departments', 'https://lwcommerce.org/departments/'], ['Human Capital Development', 'https://lwcommerce.org/departments/?lwc=human-capital-development'], ['Finance & Treasury', 'https://lwcommerce.org/departments/?lwc=finance-treasury'], ['Media, Communications & Public Relations', 'https://lwcommerce.org/departments/?lwc=media-communications-public-relations'], ['Enterprise Growth & Development', 'https://lwcommerce.org/departments/?lwc=enterprise-growth-development'], ['E-Commerce & Digital Trade', 'https://lwcommerce.org/departments/?lwc=e-commerce-digital-trade'], ['Digital Infrastructure & Innovation', 'https://lwcommerce.org/departments/?lwc=digital-infrastructure-innovation'], ['Legal & Policy Regulations', 'https://lwcommerce.org/departments/?lwc=legal-policy-regulations'], ['Economic Research & Statistics', 'https://lwcommerce.org/departments/?lwc=economic-research-statistics'], ['Commerce Programs & Events', 'https://lwcommerce.org/departments/?lwc=commerce-programs-events'], ['Investments & Partnerships', 'https://lwcommerce.org/departments/?lwc=investments-partnerships']] },
  { title: 'Regulatory agencies', links: [['All regulatory agencies', 'https://lwcommerce.org/regulatory-agencies/'], ['Consumer Protection Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=consumer-protection-agency'], ['Finance Reporting Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=finance-reporting-agency'], ['Loveworld Enterprise Development Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=loveworld-enterprise-development-agency'], ['Loveworld Trade & Export Promotion Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=loveworld-trade-export-promotion-agency'], ['Investment Promotion Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=investment-promotion-agency']] },
  { title: 'Commercial corporations', links: [['All commercial corporations', 'https://lwcommerce.org/commercial-coporations/'], ['Loveworld Inspectorate Administration', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-inspectorate-administration'], ['Loveworld Business House', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-business-house'], ['Loveworld Standards Organisation', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-standards-organisation'], ['Loveworld Bank of Industry', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-bank-of-industry'], ['Loveworld Free Trade Zone', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-free-trade-zone']] },
  { title: 'Event pages', links: [['LoveWorld Trade & Investment Forum events', 'https://ltif.lwcommerce.org/events/'], ['LW Commerce events', 'https://lwcommerce.org/events/'], ['BEGIN events', 'https://begin.lwcommerce.org/events/']] },
]

const groups = [
  {
    key: 'websites',
    label: 'Websites',
    eyebrow: 'WordPress design',
    title: 'Websites built for real people.',
    introduction: 'I design responsive websites with clear navigation, useful content, and straightforward paths that help visitors take action.',
    items: [
      { title: 'Prowess Digital Solutions', description: 'A practical platform connecting people with learning, opportunities, tools, and business support.', image: '/service-proof/prowess-digital-solutions.png', href: 'https://www.prowessdigitalsolutions.com', linkLabel: 'Visit website' },
      { title: 'Testers Connect', description: 'A community website built to connect quality assurance professionals with resources, events, jobs, and mentorship.', image: '/service-proof/testers-connect.png', href: 'https://testersconnect.com', linkLabel: 'View project preview' },
      { title: 'Dritchwear', description: 'A merchandise commerce experience for custom apparel, corporate gifts, event kits, and branded products.', image: '/service-proof/dritchwear.png', href: 'https://dritchwear.com', linkLabel: 'Visit website' },
      { title: 'BEGIN', description: 'A digital home for the Business Expansion & Growth Initiative, connecting entrepreneurs to training, mentorship, investment access and strategic partnerships.', image: '/projects/lw-commerce-begin.jpg', href: 'https://begin.lwcommerce.org/', linkLabel: 'Visit website' },
      { title: 'BEGIN Admin', description: 'A secure entry point for the BEGIN administration console, designed to keep programme management focused and straightforward.', image: '/projects/lw-commerce-dashboard.png', href: 'https://begin.lwcommerce.org/admin-dashboard', linkLabel: 'Visit portal' },
      { title: 'LoveWorld Trade & Investment Forum', description: 'An event platform for bringing entrepreneurs, investors, policymakers and innovators together around trade and investment.', image: '/projects/ltif.jpg', href: 'https://ltif.lwcommerce.org/', linkLabel: 'Visit website' },
    ] as Proof[],
  },
  {
    key: 'writing',
    label: 'Writing',
    eyebrow: 'Copywriting and technical writing',
    title: 'Writing that makes complex products easier to understand.',
    introduction: 'My work includes copywriting, technical articles, product education, industry analysis, tutorials, and content written for search.',
    items: [
      { title: 'LBank', description: 'Crypto market education, industry coverage, and product focused articles.', image: '/service-proof/case-study-lbank.jpg', href: 'https://www.lbank.com/creator/profile/ladyprowess', linkLabel: 'Read my work' },
      { title: 'Bullring Finance', description: 'DeFi education, protocol explainers, and practical blockchain content.', image: '/service-proof/case-study-bullring.jpg', href: 'https://blog.bullring.finance/en/author/ngozipeaceokafor/', linkLabel: 'Read my work' },
      { title: 'UEEx', description: 'Crypto guides and market content written for a global exchange audience.', image: '/service-proof/case-study-ueex.jpg', href: 'https://blog.ueex.com/author/ngozi/', linkLabel: 'Read my work' },
      { title: 'UPay', description: 'Product education and payment content for people using digital assets.', image: '/service-proof/case-study-upay.jpg', href: 'https://blog.upay.best/author/ngozi/', linkLabel: 'Read my work' },
      { title: 'Giveaway.com', description: 'Campaign education and practical content for brands building engaged communities.', image: '/brands/giveaway_com.jpeg', href: 'https://giveaway.com/blog/author/okafor/', linkLabel: 'Read my work' },
      { title: 'CCPayment', description: 'Crypto payment guides, business education, and product led content.', image: '/service-proof/case-study-ccpayment.jpg', href: 'https://ccpayment.com/blog/author/okafor/', linkLabel: 'Read my work' },
      { title: 'DEV Community', description: 'Technical articles, tutorials, and practical lessons for builders.', image: '/service-proof/case-study-devto.jpg', href: 'https://dev.to/ladyprowess', linkLabel: 'Read my work' },
      { title: 'WriteTech Hub', description: 'Technical writing resources, career guidance, and educational content.', image: '/service-proof/case-study-writetechhub.jpg', href: 'https://writetechhub.org/author/ladyprowess/', linkLabel: 'Read my work' },
    ] as Proof[],
  },
  {
    key: 'education',
    label: 'Education',
    eyebrow: 'Education and learning',
    title: 'Practical learning for business, technology, and Web3.',
    introduction: 'I create workshops, video lessons, ebooks, guides, and learning resources that make unfamiliar topics easier to understand.',
    items: [
      { title: 'Video Learning Library', description: 'Practical video lessons covering Web3, business, career growth, and useful digital skills.', image: '/service-proof/video-library.png', href: 'https://www.prowessdigitalsolutions.com/videos', linkLabel: 'Watch the lessons' },
      { title: 'Learn Web3 with Lady Prowess', description: 'Lessons and practical explanations for people building confidence in Web3 and emerging technology.', image: '/service-proof/web3-training.jpg', href: 'https://ladyprowess.substack.com/', linkLabel: 'Explore the lessons' },
      { title: 'Ebook and Resource Library', description: 'A digital library where readers can discover and buy ebooks, guides, templates, checklists, and other useful resources.', image: '/service-proof/digital-library.png', href: 'https://www.prowessdigitalsolutions.com/resources', linkLabel: 'Visit the library' },
    ] as Proof[],
  },
]

export default function ServiceProof() {
  const [selected, setSelected] = useState(groups[0])

  return (
    <section id="service-proof" className="border-y border-ink-border bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Selected work</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.035em] md:text-4xl">What I do, shown through real projects.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted">Browse websites I designed, writing I publish for brands, and learning experiences I created.</p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto border-b border-ink-border pb-4" role="tablist" aria-label="Service proof categories">
          {groups.map(group => (
            <button
              key={group.key}
              role="tab"
              aria-selected={selected.key === group.key}
              onClick={() => setSelected(group)}
              className={`min-w-max rounded-full px-5 py-2.5 text-sm font-semibold transition ${selected.key === group.key ? 'bg-primary text-on-primary' : 'border border-ink-border bg-bg text-muted hover:border-primary/40 hover:text-parchment'}`}
            >
              {group.label} <span className="ml-1 opacity-65">{group.items.length}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selected.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }} className="pt-9">
            <div className="mb-8 grid gap-3 md:grid-cols-[.8fr_1.2fr] md:items-end">
              <div><p className="font-head text-[10px] uppercase tracking-[.14em] text-primary">{selected.eyebrow}</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.03em] md:text-3xl">{selected.title}</h3></div>
              <p className="max-w-xl text-sm leading-6 text-muted md:justify-self-end">{selected.introduction}</p>
            </div>

            <div className={`grid gap-5 ${selected.items.length === 1 ? 'md:grid-cols-[1.1fr_.9fr]' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {selected.items.map(item => {
                const content = <>
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-2"><Image src={item.image} alt={`Preview of ${item.title}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.025]" /></div>
                  <div className="p-5"><div className="flex items-start justify-between gap-4"><h4 className="font-display text-lg font-semibold">{item.title}</h4><span className="text-primary" aria-hidden="true">↗</span></div><p className="mt-2 text-sm leading-6 text-muted">{item.description}</p><p className="mt-5 text-sm font-semibold text-primary">{item.linkLabel}</p></div>
                </>

                return item.href ? <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-3xl border border-ink-border bg-bg transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_45px_rgba(17,24,39,.08)]">{content}</a> : <article key={item.title} className="group overflow-hidden rounded-3xl border border-ink-border bg-bg">{content}</article>
              })}
            </div>
            {selected.key === 'websites' && <div className="mt-10 border-t border-ink-border pt-10"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="font-head text-[10px] uppercase tracking-[.14em] text-primary">LW Commerce page directory</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.03em]">Every LW Commerce page I worked on.</h3></div><a href="https://lwcommerce.org/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Visit LW Commerce ↗</a></div><div className="mt-6 grid gap-4 md:grid-cols-2">{lwCommercePages.map(group => <details key={group.title} className="group rounded-2xl border border-ink-border bg-bg p-5 open:bg-surface"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold focus-visible:outline-none"><span>{group.title}</span><span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">+</span></summary><ul className="mt-4 space-y-2 border-t border-ink-border pt-4">{group.links.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex text-sm leading-6 text-muted underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{label}<span aria-hidden="true" className="ml-1">↗</span></a></li>)}</ul></details>)}</div></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
