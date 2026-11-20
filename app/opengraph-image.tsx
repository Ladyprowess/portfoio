import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og/card'

export const runtime = 'nodejs'
export const alt = 'Lady Prowess portfolio'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        category="AI Strategy & Digital Products"
        title="I help businesses turn technology into practical solutions."
        excerpt="AI strategy, digital product development and technical writing."
        meta="ladyprowess.com"
      />
    ),
    { ...size, fonts: await ogFonts() },
  )
}
