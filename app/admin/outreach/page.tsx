import type { Metadata } from 'next'
import OutreachDashboard from '@/components/outreach/OutreachDashboard'

export const metadata: Metadata = { title: 'Outreach', robots: { index: false, follow: false } }

export default function Page() {
  return <OutreachDashboard />
}
