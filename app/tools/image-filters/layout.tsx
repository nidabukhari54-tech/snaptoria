import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-filters')
}

export default function ImageFiltersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
