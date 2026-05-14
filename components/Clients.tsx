'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const clients = [
  { name: 'CustomersChain',            industry: 'Web3',          href: 'https://customerschain.com/' },
  { name: 'CoinTime ATM',              industry: 'Crypto',         href: 'https://cointimeatm.com/' },
  { name: 'Point22',                   industry: 'Fintech',        href: 'https://pt22.io/' },
  { name: 'txFusion',                  industry: 'Web3',           href: 'https://www.txfusion.io/' },
  { name: 'Kivora Pay',                industry: 'DeFi / Africa',  href: 'https://kivorapay.com/' },
  { name: 'Prowess Digital Solutions', industry: 'Consulting',     href: 'https://www.prowessdigitalsolutions.com' },
  { name: 'Dritchwear Collections',    industry: 'Fashion / Tech', href: 'https://dritchwear.com' },
  { name: 'CWallet',                   industry: 'Crypto',         href: '#' },
  { name: 'Bullring Finance',          industry: 'DeFi',           href: 'https://blog.bullring.finance/en/author/ngozipeaceokafor/' },
]

export default function Clients() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' })

  return (
    <section id="clients" className="px-8 md:px-20 py-36 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Clients and Brands
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Brands I have
              <br />
              <em className="italic gradient-text">worked with</em>
            </h2>
          </div>
          <p className="text-[0.95rem] text-muted max-w-xs leading-[1.8] mb-1">
            Across Web3, fintech, consulting, and fashion - each brand treated with full attention.
          </p>
        </motion.div>

        {/* Logo wall */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 border-l border-t border-ink-border"
        >
          {clients.map((client, i) => (
            <motion.a
              key={client.name}
              href={client.href}
              target={client.href === '#' ? undefined : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col items-center justify-center gap-2 p-10 border-r border-b border-ink-border bg-surface overflow-hidden transition-colors duration-300 hover:bg-surface-2"
            >
              {/* Hover top-edge gradient line */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #2fd6c5, #a78bfa)' }}
              />

              {/* Ambient glow on hover */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(47,214,197,0.06), transparent 70%)',
                }}
              />

              <span className="relative z-10 font-head font-bold text-center text-muted group-hover:text-parchment transition-colors duration-250 leading-snug"
                style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}
              >
                {client.name}
              </span>
              <span className="relative z-10 font-head text-[0.58rem] font-bold tracking-[0.14em] uppercase text-muted/40 group-hover:text-primary/70 transition-colors duration-250">
                {client.industry}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
