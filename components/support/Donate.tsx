'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// PayPal and Payoneer both receive at this address.
const PAY_EMAIL = 'ladyprowess1@gmail.com'

const methods = [
  {
    key: 'crypto',
    name: 'Crypto',
    note: 'USDT, USDC or Bitcoin through KivoraPay',
    href: 'https://kivorapay.com/pay/7632295',
    cta: 'Pay with KivoraPay',
    color: '#1D4ED8',
    icon: <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11zM12 7v10M9 9.5h4.5a1.75 1.75 0 010 3.5H9m0 0h5a1.75 1.75 0 010 3.5H9" />,
  },
  {
    key: 'paypal',
    name: 'PayPal',
    note: PAY_EMAIL,
    // A standard payment to the email, not PayPal's donate flow: Donate is
    // blocked for accounts in some countries, Nigeria included.
    href: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(PAY_EMAIL)}&item_name=${encodeURIComponent('Support for Lady Prowess ventures')}&currency_code=USD&no_shipping=1`,
    cta: 'Pay with PayPal',
    color: '#003087',
    copy: PAY_EMAIL,
    hint: 'Or send to this email from the PayPal app.',
    icon: <path d="M7 21l1.5-9h4a5 5 0 000-10H6L3 21h4zm3-14h3a2 2 0 010 4h-3.6" />,
  },
  {
    key: 'payoneer',
    name: 'Payoneer',
    note: PAY_EMAIL,
    href: 'https://login.payoneer.com/',
    cta: 'Open Payoneer',
    copy: PAY_EMAIL,
    hint: 'Send a payment to this email from your Payoneer account.',
    color: '#FF4800',
    icon: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 100 10 5 5 0 000-10z" />,
  },
]

/** The trigger plus a small dialog listing every way to give. */
export default function Donate({ className, children }: { className: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {}
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>{children}</button>
      {mounted && createPortal(<AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="donate-title" onClick={e => e.stopPropagation()} initial={{ y: 40, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[460px] rounded-[1.8rem] border border-ink-border bg-surface p-6 text-left text-parchment shadow-2xl md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-head text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary">Support the work</p>
                  <h2 id="donate-title" className="mt-2 font-display text-2xl font-extrabold">Donate to our cause</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">Choose how you would like to give. Every contribution goes into building the ventures.</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted transition hover:text-parchment">✕</button>
              </div>
              <ul className="mt-6 space-y-3">
                {methods.map((m, n) => (
                  <motion.li key={m.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + n * 0.07 }} className="flex items-center gap-4 rounded-2xl border border-ink-border bg-bg p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: m.color }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{m.icon}</svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block text-[0.95rem]">{m.name}</b>
                      {m.copy ? (
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs leading-5 text-muted">
                          <span className="break-all font-semibold text-parchment">{m.note}</span>
                          <button type="button" onClick={() => copy(m.copy!)} className="font-bold text-primary hover:underline">{copied ? 'Copied' : 'Copy email'}</button>
                          <span className="w-full">{m.hint}</span>
                        </span>
                      ) : <span className="block text-xs leading-5 text-muted">{m.note}</span>}
                    </span>
                    <a href={m.href} target={m.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary transition hover:bg-primary-dim">{m.cta}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}
