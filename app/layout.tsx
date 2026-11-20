import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono, Newsreader } from 'next/font/google'
import PostHogProvider from '@/components/PostHogProvider'
import { themeBootstrapScript } from '@/lib/theme'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
  // Next has no metric overrides for Newsreader; name the fallback explicitly
  // rather than let it fall through to the default sans.
  adjustFontFallback: false,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lady Prowess | Ngozi Peace Unegbu',
    template: '%s | Lady Prowess',
  },
  description:
    'Ngozi Peace Unegbu (Lady Prowess) is an AI Strategy and Digital Product Specialist and technical writer, helping businesses adopt AI, build useful digital products and make complex technology easy to understand.',
  applicationName: 'Lady Prowess',
  authors: [{ name: 'Ngozi Peace Unegbu', url: `${SITE_URL}/about` }],
  creator: 'Ngozi Peace Unegbu',
  publisher: 'Lady Prowess',
  keywords: ['Lady Prowess', 'Ngozi Peace Unegbu', 'Ngozi Peace Okafor', 'AI strategy', 'AI adoption', 'digital product development', 'technical writing', 'API documentation', 'fintech', 'Web3'],
  openGraph: {
    title: 'Lady Prowess | Ngozi Peace Unegbu',
    description: 'AI strategy, digital products and technical writing: helping businesses turn technology into practical solutions.',
    type: 'website',
    url: '/',
    siteName: 'Lady Prowess',
    locale: 'en_NG',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Lady Prowess portfolio' }],
  },
  twitter: { card: 'summary_large_image', title: 'Lady Prowess | Ngozi Peace Unegbu', description: 'AI strategy, digital products and technical writing: helping businesses turn technology into practical solutions.', images: ['/opengraph-image'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${jetbrains.variable} ${inter.variable} ${newsreader.variable} font-body bg-bg text-parchment antialiased`}
      >
        {/* Sets data-theme before the page paints, so there is no light flash.
            This lives at the top of <body> rather than in a <head> of its own:
            a raw script inside <head> gets reordered relative to the JSON-LD
            below it during hydration, which broke hydration on every page. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Ngozi Peace Unegbu', alternateName: ['Lady Prowess', 'Ngozi Peace Okafor'], url: SITE_URL, jobTitle: ['AI Strategy & Digital Product Specialist', 'Technical Writer'], worksFor: { '@type': 'Organization', name: 'Prowess Digital Solutions' } }).replace(/</g, '\\u003c') }}
        />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
