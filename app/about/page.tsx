import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import AboutHero from '@/components/AboutHero'
import AboutStory from '@/components/AboutStory'
import Doors from '@/components/home/Doors'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Ngozi Peace Unegbu, an AI Strategy and Digital Product Specialist and technical writer working across AI adoption, digital products, developer documentation, fintech and Web3.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About Lady Prowess', description: 'Meet Ngozi Peace Unegbu, an AI Strategy and Digital Product Specialist helping businesses turn technology into practical solutions.', url: '/about', images: ['/opengraph-image'] },
}

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <AboutHero />
      <AboutStory />
      {/* Same next steps as the homepage: CV, Work, Services. */}
      <div className="bg-bg pt-16 md:pt-24"><Doors /></div>
      <Footer />
    </main>
  )
}
