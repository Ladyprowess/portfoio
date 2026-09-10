import Nav from '@/components/Nav'
import Services from '@/components/Services'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'

export const metadata = { title: 'Services | Lady Prowess', description: 'Product marketing, technical writing, WordPress design, Web3 education, business strategy, and AI-enabled creative work.' }

export default function ServicesPage() {
  return <main><Nav /><div className="pt-20"><Services /></div><CTABanner /><Footer /></main>
}
