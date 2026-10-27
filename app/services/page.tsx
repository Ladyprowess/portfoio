import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WorkHero from '@/components/work/WorkHero'
import SectionBar from '@/components/work/SectionBar'
import Websites from '@/components/work/Websites'
import Writing from '@/components/work/Writing'
import Learning from '@/components/work/Learning'
import CaseStudyDocs from '@/components/work/CaseStudyDocs'
import YourTurn from '@/components/home/YourTurn'

export const metadata = { title: 'Work', description: 'Explore product communication, content strategy, technical writing, WordPress design, Web3 education, and practical digital work by Lady Prowess.', alternates: { canonical: '/services' }, openGraph: { title: 'Work | Lady Prowess', description: 'Explore product communication, writing, WordPress design, Web3 education, and digital strategy by Lady Prowess.', url: '/services', images: ['/opengraph-image'] } }

export default function ServicesPage() {
  return <main className="bg-bg text-parchment">
    <Nav />
    <WorkHero />
    <SectionBar />
    <Websites />
    <Writing />
    <Learning />
    <CaseStudyDocs />
    {/* Same closing conversation as the homepage */}
    <YourTurn intent={null} />
    <Footer />
  </main>
}
