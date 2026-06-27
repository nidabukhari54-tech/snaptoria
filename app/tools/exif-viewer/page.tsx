'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Eye, EyeOff, MapPin, Camera } from 'lucide-react'
import exifr from 'exifr'

export default function ExifViewerPage() {
  const tool = tools.find((t) => t.id === 'exif-viewer')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [exifData, setExifData] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSensitive, setShowSensitive] = useState(true)

  const sensitiveKeys = ['GPSLatitude', 'GPSLongitude', 'GPSLatitudeRef', 'GPSLongitudeRef', 'GPSPosition']

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setLoading(true)
    setExifData(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)

      try {
        const exif = await exifr.parse(selectedFile)
        if (exif) {
          const flatData: Record<string, string> = {}
          const processObj = (obj: Record<string, unknown>, prefix = '') => {
            Object.entries(obj).forEach(([key, value]) => {
              const fullKey = prefix ? `${prefix}.${key}` : key
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                processObj(value as Record<string, unknown>, fullKey)
              } else {
                flatData[fullKey] = String(value)
              }
            })
          }
          if (Array.isArray(exif)) {
            exif.forEach((obj) => processObj(obj))
          } else {
            processObj(exif)
          }
          setExifData(flatData)
        } else {
          setExifData({ 'No EXIF Data': 'This image has no embedded metadata' })
        }
      } catch (error) {
        console.error('Error reading EXIF:', error)
        setExifData({ 'Error': 'Could not read EXIF data from this image' })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setExifData(null)
  }

  const handleStripAndDownload = async () => {
    if (!preview || !file) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `cleaned-${file.name.replace(/\.[^/.]+$/, '')}.jpg`
          link.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/jpeg', 0.9)
    }
    img.src = preview
  }

  const hasSensitiveData = exifData && Object.keys(exifData).some(key =>
    key.toLowerCase().includes('gps') || key.toLowerCase().includes('location')
  )

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
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

          {loading && (
            <div className="mt-6 text-center text-gray-500">
              <Camera className="h-5 w-5 animate-pulse mx-auto mb-2" />
              Reading EXIF metadata...
            </div>
          )}

          {exifData && (
            <div className="mt-6 space-y-4">
              {hasSensitiveData && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Location Data Detected</div>
                    <div className="text-sm text-yellow-700">
                      This image contains GPS coordinates. Click below to download a cleaned version.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Metadata ({Object.keys(exifData).length} fields)</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSensitive(!showSensitive)}
                >
                  {showSensitive ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showSensitive ? 'Hide' : 'Show'} All
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(exifData).map(([key, value]) => {
                      const isSensitive = sensitiveKeys.some(s => key.toLowerCase().includes(s.toLowerCase()))
                      if (isSensitive && !showSensitive) {
                        return (
                          <tr key={key} className="border-b last:border-b-0 bg-yellow-50">
                            <td className="px-4 py-2 font-medium text-gray-600 bg-gray-50">{key}</td>
                            <td className="px-4 py-2 text-yellow-600">[Hidden - sensitive data]</td>
                          </tr>
                        )
                      }
                      return (
                        <tr key={key} className={`border-b last:border-b-0 ${isSensitive ? 'bg-yellow-50' : ''}`}>
                          <td className="px-4 py-2 font-medium text-gray-600 bg-gray-50 w-1/3">{key}</td>
                          <td className={`px-4 py-2 ${isSensitive ? 'text-yellow-700' : 'text-gray-900'}`}>
                            {formatValue(value)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleStripAndDownload}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Cleaned Image (No EXIF)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
