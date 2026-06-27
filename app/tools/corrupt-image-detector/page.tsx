'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function CorruptImageDetectorPage() {
  const tool = tools.find((t) => t.id === 'corrupt-image-detector')!
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'loading' | 'valid' | 'corrupt' | null>(null)
  const [details, setDetails] = useState<string | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setStatus('loading')
    setDetails(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string

      const img = new Image()
      img.onload = () => {
        // Try to draw the image to check for corruption
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        try {
          ctx?.drawImage(img, 0, 0)
          // Try to get pixel data
          ctx?.getImageData(0, 0, 1, 1)
          setStatus('valid')
          setDetails(`Image is valid. Dimensions: ${img.width} x ${img.height} pixels`)
        } catch {
          setStatus('corrupt')
          setDetails('Image has corrupt or missing data')
        }
      }
      img.onerror = () => {
        setStatus('corrupt')
        setDetails('Failed to load image - file may be corrupt or unsupported format')
      }
      img.src = dataUrl
    }
    reader.onerror = () => {
      setStatus('corrupt')
      setDetails('Failed to read file')
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setStatus(null)
    setDetails(null)
  }

  const getResultContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex items-center gap-3 text-gray-500">
          <Info className="h-6 w-6 animate-pulse" />
          <div>
            <div className="font-medium">Analyzing image...</div>
            <div className="text-sm">Checking for corruption...</div>
          </div>
        </div>
      )
    }

    if (status === 'valid') {
      return (
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle className="h-6 w-6" />
          <div>
            <div className="font-medium">Image is Valid</div>
            <div className="text-sm">{details}</div>
          </div>
        </div>
      )
    }

    if (status === 'corrupt') {
      return (
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <div className="font-medium">Image is Corrupt or Invalid</div>
            <div className="text-sm">{details}</div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <ToolLayout tool={tool}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <FileDropzone
            onFileSelect={handleFileSelect}
            file={file}
            onClear={handleClear}
          />

          {status && (
            <div className={`mt-6 p-4 rounded-lg ${
              status === 'valid' ? 'bg-green-50' :
              status === 'corrupt' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              {getResultContent()}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
