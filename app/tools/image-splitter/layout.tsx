import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-splitter')
}

export default function ImageSplitterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
