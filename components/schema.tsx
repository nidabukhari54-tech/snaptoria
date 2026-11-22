import { tools, type Tool } from '@/lib/tools'
import { SITE_URL, SITE_NAME } from '@/lib/site'

// JSON-LD is rendered as a plain <script> tag, NOT next/script.
// next/script's default strategy (afterInteractive) only injects the tag
// through client-side JavaScript when the component tree is a client
// component (as ToolLayout is), so the schema never appears in the
// initial server-rendered HTML and is invisible to crawlers that do not
// execute JavaScript. A plain <script> element is emitted in the SSR
// HTML on every page.
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface ToolSchemaProps {
  tool: Tool
}

export function ToolSchema({ tool }: ToolSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: `${SITE_URL}/tools/${tool.id}`,
    description: tool.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (browser-based)',
    browserRequirements: 'Runs entirely in your web browser',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan: 10 actions per day, no signup required',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '9',
        priceCurrency: 'USD',
        description: 'Pro plan: $9/month, unlimited actions',
      },
    ],
  }

  return <JsonLd data={schema} />
}

export function BreadcrumbSchema({ tool }: ToolSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${SITE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `${SITE_URL}/tools/${tool.id}`,
      },
    ],
  }

  return <JsonLd data={schema} />
}

interface HowToSchemaProps {
  name: string
  steps: { step: number; text: string }[]
}

export function HowToSchema({ name, steps }: HowToSchemaProps) {
  if (!steps?.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.step,
      text: s.text,
    })),
  }

  return <JsonLd data={schema} />
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

  return <JsonLd data={schema} />
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

  return <JsonLd data={schema} />
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

  return <JsonLd data={schema} />
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

  return <JsonLd data={schema} />
}
