'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, FileImage } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const faviconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
]

export default function FaviconGeneratorPage() {
  const tool = tools.find((t) => t.id === 'favicon-generator')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([])
  const [processing, setProcessing] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setPreviews([])

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setPreviews([])
  }

  const generateFavicons = async () => {
    if (!preview || !file) return

    setProcessing(true)

    try {
      const img = new Image()
      img.onload = async () => {
        const zip = new JSZip()
        const generatedPreviews: { size: number; url: string }[] = []

        for (const favicon of faviconSizes) {
          const canvas = document.createElement('canvas')
          canvas.width = favicon.size
          canvas.height = favicon.size

          const ctx = canvas.getContext('2d')
          if (!ctx) continue

          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'

          // Draw image centered and scaled
          const scale = Math.min(favicon.size / img.width, favicon.size / img.height)
          const width = img.width * scale
          const height = img.height * scale
          const x = (favicon.size - width) / 2
          const y = (favicon.size - height) / 2

          ctx.drawImage(img, x, y, width, height)

          // Generate blob
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/png')
          })

          if (blob) {
            zip.file(favicon.name, blob)
            generatedPreviews.push({
              size: favicon.size,
              url: URL.createObjectURL(blob)
            })
          }
        }

        // Generate manifest.json
        const manifest = {
          name: file.name.replace(/\.[^/.]+$/, ''),
          icons: [
            { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        }
        zip.file('manifest.json', JSON.stringify(manifest, null, 2))

        // Generate browserconfig.xml
        const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="android-chrome-192x192.png"/>
    </tile>
  </msapplication>
</browserconfig>`
        zip.file('browserconfig.xml', browserconfig)

        // Generate zip
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        saveAs(zipBlob, 'favicons.zip')

        setPreviews(generatedPreviews)
      }
      img.src = preview
    } finally {
      setProcessing(false)
    }
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
            label="Drop a square image for best results"
          />

          {preview && (
            <div className="mt-6 space-y-6">
              <Button
                onClick={generateFavicons}
                disabled={processing}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                {processing ? (
                  <>
                    <FileImage className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileImage className="h-4 w-4 mr-2" />
                    Generate Favicons
                  </>
                )}
              </Button>

              {previews.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center text-green-700">
                    <Download className="h-5 w-5 mx-auto mb-2" />
                    Downloaded! Your favicons.zip includes:
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {previews.map((p, i) => (
                      <div key={i} className="text-center">
                        <div className="inline-block p-4 bg-gray-100 rounded-lg mb-2">
                          <img
                            src={p.url}
                            alt={`${p.size}x${p.size}`}
                            style={{ width: Math.min(p.size, 64), height: Math.min(p.size, 64) }}
                            className="mx-auto"
                          />
                        </div>
                        <div className="text-sm font-medium">{p.size}x{p.size}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    <p className="font-medium mb-2">Included files:</p>
                    <ul className="space-y-1">
                      {faviconSizes.map((f) => (
                        <li key={f.name}>{f.name}</li>
                      ))}
                      <li>manifest.json</li>
                      <li>browserconfig.xml</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
