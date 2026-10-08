import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('qr-code-reader')
}

export default function QrCodeReaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
