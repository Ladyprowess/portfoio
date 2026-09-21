'use client'
import { useRef, useState } from 'react'
import ArticleContent from '@/components/ArticleContent'
import { igboEditorHtml, storeIgboHtml } from '@/lib/igbo-html'

type Props = { title: string; excerpt: string; body: string; approved: boolean; onChange: (value: { title: string; excerpt: string; body: string; approved: boolean }) => void }
const button = 'min-h-11 rounded-lg border border-ink-border px-3 py-2 text-sm hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const field = 'mt-2 w-full rounded-xl border border-ink-border bg-bg px-4 py-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
export default function IgboTranslationEditor(props: Props) {
 const dialog = useRef<HTMLDialogElement>(null)
 const editor = useRef<HTMLDivElement>(null)
 const trigger = useRef<HTMLButtonElement>(null)
 const [preview, setPreview] = useState(false)
 const [insert, setInsert] = useState<'link' | 'image' | null>(null)
 const [url, setUrl] = useState('')
 const [error, setError] = useState('')
 const selection = useRef<Range | null>(null)
 function update(value: Partial<Props>) { props.onChange({ title: props.title, excerpt: props.excerpt, body: props.body, approved: false, ...value }) }
 function sync() { if (editor.current) update({ body: storeIgboHtml(editor.current.innerHTML) }) }
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
 const tools: [string, string, string?][] = [['Bold','bold'],['Italic','italic'],['Underline','underline'],['Strikethrough','strikeThrough'],['Paragraph','formatBlock','p'],['Heading 2','formatBlock','h2'],['Heading 3','formatBlock','h3'],['Quote','formatBlock','blockquote'],['Code','formatBlock','pre'],['Bullets','insertUnorderedList'],['Numbered list','insertOrderedList'],['Indent','indent'],['Outdent','outdent'],['Divider','insertHorizontalRule'],['Undo','undo'],['Redo','redo'],['Clear formatting','removeFormat']]
 return <>
  <button ref={trigger} type="button" onClick={open} className={`${button} shrink-0`}>Igbo translation{props.approved ? ' ✓' : ''}</button>
  <dialog ref={dialog} onClose={() => trigger.current?.focus()} className="fixed inset-0 m-auto h-[90dvh] max-h-[90dvh] w-[min(72rem,96vw)] max-w-none overflow-hidden rounded-2xl border border-ink-border bg-bg p-0 text-parchment backdrop:bg-black/50" aria-labelledby="igbo-editor-title">
   <div className="flex h-full flex-col">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-border px-5 py-4"><div><h2 id="igbo-editor-title" className="text-xl font-semibold">Igbo translation</h2><p className="mt-1 text-xs text-muted">Changes are included when you save or publish the post.</p></div><div className="flex gap-2"><button type="button" onClick={() => { setPreview(!preview); setInsert(null) }} className={button}>{preview ? 'Edit' : 'Preview'}</button><button type="button" onClick={() => dialog.current?.close()} className={button}>Done</button></div></header>
    <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
     <div hidden={preview} className="space-y-5">
      <label className="block text-sm font-semibold">Igbo title<input autoFocus lang="ig" value={props.title} maxLength={500} onChange={e => update({ title: e.target.value })} className={field} /></label>
      <label className="block text-sm font-semibold">Igbo summary<textarea lang="ig" rows={2} value={props.excerpt} maxLength={3000} onChange={e => update({ excerpt: e.target.value })} className={field} /></label>
      <div className="rounded-xl border border-ink-border bg-surface">
       <div className="sticky top-0 z-10 flex flex-wrap gap-1 rounded-t-xl border-b border-ink-border bg-surface p-2" role="group" aria-label="Igbo article formatting">{tools.map(([label, name, value]) => <button key={label} type="button" onMouseDown={e => e.preventDefault()} onClick={() => command(name, value)} className={button}>{label}</button>)}<button type="button" onMouseDown={e => e.preventDefault()} onClick={() => beginInsert('link')} className={button}>Link</button><button type="button" onMouseDown={e => e.preventDefault()} onClick={() => command('unlink')} className={button}>Remove link</button><button type="button" onMouseDown={e => e.preventDefault()} onClick={() => beginInsert('image')} className={button}>Image URL</button><button type="button" onMouseDown={e => e.preventDefault()} onClick={() => command('insertHTML', '<table><tbody><tr><th>Isiokwu</th><th>Isiokwu</th></tr><tr><td>…</td><td>…</td></tr></tbody></table><p><br></p>')} className={button}>Table</button></div>
       {insert && <div className="flex flex-wrap items-end gap-2 border-b border-ink-border p-3"><label className="min-w-0 flex-1 text-sm">{insert === 'image' ? 'Image address' : 'Link address'}<input type="url" autoFocus value={url} onChange={e => setUrl(e.target.value)} className={field} /></label><button type="button" onClick={insertUrl} className={button}>Insert</button><button type="button" onClick={() => setInsert(null)} className={button}>Cancel</button>{error && <p role="alert" className="w-full text-sm">{error}</p>}</div>}
       <div ref={editor} contentEditable suppressContentEditableWarning lang="ig" role="textbox" aria-label="Igbo article" aria-multiline="true" onInput={sync} onBlur={sync} onPaste={event => { event.preventDefault(); const html = event.clipboardData.getData('text/html'); if (html) command('insertHTML', igboEditorHtml(storeIgboHtml(html))); else command('insertText', event.clipboardData.getData('text/plain')) }} className="blog-editor min-h-80 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
      </div>
     </div>
     {preview && <div lang="ig" className="mx-auto max-w-3xl"><h2 className="font-serif text-4xl">{props.title}</h2><p className="mt-5 text-lg text-muted">{props.excerpt}</p><div className="reading mt-8"><ArticleContent html={igboEditorHtml(props.body)} /></div></div>}
    </div>
    <footer className="border-t border-ink-border px-5 py-3"><label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={props.approved} onChange={e => update({ approved: e.target.checked })} className="h-5 w-5 accent-primary focus-visible:ring-2 focus-visible:ring-primary" />I have reviewed and approve this Igbo translation.</label></footer>
   </div>
  </dialog>
 </>
}
