import type { Metadata } from 'next'
import { Cormorant_Garamond, Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
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
    'Copywriter, Content Strategist, Technical Writer, and Web3 Educator based in Lagos, Nigeria. Available worldwide.',
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
        className={`${cormorant.variable} ${syne.variable} ${dmSans.variable} font-body bg-bg text-parchment antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
