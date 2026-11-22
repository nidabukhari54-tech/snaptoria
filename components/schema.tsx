import Script from 'next/script'
import { tools, type Tool } from '@/lib/tools'
import { SITE_URL, SITE_NAME } from '@/lib/site'

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
    name: SITE_NAME,
    description: `${tools.length} browser-based image and document tools. All processing happens locally on your device.`,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
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
    name: SITE_NAME,
    url: SITE_URL,
    description: `${tools.length} browser-based image and document tools. All processing happens locally on your device.`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/tools?q={search_term_string}`,
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

export function ToolListSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} Tools`,
    description: `${tools.length} free browser-based image and document tools. Files are processed locally in your browser and never uploaded.`,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}/tools/${tool.id}`,
    })),
  }

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FaqSchemaProps {
  faqs: { question: string; answer: string }[]
}

export function FaqSchema({ faqs }: FaqSchemaProps) {
  if (!faqs?.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
