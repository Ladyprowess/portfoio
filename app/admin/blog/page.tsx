'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import AdminNav from '@/components/AdminNav'
import type { CmsPost } from '@/lib/blog-cms'

const fieldClass = 'w-full rounded-xl border border-ink-border bg-white px-4 py-3 text-sm outline-none focus:border-primary'
const toolbarButtonClass = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-parchment transition hover:bg-white hover:text-primary focus-visible:ring-2 focus-visible:ring-primary'
const POSTS_PER_PAGE = 5

type IconName = 'left' | 'centre' | 'right' | 'justify' | 'bullets' | 'numbers' | 'checklist' | 'link' | 'table' | 'image' | 'clear'

function EditorIcon({ name }: { name: IconName }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'left') return <svg {...common}><path d="M4 6h16M4 10h11M4 14h16M4 18h9" /></svg>
  if (name === 'centre') return <svg {...common}><path d="M4 6h16M7 10h10M4 14h16M8 18h8" /></svg>
  if (name === 'right') return <svg {...common}><path d="M4 6h16M9 10h11M4 14h16M11 18h9" /></svg>
  if (name === 'justify') return <svg {...common}><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
  if (name === 'bullets') return <svg {...common}><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" /></svg>
  if (name === 'numbers') return <svg {...common}><path d="M10 6h10M10 12h10M10 18h10M4 5h1v3M4 11h2l-2 3h2M4 17h2l-2 2h2" /></svg>
  if (name === 'checklist') return <svg {...common}><rect x="3" y="4" width="5" height="5" rx="1" /><path d="m4.5 6.5 1.2 1.2L8 5.2M11 6.5h10" /><rect x="3" y="14" width="5" height="5" rx="1" /><path d="M11 16.5h10" /></svg>
  if (name === 'link') return <svg {...common}><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></svg>
  if (name === 'table') return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 9h18M9 4v16M15 4v16" /></svg>
  if (name === 'image') return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 4 4 2-2 5 5" /></svg>
  return <svg {...common}><path d="m5 5 14 14M19 5 5 19" /></svg>
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} onMouseDown={event => event.preventDefault()} onClick={onClick} className={toolbarButtonClass}>{children}</button>
}

const checklistMarker = /^\s*(?:☐|☑|☒|□|✓|✔|\[\s?\]|\[[xX]\])\s*/

function flattenChecklistWrappers(list: HTMLUListElement | HTMLOListElement) {
  let foundWrapper = true

  while (foundWrapper) {
    foundWrapper = false

    Array.from(list.children).forEach(item => {
      if (item.tagName !== 'LI') return
      const nestedList = item.querySelector('ul, ol')
      if (!nestedList) return

      const visibleCopy = item.cloneNode(true) as HTMLElement
      visibleCopy.querySelectorAll('ul, ol').forEach(childList => childList.remove())
      visibleCopy.querySelectorAll('input[type="checkbox"], [aria-hidden="true"]').forEach(element => element.remove())
      const ownText = (visibleCopy.textContent || '').replace(checklistMarker, '').replace(/\u200B/g, '').trim()
      const hasWrittenContent = /[A-Za-z0-9]/.test(ownText)
      if (hasWrittenContent || visibleCopy.querySelector('img, table')) return

      Array.from(nestedList.children).forEach(nestedItem => list.insertBefore(nestedItem, item))
      item.remove()
      foundWrapper = true
    })
  }
}

function prepareChecklist(list: HTMLUListElement | HTMLOListElement, removeEmptyItems = false) {
  flattenChecklistWrappers(list)
  list.className = 'blog-checklist'
  list.querySelectorAll(':scope > li').forEach(item => {
    const sourceCheckboxes = Array.from(item.querySelectorAll('input[type="checkbox"]')) as HTMLInputElement[]
    const itemText = (item.textContent || '').replace(checklistMarker, '').replace(/\u200B/g, '').trim()
    if (removeEmptyItems && !itemText && !item.querySelector('img, table')) {
      item.remove()
      return
    }
    const checked = sourceCheckboxes.some(checkbox => checkbox.checked || checkbox.hasAttribute('checked')) || /^(?:☑|☒|✓|✔|\[[xX]\])/i.test(item.textContent?.trim() || '') || item.getAttribute('aria-checked') === 'true'
    sourceCheckboxes.forEach(checkbox => checkbox.remove())
    item.querySelectorAll('label').forEach(sourceLabel => sourceLabel.replaceWith(...Array.from(sourceLabel.childNodes)))
    const textWalker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT)
    let textNode = textWalker.nextNode()
    while (textNode) {
      if (textNode.textContent && checklistMarker.test(textNode.textContent)) {
        textNode.textContent = textNode.textContent.replace(checklistMarker, '')
        break
      }
      textNode = textWalker.nextNode()
    }
    const contents = document.createElement('span')
    while (item.firstChild) contents.appendChild(item.firstChild)
    const label = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = checked
    if (checked) checkbox.setAttribute('checked', '')
    label.append(checkbox, contents)
    item.replaceChildren(label)
    item.removeAttribute('aria-checked')
  })
}

function normaliseGoogleDocsPaste(html: string) {
  const documentCopy = new DOMParser().parseFromString(html, 'text/html')
  const isGoogleDocs = /docs-internal-guid|google-docs|kix-/i.test(html)

  documentCopy.querySelectorAll('script, meta, link').forEach(element => element.remove())
  const checklistLists = new Set<HTMLUListElement | HTMLOListElement>()
  documentCopy.querySelectorAll('li').forEach(item => {
    const text = item.textContent?.trim() || ''
    const style = item.getAttribute('style') || ''
    const list = item.closest('ul, ol')
    const looksLikeChecklist = item.hasAttribute('aria-checked') || checklistMarker.test(text) || (isGoogleDocs && /list-style-type:\s*none/i.test(style))
    if (looksLikeChecklist && list) checklistLists.add(list as HTMLUListElement | HTMLOListElement)
  })
  Array.from(checklistLists)
    .filter(list => !Array.from(checklistLists).some(otherList => otherList !== list && otherList.contains(list)))
    .forEach(list => prepareChecklist(list, true))
  documentCopy.querySelectorAll('p, div').forEach(block => {
    if (block.closest('.blog-checklist') || !checklistMarker.test(block.textContent?.trim() || '')) return
    const list = documentCopy.createElement('ul')
    list.className = 'blog-checklist'
    const item = documentCopy.createElement('li')
    const label = documentCopy.createElement('label')
    const checkbox = documentCopy.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = /^(?:☑|☒|✓|✔|\[[xX]\])/i.test(block.textContent?.trim() || '')
    if (checkbox.checked) checkbox.setAttribute('checked', '')
    const contents = documentCopy.createElement('span')
    contents.innerHTML = block.innerHTML.replace(checklistMarker, '')
    label.append(checkbox, contents)
    item.appendChild(label)
    list.appendChild(item)
    block.replaceWith(list)
  })

  documentCopy.querySelectorAll('style').forEach(element => element.remove())
  return documentCopy.body.innerHTML
}

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
  const [postSearch, setPostSearch] = useState('')
  const [postFilter, setPostFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [postPage, setPostPage] = useState(1)
  const [editingStatus, setEditingStatus] = useState<'draft' | 'published' | ''>('')
  const [publishedAt, setPublishedAt] = useState<string | null>(null)
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

  function addTable() {
    const rowAnswer = window.prompt('How many rows?', '3')
    if (rowAnswer === null) return
    const columnAnswer = window.prompt('How many columns?', '3')
    if (columnAnswer === null) return

    const rows = Math.min(Math.max(Number.parseInt(rowAnswer, 10) || 3, 2), 12)
    const columns = Math.min(Math.max(Number.parseInt(columnAnswer, 10) || 3, 2), 8)
    const headingCells = Array.from({ length: columns }, (_, index) => `<th scope="col">Heading ${index + 1}</th>`).join('')
    const bodyRows = Array.from({ length: rows - 1 }, () => `<tr>${Array.from({ length: columns }, () => '<td>Text</td>').join('')}</tr>`).join('')
    const table = `<div class="blog-table-wrap"><table><thead><tr>${headingCells}</tr></thead><tbody>${bodyRows}</tbody></table></div><p><br></p>`

    format('insertHTML', table)
  }

  function addChecklist() {
    editorRef.current?.focus()
    const selection = window.getSelection()
    if (!selection?.rangeCount) return
    if (selection.isCollapsed) {
      setStatus('Highlight the lines you want to turn into a checklist, then select the checklist icon.')
      return
    }

    const lines = selection.toString().split(/\n+/).map(line => line.trim()).filter(Boolean)
    if (!lines.length) {
      setStatus('Highlight one or more complete lines first.')
      return
    }

    const escapeText = (value: string) => value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
    const items = lines.map(line => `<li><label><input type="checkbox" /><span>${escapeText(line)}</span></label></li>`).join('')
    document.execCommand('insertHTML', false, `<ul class="blog-checklist">${items}</ul><p><br></p>`)
    setStatus(`${lines.length} checklist ${lines.length === 1 ? 'item' : 'items'} created.`)
    setContentHtml(editorRef.current?.innerHTML || '')
  }

  function pasteFromDocument(event: React.ClipboardEvent<HTMLDivElement>) {
    const html = event.clipboardData.getData('text/html')
    if (!html) return
    event.preventDefault()
    const cleaned = normaliseGoogleDocsPaste(html)
    document.execCommand('insertHTML', false, cleaned)
    setContentHtml(editorRef.current?.innerHTML || '')
  }

  function syncEditor(event: React.FormEvent<HTMLDivElement>) {
    const target = event.target
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      if (target.checked) target.setAttribute('checked', '')
      else target.removeAttribute('checked')
    }
    setContentHtml(editorRef.current?.innerHTML || '')
  }

  function edit(post: CmsPost) {
    setId(post.id); setTitle(post.title); setSlug(post.slug); setExcerpt(post.excerpt); setCategory(post.category); setCoverImage(post.cover_image || ''); setContentHtml(post.content_html)
    setEditingStatus(post.status); setPublishedAt(post.published_at)
    if (editorRef.current) editorRef.current.innerHTML = post.content_html
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearForm() {
    setId(''); setTitle(''); setSlug(''); setExcerpt(''); setCategory('Insights'); setCoverImage(''); setContentHtml('')
    setEditingStatus(''); setPublishedAt(null)
    if (editorRef.current) editorRef.current.innerHTML = ''
  }

  async function save(postStatus: 'draft' | 'published') {
    setSaving(true); setStatus('')
    try {
      await request({ action: 'save', id, title, slug, excerpt, category, coverImage, contentHtml, status: postStatus, publishedAt })
      setStatus(postStatus === 'published' ? (id ? 'Live post updated.' : 'Post published.') : 'Draft saved.')
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

  const matchingPosts = posts.filter(post => {
    const query = postSearch.trim().toLowerCase()
    const matchesText = !query || post.title.toLowerCase().includes(query) || post.category.toLowerCase().includes(query)
    return matchesText && (postFilter === 'all' || post.status === postFilter)
  })
  const totalPostPages = Math.max(1, Math.ceil(matchingPosts.length / POSTS_PER_PAGE))
  const safePostPage = Math.min(postPage, totalPostPages)
  const visiblePosts = matchingPosts.slice((safePostPage - 1) * POSTS_PER_PAGE, safePostPage * POSTS_PER_PAGE)

  if (!password) return <main className="min-h-screen bg-bg"><AdminNav /><div className="mx-auto max-w-lg px-5 py-20 text-center"><h1 className="font-display text-2xl font-semibold">Open the admin dashboard first</h1><a href="/admin" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">Go to admin login</a></div></main>

  return <main className="min-h-screen bg-bg"><AdminNav /><div className="mx-auto grid max-w-[1400px] gap-7 px-5 py-8 lg:grid-cols-[1fr_340px] lg:px-8">
    <section className="rounded-3xl border border-ink-border bg-white p-5 md:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Blog CMS</p><h1 className="mt-2 font-display text-2xl font-semibold">{id ? 'Edit post' : 'Create a post'}</h1></div>{id && <button onClick={clearForm} className="rounded-full border border-ink-border px-4 py-2 text-xs font-semibold">New post</button>}</div>
      <div className="mt-7 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Title<input value={title} onChange={event => setTitle(event.target.value)} className={`mt-2 ${fieldClass}`} placeholder="Post title" /></label><label className="text-sm font-semibold">URL name<input value={slug} onChange={event => setSlug(event.target.value)} className={`mt-2 ${fieldClass}`} placeholder="Created from the title if empty" /></label><label className="text-sm font-semibold md:col-span-2">Short summary<textarea value={excerpt} onChange={event => setExcerpt(event.target.value)} className={`mt-2 min-h-24 ${fieldClass}`} placeholder="A short introduction shown on the blog page" /></label><label className="text-sm font-semibold">Category<input value={category} onChange={event => setCategory(event.target.value)} className={`mt-2 ${fieldClass}`} /></label><label className="text-sm font-semibold">Cover image<input value={coverImage} onChange={event => setCoverImage(event.target.value)} className={`mt-2 ${fieldClass}`} placeholder="Image URL or upload an image" /></label></div>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { setUploadMode('cover'); fileRef.current?.click() }} className="rounded-full border border-ink-border px-4 py-2 text-xs font-semibold hover:border-primary">Upload cover image</button>{coverImage && <a href={coverImage} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-primary">View cover</a>}</div>
      <div className="mt-7">
        <p className="text-sm font-semibold">Article</p>
        <div className="mt-2 rounded-2xl border border-ink-border focus-within:border-primary">
          <div className="sticky top-0 z-30 flex flex-wrap items-center gap-1 rounded-t-2xl border-b border-ink-border bg-surface-2/95 p-2 shadow-[0_8px_24px_rgba(18,18,18,0.07)] backdrop-blur-xl">
            <select aria-label="Text style" onChange={event => format('formatBlock', event.target.value)} className="h-9 rounded-lg border border-ink-border bg-white px-2 text-xs"><option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
            <select aria-label="Font" onChange={event => format('fontName', event.target.value)} className="h-9 rounded-lg border border-ink-border bg-white px-2 text-xs"><option value="Inter">Sans</option><option value="Georgia">Serif</option><option value="monospace">Mono</option></select>
            <ToolbarButton label="Bold" onClick={() => format('bold')}><span className="text-sm font-extrabold">B</span></ToolbarButton>
            <ToolbarButton label="Italic" onClick={() => format('italic')}><span className="font-serif text-base font-bold italic">I</span></ToolbarButton>
            <ToolbarButton label="Underline" onClick={() => format('underline')}><span className="text-sm font-bold underline underline-offset-2">U</span></ToolbarButton>
            <span className="mx-1 h-6 w-px bg-ink-border" aria-hidden />
            <ToolbarButton label="Align left" onClick={() => format('justifyLeft')}><EditorIcon name="left" /></ToolbarButton>
            <ToolbarButton label="Align centre" onClick={() => format('justifyCenter')}><EditorIcon name="centre" /></ToolbarButton>
            <ToolbarButton label="Align right" onClick={() => format('justifyRight')}><EditorIcon name="right" /></ToolbarButton>
            <ToolbarButton label="Justify text" onClick={() => format('justifyFull')}><EditorIcon name="justify" /></ToolbarButton>
            <span className="mx-1 h-6 w-px bg-ink-border" aria-hidden />
            <ToolbarButton label="Bullet list" onClick={() => format('insertUnorderedList')}><EditorIcon name="bullets" /></ToolbarButton>
            <ToolbarButton label="Numbered list" onClick={() => format('insertOrderedList')}><EditorIcon name="numbers" /></ToolbarButton>
            <ToolbarButton label="Checklist" onClick={addChecklist}><EditorIcon name="checklist" /></ToolbarButton>
            <ToolbarButton label="Add link" onClick={addLink}><EditorIcon name="link" /></ToolbarButton>
            <ToolbarButton label="Add table" onClick={addTable}><EditorIcon name="table" /></ToolbarButton>
            <ToolbarButton label="Add image" onClick={() => { setUploadMode('article'); fileRef.current?.click() }}><EditorIcon name="image" /></ToolbarButton>
            <ToolbarButton label="Clear formatting" onClick={() => format('removeFormat')}><EditorIcon name="clear" /></ToolbarButton>
          </div>
          <div ref={editorRef} contentEditable suppressContentEditableWarning onPaste={pasteFromDocument} onInput={syncEditor} onChange={syncEditor} data-placeholder="Start writing your article..." className="blog-editor min-h-[620px] p-5 text-base leading-8 outline-none" />
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={event => upload(event.target.files?.[0])} />{status && <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">{status}</p>}<div className="mt-6 flex flex-wrap gap-3"><button disabled={saving} onClick={() => save('draft')} className="rounded-full border border-ink-border bg-white px-6 py-3 text-sm font-semibold hover:border-primary disabled:opacity-50">{id ? 'Save as draft' : 'Save draft'}</button><button disabled={saving} onClick={() => save('published')} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : editingStatus === 'published' ? 'Update live post' : 'Publish'}</button>{editingStatus === 'published' && slug && <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-primary/25 bg-blue-50 px-6 py-3 text-sm font-semibold text-primary">View live post ↗</a>}</div>
    </section>
    <aside className="lg:sticky lg:top-5 lg:self-start">
      <div className="rounded-3xl border border-ink-border bg-white p-5">
        <div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">All posts</h2><span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">{matchingPosts.length}</span></div>
        <div className="mt-4 space-y-2"><input value={postSearch} onChange={event => { setPostSearch(event.target.value); setPostPage(1) }} placeholder="Search posts" className="w-full rounded-xl border border-ink-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary" /><select value={postFilter} onChange={event => { setPostFilter(event.target.value as 'all' | 'draft' | 'published'); setPostPage(1) }} className="w-full rounded-xl border border-ink-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select></div>
        <div className="mt-4 space-y-3">{visiblePosts.length ? visiblePosts.map(post => <article key={post.id} className={`rounded-2xl border p-4 ${id === post.id ? 'border-primary bg-blue-50/40' : 'border-ink-border'}`}><span className={`text-[11px] font-semibold uppercase tracking-wider ${post.status === 'published' ? 'text-green-700' : 'text-amber'}`}>{post.status}</span><h3 className="mt-1 text-sm font-semibold leading-5">{post.title}</h3><p className="mt-1 text-xs text-muted">{post.category}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => edit(post)} className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold">Edit</button>{post.status === 'published' && <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-primary">View live</a>}<button onClick={() => remove(post)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button></div></article>) : <p className="py-8 text-center text-sm text-muted">{posts.length ? 'No posts match your search.' : 'No CMS posts yet.'}</p>}</div>
        {matchingPosts.length > POSTS_PER_PAGE && <div className="mt-5 flex items-center justify-between border-t border-ink-border pt-4"><button disabled={safePostPage === 1} onClick={() => setPostPage(page => Math.max(1, page - 1))} className="rounded-full border border-ink-border px-3 py-1.5 text-xs font-semibold disabled:opacity-35">Previous</button><span className="text-xs text-muted">{safePostPage} of {totalPostPages}</span><button disabled={safePostPage === totalPostPages} onClick={() => setPostPage(page => Math.min(totalPostPages, page + 1))} className="rounded-full border border-ink-border px-3 py-1.5 text-xs font-semibold disabled:opacity-35">Next</button></div>}
      </div>
    </aside>
  </div></main>
}
