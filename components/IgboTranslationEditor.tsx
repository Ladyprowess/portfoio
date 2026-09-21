'use client'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { insertEditorContent } from '@/lib/insert-editor-content'
import { normaliseGoogleDocsPaste, prepareBlogPaste } from '@/lib/blog-editor-paste'
import ArticleContent from '@/components/ArticleContent'
import { igboEditorHtml, storeIgboHtml } from '@/lib/igbo-html'

type Props = { uploadImage: (file: File) => Promise<string>; title: string; excerpt: string; body: string; approved: boolean; onChange: (value: { title: string; excerpt: string; body: string; approved: boolean }) => void }
const button = 'min-h-11 rounded-lg border border-ink-border px-3 py-2 text-sm hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const field = 'mt-2 w-full rounded-xl border border-ink-border bg-bg px-4 py-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const iconButton = 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-parchment/80 transition-colors hover:bg-surface-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
function FormatIcon({ name }: { name: string }) {
 const paths: Record<string, string> = {
  bold: 'M6 4h7a4 4 0 0 1 0 8H6zm0 8h8a4 4 0 0 1 0 8H6z',
  italic: 'M10 4h10M4 20h10M15 4 9 20',
  underline: 'M6 3v7a6 6 0 0 0 12 0V3M4 21h16',
  strikeThrough: 'M17 5c-1-2-8-3-10 1-1 2 1 4 5 5M7 18c2 3 10 3 10-2M3 12h18',
  quote: 'M10 7H5v7h5v-4H5c0-4 2-5 5-5M21 7h-5v7h5v-4h-5c0-4 2-5 5-5',
  code: 'm8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16',
  insertUnorderedList: 'M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1',
  insertOrderedList: 'M10 6h11M10 12h11M10 18h11M3 4h1v4M3 12c0-2 3-2 3 0l-3 3h3M3 18h3l-2 2h2',
  indent: 'M10 5h11M10 10h11M10 15h11M10 20h11m-18-11 3 3-3 3',
  outdent: 'M10 5h11M10 10h11M10 15h11M10 20h11m-15-11-3 3 3 3',
  insertHorizontalRule: 'M4 12h16',
  undo: 'M9 5 4 10l5 5M4 10h10a6 6 0 0 1 6 6v3',
  redo: 'm15 5 5 5-5 5m5-5H10a6 6 0 0 0-6 6v3',
  removeFormat: 'M5 4h14M12 4 8 18M5 18h6m4-3 6 6m0-6-6 6',
  link: 'm10 13 4-4M8 15l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 3 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0',
  unlink: 'm9 15-2 2a4 4 0 0 1-6-6l3-3m11 1 2-2a4 4 0 0 1 6 6l-3 3M3 3l18 18',
  image: 'M3 4h18v16H3zM3 17l6-6 5 5 3-3 4 4M7 8h1',
  justifyLeft: 'M3 5h18M3 10h12M3 15h18M3 20h12',
  justifyCenter: 'M3 5h18M6 10h12M3 15h18M6 20h12',
  justifyRight: 'M3 5h18M9 10h12M3 15h18M9 20h12',
  justifyFull: 'M3 5h18M3 10h18M3 15h18M3 20h18',
  table: 'M3 4h18v16H3zM3 9h18M3 15h18M9 4v16M15 4v16',
 }
 return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
export default function IgboTranslationEditor(props: Props) {
 const [uploading, setUploading] = useState(false)
 const [pasteStatus, setPasteStatus] = useState('')
 const imageInput = useRef<HTMLInputElement>(null)
 const dialog = useRef<HTMLDialogElement>(null)
 const editor = useRef<HTMLDivElement>(null)
 const trigger = useRef<HTMLButtonElement>(null)
 const [preview, setPreview] = useState(false)
 const [insert, setInsert] = useState<'link' | 'image' | null>(null)
 const [url, setUrl] = useState('')
 const [error, setError] = useState('')
 const selection = useRef<Range | null>(null)
 function update(value: Partial<Props>) { props.onChange({ title: props.title, excerpt: props.excerpt, body: props.body, approved: false, ...value }) }
 function sync() { if (editor.current) { const body = storeIgboHtml(normaliseGoogleDocsPaste(editor.current.innerHTML)); if (body !== props.body) update({ body }) } }
 function open() {
  setPreview(false); setInsert(null); setError('')
  dialog.current?.showModal()
  if (editor.current) editor.current.innerHTML = igboEditorHtml(props.body)
 }
 function command(name: string, value?: string) { editor.current?.focus(); document.execCommand(name, false, value); sync() }
 function beginInsert(kind: 'link' | 'image') {
  const current = window.getSelection()
  selection.current = current?.rangeCount && editor.current?.contains(current.anchorNode) ? current.getRangeAt(0).cloneRange() : null
  setInsert(kind); setUrl(''); setError('')
 }
 function insertUrl() {
  if (!/^https?:\/\/[^\s<>"']+$/i.test(url)) { setError('Enter a full https:// or http:// address.'); return }
  editor.current?.focus()
  if (selection.current) { const current = window.getSelection(); current?.removeAllRanges(); current?.addRange(selection.current) }
  command(insert === 'image' ? 'insertImage' : 'createLink', url)
  setInsert(null)
 }
 function saveSelection() {
  const current = window.getSelection()
  selection.current = current?.rangeCount && editor.current?.contains(current.anchorNode) ? current.getRangeAt(0).cloneRange() : null
 }
 async function pasteContent(html: string, files: File[], text = '') {
  if (uploading) return
  saveSelection(); setUploading(true); setPasteStatus('Preparing pasted content and compressing images…')
  try {
   const prepared = await prepareBlogPaste(html, files, props.uploadImage)
   flushSync(() => setUploading(false))
   if (!editor.current) throw new Error('The editor is closed. Reopen it and retry.')
   insertEditorContent(editor.current, selection.current, prepared || text, Boolean(prepared))
   sync()
   setPasteStatus('Content added.')
  } catch (error) { setPasteStatus(error instanceof Error ? error.message : 'Could not paste. Please try again.') }
  finally { setUploading(false) }
 }
 async function uploadFiles(files: File[]) {
  // Selection was saved before opening the file picker.
  const range = selection.current
  setUploading(true); setPasteStatus('Compressing and uploading images…')
  try {
   const html = await prepareBlogPaste('', files, props.uploadImage)
   flushSync(() => setUploading(false))
   if (!editor.current) throw new Error('The editor is closed. Reopen it and retry.')
   insertEditorContent(editor.current, range, html, true)
   sync(); setPasteStatus('Images uploaded.')
  } catch (error) { setPasteStatus(error instanceof Error ? error.message : 'Image upload failed. Please retry.') }
  finally { setUploading(false) }
 }
 const tools: [string, string, string?][] = [['Bold','bold'],['Italic','italic'],['Underline','underline'],['Strikethrough','strikeThrough'],['Quote','formatBlock','blockquote'],['Code','formatBlock','pre'],['Align left','justifyLeft'],['Align centre','justifyCenter'],['Align right','justifyRight'],['Justify','justifyFull'],['Bullets','insertUnorderedList'],['Numbered list','insertOrderedList'],['Indent','indent'],['Outdent','outdent'],['Divider','insertHorizontalRule'],['Undo','undo'],['Redo','redo'],['Clear formatting','removeFormat']]
 return <>
  <button ref={trigger} type="button" onClick={open} className={`${button} shrink-0`}>Igbo translation{props.approved ? ' ✓' : ''}</button>
  <dialog ref={dialog} onCancel={event => { if (uploading) event.preventDefault() }} onClose={() => trigger.current?.focus()} className="fixed inset-0 m-auto h-[90dvh] max-h-[90dvh] w-[min(72rem,96vw)] max-w-none overflow-hidden rounded-2xl border border-ink-border bg-bg p-0 text-parchment backdrop:bg-black/50" aria-labelledby="igbo-editor-title">
   <div className="flex h-full flex-col">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-border px-5 py-4"><div><h2 id="igbo-editor-title" className="text-xl font-semibold">Igbo translation</h2><p className="mt-1 text-xs text-muted">Changes are included when you save or publish the post.</p></div><div className="flex gap-2"><button type="button" disabled={uploading} onClick={() => { setPreview(!preview); setInsert(null) }} className={button}>{preview ? 'Edit' : 'Preview'}</button><button type="button" disabled={uploading} onClick={() => dialog.current?.close()} className={button}>Done</button></div></header>
    <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
     <div hidden={preview} className="space-y-5">
      <label className="block text-sm font-semibold">Igbo title<input autoFocus lang="ig" value={props.title} maxLength={500} onChange={e => update({ title: e.target.value })} className={field} /></label>
      <label className="block text-sm font-semibold">Igbo summary<textarea lang="ig" rows={2} value={props.excerpt} maxLength={3000} onChange={e => update({ excerpt: e.target.value })} className={field} /></label>
      <div className="rounded-xl border border-ink-border bg-surface">
       <div className="sticky top-0 z-10 flex flex-wrap items-center gap-y-1 rounded-t-xl border-b border-ink-border bg-surface px-2 py-1.5" role="group" aria-label="Igbo article formatting">
        <select aria-label="Paragraph style" defaultValue="p" onPointerDown={() => { const current = window.getSelection(); if (current?.rangeCount && editor.current?.contains(current.anchorNode)) selection.current = current.getRangeAt(0).cloneRange() }} onChange={event => { editor.current?.focus(); if (selection.current) { const current = window.getSelection(); current?.removeAllRanges(); current?.addRange(selection.current) } command('formatBlock', event.target.value) }} className="mr-2 h-10 w-32 rounded-md border border-ink-border bg-bg px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
         <option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option>
        </select>
        <select aria-label="Font" defaultValue="Inter" onPointerDown={saveSelection} onChange={event => { editor.current?.focus(); if (selection.current) { const current = window.getSelection(); current?.removeAllRanges(); current?.addRange(selection.current) } command('fontName', event.target.value) }} className="mr-2 h-10 rounded-md border border-ink-border bg-bg px-2 text-sm focus-visible:ring-2 focus-visible:ring-primary"><option value="Inter">Sans</option><option value="Georgia">Serif</option><option value="monospace">Mono</option></select>
        {tools.map(([label, name, value], index) => <span key={label} className={`inline-flex ${[4,6,10,11].includes(index) ? 'ml-1 border-l border-ink-border pl-1' : ''}`}><button type="button" title={label} aria-label={label} onMouseDown={e => e.preventDefault()} onClick={() => command(name, value)} className={iconButton}><FormatIcon name={label === 'Quote' ? 'quote' : label === 'Code' ? 'code' : name} /></button></span>)}
        <div className="ml-1 flex border-l border-ink-border pl-1">
         <button type="button" title="Insert link" aria-label="Insert link" onMouseDown={e => e.preventDefault()} onClick={() => beginInsert('link')} className={iconButton}><FormatIcon name="link" /></button>
         <button type="button" title="Remove link" aria-label="Remove link" onMouseDown={e => e.preventDefault()} onClick={() => command('unlink')} className={iconButton}><FormatIcon name="unlink" /></button>
         <button type="button" disabled={uploading} title="Upload image" aria-label="Upload image" onMouseDown={e => e.preventDefault()} onClick={() => { saveSelection(); imageInput.current?.click() }} className={iconButton}><FormatIcon name="image" /></button>
         <button type="button" title="Insert table" aria-label="Insert table" onMouseDown={e => e.preventDefault()} onClick={() => command('insertHTML', '<table><tbody><tr><th>Isiokwu</th><th>Isiokwu</th></tr><tr><td>…</td><td>…</td></tr></tbody></table><p><br></p>')} className={iconButton}><FormatIcon name="table" /></button>
        </div>
       </div>
       <input ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={event => { const files = Array.from(event.target.files || []); event.target.value = ''; if (files.length) void uploadFiles(files) }} />
       {pasteStatus && <p role="status" className="border-b border-ink-border px-4 py-2 text-sm text-muted">{pasteStatus}</p>}
       {insert && <div className="flex flex-wrap items-end gap-2 border-b border-ink-border p-3"><label className="min-w-0 flex-1 text-sm">{insert === 'image' ? 'Image address' : 'Link address'}<input type="url" autoFocus value={url} onChange={e => setUrl(e.target.value)} className={field} /></label><button type="button" onClick={insertUrl} className={button}>Insert</button><button type="button" onClick={() => setInsert(null)} className={button}>Cancel</button>{error && <p role="alert" className="w-full text-sm">{error}</p>}</div>}
       <div ref={editor} contentEditable={!uploading} aria-busy={uploading} suppressContentEditableWarning lang="ig" role="textbox" aria-label="Igbo article" aria-multiline="true" onInput={sync} onBlur={sync} onPaste={event => { event.preventDefault(); const files = Array.from(event.clipboardData.items).filter(item => item.kind === 'file' && item.type.startsWith('image/')).map(item => item.getAsFile()).filter((file): file is File => Boolean(file)); void pasteContent(event.clipboardData.getData('text/html'), files, event.clipboardData.getData('text/plain')) }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/')); if (files.length && !uploading) { saveSelection(); void uploadFiles(files) } }} className="blog-editor min-h-80 p-5 text-base font-normal leading-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
      </div>
     </div>
     {preview && <div lang="ig" className="mx-auto max-w-3xl"><h2 className="font-serif text-4xl">{props.title}</h2><p className="mt-5 text-lg text-muted">{props.excerpt}</p><div className="reading mt-8"><ArticleContent html={igboEditorHtml(props.body)} /></div></div>}
    </div>
    <footer className="border-t border-ink-border px-5 py-3"><label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={props.approved} onChange={e => update({ approved: e.target.checked })} className="h-5 w-5 accent-primary focus-visible:ring-2 focus-visible:ring-primary" />I have reviewed and approve this Igbo translation.</label></footer>
   </div>
  </dialog>
 </>
}
