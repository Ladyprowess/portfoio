import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogArchive from '@/components/BlogArchive'
import { getPublishedPosts, readTime } from '@/lib/blog-cms'

export const metadata: Metadata = {
  title: 'Blog | Lady Prowess',
  description: 'Personal essays and technical notes by Ngozi Peace Okafor on Web3, content strategy, and founder work.',
}

export default async function BlogIndexPage() {
  const cmsPosts = await getPublishedPosts()
  const posts = [
    ...cmsPosts.map(post => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, date: post.published_at ? new Date(post.published_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '', readTime: readTime(post.content_html), accent: '#2563EB', cover: post.cover_image })),
    ...blogPosts.map(post => ({ ...post, cover: null as string | null })),
  ]
  const hasPosts = posts.length > 0

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

        {hasPosts ? <BlogArchive posts={posts} /> : (
          <div className="border border-ink-border bg-surface p-8 lg:p-10">
            <span className="font-head text-[0.58rem] font-bold tracking-[0.16em] uppercase text-muted">
              No essays published yet
            </span>
            <p className="font-display font-extrabold leading-[1.25] text-parchment/90 mt-6" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.7rem)' }}>
              Your first article will appear here when you add it.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
