import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pricing - Snaptoria',
  description:
    'Snaptoria pricing: use every image and document tool free - 10 actions a day, no signup, files processed privately in your browser - or upgrade to Pro for unlimited actions, usage history and priority support.',
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'Pricing - Snaptoria',
    description:
      'Start free with all Snaptoria tools, or go Pro for unlimited actions, usage history and priority support. 100% private - files never leave your device.',
    url: `${SITE_URL}/pricing`,
    siteName: SITE_NAME,
    type: 'website',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
