'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, LayoutGrid, Trash2 } from 'lucide-react'

interface ImageItem {
  id: string
  file: File
  preview: string
}

const layouts = [
  { value: '2-col', name: '2 Images Side by Side', cols: 2, rows: 1 },
  { value: '2-row', name: '2 Images Stacked', cols: 1, rows: 2 },
  { value: '3-col', name: '3 Images Horizontal', cols: 3, rows: 1 },
  { value: '2x2', name: '2x2 Grid', cols: 2, rows: 2 },
  { value: '3x2', name: '3x2 Grid', cols: 3, rows: 2 },
]

export default function CollageMakerPage() {
  const tool = tools.find((t) => t.id === 'collage-maker')!
  const [images, setImages] = useState<ImageItem[]>([])
  const [layout, setLayout] = useState('2x2')
  const [collagePreview, setCollagePreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage: ImageItem = {
        id: Math.random().toString(36).substr(2, 9),
        file: selectedFile,
        preview: e.target?.result as string
      }
      setImages((prev) => [...prev, newImage])
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const selectedLayout = layouts.find((l) => l.value === layout) || layouts[0]
  const requiredImages = selectedLayout.cols * selectedLayout.rows

  const createCollage = async () => {
    if (images.length < requiredImages) return

    setProcessing(true)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pieceWidth = 400
    const pieceHeight = 400
    canvas.width = pieceWidth * selectedLayout.cols
    canvas.height = pieceHeight * selectedLayout.rows

    // Load all images
    const loadedImages: HTMLImageElement[] = []
    for (const img of images.slice(0, requiredImages)) {
      const loaded = new Image()
      loaded.src = img.preview
      await new Promise<void>((resolve) => {
        loaded.onload = () => resolve()
      })
      loadedImages.push(loaded)
    }

    // Draw images in grid
    loadedImages.forEach((img, i) => {
      const col = i % selectedLayout.cols
      const row = Math.floor(i / selectedLayout.cols)
      const x = col * pieceWidth
      const y = row * pieceHeight

      // Cover fit
      const scale = Math.max(pieceWidth / img.width, pieceHeight / img.height)
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const offsetX = (scaledWidth - pieceWidth) / 2
      const offsetY = (scaledHeight - pieceHeight) / 2

      ctx.save()
      ctx.beginPath()
      ctx.rect(x, y, pieceWidth, pieceHeight)
      ctx.clip()
      ctx.drawImage(img, x - offsetX, y - offsetY, scaledWidth, scaledHeight)
      ctx.restore()
    })

    canvas.toBlob((blob) => {
      if (blob) {
        setCollagePreview(URL.createObjectURL(blob))
      }
      setProcessing(false)
    }, 'image/png')
  }

  const handleDownload = () => {
    if (!collagePreview) return

    const link = document.createElement('a')
    link.href = collagePreview
    link.download = 'collage.png'
    link.click()
  }

  const previews = images.map((img) => img.preview)

  return (
    <ToolLayout tool={tool}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <FileDropzone
            onFileSelect={handleFileSelect}
            multiple={true}
            previews={previews}
            files={images.map((i) => i.file)}
            label="Drop multiple images for your collage"
          />

          {images.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.preview}
                      alt={img.file.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Layout</label>
                <Select value={layout} onValueChange={setLayout}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layouts.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.name} ({l.cols * l.rows} images)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {images.length < requiredImages && (
                <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4">
                  Add {requiredImages - images.length} more image{requiredImages - images.length !== 1 ? 's' : ''} for this layout
                </div>
              )}

              <Button
                onClick={createCollage}
                disabled={processing || images.length < requiredImages}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                {processing ? (
                  <>
                    <LayoutGrid className="h-4 w-4 mr-2 animate-pulse" />
                    Creating...
                  </>
                ) : (
                  <>
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Create Collage
                  </>
                )}
              </Button>
            </div>
          )}

          {collagePreview && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-center">
                <img
                  src={collagePreview}
                  alt="Collage preview"
                  className="max-h-96 rounded-lg shadow-lg"
                />
              </div>
              <Button
                onClick={handleDownload}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Collage
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
