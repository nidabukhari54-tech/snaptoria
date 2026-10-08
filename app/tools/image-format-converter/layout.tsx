import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-format-converter')
}

export default function ImageFormatConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
