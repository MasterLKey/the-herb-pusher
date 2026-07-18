import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@/components/Analytics'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'The Herb Pusher — Supplements Explained Without the Nonsense',
    template: '%s — The Herb Pusher',
  },
  description:
    'Your no-BS guide to vitamins, minerals, herbs and supplements. Evidence ratings, buying guides and honest product comparisons.',
  openGraph: {
    siteName: 'The Herb Pusher',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <Analytics />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
