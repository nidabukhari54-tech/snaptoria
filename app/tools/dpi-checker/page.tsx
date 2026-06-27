'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Info, Ruler } from 'lucide-react'
import exifr from 'exifr'

export default function DpiCheckerPage() {
  const tool = tools.find((t) => t.id === 'dpi-checker')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setLoading(true)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)

      try {
        const img = new Image()
        img.onload = async () => {
          let exif: Record<string, unknown> | null = null
          try {
            exif = await exifr.parse(selectedFile)
          } catch {
            // EXIF may not exist
          }

          setMetadata({
            'File Name': selectedFile.name,
            'File Size': formatSize(selectedFile.size),
            'File Type': selectedFile.type,
            'Image Width': img.width + ' px',
            'Image Height': img.height + ' px',
            'Aspect Ratio': (img.width / img.height).toFixed(2),
            'X Resolution': String(exif?.XResolution || 'Not available'),
            'Y Resolution': String(exif?.YResolution || 'Not available'),
            'Resolution Unit': String(exif?.ResolutionUnit || 'Not available'),
            'DPI Estimate': exif?.XResolution
              ? Number(exif.XResolution).toFixed(0) + ' DPI'
              : 'Not embedded in image',
            'Color Space': String((exif as Record<string, unknown>)?.ColorSpace || 'Unknown'),
            'Bit Depth': String((exif as Record<string, unknown>)?.BitsPerSample || 'Unknown'),
          })
        }
        img.src = dataUrl
      } catch (error) {
        console.error('Error reading image:', error)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setMetadata(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
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
              <Info className="h-5 w-5 animate-pulse mx-auto mb-2" />
              Analyzing image...
            </div>
          )}

          {metadata && (
            <div className="mt-6 space-y-4">
              <div className="bg-sky-50 rounded-lg p-4 flex items-center gap-3">
                <Ruler className="h-6 w-6 text-sky-600" />
                <div>
                  <div className="font-medium text-sky-800">Image Information</div>
                  <div className="text-sm text-sky-600">
                    {metadata['Image Width']} x {metadata['Image Height']}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(metadata).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">{key}</td>
                        <td className="px-4 py-3 text-gray-900">
                          {value !== null && value !== undefined ? String(value) : 'Not available'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
