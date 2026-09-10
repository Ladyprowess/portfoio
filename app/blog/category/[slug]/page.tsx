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

type CategoryPageProps = { params: { slug: string } }

async function archivePosts(): Promise<BlogArchivePost[]> {
  const cmsPosts = await getPublishedPosts()
  return [
    ...cmsPosts.map(post => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, date: post.published_at ? new Date(post.published_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '', readTime: readTime(post.content_html), accent: '#2563EB', cover: post.cover_image })),
    ...blogPosts.map(post => ({ ...post, cover: null as string | null })),
  ]
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const posts = await archivePosts()
  const categories = Array.from(new Set(posts.map(post => post.category)))
  const category = categoryFromSlug(categories, params.slug)
  return category
    ? { title: `${category} Articles`, description: `Read ${category} articles by Lady Prowess.`, alternates: { canonical: `/blog/category/${params.slug}` }, openGraph: { title: `${category} Articles | Lady Prowess`, description: `Read ${category} articles by Lady Prowess.`, url: `/blog/category/${params.slug}`, images: [{ url: '/blog/opengraph-image', width: 1200, height: 630, alt: 'Lady Prowess Blog' }] } }
    : { title: 'Blog Category', robots: { index: false, follow: true } }
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const posts = await archivePosts()
  const categories = Array.from(new Set(posts.map(post => post.category))).sort()
  const category = categoryFromSlug(categories, params.slug)
  if (!category) notFound()
  const categoryPosts = posts.filter(post => post.category === category)

  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-28 md:px-8 md:pt-36">
        <header className="mb-14 max-w-3xl md:mb-16">
          <Link href="/blog" className="font-head text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary">All blog posts</Link>
          <h1 className="mt-5 font-display text-[clamp(2rem,3vw,3rem)] font-extrabold leading-[1.08]">{category} articles</h1>
          <p className="mt-5 max-w-2xl text-[0.96rem] leading-7 text-muted">Articles, ideas, and practical notes about {category}.</p>
        </header>
        <BlogArchive posts={categoryPosts} categories={categories} activeCategory={category} />
        <div className="mt-16"><NewsletterSignup availableTopics={categories} /></div>
      </div>
      <Footer />
    </main>
  )
}
