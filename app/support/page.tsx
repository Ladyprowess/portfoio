import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Conversation, Credibility, Opportunity, Theatre, VentureStack } from '@/components/support/Hub'

import { SupportMotion } from '@/components/support/kit'
import { InvestorIntro, SupportImpact } from '@/components/support/InvestorIntro'

const description = 'Ngozi Peace Okafor builds businesses from problems she has lived: KivoraPay, Prowess Digital Solutions and Dritchwear. See the ventures, the track record and the KivoraPay seed round.'

export const metadata: Metadata = {
  title: 'Founder Portfolio and Investment',
  description,
  alternates: { canonical: '/support' },
  openGraph: { title: 'Founder Portfolio and Investment | Lady Prowess', description, url: '/support', images: ['/opengraph-image'] },
}

export default function SupportPage() {
  return (
    <SupportMotion><main className="venture-support min-h-screen overflow-x-clip bg-bg text-parchment">
      <Nav />
      <InvestorIntro />
      <Theatre />
      <VentureStack />
      <SupportImpact />
      <Opportunity />
      <Credibility />
      <Conversation />
      <section className="border-t border-ink-border bg-surface px-6 py-10 text-center sm:px-8 md:px-20"><p className="mx-auto max-w-2xl text-xs leading-6 text-muted">Information on this page is provided for general discussion. It is not investment advice or a public offer.</p></section>
      <Footer />
    </main></SupportMotion>
  )
}
