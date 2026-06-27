'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, FileImage, Trash2, GripVertical } from 'lucide-react'
import { jsPDF } from 'jspdf'

interface ImageFile {
  file: File
  preview: string
  id: string
}

export default function ImageToPdfPage() {
  const tool = tools.find((t) => t.id === 'image-to-pdf')!
  const [images, setImages] = useState<ImageFile[]>([])
  const [processing, setProcessing] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage: ImageFile = {
        file: selectedFile,
        preview: e.target?.result as string,
        id: Math.random().toString(36).substr(2, 9)
      }
      setImages((prev) => [...prev, newImage])
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
  }

  const handleConvert = async () => {
    if (images.length === 0) return

    setProcessing(true)

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      for (let i = 0; i < images.length; i++) {
        const img = images[i]

        // Create an image element to get dimensions
        const imgEl = new Image()
        await new Promise<void>((resolve) => {
          imgEl.onload = () => resolve()
          imgEl.src = img.preview
        })

        const imgWidth = imgEl.width
        const imgHeight = imgEl.height

        // Calculate dimensions to fit on page while maintaining aspect ratio
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight, 1)
        const scaledWidth = imgWidth * ratio
        const scaledHeight = imgHeight * ratio

        // Center the image on the page
        const x = (pageWidth - scaledWidth) / 2
        const y = (pageHeight - scaledHeight) / 2

        if (i > 0) {
          pdf.addPage()
        }

        pdf.addImage(img.preview, 'JPEG', x, y, scaledWidth, scaledHeight)
      }

      pdf.save('images-converted.pdf')
    } catch (error) {
      console.error('PDF generation error:', error)
    } finally {
      setProcessing(false)
    }
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
            label="Drop images here or click to upload (multiple allowed)"
          />

          {images.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </div>
                <p className="text-xs text-gray-500">Drag to reorder, images will be added in order</p>
              </div>

              <div className="space-y-2">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-4 p-3 bg-white border rounded-lg hover:bg-gray-50"
                  >
                    <div className="text-gray-400 cursor-grab">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <img
                      src={image.preview}
                      alt={image.file.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{image.file.name}</div>
                      <div className="text-sm text-gray-500">
                        {(image.file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveImage(index, 'up')}
                        disabled={index === 0}
                      >
                        Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveImage(index, 'down')}
                        disabled={index === images.length - 1}
                      >
                        Down
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(image.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleConvert}
                disabled={processing}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                {processing ? (
                  <>
                    <FileImage className="h-4 w-4 mr-2 animate-pulse" />
                    Creating PDF...
                  </>
                ) : (
                  <>
                    <FileImage className="h-4 w-4 mr-2" />
                    Convert to PDF ({images.length} pages)
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
