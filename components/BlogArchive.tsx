'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export type BlogArchivePost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  accent: string
  cover: string | null
}

const POSTS_PER_PAGE = 6

export default function BlogArchive({ posts }: { posts: BlogArchivePost[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map(post => post.category)))], [posts])
  const filtered = posts.filter(post => {
    const search = query.trim().toLowerCase()
    const matchesSearch = !search || post.title.toLowerCase().includes(search) || post.excerpt.toLowerCase().includes(search) || post.category.toLowerCase().includes(search)
    return matchesSearch && (category === 'All' || post.category === category)
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visiblePosts = filtered.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE)

  return <>
    <div className="mb-10 grid gap-3 rounded-2xl border border-ink-border bg-white p-3 md:grid-cols-[1fr_240px]"><label className="relative"><span className="sr-only">Search blog posts</span><svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Search articles" className="w-full rounded-xl bg-bg py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/25" /></label><select value={category} onChange={event => { setCategory(event.target.value); setPage(1) }} aria-label="Filter by category" className="rounded-xl border-0 bg-bg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25">{categories.map(item => <option key={item}>{item}</option>)}</select></div>
    <div className="mb-6 flex items-center justify-between"><p className="text-sm text-muted">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</p>{totalPages > 1 && <p className="text-sm text-muted">Page {safePage} of {totalPages}</p>}</div>
    {visiblePosts.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{visiblePosts.map(post => <article key={post.slug} className="overflow-hidden rounded-3xl border border-ink-border bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(17,24,39,.08)]"><Link href={`/blog/${post.slug}`} className="group flex h-full min-h-[24rem] flex-col">{post.cover && <div className="relative aspect-[16/9] overflow-hidden bg-surface-2"><Image src={post.cover} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" /></div>}<div className="flex flex-1 flex-col p-7 lg:p-8"><div className="mb-8 flex items-start justify-between gap-4"><span className="rounded-full px-3 py-1.5 font-head text-[0.56rem] font-bold uppercase tracking-[0.12em]" style={{ color: post.accent, background: `${post.accent}14` }}>{post.category}</span><span className="font-head text-[0.58rem] font-bold uppercase tracking-[0.12em] text-muted">{post.readTime}</span></div><h2 className="font-head text-[1.4rem] font-bold leading-[1.25] text-parchment transition-colors group-hover:text-primary">{post.title}</h2><p className="mt-5 flex-1 text-[0.92rem] leading-[1.8] text-muted">{post.excerpt}</p><div className="mt-8 flex items-center justify-between border-t border-ink-border pt-8"><span className="font-head text-[0.65rem] font-bold uppercase tracking-[0.12em] text-parchment/70">{post.date}</span><span className="text-sm text-primary transition-transform group-hover:translate-x-1">Read →</span></div></div></Link></article>)}</div> : <div className="rounded-2xl border border-ink-border bg-white px-6 py-16 text-center"><h2 className="font-display text-xl font-bold">No articles found</h2><p className="mt-2 text-sm text-muted">Try a different search or category.</p></div>}
    {totalPages > 1 && <div className="mt-10 flex items-center justify-center gap-3"><button disabled={safePage === 1} onClick={() => { setPage(value => Math.max(1, value - 1)); window.scrollTo({ top: 200, behavior: 'smooth' }) }} className="rounded-full border border-ink-border bg-white px-5 py-2.5 text-sm font-semibold disabled:opacity-35">Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map(number => <button key={number} onClick={() => { setPage(number); window.scrollTo({ top: 200, behavior: 'smooth' }) }} aria-label={`Page ${number}`} className={`h-10 w-10 rounded-full text-sm font-semibold ${safePage === number ? 'bg-primary text-white' : 'border border-ink-border bg-white'}`}>{number}</button>)}<button disabled={safePage === totalPages} onClick={() => { setPage(value => Math.min(totalPages, value + 1)); window.scrollTo({ top: 200, behavior: 'smooth' }) }} className="rounded-full border border-ink-border bg-white px-5 py-2.5 text-sm font-semibold disabled:opacity-35">Next</button></div>}
  </>
}
