'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, RefreshCw } from 'lucide-react'

const formats = [
  { value: 'image/jpeg', label: 'JPG', extension: '.jpg' },
  { value: 'image/png', label: 'PNG', extension: '.png' },
  { value: 'image/webp', label: 'WebP', extension: '.webp' },
  { value: 'image/gif', label: 'GIF', extension: '.gif' },
]

export default function ImageFormatConverterPage() {
  const tool = tools.find((t) => t.id === 'image-format-converter')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [targetFormat, setTargetFormat] = useState('image/png')
  const [convertedPreview, setConvertedPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setConvertedPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setConvertedPreview(null)
  }

  const handleConvert = async () => {
    if (!preview || !file) return

    setProcessing(true)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      setProcessing(false)
      return
    }

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // For JPEG, fill with white background (no transparency)
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            setConvertedPreview(url)
          }
          setProcessing(false)
        },
        targetFormat,
        0.9
      )
    }
    img.src = preview
  }

  const handleDownload = () => {
    if (!convertedPreview || !file) return

    const format = formats.find((f) => f.value === targetFormat)
    const baseName = file.name.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.href = convertedPreview
    link.download = `${baseName}${format?.extension || '.png'}`
    link.click()
  }

  const currentFormat = file?.type || ''
  const currentFormatLabel = formats.find((f) => f.value === currentFormat)?.label || currentFormat

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
                <div className="text-sm font-medium text-gray-600 mb-1">Current Format</div>
                <div className="text-lg">
                  {currentFormatLabel}
                  <span className="text-gray-400 text-sm ml-2">({file?.name})</span>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Convert to:</Label>
                <RadioGroup value={targetFormat} onValueChange={setTargetFormat}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formats.map((format) => (
                      <div key={format.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                        <RadioGroupItem value={format.value} id={format.value} />
                        <Label htmlFor={format.value} className="cursor-pointer font-medium">
                          {format.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleConvert}
                disabled={processing}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Convert Image
                  </>
                )}
              </Button>
            </div>
          )}

          {convertedPreview && (
            <div className="mt-6">
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-green-700 mb-1">Conversion Complete</div>
                <div className="text-lg text-green-800">
                  Converted to {formats.find((f) => f.value === targetFormat)?.label}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Original ({currentFormatLabel})</div>
                  {preview && <img src={preview} alt="Original" className="rounded-lg border max-h-64 mx-auto" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Converted ({formats.find((f) => f.value === targetFormat)?.label})</div>
                  {convertedPreview && <img src={convertedPreview} alt="Converted" className="rounded-lg border max-h-64 mx-auto" />}
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Converted Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
