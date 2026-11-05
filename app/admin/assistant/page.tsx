import type { Metadata } from 'next'
import AssistantWorkspace from '@/components/email/AssistantWorkspace'

export const metadata: Metadata = {
  title: 'AI Email Assistant',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AssistantWorkspace />
}
