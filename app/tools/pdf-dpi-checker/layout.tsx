import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('pdf-dpi-checker')
}

export default function PdfDpiCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
