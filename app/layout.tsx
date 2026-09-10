import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
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
        className={`${jakarta.variable} ${jetbrains.variable} ${inter.variable} font-body bg-bg text-parchment antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
