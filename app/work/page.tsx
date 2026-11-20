import type { Metadata } from 'next'
import WorkView from '@/components/work/WorkView'

const description = 'Products, documentation, websites, courses and Python tools built and written by Ngozi Peace Unegbu.'

export const metadata: Metadata = {
  title: 'Work',
  description,
  alternates: { canonical: '/work' },
  openGraph: { title: 'Work | Lady Prowess', description, url: '/work', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'Work | Lady Prowess', description, images: ['/opengraph-image'] },
}

export default function Page() {
  return <WorkView />
}
