import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-compressor')
}

export default function ImageCompressorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
