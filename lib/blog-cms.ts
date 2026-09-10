import { db } from './email-store'

export type CmsPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  cover_image: string | null
  content_html: string
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
}

export async function getPublishedPosts(): Promise<CmsPost[]> {
  try {
    return await db('blog_posts?select=*&status=eq.published&order=published_at.desc') as CmsPost[]
  } catch {
    return []
  }
}

export async function getPublishedPost(slug: string): Promise<CmsPost | null> {
  try {
    const posts = await db(`blog_posts?select=*&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`) as CmsPost[]
    return posts[0] || null
  } catch {
    return null
  }
}

export function readTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}
