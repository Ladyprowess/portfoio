import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Awards from '@/components/Awards'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Awards - Lady Prowess',
  description: 'Awards and recognition received by Ngozi Peace Okafor.',
}

export default function AwardsPage() {
  return (
    <main>
      <Nav />
      <div className="pt-16">
        <Awards />
      </div>
      <Footer />
    </main>
  )
}
