'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Type } from 'lucide-react'

const positions = [
  { value: 'center', label: 'Center' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
]

export default function TextWatermarkPage() {
  const tool = tools.find((t) => t.id === 'text-watermark')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [watermarkedPreview, setWatermarkedPreview] = useState<string | null>(null)
  const [watermarkText, setWatermarkText] = useState('Watermark')
  const [position, setPosition] = useState('center')
  const [opacity, setOpacity] = useState(50)
  const [fontSize, setFontSize] = useState(48)
  const [fontColor, setFontColor] = useState('#ffffff')

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
    setWatermarkedPreview(null)
  }

  const applyWatermark = useCallback(() => {
    if (!preview || !file || !watermarkText) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)

      const alpha = opacity / 100
      ctx.globalAlpha = alpha
      ctx.fillStyle = fontColor
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'
      ctx.lineWidth = 2
      ctx.font = `${fontSize}px Arial, sans-serif`

      const textWidth = ctx.measureText(watermarkText).width
      const textHeight = fontSize

      let x = canvas.width / 2 - textWidth / 2
      let y = canvas.height / 2 + textHeight / 3

      switch (position) {
        case 'top-left':
          x = 20
          y = textHeight + 20
          break
        case 'top-right':
          x = canvas.width - textWidth - 20
          y = textHeight + 20
          break
        case 'bottom-left':
          x = 20
          y = canvas.height - 20
          break
        case 'bottom-right':
          x = canvas.width - textWidth - 20
          y = canvas.height - 20
          break
      }

      ctx.strokeText(watermarkText, x, y)
      ctx.fillText(watermarkText, x, y)
      ctx.globalAlpha = 1

      canvas.toBlob((blob) => {
        if (blob) {
          setWatermarkedPreview(URL.createObjectURL(blob))
        }
      }, file.type, 0.9)
    }
    img.src = preview
  }, [preview, file, watermarkText, position, opacity, fontSize, fontColor])

  useEffect(() => {
    if (preview) {
      applyWatermark()
    }
  }, [preview, watermarkText, position, opacity, fontSize, fontColor, applyWatermark])

  const handleDownload = () => {
    if (!watermarkedPreview) return

    const link = document.createElement('a')
    link.href = watermarkedPreview
    link.download = `watermarked-${file?.name || 'image.jpg'}`
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
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Watermark Settings</h3>
              </div>

              <div>
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="font-color">Color</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      id="font-color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      className="h-10 w-10 rounded cursor-pointer"
                    />
                    <Input value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
              </div>

              <div>
                <Label>Opacity: {opacity}%</Label>
                <Slider
                  value={[opacity]}
                  onValueChange={(value) => setOpacity(value[0])}
                  max={100}
                  min={10}
                  step={5}
                />
              </div>

              <div>
                <Label>Font Size: {fontSize}px</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  max={200}
                  min={12}
                  step={2}
                />
              </div>

              {watermarkedPreview && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={watermarkedPreview}
                      alt="Watermarked preview"
                      className="max-h-96 rounded-lg border"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Watermarked Image
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
