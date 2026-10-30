import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { db } from '@/lib/email-store'
import { addressFilter, advance, type LeadStatus } from '@/lib/outreach'

export const runtime = 'nodejs'

type ResendEvent = {
  type: string
  created_at: string
  data: {
    email_id?: string
    // Inbound (email.received): who sent it and what it says.
    from?: string | { email?: string; address?: string }
    subject?: string
    text?: string
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
  if (event.type === 'email.received') return recordReply(event, request.headers.get('svix-id') || '')
  if (event.type !== 'email.opened' && event.type !== 'email.clicked' && event.type !== 'email.bounced') return NextResponse.json({ ok: true })
  if (!event.data.email_id) return NextResponse.json({ ok: true })

  try {
    const resendId = encodeURIComponent(event.data.email_id)
    const eventType = event.type === 'email.opened' ? 'open' : event.type === 'email.clicked' ? 'click' : 'bounce'
    const occurredAt = event.data.click?.timestamp || event.created_at
    const url = event.data.click?.link || null
    const providerEventId = request.headers.get('svix-id') || ''
    const ignoreDuplicates = { Prefer: 'resolution=ignore-duplicates,return=representation' }

    const emails = await db(`sent_emails?select=id,lead_id&resend_id=eq.${resendId}&limit=1`)
    if (emails[0]?.id) {
      if (emails[0].lead_id) await updateLead(String(emails[0].lead_id), eventType, occurredAt)
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

    // Newsletter emails are matched through the queue's delivery rows (opens and clicks only).
    if (eventType === 'bounce') return NextResponse.json({ ok: true })
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

/** Moves an outreach lead forward when its email is opened, clicked or bounces. */
async function updateLead(leadId: string, eventType: 'open' | 'click' | 'bounce', at: string) {
  const rows = await db(`outreach_leads?select=status,opened_at,clicked_at,other_emails&id=eq.${encodeURIComponent(leadId)}`)
  const lead = rows[0] as { status: LeadStatus; opened_at: string | null; clicked_at: string | null; other_emails: string[] | null } | undefined
  if (!lead) return
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  // With several addresses, one bouncing doesn't end the sequence: the others may still work.
  if (eventType === 'bounce') { if (!lead.other_emails?.length) patch.status = advance(lead.status, 'bounced'); patch.bounced_at = at }
  if (eventType === 'open') { patch.status = advance(lead.status, 'opened'); patch.opened_at = lead.opened_at || at }
  if (eventType === 'click') { patch.status = advance(lead.status, 'clicked'); patch.clicked_at = lead.clicked_at || at; patch.opened_at = lead.opened_at || at }
  await db(`outreach_leads?id=eq.${encodeURIComponent(leadId)}`, { method: 'PATCH', body: JSON.stringify(patch) })
}

/** An inbound email to hello@ladyprowess.com: if the sender is a lead, they replied. */
async function recordReply(event: ResendEvent, providerEventId: string) {
  try {
    const raw = event.data.from
    const fromText = typeof raw === 'string' ? raw : raw?.email || raw?.address || ''
    const address = (fromText.match(/<([^>]+)>/)?.[1] || fromText).trim().toLowerCase()
    if (!address) return NextResponse.json({ ok: true })
    // Exact, case-insensitive match on any of the contact's addresses.
    const leads = await db(`outreach_leads?select=id,status&${addressFilter(address)}&limit=1`)
    const lead = leads[0] as { id: string; status: LeadStatus } | undefined
    if (!lead) return NextResponse.json({ ok: true })
    const at = event.created_at || new Date().toISOString()
    await db('outreach_replies?on_conflict=provider_event_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify({ lead_id: lead.id, from_email: address, subject: event.data.subject || null, snippet: (event.data.text || '').slice(0, 500) || null, provider_event_id: providerEventId || null, received_at: at }),
    })
    // A reply always counts, even after a bounce on an old address.
    if (lead.status !== 'replied' && lead.status !== 'stopped')
      await db(`outreach_leads?id=eq.${lead.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'replied', replied_at: at, updated_at: new Date().toISOString() }) })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Reply processing failed.' }, { status: 500 })
  }
}
