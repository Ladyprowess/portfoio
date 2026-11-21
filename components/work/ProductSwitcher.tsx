'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

type Product = { id: string; name: string; status?: string; kind: string; summary: string; image?: string; href?: string }

// Phones: tabs for each product; picking one swaps its screenshot and words in.
export default function ProductSwitcher({ products }: { products: Product[] }) {
  const [active, setActive] = useState(products[0]?.id)
  const p = products.find(x => x.id === active) ?? products[0]
  return <div>
    <div role="tablist" aria-label="Products" className="inline-flex rounded-full border border-ink-border bg-surface p-1">
      {products.map(x => <button key={x.id} role="tab" type="button" aria-selected={x.id === p.id} onClick={() => setActive(x.id)}
        className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${x.id === p.id ? 'text-on-primary' : 'text-muted'}`}>
        {x.id === p.id && <motion.span layoutId="product-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
        <span className="relative">{x.name}</span>
      </button>)}
    </div>
    <AnimatePresence mode="wait">
      <motion.a key={p.id} href={p.href} target="_blank" rel="noopener noreferrer" role="tabpanel"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-5 block">
        <span className="relative block aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-ink-border bg-surface-2 shadow-[0_30px_70px_-40px_rgba(17,24,39,.45)]">
          {p.image && <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="100vw" className="object-cover object-top" />}
        </span>
        {p.status && <span className={`mt-4 block text-xs font-semibold ${p.status === 'Live' ? 'text-success' : 'text-muted'}`}>● {p.status}</span>}
        <span className="mt-1 block text-sm text-muted">{p.kind}</span>
        <span className="mt-2 block text-[15px] leading-7">{p.summary}</span>
        <span className="mt-3 inline-block text-sm font-semibold text-primary">Visit ↗</span>
      </motion.a>
    </AnimatePresence>
  </div>
}
