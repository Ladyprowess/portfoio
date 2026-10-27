'use client'

import Nav from './Nav'
import Footer from './Footer'
import RewriteHero from './edit/RewriteHero'
import ClientStrip from './edit/ClientStrip'
import ProcessStory from './edit/ProcessStory'
import JargonTranslator from './edit/JargonTranslator'
import ImpactBand from './edit/ImpactBand'
import CraftBento from './edit/CraftBento'
import DraftToShipped from './edit/DraftToShipped'
import LatestWriting, { type LatestPost } from './edit/LatestWriting'
import FeedbackComments from './edit/FeedbackComments'
import LetterContact from './edit/LetterContact'

// The homepage, "The Edit": every section shows a draft becoming something clear.
export default function PortfolioExperience({ posts }: { posts: LatestPost[] }) {
  return <main className="min-h-screen bg-bg text-parchment">
    <Nav />
    <RewriteHero />
    <ClientStrip />
    <ProcessStory />
    <JargonTranslator />
    <ImpactBand />
    <CraftBento />
    <DraftToShipped />
    <LatestWriting posts={posts} />
    <FeedbackComments />
    <LetterContact />
    <Footer />
  </main>
}
