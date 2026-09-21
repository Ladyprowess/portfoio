'use client'

import { createContext, useContext, useEffect, useId, useState, type ReactNode, type FormEvent } from 'react'
import { SITE_URL } from '@/lib/site'

type Comment = { id: string; name: string; body: string; created_at: string }
type Data = { comments: Comment[]; commentCount: number; likes: number; liked: boolean }
const control = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50'
const Context = createContext<{
 slug: string; title: string; visitor: string; data: Data; ready: boolean; error: string; busy: boolean;
 refresh: () => Promise<void>; toggle: () => Promise<void>;
} | null>(null)
function useEngagement() { const value = useContext(Context); if (!value) throw new Error('Missing engagement provider'); return value }
export function ArticleEngagementProvider({ slug, title, children }: { slug: string; title: string; children: ReactNode }) {
 const [visitor, setVisitor] = useState('')
 const [data, setData] = useState<Data>({ comments: [], commentCount: 0, likes: 0, liked: false })
 const [ready, setReady] = useState(false)
 const [busy, setBusy] = useState(false)
 const [error, setError] = useState('')
 useEffect(() => {
  let id = ''
  try { id = localStorage.getItem('blog-visitor') || '' } catch {}
  if (!/^[0-9a-f-]{36}$/i.test(id)) id = crypto.randomUUID()
  try { localStorage.setItem('blog-visitor', id) } catch {}
  setVisitor(id)
 }, [])
 async function refresh() {
  setError('')
  try {
   const response = await fetch(`/api/blog-engagement?slug=${encodeURIComponent(slug)}&visitor=${visitor}`)
   const result = await response.json()
   if (!response.ok) throw new Error(result.error)
   setData(result); setReady(true)
  } catch (e) { setError(e instanceof Error ? e.message : 'Could not load responses. Please retry.') }
 }
 useEffect(() => { if (visitor) void refresh() }, [visitor, slug]) // eslint-disable-line react-hooks/exhaustive-deps
 async function toggle() {
  if (busy || !ready) return
  setBusy(true); setError('')
  try {
   const response = await fetch('/api/blog-engagement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'like', slug, visitor, liked: !data.liked }) })
   const result = await response.json()
   if (!response.ok) throw new Error(result.error)
   setData(current => ({ ...current, ...result }))
  } catch (e) { setError(e instanceof Error ? e.message : 'Could not save your like.') }
  finally { setBusy(false) }
 }
 return <Context.Provider value={{ slug, title, visitor, data, ready, error, busy, refresh, toggle }}>{children}</Context.Provider>
}

const actionControl = 'inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm tabular-nums transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 sm:gap-2 sm:border sm:border-ink-border sm:px-4'

export function ArticleActions() {
 const { slug, title, data, ready, busy, toggle, error, refresh } = useEngagement()
 const [open, setOpen] = useState(false)
 const [message, setMessage] = useState('')
 const [native, setNative] = useState(false)
 const [hidden, setHidden] = useState(false)
 useEffect(() => {
  const comments = document.getElementById('comments')
  if (!comments) return
  const observer = new IntersectionObserver(([entry]) => {
   setHidden(entry.isIntersecting)
   if (entry.isIntersecting) setOpen(false)
  })
  observer.observe(comments)
  return () => observer.disconnect()
 }, [])
 const id = useId()
 useEffect(() => { setNative(typeof navigator.share === 'function') }, [])
 const url = `${SITE_URL}/blog/${encodeURIComponent(slug)}`
 const encoded = encodeURIComponent(url)
 const links = [
  ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encoded}`],
  ['X / Twitter', `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`],
  ['WhatsApp', `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`],
  ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`],
 ]
 async function copy() {
  try { await navigator.clipboard.writeText(url); setMessage('Link copied.') }
  catch { setMessage(`Copy this link: ${url}`) }
 }
 async function share() {
  try { await navigator.share({ title, url }) }
  catch (e) { if (!(e instanceof Error && e.name === 'AbortError')) setMessage('Sharing is unavailable. Use a platform or copy the link.') }
 }
 return <div data-article-actions hidden={hidden} className="fixed inset-x-3 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 mx-auto w-fit max-w-[calc(100%-1.5rem)] rounded-3xl border border-ink-border bg-bg/95 p-1 shadow-lg sm:p-2 backdrop-blur-md" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); document.getElementById(`${id}-button`)?.focus() } }}>
  <div className="flex justify-center gap-0.5 sm:gap-2" aria-label="Article responses">
   <button type="button" aria-pressed={data.liked} aria-label={data.liked ? 'Unlike this article' : 'Like this article'} disabled={!ready || busy} onClick={toggle} className={`${actionControl} ${data.liked ? 'border-primary text-primary' : 'text-muted'}`}><svg width="18" height="18" viewBox="0 0 24 24" fill={data.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg><span className="hidden sm:inline">{data.liked ? 'Liked' : 'Like'}</span>{ready && <span>{data.likes}</span>}</button>
   <a href="#comments" aria-label={ready ? `Comments (${data.commentCount})` : 'Comments'} className={actionControl}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8v.5Z" /></svg><span className="hidden sm:inline">Comments</span>{ready && <span>{data.commentCount}</span>}</a>
   <button id={`${id}-button`} type="button" aria-label="Share this article" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className={actionControl}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></svg><span className="hidden sm:inline">Share</span></button>
  </div>
  {open && <div id={id} className="absolute bottom-full left-1/2 mb-3 w-72 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 max-h-[50svh] overflow-y-auto rounded-2xl border border-ink-border bg-surface p-4 shadow-lg"><p className="mb-3 text-sm font-semibold">Share this article</p><div className="flex flex-wrap gap-2">{links.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={control}>{name}</a>)}<button type="button" onClick={copy} className={control}>Copy link</button>{native && <button type="button" onClick={share} className={control}>More…</button>}</div></div>}
  {message && <p role="status" className="mt-3 break-words text-sm text-muted">{message}</p>}
  {error && <p role="alert" className="mt-3 text-sm text-muted">{error} <button type="button" onClick={refresh} className="min-h-11 px-2 underline focus-visible:ring-2 focus-visible:ring-primary">Retry</button></p>}
 </div>
}

export function ArticleComments() {
 const { slug, visitor, data, ready, error, refresh } = useEngagement()
 const [name, setName] = useState('')
 const [anonymous, setAnonymous] = useState(false)
 const [body, setBody] = useState('')
 const [website, setWebsite] = useState('')
 const [busy, setBusy] = useState(false)
 const [message, setMessage] = useState('')
 const [extra, setExtra] = useState<Comment[]>([])
 const [loading, setLoading] = useState(false)
 const [pageError, setPageError] = useState('')
 async function submit(event: FormEvent) {
  event.preventDefault(); setBusy(true); setMessage('')
  try {
   const response = await fetch('/api/blog-engagement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'comment', slug, visitor, name: anonymous ? undefined : name, anonymous, body, website }) })
   const result = await response.json()
   if (!response.ok) throw new Error(result.error)
   setBody(''); setMessage('Thank you! Your comment is awaiting approval.')
  } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not submit. Please try again.') }
  finally { setBusy(false) }
 }
 async function more() {
  setLoading(true); setPageError('')
  try {
   const response = await fetch(`/api/blog-engagement?slug=${encodeURIComponent(slug)}&offset=${data.comments.length + extra.length}`)
   const result = await response.json()
   if (!response.ok) throw new Error(result.error)
   setExtra(current => [...current, ...result.comments])
  } catch { setPageError('Could not load more comments. Please try again.') }
  finally { setLoading(false) }
 }
 const comments = [...data.comments, ...extra].filter((item, index, all) => all.findIndex(c => c.id === item.id) === index)
 const field = 'mt-2 w-full rounded-xl border border-ink-border bg-bg px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
 return <section id="comments" aria-labelledby="comments-title" className="scroll-mt-24 border-t border-ink-border py-10">
  <h2 id="comments-title" className="font-serif text-3xl">Join the conversation{ready && data.commentCount > 0 ? ` (${data.commentCount})` : ''}</h2>
  <p className="mt-3 text-sm leading-relaxed text-muted">What stayed with you? Leave a thought or a question. Comments appear after approval.</p>
  <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl bg-surface p-5 md:p-6">
   <label className="block text-sm font-medium">Your name<input required={!anonymous} disabled={anonymous} maxLength={80} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className={`${field} disabled:cursor-not-allowed disabled:opacity-50`} /></label>
   <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium"><input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="h-5 w-5 accent-primary focus-visible:ring-2 focus-visible:ring-primary" />Comment anonymously</label>
   <label className="block text-sm font-medium">Your comment<textarea required minLength={3} maxLength={3000} rows={4} value={body} onChange={e => setBody(e.target.value)} className={field} /></label>
   <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label></div>
   <p className="text-xs text-muted">{anonymous ? 'Your comment will appear as Anonymous. Your name will not be sent or saved.' : 'Your name and comment will be public once approved.'}</p>
   <button disabled={busy || !visitor} className={`${control} bg-primary text-on-primary hover:text-on-primary`}>{busy ? 'Submitting…' : 'Submit comment'}</button>
   {message && <p role="status" className="text-sm">{message}</p>}
  </form>
  {!ready && !error && <p role="status" className="mt-8 text-sm text-muted">Loading comments…</p>}
  {error && <div role="alert" className="mt-6 text-sm">{error}<button onClick={refresh} className={control}>Retry</button></div>}
  {ready && !comments.length && <p className="mt-8 text-sm text-muted">No comments yet. Be the first to share a thought.</p>}
  <div className="mt-8 divide-y divide-ink-border">{comments.map(comment => <article key={comment.id} className="py-6"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="break-words font-semibold">{comment.name}</h3><time dateTime={comment.created_at} className="text-xs text-muted">{new Date(comment.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></div><p className="mt-3 whitespace-pre-wrap break-words text-base leading-relaxed">{comment.body}</p></article>)}</div>
  {pageError && <p role="alert" className="my-3 text-sm">{pageError}</p>}
  {data.comments.length + extra.length < data.commentCount && <button onClick={more} disabled={loading} className={control}>{loading ? 'Loading…' : 'Load more comments'}</button>}
 </section>
}
