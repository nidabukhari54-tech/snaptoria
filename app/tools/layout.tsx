import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'All Free Online Image & Document Tools',
  description:
    'Browse all 20 free browser-based tools: image compressor, resizer, converter, PDF maker, EXIF stripper and more. 100% private - files never leave your device.',
  alternates: { canonical: `${SITE_URL}/tools` },
  openGraph: {
    title: 'All Free Online Image & Document Tools',
    description:
      'Browse all 20 free browser-based tools: image compressor, resizer, converter, PDF maker, EXIF stripper and more.',
    url: `${SITE_URL}/tools`,
    siteName: SITE_NAME,
    type: 'website',
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
