'use client'

import { motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { SOURCES, type Lead, type LeadStatus } from '@/lib/outreach'
import Icon from './Icon'

// Small pieces shared by the Email workspace.

export const RANK: Record<LeadStatus, number> = { new: 0, sent: 1, opened: 2, clicked: 3, replied: 4, bounced: -1, stopped: -1 }

/** Progress is shades of the brand blue; only replied (good) and bounced (bad) step outside it. */
export const statusStyle: Record<LeadStatus, string> = {
  new: 'bg-surface-2 text-muted',
  sent: 'bg-primary/10 text-primary',
  opened: 'bg-primary/20 text-primary',
  clicked: 'bg-primary text-on-primary',
  replied: 'bg-success/15 text-success',
  bounced: 'bg-[#EF4444]/10 text-[#DC2626] dark:text-[#F87171]',
  stopped: 'bg-surface-2 text-muted',
}
export const statusLabel: Record<LeadStatus, string> = { new: 'Not contacted', sent: 'Sent', opened: 'Opened', clicked: 'Clicked', replied: 'Replied', bounced: 'Bounced', stopped: 'Stopped' }
export const sourceLabel = (k?: string | null) => SOURCES.find(s => s.key === k)?.label || 'Other'

export const fullName = (l: Pick<Lead, 'first_name' | 'last_name' | 'email'>) => [l.first_name, l.last_name].filter(Boolean).join(' ') || l.email
export const initials = (l: Pick<Lead, 'first_name' | 'last_name' | 'email'>) => `${(l.first_name?.[0] || l.email[0] || '?').toUpperCase()}${l.last_name?.[0]?.toUpperCase() || ''}`

export function ago(iso: string | null | undefined) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.round(Math.abs(diff) / 60000)
  const t = m < 60 ? `${Math.max(1, m)}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`
  return diff < 0 ? `in ${t}` : `${t} ago`
}
export const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
/** "datetime-local" value for a Date, in the browser's own time zone. */
export const localInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

export const field = 'w-full rounded-xl border border-ink-border bg-bg px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10'

export function Avatar({ lead, size = 'md' }: { lead: Pick<Lead, 'first_name' | 'last_name' | 'email'>; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? 'h-14 w-14 text-base' : size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-10 w-10 text-xs'
  return <span className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary ${s}`}>{initials(lead)}</span>
}

export function StatusPill({ status }: { status: LeadStatus }) {
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[status]}`}>{statusLabel[status]}</span>
}

/** Sent → Opened → Clicked → Replied, as dots. */
export function Progress({ status }: { status: LeadStatus }) {
  const steps: LeadStatus[] = ['sent', 'opened', 'clicked', 'replied']
  return <span className="flex items-center gap-1" aria-label={`Progress: ${statusLabel[status]}`}>
    {steps.map((s, i) => <span key={s} className="flex items-center gap-1">
      {i > 0 && <span className={`h-px w-3 ${RANK[status] >= RANK[s] ? 'bg-primary' : 'bg-ink-border'}`} />}
      <span title={statusLabel[s]} className={`h-2 w-2 rounded-full ${RANK[status] >= RANK[s] ? (s === 'replied' ? 'bg-success' : 'bg-primary') : 'bg-ink-border'}`} />
    </span>)}
  </span>
}

/** A panel that slides in from the right (full screen on phones), framed like the site's editor windows. */
export function SidePanel({ title, onClose, children, footer, wide = false }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  return <motion.div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.aside role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex h-full w-full flex-col border-l border-ink-border bg-surface shadow-[-30px_0_80px_-40px_rgba(17,24,39,.5)] ${wide ? 'max-w-5xl' : 'max-w-xl'}`}>
      <div className="flex items-center gap-3 border-b border-ink-border px-5 py-3.5">
        <span className="flex gap-1.5" aria-hidden="true">{['#F87171', '#FBBF24', '#34D399'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
        <div className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</div>
        <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-parchment"><Icon name="x" /></button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
      {footer && <div className="border-t border-ink-border bg-surface px-5 py-4">{footer}</div>}
    </motion.aside>
  </motion.div>
}

export const PAGE_SIZE = 25

/** "1–25 of 140" with previous / next and page numbers. Hidden when one page is enough. */
export function Pager({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / PAGE_SIZE)
  if (pages <= 1) return null
  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(total, page * PAGE_SIZE)
  // Show first, last, and the pages around the current one.
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(n => n === 1 || n === pages || Math.abs(n - page) <= 1)
  return <nav aria-label="Pages" className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
    <span className="text-xs text-muted">{from}–{to} of {total}</span>
    <span className="flex items-center gap-1">
      <button onClick={() => onPage(page - 1)} disabled={page === 1} className="rounded-full border border-ink-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40">← Prev</button>
      {nums.map((n, i) => <span key={n} className="flex items-center gap-1">
        {i > 0 && n - nums[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
        <button onClick={() => onPage(n)} aria-current={n === page ? 'page' : undefined} className={`h-8 min-w-8 rounded-full px-2 text-xs font-semibold ${n === page ? 'bg-primary text-on-primary' : 'hover:bg-surface-2'}`}>{n}</button>
      </span>)}
      <button onClick={() => onPage(page + 1)} disabled={page === pages} className="rounded-full border border-ink-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40">Next →</button>
    </span>
  </nav>
}

/** Shows a status message; a leading "✓" (used to mark success) is drawn as an SVG check. */
export function CheckText({ text }: { text: string }) {
  const ok = text.startsWith('✓')
  return <span className="inline-flex items-center gap-1.5">{ok && <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />}{ok ? text.slice(1).trim() : text}</span>
}
