import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('base64-converter')
}

export default function Base64ConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
