import type { Metadata } from 'next'
import PortfolioExperience from '@/components/PortfolioExperience'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <PortfolioExperience />
  )
}
