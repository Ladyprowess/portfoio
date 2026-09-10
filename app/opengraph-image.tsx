import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Lady Prowess portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 82px', background: '#F9F9FB', color: '#121212', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', color: '#2563EB', fontSize: 25, fontWeight: 700, letterSpacing: 5 }}>LADY PROWESS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', fontSize: 66, lineHeight: 1.08, fontWeight: 700, maxWidth: 980 }}>Ideas made clear. Products made useful.</div>
        <div style={{ display: 'flex', color: '#6B7280', fontSize: 28 }}>Ngozi Peace Okafor</div>
      </div>
      <div style={{ display: 'flex', width: '100%', height: 8, background: '#2563EB' }} />
    </div>, size,
  )
}
