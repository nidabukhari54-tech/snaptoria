'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react'

export default function ImageRotatorPage() {
  const tool = tools.find((t) => t.id === 'image-rotator')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [transformedPreview, setTransformedPreview] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      setTransformedPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setTransformedPreview(null)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
  }

  const applyTransform = useCallback(() => {
    if (!preview || !file) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Handle rotation dimensions
      const isRotated = rotation === 90 || rotation === 270
      canvas.width = isRotated ? img.height : img.width
      canvas.height = isRotated ? img.width : img.height

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)

      const drawX = isRotated ? -img.height / 2 : -img.width / 2
      const drawY = isRotated ? -img.width / 2 : -img.height / 2

      ctx.drawImage(img, drawX, drawY, img.width, img.height)
      ctx.restore()

      canvas.toBlob((blob) => {
        if (blob) {
          setTransformedPreview(URL.createObjectURL(blob))
        }
      }, file.type, 0.9)
    }
    img.src = preview
  }, [preview, file, rotation, flipH, flipV])

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360)
  }

  const handleFlipH = () => {
    setFlipH((prev) => !prev)
  }

  const handleFlipV = () => {
    setFlipV((prev) => !prev)
  }

  // Apply transformations when they change
  const transforms = [rotation, flipH, flipV]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => {
    if (preview) applyTransform()
  })

  // Re-apply when transforms change
  const lastTransform = JSON.stringify({ rotation, flipH, flipV })
  if (preview && !transformedPreview) {
    applyTransform()
  }

  const handleDownload = () => {
    if (!transformedPreview || !file) return

    const link = document.createElement('a')
    link.href = transformedPreview
    link.download = `transformed-${file.name}`
    link.click()
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

          {preview && (
            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Current Transform</div>
                <div className="text-lg">
                  Rotation: {rotation} | Flip H: {flipH ? 'Yes' : 'No'} | Flip V: {flipV ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" onClick={() => handleRotate(90)} className="h-auto py-4 flex-col">
                  <RotateCw className="h-6 w-6 mb-2" />
                  <span>Rotate 90</span>
                </Button>
                <Button variant="outline" onClick={() => handleRotate(180)} className="h-auto py-4 flex-col">
                  <RotateCw className="h-6 w-6 mb-2 -rotate-180" />
                  <span>Rotate 180</span>
                </Button>
                <Button variant="outline" onClick={handleFlipH} className={`h-auto py-4 flex-col ${flipH ? 'bg-sky-100 border-sky-300' : ''}`}>
                  <FlipHorizontal className="h-6 w-6 mb-2" />
                  <span>Flip Horizontal</span>
                </Button>
                <Button variant="outline" onClick={handleFlipV} className={`h-auto py-4 flex-col ${flipV ? 'bg-sky-100 border-sky-300' : ''}`}>
                  <FlipVertical className="h-6 w-6 mb-2" />
                  <span>Flip Vertical</span>
                </Button>
              </div>

              <Button
                onClick={() => {
                  setRotation(0)
                  setFlipH(false)
                  setFlipV(false)
                  setTransformedPreview(preview)
                }}
                variant="ghost"
                className="w-full"
              >
                Reset All
              </Button>

              {transformedPreview && (
                <div className="flex justify-center">
                  <img
                    src={transformedPreview}
                    alt="Transformed preview"
                    className="max-h-96 rounded-lg border"
                  />
                </div>
              )}

              <Button
                onClick={handleDownload}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Transformed Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
