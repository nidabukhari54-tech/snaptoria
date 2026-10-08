import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('color-palette-extractor')
}

export default function ColorPaletteExtractorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
