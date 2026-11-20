import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-resolution-checker')
}

export default function ImageResolutionCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
