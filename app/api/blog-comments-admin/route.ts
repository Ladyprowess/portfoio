import { NextResponse } from 'next/server'
import { db } from '@/lib/email-store'
export const runtime = 'nodejs'
export async function POST(request: Request) {
 const p = await request.json().catch(() => null)
 if (!p || !process.env.COMPOSE_PASSWORD || p.password !== process.env.COMPOSE_PASSWORD) return NextResponse.json({ error: 'Please sign in from the admin dashboard.' }, { status: 401 })
 try {
  if (p.action === 'list') {
   const status = ['pending','approved','rejected'].includes(p.status) ? p.status : 'pending'
   const offset = Math.max(0, Math.floor(Number(p.offset) || 0))
   return NextResponse.json({ comments: await db(`blog_comments?select=id,post_slug,name,body,status,created_at&status=eq.${status}&order=created_at.desc,id.desc&limit=21&offset=${offset}`) })
  }
  if (!/^[0-9a-f-]{36}$/i.test(p.id || '') || !['approved','rejected','delete'].includes(p.action)) return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
  await db(`blog_comments?id=eq.${p.id}`, { method: p.action === 'delete' ? 'DELETE' : 'PATCH', ...(p.action !== 'delete' ? { body: JSON.stringify({ status: p.action }) } : {}) })
  return NextResponse.json({ ok: true })
 } catch { return NextResponse.json({ error: 'Comments are unavailable. Check that the engagement database migration has been applied.' }, { status: 503 }) }
}
