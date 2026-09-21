import { ArticleLanguageProvider, ArticleLanguageBody } from '@/components/ArticleLanguage'
import { hasIgboTranslation } from '@/lib/blog-translation'
import Link from 'next/link'
import { ArticleEngagementProvider, ArticleActions, ArticleComments } from '@/components/ArticleEngagement'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getBlogPost } from '@/lib/blog-posts'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { getPublishedPost, readTime } from '@/lib/blog-cms'
import NewsletterSignup from '@/components/NewsletterSignup'
import ArticleContent from '@/components/ArticleContent'
import ArticleOpening from '@/components/ArticleOpening'
import ReadingProgress from '@/components/ReadingProgress'
import ArticleSnap from '@/components/ArticleSnap'
import { DEFAULT_ACCENT } from '@/lib/accent'
import { SITE_URL } from '@/lib/site'
import { splitArticleHtml, staticSplitIndex } from '@/lib/article-split'

type BlogPostPageProps = {
  params: {
    slug: string
  }
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
    openGraph: { title: post.title, description: post.excerpt, url: `/blog/${post.slug}`, siteName: 'Lady Prowess', type: 'article', publishedTime: 'published_at' in post ? post.published_at || undefined : undefined, authors: ['Ngozi Peace Okafor'], section: post.category, images: [{ url: `/blog/${post.slug}/opengraph-image`, width: 1200, height: 630, alt: post.title, type: 'image/png' }] },
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
  if (post.slug !== params.slug) {
    permanentRedirect(`/blog/${post.slug}`)
  }
  const translation = 'content_html' in post && hasIgboTranslation(post) ? post : null
  const accent = 'accent' in post ? post.accent : DEFAULT_ACCENT
  const newsletterTopic = 'newsletter_topic' in post ? post.newsletter_topic : post.newsletterTopic
  const publishedDate = 'date' in post ? undefined : post.published_at || undefined
  const cmsArticleParts = 'content_html' in post ? splitArticleHtml(post.content_html) : null
  const staticArticleMiddle = 'body' in post ? staticSplitIndex(post.body) : 0
  const displayDate =
    'date' in post
      ? post.date
      : post.published_at
        ? new Date(post.published_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })
        : ''
  const displayReadTime = 'readTime' in post ? post.readTime : readTime(post.content_html)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedDate,
    dateModified: 'updated_at' in post ? post.updated_at || publishedDate : publishedDate,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
    author: { '@type': 'Person', name: 'Ngozi Peace Okafor', url: `${SITE_URL}/about` },
    publisher: { '@type': 'Person', name: 'Lady Prowess', url: SITE_URL },
  }

  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }} />
      <Nav />
      <ReadingProgress />
      <ArticleSnap />

      <ArticleLanguageProvider available={Boolean(translation)}>
      <ArticleEngagementProvider slug={post.slug} title={post.title}>
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <ArticleOpening
          title={post.title}
          titleIg={translation?.title_ig}
          excerptIg={translation?.excerpt_ig}
          date={displayDate}
          category={post.category}
          readTime={displayReadTime}
          excerpt={post.excerpt}
          accent={accent}
        />
      </div>

      <article className="mx-auto w-full min-w-0 max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
        <div id="article-body" className="scroll-mt-[5.25rem]">
        {'cover_image' in post && post.cover_image && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[2/1] md:rounded-3xl bg-surface-2"><Image src={post.cover_image} alt="" fill unoptimized sizes="(max-width: 1152px) 100vw, 1088px" className="object-cover" priority /></div>}

        <ArticleLanguageBody translation={translation?.body_ig}>
        {'content_html' in post ? <div className="reading mx-auto w-full min-w-0 max-w-3xl py-10 md:py-14">
          <ArticleContent html={cmsArticleParts?.[0] || post.content_html} />
          <div className="reading-reset my-12"><NewsletterSignup inline defaultTopics={[newsletterTopic]} /></div>
          {cmsArticleParts?.[1] && <ArticleContent html={cmsArticleParts[1]} />}
        </div> : <div className="reading mx-auto w-full min-w-0 max-w-3xl py-10 md:py-14">
          {post.body.map((block, index) => {
            const articleBlock = (() => {
            if (block.type === 'quote') {
              return (
                <blockquote
                  key={`${block.type}-${index}`}
                  className="my-10 border-l-2 border-primary pl-6 font-serif text-[1.3rem] font-normal italic leading-[1.5] text-parchment md:text-[1.5rem]"
                >
                  {block.text}
                </blockquote>
              )
            }

            if (block.type === 'divider') {
              return <hr key={`${block.type}-${index}`} />
            }

            return (
              <p key={`${block.type}-${index}`}>
                {block.text}
              </p>
            )
            })()

            return <div key={`${block.type}-${index}`}>
              {articleBlock}
              {index + 1 === staticArticleMiddle && <div className="reading-reset my-12"><NewsletterSignup inline defaultTopics={[newsletterTopic]} /></div>}
            </div>
          })}
        </div>}
        </ArticleLanguageBody>
        </div>

        <div className="mx-auto w-full max-w-3xl">
        <ArticleComments />
        <div className="mb-12"><NewsletterSignup compact availableTopics={[newsletterTopic]} defaultTopics={[newsletterTopic]} /></div>

        <footer className="pt-10 border-t border-ink-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <span className="text-sm text-muted">
            Written by Ngozi Peace Okafor
          </span>
          <Link
            href="/#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
          >
            Work With Me
          </Link>
        </footer>
        <Link href="/blog" className="mt-8 inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">← Explore more articles</Link>
        </div>
      </article>
      <ArticleActions />
      </ArticleEngagementProvider>
      </ArticleLanguageProvider>
      <Footer />
    </main>
  )
}
