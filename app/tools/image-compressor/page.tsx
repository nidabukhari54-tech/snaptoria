'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Loader2, ArrowRight, Image as ImageIcon } from 'lucide-react'
import imageCompression from 'browser-image-compression'

export default function ImageCompressorPage() {
  const tool = tools.find((t) => t.id === 'image-compressor')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [quality, setQuality] = useState(80)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setCompressedFile(null)
    setCompressedPreview(null)
    setOriginalSize(selectedFile.size)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setCompressedFile(null)
    setCompressedPreview(null)
  }

  const handleCompress = async () => {
    if (!file) return

    setProcessing(true)
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality / 100,
        fileType: file.type
      }

      const result = await imageCompression(file, options)
      setCompressedFile(result)
      setCompressedSize(result.size)

      const reader = new FileReader()
      reader.onload = (e) => {
        setCompressedPreview(e.target?.result as string)
      }
      reader.readAsDataURL(result)
    } catch (error) {
      console.error('Compression error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedFile) return

    const link = document.createElement('a')
    link.href = URL.createObjectURL(compressedFile)
    link.download = `compressed-${compressedFile.name}`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0

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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Quality: {quality}%
                </label>
                <Slider
                  value={[quality]}
                  onValueChange={(value) => setQuality(value[0])}
                  max={100}
                  min={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Smaller file</span>
                  <span>Higher quality</span>
                </div>
              </div>

              <Button
                onClick={handleCompress}
                disabled={processing}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Compress Image
                  </>
                )}
              </Button>
            </div>
          )}

          {compressedPreview && (
            <div className="mt-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Original</div>
                  <div className="text-lg font-semibold">{formatSize(originalSize)}</div>
                </div>
                <ArrowRight className="text-gray-400" />
                <div className="text-center">
                  <div className="text-sm text-gray-500">Compressed</div>
                  <div className="text-lg font-semibold text-green-600">{formatSize(compressedSize)}</div>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-green-50 text-green-700 text-center py-2 px-4 rounded-lg mb-6">
                  Saved {savings}% smaller!
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Original</div>
                  {preview && <img src={preview} alt="Original" className="rounded-lg border max-h-64 mx-auto" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Compressed</div>
                  {compressedPreview && <img src={compressedPreview} alt="Compressed" className="rounded-lg border max-h-64 mx-auto" />}
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="w-full mt-6 bg-green-500 hover:bg-green-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Compressed Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
