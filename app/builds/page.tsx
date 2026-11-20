import type { Metadata } from 'next'
import BuildsView from '@/components/builds/BuildsView'

const description = 'Applications, AI agent workflows, Python scripts and automations built by Ngozi Peace Unegbu with Claude Code and other AI tools.'

export const metadata: Metadata = {
  title: 'Builds',
  description,
  alternates: { canonical: '/builds' },
  openGraph: { title: 'Builds | Lady Prowess', description, url: '/builds', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'Builds | Lady Prowess', description, images: ['/opengraph-image'] },
}

export default function Page() {
  return <BuildsView />
}
