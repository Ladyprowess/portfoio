'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#about',        label: 'About' },
  { href: '#services',     label: 'Services' },
  { href: '#work',         label: 'Work' },
  { href: '#writing',      label: 'Writing' },
  { href: '/blog',         label: 'Blog' },
  { href: '#contact',      label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-20 py-5 transition-colors duration-300 ${
          scrolled ? 'bg-bg/92 backdrop-blur-2xl border-b border-ink-border' : 'bg-transparent'
        }`}
      >
        <a
          href="#hero"
          className="font-display font-semibold italic text-parchment tracking-wide text-[1.1rem] hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Lady Prowess
        </a>

        {/* Desktop */}
        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-head text-[0.67rem] font-bold tracking-[0.14em] uppercase text-muted hover:text-parchment focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://drive.google.com/file/d/1qWDoVGKY3sps03fPbmNgCeR0FpPj7A0c/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="font-head text-[0.67rem] font-bold tracking-[0.14em] uppercase text-muted border border-ink-border px-4 py-2 hover:border-primary/40 hover:text-parchment focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
            >
              CV ↗
            </a>
          </li>
          <li>
            <a
              href="mailto:hello@ladyprowess.com"
              className="font-head text-[0.67rem] font-bold tracking-[0.14em] uppercase text-bg bg-primary px-5 py-2.5 hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-200"
            >
              Hire Me
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="lg:hidden relative z-50 flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] p-2 -mr-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
            className="fixed inset-0 z-40 bg-bg/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-3 lg:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setMenuOpen(false)}
                className="font-display font-light text-5xl italic text-parchment hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors py-1"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="mailto:hello@ladyprowess.com"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              onClick={() => setMenuOpen(false)}
              className="mt-6 font-head text-[0.7rem] font-bold tracking-[0.14em] uppercase text-bg bg-primary px-8 py-4"
            >
              Hire Me
            </motion.a>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52 }}
              className="absolute bottom-10 font-head text-[0.6rem] tracking-[0.14em] uppercase text-muted"
            >
              Remote Engagements
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
