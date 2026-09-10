import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import AboutHero from '@/components/AboutHero'
import AboutStory from '@/components/AboutStory'
import AboutCredentials from '@/components/AboutCredentials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Ngozi Peace Okafor, also known as Lady Prowess. Founder, product marketer, WordPress designer, writer, and educator.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About Lady Prowess', description: 'Meet Ngozi Peace Okafor, founder, product marketer, WordPress designer, writer, and educator.', url: '/about', images: ['/opengraph-image'] },
}

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <AboutHero />
      <AboutStory />
      <AboutCredentials />
      <Contact />
      <Footer />
    </main>
  )
}
