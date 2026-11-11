'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { pages, type DocPage } from './content'

const groups = Array.from(new Set(pages.map(p => p.group)))

/** Sidebar label: the title without its "Quickstart:"-style prefix. */
const navLabel = (title: string) => { const t = title.replace(/^(Quickstart|User guide|Concepts|Tutorial): /, ''); return t[0].toUpperCase() + t.slice(1) }

/**
 * The technical writing view: a working documentation site. Pages are
 * addressed by hash (#/quickstart) so every page can be linked and shared.
 */
export default function DocsView() {
  const [id, setId] = useState('overview')
  const [lang, setLang] = useState('cURL')
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const page = pages.find(p => p.id === id) ?? pages[0]
  const index = pages.indexOf(page)

  useEffect(() => {
    const read = () => {
      const [pid, anchor] = window.location.hash.replace(/^#\/?/, '').split('/')
      if (!pages.some(p => p.id === pid)) return
      setId(pid)
      // The page swaps in with an animation, so wait for the section to exist before scrolling.
      if (anchor) {
        let tries = 0
        const find = () => { const el = document.getElementById(anchor); if (el) el.scrollIntoView({ behavior: 'smooth' }); else if (tries++ < 30) setTimeout(find, 60) }
        setTimeout(find, 60)
      }
    }
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])

  const go = useCallback((pid: string, anchor?: string) => {
    setMenu(false)
    setSearch(false)
    window.location.hash = `/${pid}${anchor ? `/${anchor}` : ''}`
    if (!anchor) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement).tagName)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setSearch(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main className="min-h-screen bg-bg text-parchment">
      <Nav />
      <div className="border-b border-ink-border bg-surface pt-[var(--nav-h)]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button type="button" onClick={() => setMenu(true)} className="flex h-10 items-center gap-2 rounded-lg border border-ink-border px-3 text-sm font-semibold lg:hidden" aria-label="Open documentation menu">☰ <span className="max-w-[40vw] truncate">{page.title}</span></button>
          <p className="hidden items-center gap-2 text-sm font-bold lg:flex"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-head text-xs text-on-primary">NP</span>Ngozi Peace Okafor <span className="font-normal text-muted">/ Documentation</span></p>
          <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[0.7rem] font-bold text-success sm:flex"><span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 animate-ping rounded-full bg-success" /><span className="h-1.5 w-1.5 rounded-full bg-success" /></span>Live</span>
          <button type="button" onClick={() => setSearch(true)} className="ml-auto flex h-10 w-full max-w-[280px] items-center gap-2 rounded-lg border border-ink-border bg-bg px-3 text-sm text-muted transition hover:border-primary/40">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            Search docs<kbd className="ml-auto hidden rounded border border-ink-border px-1.5 font-head text-[0.65rem] sm:inline">⌘K</kbd>
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[250px_minmax(0,1fr)_210px]">
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--nav-h)+1.5rem)] max-h-[calc(100vh-var(--nav-h)-3rem)] overflow-y-auto py-8 pr-2">
            <Sidebar active={page.id} go={go} />
          </div>
        </aside>

        <article className="min-w-0 py-10 md:py-14">
          <AnimatePresence mode="wait">
            <motion.div key={page.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="max-w-[760px]">
              <p className="text-xs font-semibold text-muted">{page.group} <span className="mx-1">›</span> <span className="text-parchment">{page.title}</span></p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">{page.title}</h1>
              <p className="mt-4 text-[1.08rem] leading-8 text-muted">{page.lead}</p>
              {page.id === 'overview' && <LiveBanner onSearch={() => setSearch(true)} go={go} />}
              <div className="mt-10">{page.body({ lang, setLang, go })}</div>
              <Feedback key={`fb-${page.id}`} />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {index > 0 ? <PageLink p={pages[index - 1]} dir="Previous" go={go} /> : <span />}
                {index < pages.length - 1 && <PageLink p={pages[index + 1]} dir="Next" go={go} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-[calc(var(--nav-h)+1.5rem)] py-8"><Toc key={page.id} page={page} /></div>
        </aside>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-0 z-[90] bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="h-full w-[82%] max-w-[320px] overflow-y-auto bg-surface p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between"><p className="font-bold">Documentation</p><button type="button" onClick={() => setMenu(false)} aria-label="Close menu" className="h-9 w-9 rounded-full bg-surface-2">✕</button></div>
              <Sidebar active={page.id} go={go} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{search && <Search onClose={() => setSearch(false)} go={go} />}</AnimatePresence>
      <Footer />
    </main>
  )
}

function Sidebar({ active, go }: { active: string; go: (id: string) => void }) {
  return (
    <nav aria-label="Documentation">
      {groups.map(g => (
        <div key={g} className="mb-7">
          <p className="mb-2 px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">{g}</p>
          <ul className="space-y-0.5">
            {pages.filter(p => p.group === g).map(p => (
              <li key={p.id}>
                <button type="button" onClick={() => go(p.id)} aria-current={p.id === active ? 'page' : undefined} className={`relative w-full rounded-lg px-3 py-2 text-left text-[0.88rem] transition ${p.id === active ? 'font-bold text-primary' : 'text-parchment/75 hover:bg-surface-2 hover:text-parchment'}`}>
                  {p.id === active && <motion.span layoutId="side-on" className="absolute inset-0 rounded-lg bg-primary/[0.08]" />}
                  <span className="relative">{navLabel(p.title)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/** "On this page", highlighting the section being read. */
function Toc({ page }: { page: DocPage }) {
  const [on, setOn] = useState(page.toc[0]?.id)
  useEffect(() => {
    const els = page.toc.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(entries => {
      const top = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (top) setOn(top.target.id)
    }, { rootMargin: '-20% 0px -65% 0px' })
    const t = setTimeout(() => els.forEach(el => io.observe(el)), 400)
    return () => { clearTimeout(t); io.disconnect() }
  }, [page])
  return (
    <nav aria-label="On this page">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">On this page</p>
      <ul className="mt-3 space-y-1 border-l border-ink-border">
        {page.toc.map(t => (
          <li key={t.id}>
            <a href={`#/${page.id}/${t.id}`} className={`-ml-px block border-l-2 py-1 pl-3 text-[0.82rem] transition ${on === t.id ? 'border-primary font-semibold text-primary' : 'border-transparent text-muted hover:text-parchment'}`}>{t.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function LiveBanner({ onSearch, go }: { onSearch: () => void; go: (id: string, anchor?: string) => void }) {
  const tries = [
    { label: 'Search these docs', hint: '⌘K', act: onSearch },
    { label: 'Send an API request', hint: 'Try it', act: () => go('api-payments', 'try-it') },
    { label: 'Watch a contract deploy', hint: 'Terminal', act: () => go('web3-deploy', 'deploy') },
  ]
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.05] p-5">
      <p className="text-sm font-bold">These docs are live. Use them.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {tries.map((t, n) => (
          <motion.button key={t.label} type="button" onClick={t.act} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + n * 0.1 }} className="flex items-center justify-between gap-2 rounded-xl border border-ink-border bg-surface px-3.5 py-3 text-left text-[0.85rem] font-semibold transition hover:-translate-y-0.5 hover:border-primary/50">
            {t.label}<span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-head text-[0.65rem] text-primary">{t.hint}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function Feedback() {
  const [vote, setVote] = useState<null | 'yes' | 'no'>(null)
  return (
    <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-ink-border pt-6 text-sm">
      <AnimatePresence mode="wait">
        {vote ? (
          <motion.p key="thanks" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-semibold text-success">{vote === 'yes' ? 'Thanks. Glad it helped.' : 'Thanks. Tell me what was missing: hello@ladyprowess.com'}</motion.p>
        ) : (
          <motion.div key="ask" exit={{ opacity: 0 }} className="flex items-center gap-3">
            <span className="text-muted">Was this page helpful?</span>
            {(['yes', 'no'] as const).map(v => <button key={v} type="button" onClick={() => setVote(v)} className="rounded-lg border border-ink-border px-3 py-1.5 font-semibold capitalize transition hover:border-primary/50">{v}</button>)}
          </motion.div>
        )}
      </AnimatePresence>
      <span className="ml-auto text-xs text-muted">Updated November 2026</span>
    </div>
  )
}

function PageLink({ p, dir, go }: { p: DocPage; dir: 'Previous' | 'Next'; go: (id: string) => void }) {
  return (
    <button type="button" onClick={() => go(p.id)} className={`group rounded-xl border border-ink-border p-4 transition hover:border-primary/50 hover:shadow-md ${dir === 'Next' ? 'text-right sm:col-start-2' : 'text-left'}`}>
      <p className="text-xs text-muted">{dir}</p>
      <p className="mt-1 font-bold text-primary">{dir === 'Previous' && '← '}{p.title}{dir === 'Next' && ' →'}</p>
    </button>
  )
}

/** Search across page titles, leads and section headings. Arrow keys move, Enter opens. */
function Search({ onClose, go }: { onClose: () => void; go: (id: string, anchor?: string) => void }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const results = useMemo(() => {
    const all = pages.flatMap(p => [
      { pid: p.id, anchor: undefined as string | undefined, title: p.title, sub: p.group, text: `${p.title} ${p.lead} ${p.keywords ?? ''}` },
      ...p.toc.map(t => ({ pid: p.id, anchor: t.id, title: t.label, sub: p.title, text: `${t.label} ${p.title}` })),
    ])
    const term = q.trim().toLowerCase()
    return (term ? all.filter(r => r.text.toLowerCase().includes(term)) : all.filter(r => !r.anchor)).slice(0, 9)
  }, [q])

  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => setSel(0), [q])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[sel]) go(results[sel].pid, results[sel].anchor)
  }

  return (
    <motion.div className="fixed inset-0 z-[95] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label="Search documentation" onClick={e => e.stopPropagation()} initial={{ y: -16, scale: 0.98 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-ink-border px-4">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-muted"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input ref={input} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search: webhooks, Rootstock, errors…" className="h-14 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-muted" />
          <kbd className="rounded border border-ink-border px-1.5 font-head text-[0.65rem] text-muted">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No results for “{q}”.</li>}
          {results.map((r, n) => (
            <li key={`${r.pid}-${r.anchor ?? ''}`}>
              <button type="button" onMouseEnter={() => setSel(n)} onClick={() => go(r.pid, r.anchor)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${n === sel ? 'bg-primary/[0.08]' : ''}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-head text-[0.7rem] ${r.anchor ? 'bg-surface-2 text-muted' : 'bg-primary/10 text-primary'}`}>{r.anchor ? '#' : '¶'}</span>
                <span className="min-w-0"><b className="block truncate text-[0.88rem]">{r.title}</b><span className="block truncate text-xs text-muted">{r.sub}</span></span>
                {n === sel && <span className="ml-auto text-xs text-muted">↵</span>}
              </button>
            </li>
          ))}
        </ul>
        <p className="border-t border-ink-border px-4 py-2.5 text-[0.7rem] text-muted">↑ ↓ to move · ↵ to open · <Link href="/" className="hover:text-parchment">Back to portfolio</Link></p>
      </motion.div>
    </motion.div>
  )
}
