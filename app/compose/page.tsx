'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

// Private compose page. Public URL, but the form is gated by a password that is
// checked on the server (COMPOSE_PASSWORD). Sends from hello@ladyprowess.com via Resend.

const MAX_TOTAL_BYTES = 8 * 1024 * 1024 // keep total attachments under ~8MB

type PendingFile = {
  filename: string
  content: string // base64
  size: number
}

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

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
            if (password.trim()) setUnlocked(true)
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
    <main className="min-h-screen bg-bg px-6 py-16 text-parchment md:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="font-head text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
              New message
            </span>
            <h1 className="mt-2 font-display text-[2.8rem] font-extrabold leading-none">Compose</h1>
          </div>
          <Link
            href="/"
            className="font-head text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
          >
            Close
          </Link>
        </div>

        <form onSubmit={handleSend} className="space-y-5 border border-ink-border bg-surface p-6 md:p-8">
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
      </div>
    </main>
  )
}
