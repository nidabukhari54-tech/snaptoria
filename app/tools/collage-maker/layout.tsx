import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('collage-maker')
}

export default function CollageMakerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
