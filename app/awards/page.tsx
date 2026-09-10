import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Awards from '@/components/Awards'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Awards',
  description: 'Awards and recognition received by Ngozi Peace Okafor.',
  alternates: { canonical: '/awards' },
  openGraph: { title: 'Awards | Lady Prowess', description: 'Awards and recognition received by Ngozi Peace Okafor.', url: '/awards', images: ['/opengraph-image'] },
}

export default function AwardsPage() {
  return (
    <main>
      <Nav />
      <Awards />
      <Footer />
    </main>
  )
}
