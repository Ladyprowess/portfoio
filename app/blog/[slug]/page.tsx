import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogPosts, getBlogPost } from '@/lib/blog-posts'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { getPublishedPost, readTime } from '@/lib/blog-cms'
import NewsletterSignup from '@/components/NewsletterSignup'

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug) || await getPublishedPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found | Lady Prowess',
    }
  }

  return {
    title: `${post.title} | Lady Prowess`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const staticPost = getBlogPost(params.slug)
  const cmsPost = staticPost ? null : await getPublishedPost(params.slug)
  const post = staticPost || cmsPost

  if (!post) {
    notFound()
  }
  const accent = 'accent' in post ? post.accent : '#2563EB'

  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <article className="mx-auto max-w-4xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
        <Link
          href="/blog"
          className="font-head text-[0.65rem] font-bold tracking-[0.14em] uppercase text-muted hover:text-primary transition-colors"
        >
          All posts
        </Link>

        <header className="mt-16 pb-12 border-b border-ink-border">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="font-head text-[0.58rem] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
              style={{ color: accent, background: `${accent}14` }}
            >
              {post.category}
            </span>
            <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-muted">
              {'date' in post ? post.date : post.published_at ? new Date(post.published_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            </span>
            <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-muted">
              {'readTime' in post ? post.readTime : readTime(post.content_html)}
            </span>
          </div>

          <h1
            className="font-display font-extrabold leading-[1.05] text-parchment"
            style={{ fontSize: 'clamp(1.9rem, 3vw, 2.8rem)' }}
          >
            {post.title}
          </h1>
          <p className="text-[1.08rem] text-muted leading-[1.9] mt-8 max-w-2xl">{post.excerpt}</p>
        </header>

        {'cover_image' in post && post.cover_image && <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-3xl bg-surface-2"><Image src={post.cover_image} alt="" fill unoptimized sizes="(max-width: 900px) 100vw, 900px" className="object-cover" priority /></div>}

        {'content_html' in post ? <div className="blog-content max-w-3xl py-14" dangerouslySetInnerHTML={{ __html: post.content_html }} /> : <div className="py-14 space-y-7 max-w-3xl">
          {post.body.map((block, index) => {
            if (block.type === 'quote') {
              return (
                <blockquote
                  key={`${block.type}-${index}`}
                  className="my-12 border-l border-primary pl-6 font-display text-[1.55rem] font-semibold leading-[1.4] text-parchment md:text-[2rem]"
                >
                  {block.text}
                </blockquote>
              )
            }

            if (block.type === 'divider') {
              return <div key={`${block.type}-${index}`} className="my-12 h-px w-full bg-ink-border" />
            }

            return (
              <p
                key={`${block.type}-${index}`}
                className="text-justify text-[1.05rem] leading-[2] text-parchment/84 md:text-[1.12rem]"
              >
                {block.text}
              </p>
            )
          })}
        </div>}

        <div className="mb-12"><NewsletterSignup compact /></div>

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
      <Footer />
    </main>
  )
}
