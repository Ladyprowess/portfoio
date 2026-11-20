import type { Metadata } from 'next'
import RecruiterView from '@/components/recruiter/RecruiterView'

export const metadata: Metadata = {
  title: 'CV',
  description: 'CV of Ngozi Peace Unegbu: digital product and content specialist, technical writer and product builder.',
  alternates: { canonical: '/recruiter' },
  openGraph: { title: 'Ngozi Peace Unegbu · CV', description: 'Experience, skills, projects and contact in one page.', url: '/recruiter', images: ['/opengraph-image'] },
}

export default function Page() {
  return <RecruiterView />
}
