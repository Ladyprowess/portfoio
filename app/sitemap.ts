import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import { getPublishedPosts } from '@/lib/blog-cms'
import { categorySlug } from '@/lib/blog-categories'
import { ventures } from '@/lib/ventures'
import { SITE_URL } from '@/lib/site'

const base = SITE_URL

// Rebuilt at most hourly, so posts published from the admin appear without a redeploy.
export const revalidate = 3600

// How important each page is to search engines (0-1). Work and CV matter most after home.
const priority: Record<string, number> = { '': 1, '/work': 0.9, '/recruiter': 0.9, '/blog': 0.8, '/services': 0.8, '/about': 0.8, '/docs': 0.8, '/support': 0.6, '/awards': 0.5, '/media': 0.5 }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cmsPosts = await getPublishedPosts()
  const posts = [...cmsPosts.map(post => ({ slug: post.slug, newsletterTopic: post.newsletter_topic, modified: post.updated_at || post.published_at })), ...blogPosts.map(post => ({ slug: post.slug, newsletterTopic: post.newsletterTopic, modified: null }))]
  const topics = Array.from(new Set(posts.map(post => post.newsletterTopic))).filter(topic => topic && topic !== 'All')
  const staticPages = ['', '/about', '/work', '/services', '/recruiter', '/docs', '/blog', '/awards', '/media', '/support']

  return [
    ...staticPages.map(path => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === '/blog' ? 'weekly' as const : 'monthly' as const, priority: priority[path] ?? 0.7 })),
    ...posts.map(post => ({ url: `${base}/blog/${post.slug}`, lastModified: post.modified ? new Date(post.modified) : new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...topics.map(topic => ({ url: `${base}/${categorySlug(topic)}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...ventures.map(venture => ({ url: `${base}/support/${venture.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
