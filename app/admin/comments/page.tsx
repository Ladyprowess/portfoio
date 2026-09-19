'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminNav from '@/components/AdminNav'
type Comment = { id: string; post_slug: string; name: string; body: string; status: string; created_at: string }
const button = 'min-h-11 rounded-full border border-ink-border px-4 py-2 text-sm font-semibold hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40'
export default function CommentsAdmin() {
 const [password, setPassword] = useState('')
 const [status, setStatus] = useState('pending')
 const [page, setPage] = useState(0)
 const [comments, setComments] = useState<Comment[]>([])
 const [busy, setBusy] = useState(false)
 const [error, setError] = useState('')
 const [loaded, setLoaded] = useState(false)
 const [version, setVersion] = useState(0)
 const [deleting, setDeleting] = useState('')
 useEffect(() => { setPassword(sessionStorage.getItem('ladyprowess_admin_password') || '') }, [])
 useEffect(() => {
  if (!password) return
  let active = true
  setBusy(true); setError(''); setLoaded(false)
  fetch('/api/blog-comments-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, action: 'list', status, offset: page * 20 }) })
   .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); if (active) { setComments(data.comments); setLoaded(true) } })
   .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Could not load comments.') })
   .finally(() => { if (active) setBusy(false) })
  return () => { active = false }
 }, [password, status, page, version])
 async function moderate(id: string, action: string) {
  setBusy(true); setError('')
  try {
   const response = await fetch('/api/blog-comments-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, id, action }) })
   const data = await response.json()
   if (!response.ok) throw new Error(data.error)
   setDeleting(''); setVersion(v => v + 1)
  } catch (e) { setError(e instanceof Error ? e.message : 'Could not update comment.') }
  finally { setBusy(false) }
 }
 return <main className="min-h-screen bg-bg"><AdminNav /><div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
  <h1 className="font-display text-3xl font-bold">Comments</h1><p className="mt-3 text-muted">Review reader responses. Only approved comments appear on articles.</p>
  {!password ? <p className="mt-8">Please <Link href="/admin" className="text-primary underline">sign in from the admin dashboard</Link> to review comments.</p> : <>
   <div className="my-8 flex flex-wrap gap-3">{['pending','approved','rejected'].map(value => <button key={value} disabled={busy} aria-pressed={status === value} onClick={() => { setStatus(value); setPage(0); setDeleting('') }} className={`${button} capitalize ${status === value ? 'bg-primary text-on-primary' : ''}`}>{value}</button>)}</div>
   {error && <div role="alert" className="mb-6">{error} <button onClick={() => setVersion(v => v + 1)} className={button}>Retry</button></div>}
   {busy && <p role="status" className="my-6 text-muted">Loading…</p>}
   {loaded && !comments.length && <p className="rounded-2xl border border-ink-border p-8 text-muted">No {status} comments on this page.</p>}
   {loaded && <div className="space-y-4">{comments.slice(0,20).map(comment => <article key={comment.id} className="rounded-2xl border border-ink-border bg-surface p-6"><div className="flex flex-wrap justify-between gap-3"><h2 className="break-words font-semibold">{comment.name}</h2><time className="text-sm text-muted" dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleDateString()}</time></div><Link href={`/blog/${comment.post_slug}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block break-all text-sm text-primary underline">{comment.post_slug} ↗</Link><p className="my-5 whitespace-pre-wrap break-words leading-relaxed">{comment.body}</p><div className="flex flex-wrap gap-2">{status !== 'approved' && <button disabled={busy} onClick={() => moderate(comment.id, 'approved')} className={button}>Approve</button>}{status !== 'rejected' && <button disabled={busy} onClick={() => moderate(comment.id, 'rejected')} className={button}>Reject</button>}<button disabled={busy} onClick={() => setDeleting(comment.id)} className={button}>Delete</button></div>{deleting === comment.id && <div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-sm">Permanently delete this comment?</span><button disabled={busy} onClick={() => moderate(comment.id, 'delete')} className={button}>Confirm delete</button><button onClick={() => setDeleting('')} className={button}>Cancel</button></div>}</article>)}</div>}
   <div className="mt-8 flex items-center justify-between"><button disabled={busy || page === 0} onClick={() => setPage(p => p - 1)} className={button}>Previous</button><span className="text-sm">Page {page + 1}</span><button disabled={busy || !loaded || comments.length <= 20} onClick={() => setPage(p => p + 1)} className={button}>Next</button></div>
  </>}
 </div></main>
}
