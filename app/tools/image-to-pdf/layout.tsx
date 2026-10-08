import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-to-pdf')
}

export default function ImageToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
