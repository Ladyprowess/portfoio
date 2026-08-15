import type { Metadata } from 'next'
import { Bricolage_Grotesque, IBM_Plex_Mono, DM_Sans } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lady Prowess - Ngozi Peace Okafor',
  description:
    'Copywriter, Content Strategist, Technical Writer, and Web3 Educator working remotely.',
  openGraph: {
    title: 'Lady Prowess - Ngozi Peace Okafor',
    description: 'Words, systems, and Web3.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${plexMono.variable} ${dmSans.variable} font-body bg-bg text-parchment antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
