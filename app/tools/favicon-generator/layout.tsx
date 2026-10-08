import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('favicon-generator')
}

export default function FaviconGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
