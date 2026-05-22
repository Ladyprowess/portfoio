import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Work from '@/components/Work'
import Writing from '@/components/Writing'
import Blog from '@/components/Blog'
import CaseStudies from '@/components/CaseStudies'
import Awards from '@/components/Awards'
import Clients from '@/components/Clients'
import Media from '@/components/Media'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Services />
      <Work />
      <Writing />
      <Blog />
      <CaseStudies />
      <Awards />
      <Clients />
      <Media />
      <Contact />
      <Footer />
    </main>
  )
}
