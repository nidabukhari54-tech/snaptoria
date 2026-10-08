import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('dpi-checker')
}

export default function DpiCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
