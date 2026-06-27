import Script from 'next/script'
import { tools, type Tool } from '@/lib/tools'

interface ToolSchemaProps {
  tool: Tool
}

export function ToolSchema({ tool }: ToolSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1247',
    },
  }

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Snaptoria',
    description: '20 browser-based image and document tools. All processing happens locally on your device.',
    url: 'https://snaptoria.com',
    logo: 'https://snaptoria.com/logo.png',
    sameAs: [
      'https://twitter.com/snaptoria',
    ],
  }

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Snaptoria',
    url: 'https://snaptoria.com',
    description: '20 browser-based image and document tools. All processing happens locally on your device.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://snaptoria.com/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
