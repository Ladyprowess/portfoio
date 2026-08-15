import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Impact from '@/components/Impact'
import About from '@/components/About'
import Services from '@/components/Services'
import Work from '@/components/Work'
import Writing from '@/components/Writing'
import CaseStudies from '@/components/CaseStudies'
import Clients from '@/components/Clients'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Impact />
      <About />
      <Services />
      <Work />
      <Writing />
      <CaseStudies />
      <Clients />
      <Contact />
      <Footer />
    </main>
  )
}
