import type { Metadata } from 'next'
import RecruiterView from '@/components/recruiter/RecruiterView'

export const metadata: Metadata = {
  title: 'Recruiter view',
  description: 'Ngozi Peace Okafor at a glance: product marketer, technical writer and founder. Experience, skills, CV and contact in one page.',
  alternates: { canonical: '/recruiter' },
  openGraph: { title: 'Ngozi Peace Okafor · Recruiter view', description: 'Experience, skills, CV and contact in one page.', url: '/recruiter', images: ['/opengraph-image'] },
}

export default function Page() {
  return <RecruiterView />
}
