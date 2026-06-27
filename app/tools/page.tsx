import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { tools } from '@/lib/tools'
import * as Icons from 'lucide-react'

export default function ToolsPage() {
  const categories = Array.from(new Set(tools.map((t) => t.category)))

  const LucideIcon = (name: string) => {
    const iconName = name as keyof typeof Icons
    const Icon = Icons[iconName] as React.ComponentType<{ className?: string }>
    return Icon ? <Icon className="h-6 w-6" /> : <Icons.Image className="h-6 w-6" />
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Tools</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          20 browser-based image and document tools. All processing happens locally on your device.
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
                      <div className="bg-sky-50 rounded-lg p-3 w-fit mb-4 text-sky-600 group-hover:bg-sky-100 transition-colors">
                        {LucideIcon(tool.icon)}
                      </div>
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
