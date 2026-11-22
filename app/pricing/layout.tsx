import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pricing - Snaptoria | All Tools Free, Pro $9/Month',
  description:
    'Snaptoria tools are free: 10 actions a day, no signup. Pro gives unlimited actions, usage history and priority support. Files stay private in your browser.',
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'Pricing - Snaptoria | All Tools Free, Pro $9/Month',
    description:
      'Snaptoria tools are free: 10 actions a day, no signup. Pro gives unlimited actions, usage history and priority support. Files stay private in your browser.',
    url: `${SITE_URL}/pricing`,
    siteName: SITE_NAME,
    type: 'website',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
