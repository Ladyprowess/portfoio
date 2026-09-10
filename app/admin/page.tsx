'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminNav from '@/components/AdminNav'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('ladyprowess_admin_password')
    if (saved) { setPassword(saved); verify(saved) }
  }, [])

  async function verify(value: string) {
    setLoading(true)
    setError('')
    const response = await fetch('/api/blog-posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list', password: value }) })
    const data = await response.json()
    setLoading(false)
    if (!response.ok) { setError(data.error || 'Could not unlock the admin area.'); return }
    sessionStorage.setItem('ladyprowess_admin_password', value)
    setUnlocked(true)
  }

  if (!unlocked) return <main className="flex min-h-screen items-center justify-center bg-bg px-5"><form onSubmit={event => { event.preventDefault(); verify(password) }} className="w-full max-w-sm rounded-3xl border border-ink-border bg-white p-7"><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Private admin</p><h1 className="mt-3 font-display text-3xl font-semibold">Welcome back</h1><p className="mt-3 text-sm leading-6 text-muted">Enter your admin password to manage email and blog posts.</p><input type="password" autoFocus value={password} onChange={event => setPassword(event.target.value)} placeholder="Password" className="mt-6 w-full rounded-xl border border-ink-border bg-bg px-4 py-3 outline-none focus:border-primary" />{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<button disabled={loading} className="mt-4 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{loading ? 'Checking...' : 'Open admin'}</button><Link href="/" className="mt-5 block text-center text-sm text-muted hover:text-primary">Back to website</Link></form></main>

  return <main className="min-h-screen bg-bg"><AdminNav /><section className="mx-auto max-w-[1240px] px-5 py-14 md:px-8"><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Admin dashboard</p><h1 className="mt-3 font-display text-3xl font-semibold">What would you like to manage?</h1><div className="mt-9 grid gap-5 md:grid-cols-2"><Link href="/compose" className="rounded-3xl border border-ink-border bg-white p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><span className="text-2xl">✉</span><h2 className="mt-5 font-display text-xl font-semibold">Email compose</h2><p className="mt-2 text-sm leading-6 text-muted">Write formatted emails, add attachments, send messages, and view opens and clicks.</p><p className="mt-6 text-sm font-semibold text-primary">Open email tools →</p></Link><Link href="/admin/blog" className="rounded-3xl border border-ink-border bg-white p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><span className="text-2xl">✎</span><h2 className="mt-5 font-display text-xl font-semibold">Blog CMS</h2><p className="mt-2 text-sm leading-6 text-muted">Write, format, save, edit, publish, and manage blog posts.</p><p className="mt-6 text-sm font-semibold text-primary">Manage blog →</p></Link></div></section></main>
}
