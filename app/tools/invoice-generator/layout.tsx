import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('invoice-generator')
}

export default function InvoiceGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
