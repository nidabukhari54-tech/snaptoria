'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { tools } from '@/lib/tools'
import { ToolCardVisual } from '@/components/tool-card-visual'

const categoryOrder = ['Image Processing', 'Image Analysis', 'Document Tools']
const categories = categoryOrder.filter((category) =>
  tools.some((tool) => tool.category === category)
)

export function ToolGridTabs() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const visibleTools =
    activeCategory === 'All'
      ? tools
      : tools.filter((tool) => tool.category === activeCategory)

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {['All', ...categories].map((category) => {
          const count =
            category === 'All'
              ? tools.length
              : tools.filter((tool) => tool.category === category).length
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {category}
              <span className={isActive ? 'text-sky-100' : 'text-gray-400'}>
                {' '}
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleTools.map((tool) => (
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
    </div>
  )
}
