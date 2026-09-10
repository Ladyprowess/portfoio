'use client'

import { useEffect, useRef, useState } from 'react'
import AdminNav from '@/components/AdminNav'
import type { CmsPost } from '@/lib/blog-cms'

const fieldClass = 'w-full rounded-xl border border-ink-border bg-white px-4 py-3 text-sm outline-none focus:border-primary'

export default function BlogCmsPage() {
  const [password, setPassword] = useState('')
  const [posts, setPosts] = useState<CmsPost[]>([])
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Insights')
  const [coverImage, setCoverImage] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadMode, setUploadMode] = useState<'cover' | 'article'>('cover')
  const editorRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('ladyprowess_admin_password') || ''
    setPassword(saved)
    if (saved) {
      fetch('/api/blog-posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list', password: saved }) })
        .then(response => response.json().then(data => ({ response, data })))
        .then(({ response, data }) => response.ok ? setPosts(data.posts || []) : setStatus(data.error || 'Open the admin dashboard first.'))
        .catch(() => setStatus('Could not load blog posts.'))
    }
  }, [])

  async function request(payload: Record<string, unknown>) {
    const response = await fetch('/api/blog-posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, password }) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'The request could not be completed.')
    return data
  }

  async function loadPosts(value = password) {
    const response = await fetch('/api/blog-posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list', password: value }) })
    const data = await response.json()
    if (response.ok) setPosts(data.posts || [])
    else setStatus(data.error || 'Enter your password from the admin dashboard.')
  }

  function format(command: string, value?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    setContentHtml(editorRef.current?.innerHTML || '')
  }

  function addLink() {
    const url = window.prompt('Paste the link')
    if (!url) return
    format('createLink', /^https?:\/\//i.test(url) ? url : `https://${url}`)
  }

  function edit(post: CmsPost) {
    setId(post.id); setTitle(post.title); setSlug(post.slug); setExcerpt(post.excerpt); setCategory(post.category); setCoverImage(post.cover_image || ''); setContentHtml(post.content_html)
    if (editorRef.current) editorRef.current.innerHTML = post.content_html
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearForm() {
    setId(''); setTitle(''); setSlug(''); setExcerpt(''); setCategory('Insights'); setCoverImage(''); setContentHtml('')
    if (editorRef.current) editorRef.current.innerHTML = ''
  }

  async function save(postStatus: 'draft' | 'published') {
    setSaving(true); setStatus('')
    try {
      await request({ action: 'save', id, title, slug, excerpt, category, coverImage, contentHtml, status: postStatus })
      setStatus(postStatus === 'published' ? 'Post published.' : 'Draft saved.')
      clearForm(); await loadPosts()
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not save the post.') }
    finally { setSaving(false) }
  }

  async function remove(post: CmsPost) {
    if (!window.confirm(`Delete “${post.title}”?`)) return
    try { await request({ action: 'delete', id: post.id }); if (id === post.id) clearForm(); await loadPosts() }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Could not delete the post.') }
  }

  async function upload(file?: File) {
    if (!file) return
    setStatus('Uploading image...')
    const content = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file) })
    const response = await fetch('/api/blog-images', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, name: file.name, type: file.type, content }) })
    const data = await response.json()
    if (!response.ok) { setStatus(data.error || 'Could not upload the image.'); return }
    if (uploadMode === 'cover') setCoverImage(data.url)
    else {
      const next = `${editorRef.current?.innerHTML || contentHtml}<p><img src="${data.url}" alt="" /></p>`
      setContentHtml(next)
      if (editorRef.current) editorRef.current.innerHTML = next
    }
    setStatus('Image uploaded.')
    if (fileRef.current) fileRef.current.value = ''
  }

  if (!password) return <main className="min-h-screen bg-bg"><AdminNav /><div className="mx-auto max-w-lg px-5 py-20 text-center"><h1 className="font-display text-2xl font-semibold">Open the admin dashboard first</h1><a href="/admin" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">Go to admin login</a></div></main>

  return <main className="min-h-screen bg-bg"><AdminNav /><div className="mx-auto grid max-w-[1400px] gap-7 px-5 py-8 lg:grid-cols-[1fr_340px] lg:px-8">
    <section className="rounded-3xl border border-ink-border bg-white p-5 md:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Blog CMS</p><h1 className="mt-2 font-display text-2xl font-semibold">{id ? 'Edit post' : 'Create a post'}</h1></div>{id && <button onClick={clearForm} className="rounded-full border border-ink-border px-4 py-2 text-xs font-semibold">New post</button>}</div>
      <div className="mt-7 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Title<input value={title} onChange={event => setTitle(event.target.value)} className={`mt-2 ${fieldClass}`} placeholder="Post title" /></label><label className="text-sm font-semibold">URL name<input value={slug} onChange={event => setSlug(event.target.value)} className={`mt-2 ${fieldClass}`} placeholder="Created from the title if empty" /></label><label className="text-sm font-semibold md:col-span-2">Short summary<textarea value={excerpt} onChange={event => setExcerpt(event.target.value)} className={`mt-2 min-h-24 ${fieldClass}`} placeholder="A short introduction shown on the blog page" /></label><label className="text-sm font-semibold">Category<input value={category} onChange={event => setCategory(event.target.value)} className={`mt-2 ${fieldClass}`} /></label><label className="text-sm font-semibold">Cover image<input value={coverImage} onChange={event => setCoverImage(event.target.value)} className={`mt-2 ${fieldClass}`} placeholder="Image URL or upload an image" /></label></div>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { setUploadMode('cover'); fileRef.current?.click() }} className="rounded-full border border-ink-border px-4 py-2 text-xs font-semibold hover:border-primary">Upload cover image</button>{coverImage && <a href={coverImage} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-primary">View cover</a>}</div>
      <div className="mt-7"><p className="text-sm font-semibold">Article</p><div className="mt-2 overflow-hidden rounded-2xl border border-ink-border focus-within:border-primary"><div className="flex flex-wrap items-center gap-1 border-b border-ink-border bg-surface-2 p-2"><select onChange={event => format('formatBlock', event.target.value)} className="rounded-lg border border-ink-border bg-white px-2 py-1.5 text-xs"><option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select><select onChange={event => format('fontName', event.target.value)} className="rounded-lg border border-ink-border bg-white px-2 py-1.5 text-xs"><option value="Inter">Sans</option><option value="Georgia">Serif</option><option value="monospace">Mono</option></select><button onClick={() => format('bold')} className="rounded-lg px-3 py-1.5 text-sm font-bold hover:bg-white">B</button><button onClick={() => format('italic')} className="rounded-lg px-3 py-1.5 text-sm italic hover:bg-white">I</button><button onClick={() => format('underline')} className="rounded-lg px-3 py-1.5 text-sm underline hover:bg-white">U</button><button onClick={() => format('insertUnorderedList')} className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-white">Bullets</button><button onClick={() => format('insertOrderedList')} className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-white">Numbers</button><button onClick={addLink} className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-white">Link</button><button onClick={() => { setUploadMode('article'); fileRef.current?.click() }} className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-white">Image</button><button onClick={() => format('removeFormat')} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted hover:bg-white">Clear</button></div><div ref={editorRef} contentEditable suppressContentEditableWarning onInput={event => setContentHtml((event.target as HTMLDivElement).innerHTML)} data-placeholder="Start writing your article..." className="blog-editor min-h-[420px] p-5 text-base leading-8 outline-none" /></div></div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={event => upload(event.target.files?.[0])} />{status && <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">{status}</p>}<div className="mt-6 flex flex-wrap gap-3"><button disabled={saving} onClick={() => save('draft')} className="rounded-full border border-ink-border bg-white px-6 py-3 text-sm font-semibold hover:border-primary disabled:opacity-50">Save draft</button><button disabled={saving} onClick={() => save('published')} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Publish'}</button></div>
    </section>
    <aside className="lg:sticky lg:top-5 lg:self-start"><div className="rounded-3xl border border-ink-border bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">All posts</h2><span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">{posts.length}</span></div><div className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto">{posts.length ? posts.map(post => <article key={post.id} className="rounded-2xl border border-ink-border p-4"><div className="flex items-start justify-between gap-3"><div><span className={`text-[11px] font-semibold uppercase tracking-wider ${post.status === 'published' ? 'text-green-700' : 'text-amber'}`}>{post.status}</span><h3 className="mt-1 text-sm font-semibold leading-5">{post.title}</h3><p className="mt-1 text-xs text-muted">{post.category}</p></div></div><div className="mt-4 flex gap-2"><button onClick={() => edit(post)} className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold">Edit</button><button onClick={() => remove(post)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button></div></article>) : <p className="py-8 text-center text-sm text-muted">No CMS posts yet.</p>}</div></div></aside>
  </div></main>
}
