import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og/card'

export const runtime = 'nodejs'
export const alt = 'Lady Prowess Blog'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        category="The Blog"
        title="Products, business, writing, AI, and Web3."
        excerpt="Practical writing on building digital products and explaining them well."
        meta="ladyprowess.com/blog"
      />
    ),
    { ...size, fonts: await ogFonts() },
  )
}
