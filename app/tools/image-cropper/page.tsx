'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Crop } from 'lucide-react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

export default function ImageCropperPage() {
  const tool = tools.find((t) => t.id === 'image-cropper')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setCroppedPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setCroppedPreview(null)
  }

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async () => {
    if (!preview || !croppedAreaPixels) return

    const image = await createImage(preview)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    const dataUrl = canvas.toDataURL('image/jpeg')
    setCroppedPreview(dataUrl)
  }

  const handleDownload = () => {
    if (!croppedPreview) return

    const link = document.createElement('a')
    link.href = croppedPreview
    link.download = `cropped-${file?.name || 'image.jpg'}`
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

          {preview && !croppedPreview && (
            <div className="mt-6">
              <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={undefined}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Zoom: {zoom.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={getCroppedImg}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  <Crop className="h-4 w-4 mr-2" />
                  Apply Crop
                </Button>
              </div>
            </div>
          )}

          {croppedPreview && (
            <div className="mt-6">
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-green-700 mb-1">Cropped Successfully</div>
                <div className="text-lg text-green-800">
                  {croppedAreaPixels?.width} x {croppedAreaPixels?.height} pixels
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <img
                  src={croppedPreview}
                  alt="Cropped preview"
                  className="max-h-96 rounded-lg shadow-lg"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setCroppedPreview(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Adjust Crop
                </Button>
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Cropped Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
