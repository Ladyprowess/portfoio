import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogPosts, getBlogPost } from '@/lib/blog-posts'

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found - Lady Prowess',
    }
  }

  return {
    title: `${post.title} - Lady Prowess`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen px-8 md:px-20 py-16 md:py-24">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="font-head text-[0.65rem] font-bold tracking-[0.14em] uppercase text-muted hover:text-primary transition-colors"
        >
          &lt;- All Posts
        </Link>

        <header className="mt-16 pb-12 border-b border-ink-border">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="font-head text-[0.58rem] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
              style={{ color: post.accent, background: `${post.accent}14` }}
            >
              {post.category}
            </span>
            <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-muted">
              {post.date}
            </span>
            <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-muted">
              {post.readTime}
            </span>
          </div>

          <h1
            className="font-display font-light leading-[1.05] text-parchment"
            style={{ fontSize: 'clamp(2.7rem, 6vw, 5.6rem)' }}
          >
            {post.title}
          </h1>
          <p className="text-[1.08rem] text-muted leading-[1.9] mt-8">{post.excerpt}</p>
        </header>

        <div className="py-12 space-y-7">
          {post.body.map((paragraph) => (
            <p key={paragraph} className="text-[1.05rem] md:text-[1.12rem] text-parchment/84 leading-[2]">
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="pt-10 border-t border-ink-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <span className="font-head text-[0.65rem] font-bold tracking-[0.14em] uppercase text-muted">
            Written by Ngozi Peace Okafor
          </span>
          <Link
            href="/#contact"
            className="font-head text-[0.67rem] font-bold tracking-[0.14em] uppercase text-bg bg-primary px-5 py-3 hover:bg-primary/85 transition-colors duration-200 text-center"
          >
            Work With Me
          </Link>
        </footer>
      </article>
    </main>
  )
}
