import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('exif-viewer')
}

export default function ExifViewerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
