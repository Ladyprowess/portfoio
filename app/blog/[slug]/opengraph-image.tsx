import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/lib/blog-posts'
import { getPublishedPost } from '@/lib/blog-cms'

export const runtime = 'edge'
export const alt = 'Lady Prowess article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug) || await getPublishedPost(params.slug)
  const title = post?.title || 'Lady Prowess Blog'
  const category = post?.category || 'Article'
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 82px', background: '#F9F9FB', color: '#121212', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 700, letterSpacing: 4 }}><span style={{ color: '#2563EB' }}>LADY PROWESS</span><span style={{ color: '#6B7280' }}>{category.toUpperCase()}</span></div>
      <div style={{ display: 'flex', fontSize: title.length > 70 ? 48 : 60, lineHeight: 1.08, fontWeight: 700, maxWidth: 1040 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #D9DEE8', paddingTop: 28, fontSize: 24 }}><span>By Ngozi Peace Okafor</span><span style={{ color: '#2563EB' }}>ladyprowess.com</span></div>
    </div>, size,
  )
}
