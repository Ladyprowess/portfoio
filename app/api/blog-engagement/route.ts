import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'
import { db, dbCount } from '@/lib/email-store'
import { getBlogPost } from '@/lib/blog-posts'
import { getPublishedPost } from '@/lib/blog-cms'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const validSlug = (s: unknown): s is string => typeof s === 'string' && /^[a-z0-9-]{1,200}$/.test(s)
async function exists(slug: string) { return getBlogPost(slug) || await getPublishedPost(slug) }
const fail = (error: string, status: number) => NextResponse.json({ error }, { status })

export async function GET(request: Request) {
 const params = new URL(request.url).searchParams
 const slug = params.get('slug')
 const visitor = params.get('visitor') || ''
 if (!validSlug(slug)) return fail('Invalid article.', 400)
 try {
  if (!await exists(slug)) return fail('Article not found.', 404)
  const filter = `post_slug=eq.${encodeURIComponent(slug)}`
  const offset = Math.max(0, Math.min(100000, Number(params.get('offset')) || 0))
  const [comments, commentCount, likes, own] = await Promise.all([
   db(`blog_comments?select=id,name,body,created_at&${filter}&status=eq.approved&order=created_at.desc,id.desc&limit=20&offset=${Math.floor(offset)}`),
   dbCount(`blog_comments?${filter}&status=eq.approved`),
   dbCount(`blog_likes?${filter}`),
   uuid.test(visitor) ? db(`blog_likes?select=visitor_id&${filter}&visitor_id=eq.${visitor}&limit=1`) : Promise.resolve([]),
  ])
  return NextResponse.json({ comments, commentCount, likes, liked: own.length > 0 }, { headers: { 'Cache-Control': 'no-store' } })
 } catch { return fail('Comments and likes are temporarily unavailable. Please try again.', 503) }
}

export async function POST(request: Request) {
 const origin = request.headers.get('origin')
 if (origin && origin !== new URL(request.url).origin) return fail('Invalid request origin.', 403)
 const raw = await request.text()
 if (raw.length > 16000) return fail('Your comment is too long.', 413)
 let p
 try { p = JSON.parse(raw) } catch { return fail('Invalid request.', 400) }
 if (!p || !validSlug(p.slug) || !uuid.test(p.visitor || '') || !['comment','like'].includes(p.action)) return fail('Invalid request.', 400)
 if (p.action === 'like' && typeof p.liked !== 'boolean') return fail('Invalid like.', 400)
 if (p.action === 'comment' && ((p.anonymous !== true && (typeof p.name !== 'string' || !p.name.trim() || p.name.trim().length > 80)) || typeof p.body !== 'string' || p.body.trim().length < 3 || p.body.trim().length > 3000)) return fail('Enter your name and a comment between 3 and 3,000 characters.', 400)
 if (p.website) return fail('Could not submit this comment.', 400)
 try {
  if (!await exists(p.slug)) return fail('Article not found.', 404)
  // Vercel overwrites this header. Do not trust arbitrary forwarded IP headers.
  const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'unknown' : 'local'
  const key = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!).update(`${p.action}:${ip}`).digest('hex')
  const allowed = await db('rpc/blog_rate_limit', { method: 'POST', body: JSON.stringify({ p_key: key, p_limit: p.action === 'comment' ? 5 : 60, p_seconds: 600 }) }) as unknown as boolean
  if (!allowed) return fail('Too many attempts. Please try again in 10 minutes.', 429)
  if (p.action === 'comment') {
   await db('blog_comments', { method: 'POST', body: JSON.stringify({ post_slug: p.slug, name: p.anonymous === true ? 'Anonymous' : p.name.trim(), body: p.body.trim(), status: 'pending' }) })
   return NextResponse.json({ ok: true }, { status: 201 })
  }
  const filter = `post_slug=eq.${encodeURIComponent(p.slug)}`
  if (p.liked) await db('blog_likes?on_conflict=post_slug,visitor_id', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({ post_slug: p.slug, visitor_id: p.visitor }) })
  else await db(`blog_likes?${filter}&visitor_id=eq.${p.visitor}`, { method: 'DELETE' })
  return NextResponse.json({ liked: p.liked, likes: await dbCount(`blog_likes?${filter}`) })
 } catch { return fail('Could not save your response. Please try again.', 503) }
}
