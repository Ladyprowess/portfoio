import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/email-store'
import { FROM, REPLY_TO, SIGNATURE_HTML, SIGNATURE_TEXT } from '@/lib/email-signature'

// This route sends real email from hello@ladyprowess.com via Resend.
// It is intentionally locked behind COMPOSE_PASSWORD so that, even though the
// site is public, only the owner can send mail.

export const runtime = 'nodejs'

type Attachment = {
  filename: string
  content: string // base64-encoded file contents (no data: prefix)
}

type Payload = {
  password?: string
  to?: string
  cc?: string
  bcc?: string
  subject?: string
  preview?: string
  bodyHtml?: string
  attachments?: Attachment[]
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Split a comma/semicolon/newline separated string into a clean address list.
function parseAddresses(value?: string): string[] {
  if (!value) return []
  return value
    .split(/[\n,;]+/)
    .map((a) => a.trim())
    .filter(Boolean)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The body is owner-authored rich text, but we still strip anything dangerous
// before it goes out as email: scripts, styles, inline event handlers, and
// javascript: URLs.
function sanitizeHtml(input: string): string {
  let html = input
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*"(\s*javascript:[^"]*)"/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*'(\s*javascript:[^']*)'/gi, "$1='#'")
  return html.trim()
}

// Plain-text fallback for email clients that don't render HTML.
function htmlToText(html: string): string {
  return html
    .replace(/<\s*(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const password = process.env.COMPOSE_PASSWORD

  if (!apiKey || !password) {
    return NextResponse.json(
      { error: 'Email is not configured on the server. Set RESEND_API_KEY and COMPOSE_PASSWORD.' },
      { status: 500 },
    )
  }

  let payload: Payload
  try {
    payload = (await req.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // --- Auth gate ---
  if (!payload.password || payload.password !== password) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
  }

  // --- Validate recipients ---
  const to = parseAddresses(payload.to)
  const cc = parseAddresses(payload.cc)
  const bcc = parseAddresses(payload.bcc)

  if (to.length === 0) {
    return NextResponse.json({ error: 'Add at least one recipient.' }, { status: 400 })
  }

  const invalid = [...to, ...cc, ...bcc].filter((a) => !EMAIL_RE.test(a))
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `These addresses look invalid: ${invalid.join(', ')}` },
      { status: 400 },
    )
  }

  const subject = (payload.subject ?? '').trim()
  const safeHtml = sanitizeHtml(payload.bodyHtml ?? '')
  const bodyText = htmlToText(safeHtml)
  if (!subject) {
    return NextResponse.json({ error: 'Add a subject.' }, { status: 400 })
  }
  if (!bodyText) {
    return NextResponse.json({ error: 'Write a message.' }, { status: 400 })
  }

  // Hidden preheader = the preview snippet shown in the inbox after the subject.
  // The trailing spacer characters stop the body text from leaking into it.
  const preview = (payload.preview ?? '').trim()
  const preheader = preview
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preview)}${'&#8204;&nbsp;'.repeat(60)}</div>`
    : ''

  // Wrap the formatted body, then append the branded signature footer.
  const baseHtml = `${preheader}<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${safeHtml}</div>${SIGNATURE_HTML}`
  const text = `${bodyText}${SIGNATURE_TEXT}`

  // --- Attachments ---
  const attachments = (payload.attachments ?? [])
    .filter((a) => a && a.filename && a.content)
    .map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, 'base64'),
    }))

  const resend = new Resend(apiKey)

  try {
    const records = await db('sent_emails', { method: 'POST', body: JSON.stringify({ recipients: to, cc, bcc, subject, preview, body_html: safeHtml }) })
    const emailId = String(records[0]?.id || '')
    if (!emailId) throw new Error('Could not create the email tracking record.')

    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      ...(cc.length ? { cc } : {}),
      ...(bcc.length ? { bcc } : {}),
      replyTo: REPLY_TO,
      subject,
      text,
      html: baseHtml,
      ...(attachments.length ? { attachments } : {}),
    })

    if (error) {
      await db(`sent_emails?id=eq.${emailId}`, { method: 'PATCH', body: JSON.stringify({ status: 'failed' }) }).catch(() => null)
      return NextResponse.json({ error: error.message || 'Resend rejected the email.' }, { status: 502 })
    }

    await db(`sent_emails?id=eq.${emailId}`, { method: 'PATCH', body: JSON.stringify({ status: 'sent', resend_id: data?.id }) })
    return NextResponse.json({ ok: true, id: data?.id, emailId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
