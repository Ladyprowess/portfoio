'use client'

import { useCallback, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { intents, type FacetKey } from '@/lib/home-content'
import Welcome from './Welcome'
import HomeHero from './HomeHero'
import Crafts from './Crafts'
import Journey from './Journey'
import Ventures from './Ventures'
import Proof from './Proof'
import LatestWriting, { type LatestPost } from './LatestWriting'
import YourTurn from './YourTurn'

// The homepage. What a visitor says brought them here (in the hero) opens the
// matching craft and starts their message in the contact section.
export default function HomePage({ posts }: { posts: LatestPost[] }) {
  const [intent, setIntent] = useState<string | null>(null)
  const [facet, setFacet] = useState<FacetKey>('product')
  // Once the visitor picks a craft (by answer or by tab), the hero editor stops rotating.
  const [locked, setLocked] = useState(false)

  const chooseIntent = (key: string) => {
    setIntent(key)
    const f = intents.find(i => i.key === key)?.facet
    if (f) { setFacet(f); setLocked(true) }
  }

  // Stable, so the editor's rotation timer is not reset on every render.
  const pickFacet = useCallback((key: FacetKey, byVisitor: boolean) => {
    setFacet(key)
    if (byVisitor) setLocked(true)
  }, [])

  const explore = (f: FacetKey | null) => {
    if (f) setFacet(f)
    document.getElementById('crafts')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <>
    <Welcome />
    <main className="min-h-screen bg-bg text-parchment">
      <Nav />
      <HomeHero intent={intent} onIntent={chooseIntent} onExplore={explore} facet={facet} onFacet={pickFacet} locked={locked} />
      <Crafts open={facet} onOpen={setFacet} />
      <Journey />
      <Ventures />
      <Proof />
      <LatestWriting posts={posts} />
      <YourTurn intent={intent} />
      <Footer />
    </main>
  </>
}
