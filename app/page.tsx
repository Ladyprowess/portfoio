import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Credibility from '@/components/Credibility'
import About from '@/components/About'
import Work from '@/components/Work'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import Insights from '@/components/Insights'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Credibility />
      <About />
      <Work />
      <Services />
      <Testimonials />
      <Insights />
      <CTABanner />
      <Footer />
    </main>
  )
}
