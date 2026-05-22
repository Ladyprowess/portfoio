'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const fulltime = [
  { name: 'CustomersChain',   href: 'https://customerschain.com/',                                        tag: 'Web3' },
  { name: 'CoinTime ATM',     href: 'https://cointimeatm.com/',                                           tag: 'Crypto' },
  { name: 'Point22',          href: 'https://pt22.io/',                                                   tag: 'Fintech' },
  { name: 'WriteTechHub',     href: 'https://writetechhub.org/author/ladyprowess/',                       tag: 'Tech Writing' },
  { name: 'txFusion',         href: 'https://www.txfusion.io/',                                           tag: 'Web3' },
  { name: 'Bullring Finance', href: 'https://blog.bullring.finance/en/author/ngozipeaceokafor/',           tag: 'DeFi' },
  { name: 'Giveaway.com',     href: 'https://giveaway.com/blog/author/okafor/',                           tag: 'Marketing' },
  { name: 'CCPayment',        href: 'https://ccpayment.com/blog/author/okafor/',                          tag: 'Crypto' },
]

const freelance = [
  { name: 'LBank',  href: 'https://www.lbank.com/creator/profile/ladyprowess', tag: 'Exchange' },
  { name: 'UEEX',   href: 'https://blog.ueex.com/author/ngozi',                tag: 'Exchange' },
  { name: 'UPay',   href: 'https://blog.upay.best/author/ngozi',               tag: 'Payments' },
]

const personal = [
  { name: 'Medium',    href: 'https://ladyprowess.medium.com/',      tag: 'Essays & Analysis' },
  { name: 'Substack',  href: 'https://ladyprowess.substack.com',      tag: 'Newsletter' },
  { name: 'Dev.to',    href: 'https://dev.to/ladyprowess',           tag: 'Technical' },
  { name: 'Hashnode',  href: 'https://ladyprowess.hashnode.dev/',    tag: 'Web3 & Tech' },
]

const columns = [
  { title: 'Fulltime',        accent: '#2fd6c5', items: fulltime  },
  { title: 'Freelance',       accent: '#a78bfa', items: freelance },
  { title: 'Personal Blogs',  accent: '#f5a623', items: personal  },
]

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Writing() {
  return (
    <section id="writing" className="px-8 md:px-20 py-36 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Writing Portfolio
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Words published
              <br />
              <em className="italic text-parchment/70">across the web</em>
            </h2>
          </div>
          <p className="text-[0.95rem] text-muted max-w-xs leading-[1.8] mb-1">
            Articles, guides, and long-form content written for leading Web3, crypto, and fintech brands.
          </p>
        </Reveal>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-border border border-ink-border">
          {columns.map((col, ci) => (
            <Reveal key={col.title} delay={ci * 0.1} className="bg-surface p-8 lg:p-10">
              {/* Column header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-ink-border">
                <span
                  className="w-1 h-6 rounded-full block"
                  style={{ background: col.accent }}
                />
                <span className="font-head text-[0.72rem] font-bold tracking-[0.14em] uppercase text-parchment">
                  {col.title}
                </span>
                <span className="ml-auto font-head text-[0.6rem] font-bold tracking-[0.1em] uppercase text-muted">
                  {col.items.length} {col.items.length === 1 ? 'brand' : 'brands'}
                </span>
              </div>

              {/* Items */}
              <ul className="flex flex-col gap-1">
                {col.items.map((item, ii) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: ci * 0.08 + ii * 0.05 }}
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3 px-3 -mx-3 rounded hover:bg-surface-2 transition-colors duration-200"
                    >
                      <span className="font-head font-bold text-[0.9rem] text-muted group-hover:text-parchment transition-colors duration-200">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span
                          className="font-head text-[0.55rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ color: col.accent, background: `${col.accent}15` }}
                        >
                          {item.tag}
                        </span>
                        <span
                          className="text-[0.7rem] opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5"
                          style={{ color: col.accent }}
                        >
                          ↗
                        </span>
                      </div>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
