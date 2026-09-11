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
    const resendId = encodeURIComponent(event.data.email_id)
    const eventType = event.type === 'email.opened' ? 'open' : 'click'
    const occurredAt = event.data.click?.timestamp || event.created_at
    const url = event.data.click?.link || null
    const providerEventId = request.headers.get('svix-id') || ''
    const ignoreDuplicates = { Prefer: 'resolution=ignore-duplicates,return=representation' }

    const emails = await db(`sent_emails?select=id&resend_id=eq.${resendId}&limit=1`)
    if (emails[0]?.id) {
      await db('email_events?on_conflict=provider_event_id', {
        method: 'POST',
        headers: ignoreDuplicates,
        body: JSON.stringify({
          email_id: emails[0].id,
          event_type: eventType,
          url,
          user_agent: event.data.click?.userAgent || null,
          occurred_at: occurredAt,
          source: 'resend',
          provider_event_id: providerEventId,
        }),
      })
      return NextResponse.json({ ok: true })
    }

    // Newsletter emails are matched through the queue's delivery rows.
    const deliveries = await db(`newsletter_deliveries?select=id,campaign_id&resend_id=eq.${resendId}&limit=1`)
    const delivery = deliveries[0]
    if (delivery)
      await db('newsletter_events?on_conflict=provider_event_id', {
        method: 'POST',
        headers: ignoreDuplicates,
        body: JSON.stringify({
          delivery_id: delivery.id,
          campaign_id: delivery.campaign_id,
          event_type: eventType,
          url,
          occurred_at: occurredAt,
          provider_event_id: providerEventId,
        }),
      })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook processing failed.' }, { status: 500 })
  }
}
