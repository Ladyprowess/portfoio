import { db } from './email-store'

export type CmsPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  newsletter_topic: string
  cover_image: string | null
  content_html: string
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalisePost(value: unknown): CmsPost | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const slug = text(row.slug).trim()
  const title = text(row.title).trim()
  if (!slug || !title) return null

  return {
    id: text(row.id),
    slug,
    title,
    excerpt: text(row.excerpt),
    category: text(row.category, 'Insights'),
    newsletter_topic: text(row.newsletter_topic, 'Web3'),
    cover_image: text(row.cover_image).trim() || null,
    content_html: text(row.content_html),
    status: row.status === 'draft' ? 'draft' : 'published',
    published_at: text(row.published_at).trim() || null,
    created_at: text(row.created_at),
    updated_at: text(row.updated_at),
  }
}

export async function getPublishedPosts(): Promise<CmsPost[]> {
  try {
    const rows = await db(`blog_posts?select=*&status=eq.published&published_at=lte.${encodeURIComponent(new Date().toISOString())}&order=published_at.desc`)
    return rows.map(normalisePost).filter((post): post is CmsPost => Boolean(post))
  } catch {
    return []
  }
}

export async function getPublishedPost(slug: string): Promise<CmsPost | null> {
  try {
    const posts = await db(`blog_posts?select=*&status=eq.published&published_at=lte.${encodeURIComponent(new Date().toISOString())}&slug=eq.${encodeURIComponent(slug)}&limit=1`)
    return normalisePost(posts[0])
  } catch {
    return null
  }
}

export function readTime(html: string) {
  const words = (html || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}
