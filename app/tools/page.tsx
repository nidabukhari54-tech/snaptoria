import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { tools } from '@/lib/tools'
import { ToolCardVisual } from '@/components/tool-card-visual'
import { ToolListSchema, PageBreadcrumbSchema } from '@/components/schema'

export default function ToolsPage() {
  const categories = Array.from(new Set(tools.map((t) => t.category)))

  return (
    <div className="container py-12">
      <ToolListSchema />
      <PageBreadcrumbSchema
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
        ]}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Tools</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {tools.length} browser-based image and document tools. All processing happens locally on your device.
        </p>
      </div>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools
              .filter((t) => t.category === category)
              .map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 group">
                    <CardContent className="p-6">
                      <ToolCardVisual toolId={tool.id} />
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
