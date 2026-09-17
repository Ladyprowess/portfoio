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
        category="Digital Product & Content"
        title="Ideas made clear. Products made useful."
        excerpt="Product marketing, technical writing, Web3 education, and practical digital execution."
        meta="ladyprowess.com"
      />
    ),
    { ...size, fonts: await ogFonts() },
  )
}
