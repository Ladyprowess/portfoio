import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/lib/blog-posts'
import { getPublishedPost, readTime } from '@/lib/blog-cms'
import { OgCard, OG_SIZE, ogAccent, ogFonts, absoluteImage } from '@/lib/og/card'

export const runtime = 'nodejs'
export const alt = 'Lady Prowess article'
export const size = OG_SIZE
export const contentType = 'image/png'

const SITE_URL = 'https://ladyprowess.com'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug) || (await getPublishedPost(params.slug))
  const fonts = await ogFonts()

  const card = {
    category: post?.category || 'Article',
    title: post?.title || 'Lady Prowess Blog',
    excerpt: post?.excerpt || null,
    accent: ogAccent(post && 'accent' in post ? post.accent : null),
    meta:
      post && 'readTime' in post
        ? post.readTime
        : post && 'content_html' in post
          ? readTime(post.content_html)
          : null,
  }
  const cover =
    post && 'cover_image' in post ? absoluteImage(post.cover_image, SITE_URL) : null

  try {
    return new ImageResponse(<OgCard {...card} cover={cover} />, { ...size, fonts })
  } catch {
    // A cover image that will not load would otherwise take the whole card down,
    // so fall back to the text-only layout rather than serving nothing.
    return new ImageResponse(<OgCard {...card} cover={null} />, { ...size, fonts })
  }
}
