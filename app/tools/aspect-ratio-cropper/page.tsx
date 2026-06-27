'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Crop, Maximize2 } from 'lucide-react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

const aspectRatios = [
  { value: '1:1', name: '1:1 - Instagram Post', ratio: 1 },
  { value: '4:5', name: '4:5 - Instagram Portrait', ratio: 4 / 5 },
  { value: '16:9', name: '16:9 - YouTube Thumbnail', ratio: 16 / 9 },
  { value: '9:16', name: '9:16 - Stories/Reels', ratio: 9 / 16 },
  { value: '4:3', name: '4:3 - Standard Display', ratio: 4 / 3 },
  { value: '3:2', name: '3:2 - Classic Photo', ratio: 3 / 2 },
  { value: 'free', name: 'Free Crop', ratio: undefined },
]

export default function AspectRatioCropperPage() {
  const tool = tools.find((t) => t.id === 'aspect-ratio-cropper')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [selectedPreset, setSelectedPreset] = useState('1:1')
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

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value)
    const preset = aspectRatios.find((r) => r.value === value)
    if (preset && preset.ratio !== undefined) {
      setAspectRatio(preset.ratio)
    }
  }

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
    link.download = `cropped-${selectedPreset.replace(':', 'x')}-${file?.name || 'image.jpg'}`
    link.click()
  }

  const preset = aspectRatios.find((r) => r.value === selectedPreset)

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
            <div className="mt-6 space-y-6">
              <div>
                <Label className="mb-3 block flex items-center gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Aspect Ratio Preset
                </Label>
                <RadioGroup value={selectedPreset} onValueChange={handlePresetChange}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {aspectRatios.map((r) => (
                      <div key={r.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                        <RadioGroupItem value={r.value} id={r.value} />
                        <Label htmlFor={r.value} className="cursor-pointer text-sm">{r.name}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

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
                Crop to {preset?.name || 'Custom'}
              </Button>
            </div>
          )}

          {croppedPreview && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 rounded-lg p-4 text-green-700 text-center">
                <Crop className="h-5 w-5 mx-auto mb-2" />
                Cropped to {preset?.name} ({croppedAreaPixels?.width} x {croppedAreaPixels?.height}px)
              </div>

              <div className="flex justify-center">
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
                  Download
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
