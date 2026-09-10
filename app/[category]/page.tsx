import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogArchive, { type BlogArchivePost } from '@/components/BlogArchive'
import NewsletterSignup from '@/components/NewsletterSignup'
import { blogPosts } from '@/lib/blog-posts'
import { getPublishedPosts, readTime } from '@/lib/blog-cms'
import { categoryFromSlug } from '@/lib/blog-categories'

type CategoryPageProps = { params: { category: string } }

async function archivePosts(): Promise<BlogArchivePost[]> {
  const cmsPosts = await getPublishedPosts()
  return [
    ...cmsPosts.map(post => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, newsletterTopic: post.newsletter_topic, date: post.published_at ? new Date(post.published_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '', publishedAt: post.published_at || post.created_at, readTime: readTime(post.content_html), accent: '#2563EB', cover: post.cover_image })),
    ...blogPosts.map(post => ({ ...post, publishedAt: new Date(post.date).toISOString(), cover: null as string | null })),
  ]
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const posts = await archivePosts()
  const topics = Array.from(new Set(posts.map(post => post.newsletterTopic))).filter(topic => topic && topic !== 'All')
  const topic = categoryFromSlug(topics, params.category)
  return topic
    ? { title: topic, description: `Read practical ${topic} guides, insights, and articles by Lady Prowess.`, keywords: [topic, `${topic} guides`, `${topic} articles`, `Lady Prowess ${topic}`], alternates: { canonical: `/${params.category}` }, openGraph: { title: `${topic} | Lady Prowess`, description: `Read practical ${topic} guides, insights, and articles by Lady Prowess.`, url: `/${params.category}`, type: 'website', images: [{ url: '/blog/opengraph-image', width: 1200, height: 630, alt: `${topic} by Lady Prowess` }] }, twitter: { card: 'summary_large_image', title: `${topic} | Lady Prowess`, description: `Read practical ${topic} guides, insights, and articles by Lady Prowess.`, images: ['/blog/opengraph-image'] } }
    : { title: 'Page Not Found', robots: { index: false, follow: false } }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const posts = await archivePosts()
  const topics = Array.from(new Set(posts.map(post => post.newsletterTopic))).filter(topic => topic && topic !== 'All').sort()
  const topic = categoryFromSlug(topics, params.category)
  if (!topic) notFound()
  const topicPosts = posts.filter(post => post.newsletterTopic === topic)

  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-28 md:px-8 md:pt-36">
        <header className="mb-14 max-w-3xl md:mb-16">
          <Link href="/blog" className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">All blog posts</Link>
          <h1 className="mt-5 font-display text-[clamp(2rem,3vw,3rem)] font-extrabold leading-[1.08]">{topic}</h1>
          <p className="mt-5 max-w-2xl text-[0.96rem] leading-7 text-muted">Practical guides, clear explanations, and useful ideas about {topic}.</p>
        </header>
        <BlogArchive posts={topicPosts} categories={topics} activeCategory={topic} showCategories={false} />
        <div className="mt-16"><NewsletterSignup availableTopics={[topic]} /></div>
      </div>
      <Footer />
    </main>
  )
}
