import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { Resend } from 'resend'
import { db, dbCount } from '@/lib/email-store'
import { FROM, REPLY_TO, SIGNATURE_HTML, SIGNATURE_TEXT } from '@/lib/email-signature'
import { startOfDay, textToHtml } from '@/lib/outreach'

export const runtime = 'nodejs'
export const maxDuration = 30

type Payload = {
  action?: 'send' | 'resend' | 'list_recent' | 'get_email'
  requestId?: string
  to?: string
  emailId?: string
  subject?: string
  body?: string
  limit?: number
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_BODY_LENGTH = 20_000
const DEFAULT_DAILY_LIMIT = 20

function matchesSecret(expected: string | undefined, received: string, minimumLength = 1): boolean {
  if (!expected || expected.length < minimumLength || !received) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(received)
  return a.length === b.length && timingSafeEqual(a, b)
}

function isAuthorized(request: Request): boolean {
  // Keep bearer-key access for trusted server-to-server callers.
  // The private portfolio UI uses the existing admin password from its session.
  const apiKey = process.env.PORTFOLIO_ASSISTANT_API_KEY
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const adminPassword = process.env.COMPOSE_PASSWORD
  const adminHeader = request.headers.get('x-admin-password') ?? ''
  return matchesSecret(apiKey, bearer, 32) || matchesSecret(adminPassword, adminHeader)
}

function validRequestId(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 8 && value.length <= 128 && /^[a-zA-Z0-9._:-]+$/.test(value)
}

function sanitizeHtml(input: string): string {
  return input
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '$1="#"')
    .trim()
}

function htmlToText(html: string): string {
  return html
    .replace(/<\s*(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function findByRequestId(requestId: string) {
  const rows = await db(
    `sent_emails?select=id,resend_id,recipients,subject,status,sent_at,kind&assistant_request_id=eq.${encodeURIComponent(requestId)}&limit=1`,
  )
  return rows[0]
}

function duplicateResponse(existing: Record<string, unknown>) {
  if (existing.status === 'sent') {
    return NextResponse.json({ ok: true, duplicate: true, email: existing })
  }
  return NextResponse.json(
    {
      ok: false,
      duplicate: true,
      error: 'This request has already been started. Check email history before trying again.',
      status: existing.status,
      emailId: existing.id,
    },
    { status: 409 },
  )
}

async function sendEmail(args: {
  requestId: string
  to: string
  subject: string
  bodyHtml: string
}) {
  // The unique database index below is the final guard against simultaneous retries.
  const prior = await findByRequestId(args.requestId)
  if (prior) return { response: duplicateResponse(prior), done: true as const }

  let created: Record<string, unknown>
  try {
    const rows = await db('sent_emails', {
      method: 'POST',
      body: JSON.stringify({
        assistant_request_id: args.requestId,
        recipients: [args.to],
        cc: [],
        bcc: [],
        subject: args.subject,
        preview: '',
        body_html: args.bodyHtml,
        status: 'preparing',
        kind: 'assistant',
      }),
    })
    created = rows[0] as Record<string, unknown>
    if (!created?.id) throw new Error('Could not create the email history record.')
  } catch (error) {
    // A concurrent retry may have won the unique-index race. Return that record.
    const existing = await findByRequestId(args.requestId).catch(() => undefined)
    if (existing) return { response: duplicateResponse(existing), done: true as const }
    throw error
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    await db(`sent_emails?id=eq.${encodeURIComponent(String(created.id))}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'failed' }),
    }).catch(() => null)
    throw new Error('The email provider is not configured on the server.')
  }

  const safeHtml = sanitizeHtml(args.bodyHtml)
  const plainText = htmlToText(safeHtml)
  let providerResult: Awaited<ReturnType<Resend['emails']['send']>>
  try {
    providerResult = await new Resend(resendKey).emails.send({
      from: FROM,
      to: [args.to],
      replyTo: REPLY_TO,
      subject: args.subject,
      text: `${plainText}${SIGNATURE_TEXT}`,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${safeHtml}</div>${SIGNATURE_HTML}`,
    })
  } catch {
    // Provider/network failures can be ambiguous. Do not automatically retry and risk a duplicate.
    return {
      response: NextResponse.json(
        { ok: false, delivery: 'unknown', emailId: created.id, error: 'The provider response was inconclusive. Check email history before retrying.' },
        { status: 202 },
      ),
      done: true as const,
    }
  }

  if (providerResult.error) {
    await db(`sent_emails?id=eq.${encodeURIComponent(String(created.id))}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'failed' }),
    }).catch(() => null)
    return {
      response: NextResponse.json({ ok: false, error: providerResult.error.message || 'The email provider rejected the message.' }, { status: 502 }),
      done: true as const,
    }
  }

  try {
    const rows = await db(`sent_emails?id=eq.${encodeURIComponent(String(created.id))}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'sent', resend_id: providerResult.data?.id, sent_at: new Date().toISOString() }),
    })
    return {
      response: NextResponse.json({ ok: true, duplicate: false, email: rows[0] ?? { ...created, status: 'sent', resend_id: providerResult.data?.id } }),
      done: true as const,
    }
  } catch {
    // Resend accepted the email. Report that separately from the tracking write.
    return {
      response: NextResponse.json(
        { ok: true, delivery: 'accepted_by_resend', tracking: 'update_failed', emailId: created.id, resendId: providerResult.data?.id },
        { status: 202 },
      ),
      done: true as const,
    }
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let payload: Payload
  try {
    payload = await request.json() as Payload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 })
  }

  try {
    switch (payload.action) {
      case 'list_recent': {
        const limit = Math.min(20, Math.max(1, Number(payload.limit) || 10))
        const emails = await db(
          `sent_emails?select=id,recipients,subject,status,sent_at,kind&status=neq.logged&order=sent_at.desc&limit=${limit}`,
        )
        return NextResponse.json({ emails })
      }

      case 'get_email': {
        if (!payload.emailId) return NextResponse.json({ error: 'emailId is required.' }, { status: 400 })
        const email = (await db(
          `sent_emails?select=id,recipients,subject,preview,body_html,status,sent_at,kind&id=eq.${encodeURIComponent(payload.emailId)}&limit=1`,
        ))[0]
        if (!email) return NextResponse.json({ error: 'Email not found.' }, { status: 404 })
        const events = await db(
          `email_events?select=event_type,occurred_at,url&email_id=eq.${encodeURIComponent(payload.emailId)}&order=occurred_at.asc`,
        )
        return NextResponse.json({ email, events })
      }

      case 'send':
      case 'resend': {
        if (!validRequestId(payload.requestId)) {
          return NextResponse.json({ error: 'requestId must be a unique 8–128 character identifier.' }, { status: 400 })
        }

        const to = String(payload.to ?? '').trim().toLowerCase()
        if (!EMAIL_RE.test(to)) return NextResponse.json({ error: 'Provide one valid recipient email address.' }, { status: 400 })

        let subject = String(payload.subject ?? '').trim().slice(0, 300)
        let bodyHtml = ''

        if (payload.action === 'resend') {
          if (!payload.emailId) return NextResponse.json({ error: 'emailId is required.' }, { status: 400 })
          const original = (await db(
            `sent_emails?select=id,subject,body_html,status&id=eq.${encodeURIComponent(payload.emailId)}&limit=1`,
          ))[0]
          if (!original || original.status !== 'sent') {
            return NextResponse.json({ error: 'Only an email with sent status can be reused.' }, { status: 409 })
          }
          subject = subject || String(original.subject ?? '')
          bodyHtml = sanitizeHtml(String(original.body_html ?? ''))
        } else {
          const body = String(payload.body ?? '').trim()
          if (!body) return NextResponse.json({ error: 'Message body is required.' }, { status: 400 })
          if (body.length > MAX_BODY_LENGTH) return NextResponse.json({ error: 'Message is too long (20,000 character limit).' }, { status: 400 })
          bodyHtml = textToHtml(body)
        }

        if (!subject) return NextResponse.json({ error: 'Email subject is required.' }, { status: 400 })
        if (!htmlToText(bodyHtml)) return NextResponse.json({ error: 'Email body is empty.' }, { status: 400 })

        const existing = await findByRequestId(payload.requestId)
        if (existing) return duplicateResponse(existing)

        const dailyLimit = Math.min(100, Math.max(1, Number(process.env.PORTFOLIO_ASSISTANT_DAILY_LIMIT) || DEFAULT_DAILY_LIMIT))
        const dayStart = startOfDay(new Date())
        const sentToday = await dbCount(
          `sent_emails?kind=eq.assistant&status=eq.sent&sent_at=gte.${encodeURIComponent(dayStart.toISOString())}`,
        )
        if (sentToday >= dailyLimit) {
          return NextResponse.json({ error: `Daily assistant email limit (${dailyLimit}) reached.` }, { status: 429 })
        }

        const result = await sendEmail({ requestId: payload.requestId, to, subject, bodyHtml })
        return result.response
      }

      default:
        return NextResponse.json({ error: 'Supported actions: send, resend, list_recent, get_email.' }, { status: 400 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed.'
    // Do not return secrets or raw provider/database responses to API callers.
    return NextResponse.json(
      { error: message.startsWith('Database error:') ? 'Email storage is unavailable.' : message },
      { status: 500 },
    )
  }
}
