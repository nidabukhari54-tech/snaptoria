import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('aspect-ratio-cropper')
}

export default function AspectRatioCropperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
