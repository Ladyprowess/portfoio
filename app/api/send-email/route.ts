import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// This route sends real email from hello@ladyprowess.com via Resend.
// It is intentionally locked behind COMPOSE_PASSWORD so that, even though the
// site is public, only the owner can send mail.

export const runtime = 'nodejs'

const FROM = 'Lady Prowess <hello@ladyprowess.com>'
const REPLY_TO = 'hello@ladyprowess.com'

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
  body?: string
  attachments?: Attachment[]
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
  const body = (payload.body ?? '').trim()
  if (!subject) {
    return NextResponse.json({ error: 'Add a subject.' }, { status: 400 })
  }
  if (!body) {
    return NextResponse.json({ error: 'Write a message.' }, { status: 400 })
  }

  // Turn the plain-text body into simple HTML (preserve line breaks).
  const escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;white-space:pre-wrap;">${escaped}</div>`

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
      text: body,
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
