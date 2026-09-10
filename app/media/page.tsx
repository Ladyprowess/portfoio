import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Media from '@/components/Media'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Media Kit and Press Photos',
  description: 'Download approved press photos of Ngozi Peace Okafor, also known as Lady Prowess, for interviews, articles, events, and speaker profiles.',
  alternates: { canonical: '/media' },
  keywords: ['Ngozi Peace Okafor photos', 'Lady Prowess media kit', 'Lady Prowess press photos', 'Ngozi Peace Okafor speaker'],
  openGraph: { title: 'Media Kit and Press Photos | Lady Prowess', description: 'Download approved photos of Ngozi Peace Okafor for interviews, articles, events, and speaker profiles.', url: '/media', type: 'profile', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'Media Kit and Press Photos | Lady Prowess', description: 'Approved media photos and professional information for Ngozi Peace Okafor.', images: ['/opengraph-image'] },
}

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfilePage', name: 'Lady Prowess Media Kit', url: 'https://ladyprowess.com/media', mainEntity: { '@type': 'Person', name: 'Ngozi Peace Okafor', alternateName: 'Lady Prowess', url: 'https://ladyprowess.com/about', jobTitle: ['Product Marketer', 'Technical Writer', 'WordPress Designer', 'Web3 Educator'] } }).replace(/</g, '\\u003c') }} />
      <Media />
      <Footer />
    </main>
  )
}
