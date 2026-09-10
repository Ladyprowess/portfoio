import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogArchive from '@/components/BlogArchive'
import { getPublishedPosts, readTime } from '@/lib/blog-cms'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Personal essays and technical notes by Ngozi Peace Okafor on Web3, content strategy, and founder work.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Lady Prowess Blog', description: 'Ideas about products, business, writing, AI, and Web3 by Ngozi Peace Okafor.', url: '/blog', type: 'website', images: [{ url: '/blog/opengraph-image', width: 1200, height: 630, alt: 'Lady Prowess Blog' }] },
  twitter: { card: 'summary_large_image', title: 'Lady Prowess Blog', description: 'Ideas about products, business, writing, AI, and Web3 by Ngozi Peace Okafor.', images: ['/blog/opengraph-image'] },
}

export default async function BlogIndexPage() {
  const cmsPosts = await getPublishedPosts()
  const posts = [
    ...cmsPosts.map(post => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, newsletterTopic: post.newsletter_topic, date: post.published_at ? new Date(post.published_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '', readTime: readTime(post.content_html), accent: '#2563EB', cover: post.cover_image })),
    ...blogPosts.map(post => ({ ...post, cover: null as string | null })),
  ]
  const hasPosts = posts.length > 0
  const topics = Array.from(new Set(posts.map(post => post.newsletterTopic))).filter(topic => topic && topic !== 'All').sort()

  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-28 md:px-8 md:pt-36">

        <header className="mb-14 max-w-3xl md:mb-16">
          <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
            Lady Prowess Blog
          </span>
          <h1
            className="font-display font-extrabold leading-[1.02] max-w-5xl"
            style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}
          >
            Useful ideas about products, business, writing, and Web3.
          </h1>
        </header>

        {hasPosts ? <BlogArchive posts={posts} categories={topics} /> : (
          <div className="border border-ink-border bg-surface p-8 lg:p-10">
            <span className="font-head text-[0.58rem] font-bold tracking-[0.16em] uppercase text-muted">
              No essays published yet
            </span>
            <p className="font-display font-extrabold leading-[1.25] text-parchment/90 mt-6" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.7rem)' }}>
              Your first article will appear here when you add it.
            </p>
          </div>
        )}

        <div className="mt-16"><NewsletterSignup availableTopics={topics} /></div>
      </div>
      <Footer />
    </main>
  )
}
