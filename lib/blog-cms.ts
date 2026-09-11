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

export function makeBlogSlug(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalisePost(value: unknown): CmsPost | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const title = text(row.title).trim()
  const storedSlug = makeBlogSlug(text(row.slug))
  const titleSlug = makeBlogSlug(title)
  const slug = storedSlug === titleSlug.replace(/-/g, '') ? titleSlug : storedSlug || titleSlug
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
    const directPost = normalisePost(posts[0])
    if (directPost) return directPost

    const requestedSlug = makeBlogSlug(slug)
    const rows = await db(`blog_posts?select=*&status=eq.published&published_at=lte.${encodeURIComponent(new Date().toISOString())}`)
    return rows.map(normalisePost).find((post): post is CmsPost => Boolean(post && post.slug === requestedSlug)) || null
  } catch {
    return null
  }
}

export function readTime(html: string) {
  const words = (html || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}
