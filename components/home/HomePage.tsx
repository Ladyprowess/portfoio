'use client'

import { useCallback, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { intents, type EditorKey } from '@/lib/home-content'
import Welcome from './Welcome'
import HomeHero from './HomeHero'
import Doors from './Doors'
import LogoStrip from './LogoStrip'
import Testimonials from './Testimonials'
import { type LatestPost } from './LatestWriting'
import IntroVideo from './IntroVideo'

// The homepage has one job: say who Ngozi is and send each visitor to the
// right page. Hero, who she has worked with, three doors (CV, Work,
// Services) and what clients say. Contact lives on /services. The detail lives on those pages, shown once:
// skills and live demos on /services, projects on /work, her story on /about.
// (Crafts, Journey, Ventures and LatestWriting are kept in this folder but not
// shown here, so nothing repeats.)
export default function HomePage(_props: { posts: LatestPost[] }) {
  const [intent, setIntent] = useState<string | null>(null)
  const [facet, setFacet] = useState<EditorKey>('product')
  // Once the visitor picks a craft (by answer or by tab), the hero editor stops rotating.
  const [locked, setLocked] = useState(false)

  const chooseIntent = (key: string) => {
    setIntent(key)
    const f = intents.find(i => i.key === key)?.facet
    if (f) { setFacet(f); setLocked(true) }
  }

  // Stable, so the editor's rotation timer is not reset on every render.
  const pickFacet = useCallback((key: EditorKey, byVisitor: boolean) => {
    setFacet(key)
    if (byVisitor) setLocked(true)
  }, [])

  // "See my … work" in the hero opens that service, with its live demo.
  const explore = (f: EditorKey | null) => {
    window.location.href = `/services#${!f || f === 'support' ? 'writing' : f}`
  }

  return <>
    <Welcome />
    <main className="min-h-screen bg-bg text-parchment">
      <Nav />
      <HomeHero intent={intent} onIntent={chooseIntent} onExplore={explore} facet={facet} onFacet={pickFacet} locked={locked} />
      <LogoStrip />
      <div className="pt-16 md:pt-24"><Doors /></div>
      <section className="mx-auto max-w-[1320px] px-5 pb-20 md:px-8 md:pb-28"><Testimonials /></section>
      <Footer />
    </main>
    <IntroVideo />
  </>
}
