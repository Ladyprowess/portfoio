import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Lady Prowess Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 82px', background: '#F9F9FB', color: '#121212', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', color: '#2563EB', fontSize: 25, fontWeight: 700, letterSpacing: 5 }}>LADY PROWESS BLOG</div>
      <div style={{ display: 'flex', fontSize: 64, lineHeight: 1.08, fontWeight: 700, maxWidth: 1000 }}>Products, business, writing, AI, and Web3.</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #D9DEE8', paddingTop: 30, fontSize: 25 }}><span>By Ngozi Peace Okafor</span><span style={{ color: '#2563EB' }}>ladyprowess.com/blog</span></div>
    </div>, size,
  )
}
