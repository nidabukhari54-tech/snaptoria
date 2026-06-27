'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Image as ImageIcon, Lock, Unlock } from 'lucide-react'

export default function ImageResizerPage() {
  const tool = tools.find((t) => t.id === 'image-resizer')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mode, setMode] = useState<'pixels' | 'percentage'>('pixels')
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [percentage, setPercentage] = useState(50)
  const [lockAspect, setLockAspect] = useState(true)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [resizedPreview, setResizedPreview] = useState<string | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResizedPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = e.target?.result as string
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setResizedPreview(null)
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (lockAspect && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width
      setHeight(Math.round(newWidth * ratio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (lockAspect && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(newHeight * ratio))
    }
  }

  const resizeImage = useCallback(() => {
    if (!preview || !file) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      let newWidth = width
      let newHeight = height

      if (mode === 'percentage') {
        newWidth = Math.round(img.width * (percentage / 100))
        newHeight = Math.round(img.height * (percentage / 100))
      }

      canvas.width = newWidth
      canvas.height = newHeight
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          setResizedPreview(url)
        }
      }, file.type)
    }
    img.src = preview
  }, [preview, file, width, height, mode, percentage])

  useEffect(() => {
    if (preview) {
      resizeImage()
    }
  }, [preview, width, height, mode, percentage, resizeImage])

  const handleDownload = () => {
    if (!resizedPreview || !file) return

    const link = document.createElement('a')
    link.href = resizedPreview
    link.download = `resized-${file.name}`
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
                <div className="text-sm font-medium text-gray-600 mb-1">Original Dimensions</div>
                <div className="text-lg">
                  {originalDimensions.width} x {originalDimensions.height} pixels
                </div>
              </div>

              <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'pixels' | 'percentage')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pixels" id="pixels" />
                  <Label htmlFor="pixels">Resize by pixels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Resize by percentage</Label>
                </div>
              </RadioGroup>

              {mode === 'pixels' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="percentage">Scale to {percentage}%</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min={1}
                    max={400}
                    value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}

              {mode === 'pixels' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lock-aspect"
                    checked={lockAspect}
                    onCheckedChange={(checked) => setLockAspect(checked as boolean)}
                  />
                  <Label htmlFor="lock-aspect" className="flex items-center gap-2 cursor-pointer">
                    {lockAspect ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    Lock aspect ratio
                  </Label>
                </div>
              )}

              {resizedPreview && (
                <div className="mt-6">
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-green-700 mb-1">New Dimensions</div>
                    <div className="text-lg text-green-800">
                      {mode === 'percentage'
                        ? `${Math.round(originalDimensions.width * percentage / 100)} x ${Math.round(originalDimensions.height * percentage / 100)} pixels`
                        : `${width} x ${height} pixels`}
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <img
                      src={resizedPreview}
                      alt="Resized preview"
                      className="max-h-64 rounded-lg border"
                    />
                  </div>

                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resized Image
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
