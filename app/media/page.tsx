import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Media from '@/components/Media'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Media Kit and Press Photos',
  description: 'Official media kit, biography, and approved press photos for Ngozi Peace Okafor, a Digital Product and Content Specialist also known as Lady Prowess.',
  alternates: { canonical: '/media' },
  keywords: ['Ngozi Peace Okafor photos', 'Lady Prowess media kit', 'Lady Prowess press photos', 'Ngozi Peace Okafor speaker'],
  openGraph: { title: 'Media Kit and Press Photos | Lady Prowess', description: 'Official biography and approved photos of Ngozi Peace Okafor for interviews, articles, events, and speaker profiles.', url: '/media', type: 'profile', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'Media Kit and Press Photos | Lady Prowess', description: 'Approved media photos and professional information for Ngozi Peace Okafor.', images: ['/opengraph-image'] },
}

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfilePage', name: 'Lady Prowess Media Kit', description: 'Official biography and media resources for Ngozi Peace Okafor.', url: 'https://ladyprowess.com/media', mainEntity: { '@type': 'Person', name: 'Ngozi Peace Okafor', alternateName: 'Lady Prowess', url: 'https://ladyprowess.com/about', jobTitle: 'Digital Product and Content Specialist', knowsAbout: ['Technical writing', 'WordPress design', 'Web3', 'Fintech', 'Product communication', 'Content strategy', 'SEO'] } }).replace(/</g, '\\u003c') }} />
      <Media />
      <Footer />
    </main>
  )
}
