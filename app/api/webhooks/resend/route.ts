import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { db } from '@/lib/email-store'

export const runtime = 'nodejs'

type ResendEvent = {
  type: string
  created_at: string
  data: {
    email_id?: string
    click?: {
      link?: string
      timestamp?: string
      userAgent?: string
    }
  }
}

function verify(payload: string, request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  const id = request.headers.get('svix-id')
  const timestamp = request.headers.get('svix-timestamp')
  const signatures = request.headers.get('svix-signature')
  if (!secret || !id || !timestamp || !signatures) return false

  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(age) || age > 300) return false

  const key = Buffer.from(secret.startsWith('whsec_') ? secret.slice(6) : secret, 'base64')
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${payload}`).digest()
  return signatures.split(' ').some(signature => {
    const encoded = signature.startsWith('v1,') ? signature.slice(3) : signature
    try {
      const received = Buffer.from(encoded, 'base64')
      return received.length === expected.length && timingSafeEqual(received, expected)
    } catch {
      return false
    }
  })
}

export async function POST(request: Request) {
  const payload = await request.text()
  if (!verify(payload, request)) return new NextResponse('Invalid webhook', { status: 400 })

  const event = JSON.parse(payload) as ResendEvent
  if (event.type !== 'email.opened' && event.type !== 'email.clicked') return NextResponse.json({ ok: true })
  if (!event.data.email_id) return NextResponse.json({ ok: true })

  try {
    const eventId = request.headers.get('svix-id') || ''
    const emails = await db(`sent_emails?select=id&resend_id=eq.${encodeURIComponent(event.data.email_id)}&limit=1`)
    const emailId = emails[0]?.id
    if (!emailId) return NextResponse.json({ ok: true })

    await db('email_events?on_conflict=provider_event_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify({
        email_id: emailId,
        event_type: event.type === 'email.opened' ? 'open' : 'click',
        url: event.data.click?.link || null,
        user_agent: event.data.click?.userAgent || null,
        occurred_at: event.data.click?.timestamp || event.created_at,
        source: 'resend',
        provider_event_id: eventId,
      }),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook processing failed.' }, { status: 500 })
  }
}
