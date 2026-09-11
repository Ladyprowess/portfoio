import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import PostHogProvider from '@/components/PostHogProvider'
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

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ladyprowess.com'),
  title: {
    default: 'Lady Prowess | Ngozi Peace Okafor',
    template: '%s | Lady Prowess',
  },
  description:
    'Ngozi Peace Okafor is a product marketer, technical writer, WordPress designer, Web3 educator, and founder of Prowess Digital Solutions.',
  applicationName: 'Lady Prowess',
  authors: [{ name: 'Ngozi Peace Okafor', url: 'https://ladyprowess.com/about' }],
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
    <html lang="en">
      <body
        className={`${jakarta.variable} ${jetbrains.variable} ${inter.variable} font-body bg-bg text-parchment antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Ngozi Peace Okafor', alternateName: 'Lady Prowess', url: 'https://ladyprowess.com', jobTitle: ['Product Marketer', 'Technical Writer', 'WordPress Designer', 'Web3 Educator'], worksFor: { '@type': 'Organization', name: 'Prowess Digital Solutions' } }).replace(/</g, '\\u003c') }}
        />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
