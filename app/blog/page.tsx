import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Image from 'next/image'
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

        {hasPosts ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-3xl border border-ink-border bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(17,24,39,.08)]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full min-h-[24rem] flex-col"
                >
                  {post.cover && <div className="relative aspect-[16/9] overflow-hidden bg-surface-2"><Image src={post.cover} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" /></div>}
                  <div className="flex flex-1 flex-col p-7 lg:p-8"><div className="flex items-start justify-between gap-4 mb-8">
                    <span
                      className="font-head text-[0.56rem] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                      style={{ color: post.accent, background: `${post.accent}14` }}
                    >
                      {post.category}
                    </span>
                    <span className="font-head text-[0.58rem] font-bold tracking-[0.12em] uppercase text-muted">
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-head font-bold text-[1.4rem] leading-[1.25] text-parchment group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-[0.92rem] text-muted leading-[1.8] mt-5 flex-1">{post.excerpt}</p>

                  <div className="pt-8 mt-8 border-t border-ink-border flex items-center justify-between">
                    <span className="font-head text-[0.65rem] font-bold tracking-[0.12em] uppercase text-parchment/70">
                      {post.date}
                    </span>
                    <span
                      className="text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                      style={{ color: post.accent }}
                    >
                      Read
                    </span>
                  </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
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
