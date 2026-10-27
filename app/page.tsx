import type { Metadata } from 'next'
import HomePage from '@/components/home/HomePage'
import { blogPosts } from '@/lib/blog-posts'
import { getPublishedPosts, readTime } from '@/lib/blog-cms'
import { welcomeBootstrapScript } from '@/lib/welcome'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// Refresh the latest articles hourly.
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
    <>
      {/* Hides the welcome screen before paint for visitors who have already seen it this session. */}
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: welcomeBootstrapScript }} />
      {/* Without JavaScript the welcome could never be dismissed, so it is not shown at all. */}
      <noscript><style>{'.welcome{display:none!important}body{overflow:auto!important}'}</style></noscript>
      <HomePage posts={latest} />
    </>
  )
}
