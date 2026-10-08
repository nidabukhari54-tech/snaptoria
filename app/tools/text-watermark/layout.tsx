import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('text-watermark')
}

export default function TextWatermarkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
