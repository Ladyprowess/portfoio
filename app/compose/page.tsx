'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'

// Private compose page. Public URL, but the form is gated by a password that is
// checked on the server (COMPOSE_PASSWORD). Sends from hello@ladyprowess.com via Resend.

const MAX_TOTAL_BYTES = 8 * 1024 * 1024 // keep total attachments under ~8MB

type PendingFile = {
  filename: string
  content: string // base64
  size: number
}

type EmailEvent = { id: number; event_type: 'open' | 'click'; url?: string; occurred_at: string }
type SentEmail = { id: string; recipients: string[]; cc: string[]; bcc: string[]; subject: string; preview?: string; body_html: string; status: string; sent_at: string; events: EmailEvent[] }

const inputClass =
  'w-full bg-bg border border-ink-border px-4 py-3 text-[0.95rem] text-parchment placeholder:text-muted/50 outline-none transition-colors focus:border-primary/60'
const labelClass =
  'font-head text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // strip the "data:<mime>;base64," prefix
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ToolbarButton({
  label,
  onClick,
  className = '',
  children,
}: {
  label: string
  onClick: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      // onMouseDown + preventDefault keeps the editor's text selection intact
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-h-8 rounded-sm px-2 py-1 font-head text-[0.7rem] font-bold text-muted transition-colors hover:bg-surface-2 hover:text-primary ${className}`}
    >
      {children}
    </button>
  )
}

export default function ComposePage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [showCc, setShowCc] = useState(false)
  const [subject, setSubject] = useState('')
  const [preview, setPreview] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [files, setFiles] = useState<PendingFile[]>([])

  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [history, setHistory] = useState<SentEmail[]>([])
  const [historyPage, setHistoryPage] = useState(1)
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('ladyprowess_admin_password')
    if (saved) { setPassword(saved); setUnlocked(true) }
  }, [])

  // Apply a formatting command to the selected text in the rich editor.
  function format(command: string, value?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    setBodyHtml(editorRef.current?.innerHTML ?? '')
  }

  function insertLink() {
    const url = window.prompt('Link URL (https://…)')
    if (!url) return
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`
    format('createLink', href)
  }

  async function handleFiles(list: FileList | null) {
    if (!list) return
    const next: PendingFile[] = [...files]
    for (const file of Array.from(list)) {
      const content = await fileToBase64(file)
      next.push({ filename: file.name, content, size: file.size })
    }
    const total = next.reduce((sum, f) => sum + f.size, 0)
    if (total > MAX_TOTAL_BYTES) {
      setStatus({ type: 'error', text: `Attachments too large (${formatBytes(total)}). Keep the total under 8 MB.` })
      return
    }
    setStatus(null)
    setFiles(next)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function loadHistory() {
    setLoadingHistory(true)
    try {
      const response = await fetch('/api/email-history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not load email activity.')
      setHistory(data.emails || [])
      setHistoryPage(1)
      if (selectedEmail) setSelectedEmail((data.emails || []).find((email: SentEmail) => email.id === selectedEmail.id) || null)
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'Could not load email activity.' })
    } finally { setLoadingHistory(false) }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          to,
          cc,
          bcc,
          subject,
          preview,
          bodyHtml,
          attachments: files.map((f) => ({ filename: f.filename, content: f.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) setUnlocked(false)
        setStatus({ type: 'error', text: data.error || 'Something went wrong.' })
        return
      }
      setStatus({ type: 'ok', text: 'Sent. Your email is on its way.' })
      setTo('')
      setCc('')
      setBcc('')
      setSubject('')
      setPreview('')
      setBodyHtml('')
      if (editorRef.current) editorRef.current.innerHTML = ''
      setFiles([])
      await loadHistory()
    } catch {
      setStatus({ type: 'error', text: 'Network error. Try again.' })
    } finally {
      setSending(false)
    }
  }

  // --- Password gate ---
  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-parchment">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (password.trim()) {
              sessionStorage.setItem('ladyprowess_admin_password', password)
              setUnlocked(true)
            }
          }}
          className="w-full max-w-sm border border-ink-border bg-surface p-8"
        >
          <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
            Private
          </span>
          <h1 className="mt-3 font-display text-[2.4rem] font-extrabold leading-none">Compose</h1>
          <p className="mt-3 text-[0.9rem] leading-[1.7] text-muted">
            Enter your password to send email from hello@ladyprowess.com.
          </p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`mt-6 ${inputClass}`}
          />
          <button
            type="submit"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center bg-primary px-6 font-head text-[0.72rem] font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-primary/85"
          >
            Unlock
          </button>
          <Link
            href="/"
            className="mt-6 block text-center font-head text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
          >
            Back to site
          </Link>
        </form>
      </main>
    )
  }

  // --- Compose form ---
  return (
    <><AdminNav /><main className="min-h-screen bg-bg px-6 py-12 text-parchment md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
              New message
            </span>
            <h1 className="mt-2 font-display text-[2.2rem] font-semibold leading-none">Compose</h1>
          </div>
          <Link
            href="/admin"
            className="font-head text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
          >
            Admin home
          </Link>
        </div>

        <form onSubmit={handleSend} className="mx-auto max-w-2xl space-y-5 rounded-3xl border border-ink-border bg-surface p-6 md:p-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>From</label>
            </div>
            <div className="bg-bg border border-ink-border px-4 py-3 text-[0.95rem] text-muted">
              hello@ladyprowess.com
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>To</label>
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="font-head text-[0.58rem] font-bold uppercase tracking-[0.14em] text-primary hover:text-primary/80"
                >
                  + Cc / Bcc
                </button>
              )}
            </div>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="partner@company.com, another@company.com"
              className={inputClass}
            />
          </div>

          {showCc && (
            <>
              <div className="space-y-2">
                <label className={labelClass}>Cc</label>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@company.com"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Bcc</label>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="bcc@company.com"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className={labelClass}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Partnership proposal"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Preview</label>
              <span className="font-head text-[0.55rem] uppercase tracking-[0.12em] text-muted/60">
                Inbox snippet · optional
              </span>
            </div>
            <input
              type="text"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              placeholder="Short line shown after the subject in the inbox"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Message</label>
            <div className="border border-ink-border bg-bg focus-within:border-primary/60">
              <div className="flex flex-wrap items-center gap-1 border-b border-ink-border px-2 py-1.5">
                <ToolbarButton label="Bold" onClick={() => format('bold')} className="font-bold">
                  B
                </ToolbarButton>
                <ToolbarButton label="Italic" onClick={() => format('italic')} className="italic">
                  I
                </ToolbarButton>
                <ToolbarButton label="Underline" onClick={() => format('underline')} className="underline">
                  U
                </ToolbarButton>
                <span className="mx-1 h-4 w-px bg-ink-border" />
                <ToolbarButton label="Bulleted list" onClick={() => format('insertUnorderedList')}>
                  • List
                </ToolbarButton>
                <ToolbarButton label="Numbered list" onClick={() => format('insertOrderedList')}>
                  1. List
                </ToolbarButton>
                <span className="mx-1 h-4 w-px bg-ink-border" />
                <ToolbarButton label="Insert link" onClick={insertLink}>
                  🔗 Link
                </ToolbarButton>
                <ToolbarButton label="Clear formatting" onClick={() => format('removeFormat')}>
                  Clear
                </ToolbarButton>
              </div>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                data-placeholder="Hi there,&#10;&#10;..."
                onInput={(e) => setBodyHtml((e.target as HTMLDivElement).innerHTML)}
                className="compose-editor min-h-[240px] px-4 py-3 text-[0.95rem] leading-[1.7] text-parchment outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Attachments</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-head text-[0.58rem] font-bold uppercase tracking-[0.14em] text-primary hover:text-primary/80"
              >
                + Add file
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((f, i) => (
                  <li
                    key={`${f.filename}-${i}`}
                    className="flex items-center justify-between border border-ink-border bg-bg px-3 py-2 text-[0.85rem]"
                  >
                    <span className="truncate text-parchment">{f.filename}</span>
                    <span className="ml-3 flex shrink-0 items-center gap-3">
                      <span className="text-muted">{formatBytes(f.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-muted transition-colors hover:text-primary"
                        aria-label={`Remove ${f.filename}`}
                      >
                        ✕
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {status && (
            <div
              className={`border px-4 py-3 text-[0.88rem] ${
                status.type === 'ok'
                  ? 'border-primary/40 bg-primary-glow text-primary'
                  : 'border-amber/40 bg-amber/10 text-amber'
              }`}
            >
              {status.text}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex min-h-12 items-center justify-center bg-primary px-8 font-head text-[0.72rem] font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Send email'}
            </button>
            <span className="font-head text-[0.58rem] font-bold uppercase tracking-[0.14em] text-muted">
              Replies go to hello@ladyprowess.com
            </span>
          </div>
        </form>

        <section className="mt-16 border-t border-ink-border pt-10">
          <div className="mb-6 flex items-end justify-between gap-4"><div><span className={labelClass}>Tracking dashboard</span><h2 className="mt-2 font-display text-2xl font-bold">Sent email activity</h2></div><button onClick={loadHistory} disabled={loadingHistory} className="rounded-full border border-ink-border bg-white px-4 py-2 text-xs font-semibold hover:border-primary disabled:opacity-50">{loadingHistory ? 'Loading…' : history.length ? 'Refresh' : 'Load emails'}</button></div>
          {history.length === 0 ? <div className="rounded-2xl border border-dashed border-ink-border bg-white p-8 text-center text-sm text-muted">Load your sent emails to see delivery, opens, and clicks.</div> : <><div className="overflow-hidden rounded-2xl border border-ink-border bg-white"><div className="hidden grid-cols-[1fr_1.4fr_110px_100px] gap-4 border-b border-ink-border bg-surface-2 px-5 py-3 font-head text-[10px] uppercase tracking-wider text-muted md:grid"><span>Recipient</span><span>Subject</span><span>Activity</span><span>Sent</span></div>{history.slice((historyPage - 1) * 5, historyPage * 5).map(email => {
            const opens = email.events.filter(event => event.event_type === 'open').length
            const clicks = email.events.filter(event => event.event_type === 'click').length
            return <button key={email.id} onClick={() => setSelectedEmail(email)} className="grid w-full gap-2 border-b border-ink-border px-5 py-4 text-left last:border-0 hover:bg-blue-50/40 md:grid-cols-[1fr_1.4fr_110px_100px] md:items-center md:gap-4"><span className="truncate text-sm">{email.recipients.join(', ')}</span><span className="truncate text-sm font-semibold">{email.subject}</span><span className="flex gap-2 text-xs"><span className="rounded-full bg-blue-50 px-2 py-1 text-primary">{opens} open{opens === 1 ? '' : 's'}</span><span className="rounded-full bg-lime-50 px-2 py-1 text-lime-700">{clicks} click{clicks === 1 ? '' : 's'}</span></span><span className="text-xs text-muted">{new Date(email.sent_at).toLocaleDateString()}</span></button>
          })}</div>{history.length > 5 && <div className="mt-4 flex items-center justify-between"><p className="text-xs text-muted">Page {historyPage} of {Math.ceil(history.length / 5)}</p><div className="flex gap-2"><button onClick={() => setHistoryPage(page => Math.max(1, page - 1))} disabled={historyPage === 1} className="rounded-full border border-ink-border bg-white px-4 py-2 text-xs font-semibold hover:border-primary disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button onClick={() => setHistoryPage(page => Math.min(Math.ceil(history.length / 5), page + 1))} disabled={historyPage === Math.ceil(history.length / 5)} className="rounded-full border border-ink-border bg-white px-4 py-2 text-xs font-semibold hover:border-primary disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div>}</>}
        </section>
      </div>

      {selectedEmail && <div className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-sm" onClick={() => setSelectedEmail(null)}><aside className="h-full w-full max-w-2xl overflow-y-auto border-l border-ink-border bg-bg p-7 md:p-10" onClick={event => event.stopPropagation()}><div className="flex items-start justify-between"><div><span className={labelClass}>Email details</span><h2 className="mt-2 font-display text-2xl font-bold">{selectedEmail.subject}</h2></div><button onClick={() => setSelectedEmail(null)} className="rounded-full border border-ink-border bg-white px-4 py-2 text-xs">Close</button></div><dl className="mt-8 grid gap-4 rounded-2xl border border-ink-border bg-white p-5 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted">To</dt><dd className="mt-1">{selectedEmail.recipients.join(', ')}</dd></div><div><dt className="text-xs text-muted">Sent</dt><dd className="mt-1">{new Date(selectedEmail.sent_at).toLocaleString()}</dd></div><div><dt className="text-xs text-muted">Status</dt><dd className="mt-1 capitalize">{selectedEmail.status}</dd></div><div><dt className="text-xs text-muted">Activity</dt><dd className="mt-1">{selectedEmail.events.filter(e => e.event_type === 'open').length} opens · {selectedEmail.events.filter(e => e.event_type === 'click').length} clicks</dd></div></dl><div className="mt-7"><p className={labelClass}>Email sent</p><div className="mt-3 rounded-2xl border border-ink-border bg-white p-6 leading-7" dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }} /></div><div className="mt-7"><p className={labelClass}>Activity timeline</p><div className="mt-3 overflow-hidden rounded-2xl border border-ink-border bg-white">{selectedEmail.events.length ? selectedEmail.events.map(event => <div key={event.id} className="flex items-start justify-between gap-5 border-b border-ink-border p-4 last:border-0"><div><p className="text-sm font-semibold capitalize">{event.event_type}</p>{event.url && <p className="mt-1 break-all text-xs text-primary">{event.url}</p>}</div><time className="shrink-0 text-xs text-muted">{new Date(event.occurred_at).toLocaleString()}</time></div>) : <p className="p-5 text-sm text-muted">No opens or clicks recorded yet.</p>}</div></div></aside></div>}
    </main></>
  )
}
