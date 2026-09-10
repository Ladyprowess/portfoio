import { NextResponse } from 'next/server'
import { db } from '@/lib/email-store'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const id = params.get('id')
  const destination = params.get('url')
  if (!destination || !/^https?:\/\//i.test(destination)) return NextResponse.redirect(new URL('/', request.url))
  if (id) await db('email_events', { method: 'POST', body: JSON.stringify({ email_id: id, event_type: 'click', url: destination, user_agent: request.headers.get('user-agent') }) }).catch(() => null)
  return NextResponse.redirect(destination)
}
