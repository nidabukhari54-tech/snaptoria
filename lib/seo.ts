import type { Metadata } from 'next'
import { tools } from './tools'
import { SITE_URL, SITE_NAME } from './site'

export function getToolMetadata(toolId: string): Metadata {
  const tool = tools.find((t) => t.id === toolId)
  if (!tool) return {}

  const url = `${SITE_URL}/tools/${tool.id}`

  return {
    title: tool.metaTitle,
    description: tool.metaDesc,
    alternates: { canonical: url },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDesc,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: tool.metaTitle,
      description: tool.metaDesc,
    },
  }
}
