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
  title: 'Snaptoria - Free Online Image Tools | Compress, Resize',
  description: `${tools.length} free browser-based image and document tools. Compress, resize and convert images, create PDFs, remove EXIF data. 100% private, files never leave your device.`,
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.svg',
  },
  verification: {
    google: 'vaKnJgCO3HqzjqDlYa76SFTBxSLKN8G62uZTKJQMTgg',
  },
  openGraph: {
    title: 'Snaptoria - Free Online Image Tools | Compress, Resize',
    description: `${tools.length} free browser-based image and document tools. Compress, resize and convert images, create PDFs, remove EXIF data. 100% private, files never leave your device.`,
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Snaptoria - Free Online Image Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snaptoria - Free Online Image Tools | Compress, Resize',
    description: `${tools.length} free browser-based image and document tools. Compress, resize and convert images, create PDFs, remove EXIF data. 100% private, files never leave your device.`,
    images: [`${SITE_URL}/og-image.jpg`],
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
