import { NextResponse } from 'next/server'
import { db } from '@/lib/email-store'

export const runtime = 'nodejs'

function authorised(password?: string) {
  return Boolean(process.env.COMPOSE_PASSWORD && password === process.env.COMPOSE_PASSWORD)
}

function cleanHtml(input: string) {
  return input
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*"\s*javascript:[^"]*"/gi, '$1="#"')
    .trim()
}

function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  if (!authorised(payload.password)) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })

  try {
    if (payload.action === 'list') {
      const posts = await db('blog_posts?select=*&order=updated_at.desc')
      return NextResponse.json({ posts })
    }

    if (payload.action === 'delete') {
      if (!payload.id) return NextResponse.json({ error: 'Choose a post to delete.' }, { status: 400 })
      await db(`blog_posts?id=eq.${encodeURIComponent(payload.id)}`, { method: 'DELETE' })
      return NextResponse.json({ ok: true })
    }

    if (payload.action !== 'save') return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })

    const title = String(payload.title || '').trim()
    const excerpt = String(payload.excerpt || '').trim()
    const contentHtml = cleanHtml(String(payload.contentHtml || ''))
    const plainText = contentHtml.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim()
    if (!title || !excerpt || !plainText) return NextResponse.json({ error: 'Add a title, summary, and article content.' }, { status: 400 })

    const status = payload.status === 'published' ? 'published' : 'draft'
    const record = {
      title,
      slug: makeSlug(String(payload.slug || title)),
      excerpt,
      category: String(payload.category || 'Insights').trim(),
      cover_image: String(payload.coverImage || '').trim() || null,
      content_html: contentHtml,
      status,
      published_at: status === 'published' ? payload.publishedAt || new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    const posts = payload.id
      ? await db(`blog_posts?id=eq.${encodeURIComponent(payload.id)}`, { method: 'PATCH', body: JSON.stringify(record) })
      : await db('blog_posts', { method: 'POST', body: JSON.stringify(record) })
    return NextResponse.json({ post: posts[0] })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not update the blog.' }, { status: 500 })
  }
}
