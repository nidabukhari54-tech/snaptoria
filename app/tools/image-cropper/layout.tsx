import type { Metadata } from 'next'
import { getToolMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return getToolMetadata('image-cropper')
}

export default function ImageCropperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
