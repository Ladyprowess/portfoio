import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import AboutHero from '@/components/AboutHero'
import AboutStory from '@/components/AboutStory'
import AboutCredentials from '@/components/AboutCredentials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About - Lady Prowess',
  description:
    'The story of Ngozi Peace Okafor (Lady Prowess): copywriter, technical writer, and founder. Career timeline, education, certifications, and areas of expertise.',
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
