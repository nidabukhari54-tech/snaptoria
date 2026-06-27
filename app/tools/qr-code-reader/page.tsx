'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { QrCode, Copy, Check, ExternalLink } from 'lucide-react'
import jsQR from 'jsqr'

export default function QrCodeReaderPage() {
  const tool = tools.find((t) => t.id === 'qr-code-reader')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [decodedText, setDecodedText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setDecodedText(null)
    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)

      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          setError('Could not process image')
          return
        }

        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          setDecodedText(code.data)
        } else {
          setError('No QR code found in the image. Please try a clearer image.')
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setDecodedText(null)
    setError(null)
  }

  const handleCopy = () => {
    if (decodedText) {
      navigator.clipboard.writeText(decodedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isUrl = decodedText && (decodedText.startsWith('http://') || decodedText.startsWith('https://'))

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

          {error && (
            <div className="mt-6 bg-red-50 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {decodedText && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <QrCode className="h-5 w-5" />
                  <span className="font-medium">QR Code Decoded</span>
                </div>
                <div className="bg-white rounded-lg p-3 font-mono text-sm break-all">
                  {decodedText}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCopy} variant="outline" className="flex-1">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
                {isUrl && (
                  <Button asChild className="flex-1 bg-sky-500 hover:bg-sky-600">
                    <a href={decodedText} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Link
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
