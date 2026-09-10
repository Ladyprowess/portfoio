import { db } from '@/lib/email-store'

const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64')

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  if (id) await db('email_events', { method: 'POST', body: JSON.stringify({ email_id: id, event_type: 'open', user_agent: request.headers.get('user-agent') }) }).catch(() => null)
  return new Response(pixel, { headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store, max-age=0' } })
}
