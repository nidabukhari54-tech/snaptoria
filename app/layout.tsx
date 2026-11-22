import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChatWidget } from '@/components/chat-widget'
import { Toaster } from '@/components/ui/toaster'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { tools } from '@/lib/tools'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Snaptoria - Free Online Image Tools | Compress, Resize, Convert',
  description: `${tools.length} free browser-based image and document tools. Compress images, resize photos, convert HEIC to JPG, create PDFs, extract colors, remove EXIF metadata. 100% private - files never leave your device.`,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  verification: {
    google: 'vaKnJgCO3HqzjqDlYa76SFTBxSLKN8G62uZTKJQMTgg',
  },
  openGraph: {
    title: 'Snaptoria - Free Online Image Tools',
    description: `${tools.length} free tools: compress images, resize photos, convert formats, create PDFs. All processing happens in your browser for complete privacy.`,
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snaptoria - Free Online Image Tools',
    description: `Compress, resize, convert images free. ${tools.length} browser-based tools, 100% private processing.`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ChatWidget />
        <Toaster />
      </body>
    </html>
  )
}
