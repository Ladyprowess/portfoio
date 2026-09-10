import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import { getPublishedPosts } from '@/lib/blog-cms'
import { categorySlug } from '@/lib/blog-categories'
import { ventures } from '@/lib/ventures'

const base = 'https://ladyprowess.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cmsPosts = await getPublishedPosts()
  const posts = [...cmsPosts.map(post => ({ slug: post.slug, newsletterTopic: post.newsletter_topic, modified: post.updated_at || post.published_at })), ...blogPosts.map(post => ({ slug: post.slug, newsletterTopic: post.newsletterTopic, modified: null }))]
  const topics = Array.from(new Set(posts.map(post => post.newsletterTopic))).filter(topic => topic && topic !== 'All')
  const staticPages = ['', '/about', '/services', '/blog', '/awards', '/media', '/support']

  return [
    ...staticPages.map(path => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === '/blog' ? 'weekly' as const : 'monthly' as const, priority: path === '' ? 1 : path === '/blog' ? 0.9 : 0.8 })),
    ...posts.map(post => ({ url: `${base}/blog/${post.slug}`, lastModified: post.modified ? new Date(post.modified) : new Date(), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...topics.map(topic => ({ url: `${base}/${categorySlug(topic)}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...ventures.map(venture => ({ url: `${base}/support/${venture.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
