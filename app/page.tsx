import type { Metadata } from 'next'
import PortfolioExperience from '@/components/PortfolioExperience'
import { blogPosts } from '@/lib/blog-posts'
import { getPublishedPosts, readTime } from '@/lib/blog-cms'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// Refresh the "From the notebook" articles hourly.
export const revalidate = 3600

export default async function Home() {
  const cmsPosts = await getPublishedPosts()
  const latest = [
    ...cmsPosts.map(post => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, publishedAt: post.published_at || post.created_at, readTime: readTime(post.content_html), cover: post.cover_image || null })),
    ...blogPosts.map(post => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, publishedAt: new Date(post.date).toISOString(), readTime: post.readTime, cover: null })),
  ]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
    .map(({ publishedAt, ...post }) => ({ ...post, date: new Date(publishedAt).toLocaleDateString('en', { month: 'long', year: 'numeric' }) }))

  return (
    <PortfolioExperience posts={latest} />
  )
}
