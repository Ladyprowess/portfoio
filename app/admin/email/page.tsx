import type { Metadata } from 'next'
import { Suspense } from 'react'
import EmailWorkspace from '@/components/email/EmailWorkspace'

export const metadata: Metadata = { title: 'Email', robots: { index: false, follow: false } }

export default function Page() {
  return <Suspense><EmailWorkspace /></Suspense>
}
