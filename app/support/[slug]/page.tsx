import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VentureDetail from '@/components/VentureDetail'
import { getVenture, ventures } from '@/lib/ventures'

export function generateStaticParams() {
  return ventures.map(venture => ({ slug: venture.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const venture = getVenture(params.slug)
  return venture ? { title: `${venture.name} | Venture Support`, description: venture.summary } : {}
}

export default function VenturePage({ params }: { params: { slug: string } }) {
  const venture = getVenture(params.slug)
  if (!venture) notFound()
  return <VentureDetail venture={venture} />
}
