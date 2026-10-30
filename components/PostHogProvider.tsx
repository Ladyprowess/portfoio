'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (!projectToken || !host) {
  if (process.env.NODE_ENV === 'development') {
    const missingVariable = !projectToken
      ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'NEXT_PUBLIC_POSTHOG_HOST'

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
  }
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Analytics may insert script elements; wait until hydration has completed.
  useEffect(() => {
    if (projectToken && host) {
      posthog.init(projectToken, {
        api_host: host,
        capture_exceptions: true,
      })
    }
  }, [])
  return children
}
