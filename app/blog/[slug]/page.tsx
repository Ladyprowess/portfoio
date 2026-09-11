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

const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

function splitArticleHtml(html: string): [string, string] {
  const tokens = html.match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[a-z][^>]*>|[^<]+/gi) || [html]
  const blocks: string[] = []
  let block = ''
  let depth = 0

  for (const token of tokens) {
    const closingTag = token.match(/^<\/([a-z0-9-]+)/i)
    const openingTag = token.match(/^<([a-z0-9-]+)/i)

    if (closingTag) {
      block += token
      depth = Math.max(0, depth - 1)
      if (depth === 0 && block.trim()) {
        blocks.push(block)
        block = ''
      }
      continue
    }

    if (openingTag) {
      block += token
      const tag = openingTag[1].toLowerCase()
      const selfClosing = /\/>$/.test(token) || voidElements.has(tag)
      if (!selfClosing) depth += 1
      else if (depth === 0 && block.trim()) {
        blocks.push(block)
        block = ''
      }
      continue
    }

    if (depth > 0) block += token
    else if (token.trim()) blocks.push(token)
    else if (blocks.length) blocks[blocks.length - 1] += token
  }

  if (block.trim()) blocks.push(block)
  if (blocks.length < 2) return [html, '']

  const lengths = blocks.map((item) => item.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim().length)
  const target = lengths.reduce((total, length) => total + length, 0) / 2
  let runningTotal = 0
  let splitIndex = 1
  let smallestDifference = Number.POSITIVE_INFINITY

  for (let index = 0; index < blocks.length - 1; index += 1) {
    runningTotal += lengths[index]
    const difference = Math.abs(target - runningTotal)
    if (difference < smallestDifference) {
      smallestDifference = difference
      splitIndex = index + 1
    }
  }

  return [blocks.slice(0, splitIndex).join(''), blocks.slice(splitIndex).join('')]
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug) || await getPublishedPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found | Lady Prowess',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, url: `/blog/${post.slug}`, siteName: 'Lady Prowess', type: 'article', publishedTime: 'published_at' in post ? post.published_at || undefined : undefined, authors: ['Ngozi Peace Okafor'], section: post.category, images: [{ url: `/blog/${post.slug}/opengraph-image`, width: 1200, height: 630, alt: post.title }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: [`/blog/${post.slug}/opengraph-image`] },
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
  const newsletterTopic = 'newsletter_topic' in post ? post.newsletter_topic : post.newsletterTopic
  const publishedDate = 'date' in post ? undefined : post.published_at || undefined
  const cmsArticleParts = 'content_html' in post ? splitArticleHtml(post.content_html) : null
  const staticArticleMiddle = 'body' in post ? Math.ceil(post.body.length / 2) : 0
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedDate,
    dateModified: 'updated_at' in post ? post.updated_at || publishedDate : publishedDate,
    mainEntityOfPage: `https://ladyprowess.com/blog/${post.slug}`,
    image: `https://ladyprowess.com/blog/${post.slug}/opengraph-image`,
    author: { '@type': 'Person', name: 'Ngozi Peace Okafor', url: 'https://ladyprowess.com/about' },
    publisher: { '@type': 'Person', name: 'Lady Prowess', url: 'https://ladyprowess.com' },
  }

  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }} />
      <Nav />
      <article className="mx-auto w-full min-w-0 max-w-4xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
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

        {'content_html' in post ? <div className="w-full min-w-0 max-w-3xl py-14">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: cmsArticleParts?.[0] || post.content_html }} />
          <div className="my-10"><NewsletterSignup inline defaultTopics={[newsletterTopic]} /></div>
          {cmsArticleParts?.[1] && <div className="blog-content" dangerouslySetInnerHTML={{ __html: cmsArticleParts[1] }} />}
        </div> : <div className="w-full min-w-0 max-w-3xl space-y-7 py-14">
          {post.body.map((block, index) => {
            const articleBlock = (() => {
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
            })()

            return <div key={`${block.type}-${index}`}>
              {articleBlock}
              {index + 1 === staticArticleMiddle && <div className="my-10"><NewsletterSignup inline defaultTopics={[newsletterTopic]} /></div>}
            </div>
          })}
        </div>}

        <div className="mb-12"><NewsletterSignup compact availableTopics={[newsletterTopic]} defaultTopics={[newsletterTopic]} /></div>

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
