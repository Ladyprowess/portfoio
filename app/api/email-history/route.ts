import { NextResponse } from 'next/server'
import { db } from '@/lib/email-store'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }))
  if (!process.env.COMPOSE_PASSWORD || password !== process.env.COMPOSE_PASSWORD) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
  try {
    const [emails, events] = await Promise.all([
      db('sent_emails?select=*&order=sent_at.desc&limit=100'),
      db('email_events?select=*&source=eq.resend&order=occurred_at.desc'),
    ])
    return NextResponse.json({ emails: emails.map(email => ({ ...email, events: events.filter(event => event.email_id === email.id) })) })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not load email activity.' }, { status: 500 })
  }
}
