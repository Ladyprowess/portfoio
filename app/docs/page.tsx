import type { Metadata } from 'next'
import DocsView from '@/components/docs/DocsView'

const description = 'Technical writing and documentation by Ngozi Peace Okafor: API references, developer guides and technical manuals, with live, interactive samples.'

export const metadata: Metadata = {
  title: 'Technical Writing and Documentation',
  description,
  alternates: { canonical: '/docs' },
  openGraph: { title: 'Technical Writing and Documentation | Lady Prowess', description, url: '/docs', images: ['/opengraph-image'] },
}

export default function Page() {
  return <DocsView />
}
