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
    default: 'Lady Prowess | Ngozi Peace Okafor',
    template: '%s | Lady Prowess',
  },
  description:
    'Ngozi Peace Okafor is a product marketer, technical writer, WordPress designer, Web3 educator, and founder of Prowess Digital Solutions.',
  applicationName: 'Lady Prowess',
  authors: [{ name: 'Ngozi Peace Okafor', url: `${SITE_URL}/about` }],
  creator: 'Ngozi Peace Okafor',
  publisher: 'Lady Prowess',
  keywords: ['Lady Prowess', 'Ngozi Peace Okafor', 'product marketing', 'technical writing', 'WordPress design', 'Web3 education', 'business strategy'],
  openGraph: {
    title: 'Lady Prowess | Ngozi Peace Okafor',
    description: 'Product marketing, technical writing, WordPress design, Web3 education, and practical business strategy.',
    type: 'website',
    url: '/',
    siteName: 'Lady Prowess',
    locale: 'en_NG',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Lady Prowess portfolio' }],
  },
  twitter: { card: 'summary_large_image', title: 'Lady Prowess | Ngozi Peace Okafor', description: 'Product marketing, technical writing, WordPress design, Web3 education, and practical business strategy.', images: ['/opengraph-image'] },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Ngozi Peace Okafor', alternateName: 'Lady Prowess', url: SITE_URL, jobTitle: ['Product Marketer', 'Technical Writer', 'WordPress Designer', 'Web3 Educator'], worksFor: { '@type': 'Organization', name: 'Prowess Digital Solutions' } }).replace(/</g, '\\u003c') }}
        />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
