import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('receipt-generator')
}

export default function ReceiptGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
