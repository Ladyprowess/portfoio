import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Media from '@/components/Media'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Media photos and professional portraits for Ngozi Peace Okafor.',
  alternates: { canonical: '/media' },
  openGraph: { title: 'Media | Lady Prowess', description: 'Media photos and professional portraits for Ngozi Peace Okafor.', url: '/media', images: ['/opengraph-image'] },
}

export default function MediaPage() {
  return (
    <main>
      <Nav />
      <div className="pt-16">
        <Media />
      </div>
      <Footer />
    </main>
  )
}
