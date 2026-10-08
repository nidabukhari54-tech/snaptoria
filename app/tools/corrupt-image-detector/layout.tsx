import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('corrupt-image-detector')
}

export default function CorruptImageDetectorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
