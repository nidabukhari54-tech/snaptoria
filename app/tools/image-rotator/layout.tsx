import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-rotator')
}

export default function ImageRotatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
