import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/email-store'
import { SITE_URL } from "@/lib/site";

// This route sends real email from hello@ladyprowess.com via Resend.
// It is intentionally locked behind COMPOSE_PASSWORD so that, even though the
// site is public, only the owner can send mail.

export const runtime = 'nodejs'

const FROM = 'Lady Prowess <hello@ladyprowess.com>'
const REPLY_TO = 'hello@ladyprowess.com'

// Social links for the signature footer.
const SOCIALS: { label: string; url: string }[] = [
  { label: 'X', url: 'https://x.com/ladyprowess' },
  { label: 'Instagram', url: 'https://www.instagram.com/ladyprowess_' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/peace-ngozi-okafor' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@ladyprowess' },
  { label: 'Medium', url: 'https://ladyprowess.medium.com/' },
  { label: 'Substack', url: 'https://ladyprowess.substack.com' },
]

const TAGLINE = 'I help tech products get understood and trusted.'

// Branded signature footer appended to every email: logo, a blue rule, then name and links.
const SIGNATURE_HTML = `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;font-family:Arial,Helvetica,sans-serif;color:#22292A;font-size:14px;line-height:1.4;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;">
      <a href="${SITE_URL}" style="text-decoration:none;">
        <img src="${SITE_URL}/icon-blue.png" width="64" height="64" alt="Lady Prowess" style="display:block;border:0;border-radius:8px;">
      </a>
    </td>
    <td style="border-left:2px solid #2563EB;padding-left:16px;vertical-align:top;">
      <div style="font-size:16px;font-weight:bold;color:#131718;">Ngozi Peace Okafor</div>
      <div style="color:#2563EB;font-weight:bold;">Lady Prowess</div>
      <div style="color:#5B6466;font-style:italic;padding-bottom:8px;">${TAGLINE}</div>
      <div>
        <a href="mailto:hello@ladyprowess.com" style="color:#22292A;text-decoration:none;">hello@ladyprowess.com</a>
        <span style="color:#9CA3A3;">&nbsp;|&nbsp;</span>
        <a href="${SITE_URL}" style="color:#22292A;text-decoration:none;">ladyprowess.com</a>
      </div>
      <div style="padding-top:6px;font-size:13px;">
        ${SOCIALS.map(
          (s) => `<a href="${s.url}" style="color:#2563EB;text-decoration:none;">${s.label}</a>`,
        ).join('<span style="color:#9CA3A3;">&nbsp;&middot;&nbsp;</span>')}
      </div>
    </td>
  </tr>
</table>`

const SIGNATURE_TEXT = `

-
Ngozi Peace Okafor
Lady Prowess
${TAGLINE}
hello@ladyprowess.com · ladyprowess.com
${SOCIALS.map((s) => `${s.label}: ${s.url}`).join('\n')}`

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
