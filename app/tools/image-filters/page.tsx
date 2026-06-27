'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Sliders, RotateCcw } from 'lucide-react'

export default function ImageFiltersPage() {
  const tool = tools.find((t) => t.id === 'image-filters')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [filteredPreview, setFilteredPreview] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
  })

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setFilteredPreview(null)
  }

  const applyFilters = useCallback(() => {
    if (!preview || !file) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Apply CSS-like filters
      ctx.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturate}%)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
      `
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          setFilteredPreview(URL.createObjectURL(blob))
        }
      }, file.type, 0.9)
    }
    img.src = preview
  }, [preview, file, filters])

  useEffect(() => {
    if (preview) {
      applyFilters()
    }
  }, [preview, filters, applyFilters])

  const handleDownload = () => {
    if (!filteredPreview) return

    const link = document.createElement('a')
    link.href = filteredPreview
    link.download = `filtered-${file?.name || 'image.jpg'}`
    link.click()
  }

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      sepia: 0,
    })
  }

  const presets = [
    { name: 'B&W', filters: { brightness: 100, contrast: 100, saturate: 0, grayscale: 100, sepia: 0 } },
    { name: 'Sepia', filters: { brightness: 100, contrast: 110, saturate: 100, grayscale: 0, sepia: 80 } },
    { name: 'Vivid', filters: { brightness: 105, contrast: 110, saturate: 150, grayscale: 0, sepia: 0 } },
    { name: 'Muted', filters: { brightness: 95, contrast: 90, saturate: 60, grayscale: 0, sepia: 0 } },
  ]

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

          {preview && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {presets.map((p) => (
                  <Button
                    key={p.name}
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(p.filters)}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Brightness: {filters.brightness}%
                  </label>
                  <Slider
                    value={[filters.brightness]}
                    onValueChange={(value) => setFilters({ ...filters, brightness: value[0] })}
                    max={200}
                    min={50}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Contrast: {filters.contrast}%
                  </label>
                  <Slider
                    value={[filters.contrast]}
                    onValueChange={(value) => setFilters({ ...filters, contrast: value[0] })}
                    max={200}
                    min={50}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Saturation: {filters.saturate}%
                  </label>
                  <Slider
                    value={[filters.saturate]}
                    onValueChange={(value) => setFilters({ ...filters, saturate: value[0] })}
                    max={200}
                    min={0}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Grayscale: {filters.grayscale}%
                  </label>
                  <Slider
                    value={[filters.grayscale]}
                    onValueChange={(value) => setFilters({ ...filters, grayscale: value[0] })}
                    max={100}
                    min={0}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sepia: {filters.sepia}%
                  </label>
                  <Slider
                    value={[filters.sepia]}
                    onValueChange={(value) => setFilters({ ...filters, sepia: value[0] })}
                    max={100}
                    min={0}
                    step={1}
                  />
                </div>
              </div>

              {filteredPreview && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Original</div>
                    {preview && <img src={preview} alt="Original" className="rounded-lg border max-h-64 mx-auto" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Filtered</div>
                    {filteredPreview && <img src={filteredPreview} alt="Filtered" className="rounded-lg border max-h-64 mx-auto" />}
                  </div>
                </div>
              )}

              <Button
                onClick={handleDownload}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Filtered Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
