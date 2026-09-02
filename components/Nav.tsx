'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const links = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About' },
  { href: '/work',         label: 'Work' },
  { href: '/#services',    label: 'Services' },
  { href: 'https://www.prowessdigitalsolutions.com/resources', label: 'Resources' },
  { href: '/#contact',     label: 'Contact' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 md:px-20 py-5 bg-bg/[0.92] backdrop-blur-2xl border-b border-ink-border"
      >
        <a
          href="/"
          className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Image src="/Logo.png" alt="Lady Prowess" width={132} height={38} className="h-7 w-auto" priority />
        </a>

        {/* Desktop */}
        <ul className="hidden xl:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="font-head text-[0.67rem] font-bold tracking-[0.14em] uppercase text-muted hover:text-parchment focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden xl:block">
          <a
            href="mailto:hello@ladyprowess.com"
            className="inline-flex items-center gap-2 font-display text-[0.85rem] font-bold text-white bg-primary px-5 py-2.5 hover:bg-primary-dim focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
          >
            Let&apos;s Work Together →
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="xl:hidden relative z-50 flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] p-2 -mr-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px bg-parchment transition-transform duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-[5px]' : 'w-6'}`} />
          <span className={`block h-px bg-parchment transition-opacity duration-300 ${menuOpen ? 'w-0 opacity-0' : 'w-4'}`} />
          <span className={`block h-px bg-parchment transition-transform duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-[5px]' : 'w-5'}`} />
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-bg/[0.98] backdrop-blur-2xl xl:hidden overflow-y-auto px-8 pt-32 pb-28"
          >
            <div className="min-h-full flex flex-col items-center justify-center gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setMenuOpen(false)}
                  className="font-display font-extrabold text-[clamp(2.6rem,11vw,3.45rem)] leading-[1.05] text-parchment hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors py-1"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="mailto:hello@ladyprowess.com"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setMenuOpen(false)}
                className="mt-6 min-h-11 inline-flex items-center justify-center font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase text-white bg-primary px-8 py-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Let&apos;s Work Together
              </motion.a>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.52 }}
                className="mt-5 font-head text-[0.6rem] tracking-[0.14em] uppercase text-muted"
              >
                Remote Engagements
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
