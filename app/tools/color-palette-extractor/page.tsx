'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Palette, Copy, Check } from 'lucide-react'

interface ColorItem {
  hex: string
  rgb: { r: number; g: number; b: number }
  percentage: number
}

export default function ColorPaletteExtractorPage() {
  const tool = tools.find((t) => t.id === 'color-palette-extractor')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [colors, setColors] = useState<ColorItem[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setColors([])

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setColors([])
  }

  const extractColors = useCallback(() => {
    if (!preview) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Count colors
      const colorMap = new Map<string, number>()

      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32
        const g = Math.round(data[i + 1] / 32) * 32
        const b = Math.round(data[i + 2] / 32) * 32
        const key = `${r},${g},${b}`
        colorMap.set(key, (colorMap.get(key) || 0) + 1)
      }

      // Get top colors
      const totalPixels = data.length / 4
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number)
          return {
            hex: rgbToHex(r, g, b),
            rgb: { r, g, b },
            percentage: Math.round((count / totalPixels) * 100)
          }
        })

      setColors(sortedColors)
    }
    img.src = preview
  }, [preview])

  useEffect(() => {
    if (preview) {
      extractColors()
    }
  }, [preview, extractColors])

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <ToolLayout tool={tool}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <FileDropzone
            onFileSelect={handleFileSelect}
            file={file}
            preview={preview}
            onClear={handleClear}
          />

          {colors.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Palette className="h-5 w-5" />
                <span className="font-medium">Extracted Color Palette</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div
                      className="h-20 w-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="p-3 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {color.hex.toUpperCase()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(color.hex, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {color.percentage}% coverage
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const palette = colors.map(c => c.hex).join('\n')
                  navigator.clipboard.writeText(palette)
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All Colors
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
