'use client'

import { useEffect, useState, type FormEvent } from 'react'
import AdminNav from '@/components/AdminNav'
import Icon from './Icon'

const PW_KEY = 'ladyprowess_admin_password'

type RecentEmail = {
  id: string
  recipients?: string[]
  subject: string
  status: string
  sent_at: string
  kind: string
}

function makeRequestId() {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `assistant-ui-${random}`
}

export default function AssistantWorkspace() {
  const [password, setPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [request, setRequest] = useState('')
  const [context, setContext] = useState('')
  const [tone, setTone] = useState('Natural and direct')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [requestId, setRequestId] = useState('')
  const [recent, setRecent] = useState<RecentEmail[]>([])
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function returnToLogin() {
    sessionStorage.removeItem(PW_KEY)
    window.location.replace(`/admin?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
  }

  async function loadRecent(savedPassword = password) {
    const response = await fetch('/api/assistant-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': savedPassword },
      body: JSON.stringify({ action: 'list_recent', limit: 20 }),
      cache: 'no-store',
    })
    const data = await response.json().catch(() => ({}))
    if (response.status === 401) { returnToLogin(); return }
    if (!response.ok) throw new Error(data.error || 'Could not load recent emails.')
    setRecent((data.emails || []).filter((email: RecentEmail) => email.kind === 'assistant'))
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY)
    if (!saved) { returnToLogin(); return }
    setPassword(saved)
    loadRecent(saved)
      .then(() => setReady(true))
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'Could not open the assistant.')
        setReady(true)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function edited() {
    setRequestId('')
    setNotice('')
  }

  async function generateDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    if (request.trim().length < 8) { setError('Add a little more detail about what the email should say.'); return }
    setGenerating(true)
    try {
      const response = await fetch('/api/assistant-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, request: request.trim(), context: context.trim(), tone }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) { returnToLogin(); return }
      if (!response.ok) throw new Error(data.error || 'Could not generate the draft.')
      setSubject(data.subject || '')
      setBody(data.body || '')
      setRequestId(makeRequestId())
      setNotice('Draft ready. Review and edit it before sending.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not generate the draft.')
    } finally {
      setGenerating(false)
    }
  }

  async function sendEmail() {
    setError('')
    setNotice('')
    const to = recipient.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) { setError('Enter one valid recipient email address.'); return }
    if (!subject.trim() || !body.trim()) { setError('Generate or write the subject and message first.'); return }
    const confirmed = window.confirm(`Send this email to ${to}?\n\nSubject: ${subject.trim()}`)
    if (!confirmed) return

    setSending(true)
    const stableRequestId = requestId || makeRequestId()
    setRequestId(stableRequestId)
    try {
      const response = await fetch('/api/assistant-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          action: 'send',
          requestId: stableRequestId,
          to,
          subject: subject.trim(),
          body: body.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) { returnToLogin(); return }
      if (data.delivery === 'unknown') throw new Error(data.error || 'The provider response was inconclusive. Check recent email history before trying again.')
      if (!response.ok && !data.ok) throw new Error(data.error || 'The email was not sent.')
      setNotice(data.duplicate ? 'This email request was already processed. Check the recent email list.' : data.delivery === 'accepted_by_resend' ? 'Resend accepted the email. The tracking update needs checking.' : 'Email sent and added to your portfolio email history.')
      setRequestId('')
      await loadRecent(password)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The email could not be sent. Check your email history before retrying.')
    } finally {
      setSending(false)
    }
  }

  if (!ready) return <main className="min-h-screen bg-bg"><AdminNav /><div className="mx-auto max-w-5xl px-5 py-12"><div className="h-28 animate-pulse rounded-3xl bg-surface-2" /></div></main>

  return (
    <main className="min-h-screen bg-bg pb-20 text-parchment">
      <AdminNav />
      <header className="border-b border-ink-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-7 md:px-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon name="mail" className="h-6 w-6" /></span>
          <div>
            <p className="font-head text-[10px] uppercase tracking-[.16em] text-primary">Private · Portfolio email</p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-[-.03em] md:text-3xl">AI Email Assistant</h1>
            <p className="mt-1 text-sm text-muted">Describe the email. Review the draft. Send it through your portfolio.</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <form onSubmit={generateDraft} className="rounded-3xl border border-ink-border bg-surface p-5 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div><p className="font-head text-[10px] uppercase tracking-[.14em] text-primary">Step 1</p><h2 className="mt-1 font-display text-xl font-semibold">What do you need to say?</h2></div>
              <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted">Draft only · Nothing sends automatically</span>
            </div>

            <label className="mt-6 block text-sm font-semibold" htmlFor="assistant-request">Your instructions</label>
            <textarea id="assistant-request" value={request} onChange={event => { setRequest(event.target.value); edited() }} rows={5} maxLength={5000} placeholder="For example: Write a follow-up to the hiring manager. I applied for the Technical Writer role last week. Ask whether they have had a chance to review my application, and keep it polite but straightforward." className="mt-2 w-full resize-y rounded-2xl border border-ink-border bg-bg px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted"><span>Include the purpose, important facts and what response you want.</span><span>{request.length}/5,000</span></div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
              <div><label className="block text-sm font-semibold" htmlFor="assistant-context">Extra context <span className="font-normal text-muted">(optional)</span></label><textarea id="assistant-context" value={context} onChange={event => { setContext(event.target.value); edited() }} rows={3} maxLength={5000} placeholder="Recipient's role, previous conversation, deadline, or details the draft should reflect." className="mt-2 w-full resize-y rounded-2xl border border-ink-border bg-bg px-4 py-3 text-sm leading-6 outline-none focus:border-primary" /></div>
              <div><label className="block text-sm font-semibold" htmlFor="assistant-tone">Tone</label><select id="assistant-tone" value={tone} onChange={event => { setTone(event.target.value); edited() }} className="mt-2 w-full rounded-xl border border-ink-border bg-bg px-3 py-3 text-sm outline-none focus:border-primary"><option>Natural and direct</option><option>Professional</option><option>Warm but concise</option><option>Formal</option><option>Persuasive</option><option>Friendly</option></select><p className="mt-2 text-xs leading-5 text-muted">The draft will avoid adding facts you did not provide.</p></div>
            </div>

            <button type="submit" disabled={generating} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-50"><Icon name="sparkle" className="h-4 w-4" />{generating ? 'Writing your draft…' : 'Generate email draft'}</button>
          </form>

          <section className="rounded-3xl border border-ink-border bg-surface p-5 md:p-7">
            <div><p className="font-head text-[10px] uppercase tracking-[.14em] text-primary">Step 2</p><h2 className="mt-1 font-display text-xl font-semibold">Review your email</h2><p className="mt-1 text-sm text-muted">You can edit both fields before anything is sent.</p></div>
            <div className="mt-6"><label htmlFor="assistant-to" className="block text-sm font-semibold">Send to</label><input id="assistant-to" type="email" value={recipient} onChange={event => { setRecipient(event.target.value); edited() }} placeholder="recipient@example.com" className="mt-2 w-full rounded-xl border border-ink-border bg-bg px-4 py-3 text-sm outline-none focus:border-primary" /></div>
            <div className="mt-4"><label htmlFor="assistant-subject" className="block text-sm font-semibold">Subject</label><input id="assistant-subject" value={subject} onChange={event => { setSubject(event.target.value); edited() }} maxLength={300} placeholder="Email subject" className="mt-2 w-full rounded-xl border border-ink-border bg-bg px-4 py-3 text-sm outline-none focus:border-primary" /></div>
            <div className="mt-4"><label htmlFor="assistant-body" className="block text-sm font-semibold">Message</label><textarea id="assistant-body" value={body} onChange={event => { setBody(event.target.value); edited() }} rows={12} maxLength={20000} placeholder="Your email draft will appear here. You can also write or paste a message." className="mt-2 w-full resize-y rounded-2xl border border-ink-border bg-bg px-4 py-3 text-sm leading-7 outline-none focus:border-primary" /><p className="mt-2 text-xs text-muted">Your portfolio&apos;s existing sender identity and signature are added when the email is sent.</p></div>
            <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={sendEmail} disabled={sending || !subject.trim() || !body.trim()} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-50"><Icon name="send" className="h-4 w-4" />{sending ? 'Sending…' : 'Review and send'}</button><button type="button" onClick={() => { setSubject(''); setBody(''); setRequestId(''); setNotice(''); setError('') }} className="rounded-full border border-ink-border px-5 py-3 text-sm font-semibold text-muted hover:border-primary hover:text-primary">Clear draft</button></div>
          </section>

          {error && <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600">{error}</div>}
          {notice && <div role="status" className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-parchment">{notice}</div>}
          <p className="px-1 text-xs leading-5 text-muted">Draft instructions are sent to OpenAI through your server-side API connection. The message is sent through Resend only after you press “Review and send” and confirm.</p>
        </section>

        <aside className="h-fit rounded-3xl border border-ink-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3"><div><p className="font-head text-[10px] uppercase tracking-[.14em] text-primary">Activity</p><h2 className="mt-1 font-display text-lg font-semibold">Recent assistant emails</h2></div><button type="button" onClick={() => loadRecent().catch(cause => setError(cause instanceof Error ? cause.message : 'Could not refresh history.'))} aria-label="Refresh recent emails" className="rounded-full border border-ink-border p-2 text-muted hover:border-primary hover:text-primary"><Icon name="refresh" className="h-4 w-4" /></button></div>
          {!recent.length ? <p className="mt-5 text-sm leading-6 text-muted">No assistant emails yet. Emails sent here will appear in this list.</p> : <ul className="mt-4 divide-y divide-ink-border">{recent.slice(0, 8).map(email => <li key={email.id} className="py-3"><p className="break-words text-sm font-semibold">{email.subject}</p><p className="mt-1 break-all text-xs text-muted">{email.recipients?.join(', ') || 'No recipient listed'}</p><div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted"><span>{new Date(email.sent_at).toLocaleString()}</span><span className={`rounded-full px-2 py-1 ${email.status === 'sent' ? 'bg-primary/10 text-primary' : 'bg-surface-2'}`}>{email.status}</span></div></li>)}</ul>}
          <a href="/admin/email" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Open full email workspace <Icon name="chevronRight" className="h-4 w-4" /></a>
        </aside>
      </div>
    </main>
  )
}
