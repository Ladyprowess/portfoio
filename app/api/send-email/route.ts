import { NextResponse } from 'next/server'
import { Resend } from 'resend'

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

// Branded signature footer appended to every email, using the brand background.
const SIGNATURE_HTML = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;border-radius:10px;background-color:#08090b;">
  <tr>
    <td style="padding:26px 28px;font-family:Arial,Helvetica,sans-serif;">
      <div style="font-size:18px;font-weight:bold;color:#f0ece3;line-height:1.2;">Ngozi Peace Okafor</div>
      <div style="font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#41d7c7;margin-top:6px;">Lady Prowess</div>
      <div style="font-size:13px;color:#a2a7b3;margin-top:14px;line-height:1.6;">
        <a href="mailto:hello@ladyprowess.com" style="color:#a2a7b3;text-decoration:none;">hello@ladyprowess.com</a>
        &nbsp;&middot;&nbsp;
        <a href="https://kivorapay.com" style="color:#a2a7b3;text-decoration:none;">kivorapay.com</a>
        &nbsp;&middot;&nbsp;
        <a href="https://ladyprowess.com" style="color:#a2a7b3;text-decoration:none;">ladyprowess.com</a>
      </div>
      <div style="font-size:13px;margin-top:16px;line-height:1.6;">
        ${SOCIALS.map(
          (s) =>
            `<a href="${s.url}" style="color:#41d7c7;text-decoration:none;font-weight:bold;">${s.label}</a>`,
        ).join('<span style="color:#272b35;">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>')}
      </div>
    </td>
  </tr>
</table>`

const SIGNATURE_TEXT = `

-
Ngozi Peace Okafor
Lady Prowess
hello@ladyprowess.com · kivorapay.com · ladyprowess.com
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
  const html = `${preheader}<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${safeHtml}</div>${SIGNATURE_HTML}`
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
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      ...(cc.length ? { cc } : {}),
      ...(bcc.length ? { bcc } : {}),
      replyTo: REPLY_TO,
      subject,
      text,
      html,
      ...(attachments.length ? { attachments } : {}),
    })

    if (error) {
      return NextResponse.json({ error: error.message || 'Resend rejected the email.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
