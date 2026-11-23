'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Info, Expand, CheckCircle2, AlertTriangle } from 'lucide-react'
import exifr from 'exifr'

export default function ImageResolutionCheckerPage() {
  const tool = tools.find((t) => t.id === 'image-resolution-checker')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<Record<string, string> | null>(null)
  const [verdict, setVerdict] = useState<{ label: string; highRes: boolean; lines: string[] } | null>(null)
  const [loading, setLoading] = useState(false)

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setLoading(true)
    setVerdict(null)

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

          const w = img.width
          const h = img.height
          const megapixels = (w * h) / 1000000
          const divisor = gcd(w, h)
          const ratioW = w / divisor
          const ratioH = h / divisor
          const aspectRatio =
            ratioW <= 50 && ratioH <= 50 ? `${ratioW}:${ratioH}` : (w / h).toFixed(2) + ':1'
          const print300W = w / 300
          const print300H = h / 300
          const print150W = w / 150
          const print150H = h / 150
          const embeddedDpi = exif?.XResolution ? Number(exif.XResolution).toFixed(0) + ' DPI' : 'Not embedded in image'

          setMetadata({
            'File Name': selectedFile.name,
            'File Size': formatSize(selectedFile.size),
            'File Type': selectedFile.type || 'Unknown',
            'Image Width': w + ' px',
            'Image Height': h + ' px',
            'Resolution': `${w} x ${h} pixels`,
            'Megapixels': megapixels.toFixed(2) + ' MP',
            'Aspect Ratio': aspectRatio,
            'Embedded DPI/PPI': embeddedDpi,
            'Max Print Size at 300 DPI': `${print300W.toFixed(1)} x ${print300H.toFixed(1)} inches`,
            'Max Print Size at 150 DPI': `${print150W.toFixed(1)} x ${print150H.toFixed(1)} inches`,
          })

          const longSide = Math.max(w, h)
          const highRes = megapixels >= 6
          const label =
            megapixels >= 12
              ? 'High resolution'
              : megapixels >= 6
                ? 'High resolution'
                : megapixels >= 2
                  ? 'Moderate resolution'
                  : 'Low resolution'

          const lines: string[] = []
          lines.push(
            `Prints sharply at 300 DPI up to ${print300W.toFixed(1)} x ${print300H.toFixed(1)} inches, or at 150 DPI up to ${print150W.toFixed(1)} x ${print150H.toFixed(1)} inches.`
          )
          if (longSide >= 1920) {
            lines.push('Plenty of resolution for websites, full-HD screens, and social media at full size.')
          } else if (longSide >= 1080) {
            lines.push('Good for social media posts and standard web use; may look soft as a full-width website hero image.')
          } else {
            lines.push('Best kept to thumbnails, small web placements, or small prints — it will look pixelated if shown large.')
          }
          if (megapixels >= 6) {
            lines.push('This counts as a high resolution image for most print and screen uses.')
          }

          setVerdict({ label, highRes, lines })
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
    setVerdict(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <ToolLayout tool={tool}>
      <Card className="mx-auto max-w-4xl rounded-none border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          <FileDropzone
            onFileSelect={handleFileSelect}
            file={file}
            preview={preview}
            onClear={handleClear}
          />

          {loading && (
            <div className="mt-6 text-center text-gray-500">
              <Info className="h-5 w-5 animate-pulse mx-auto mb-2" />
              Checking image resolution...
            </div>
          )}

          {metadata && (
            <div className="mt-6 space-y-4">
              <div className="bg-sky-50 rounded-lg p-4 flex items-center gap-3">
                <Expand className="h-6 w-6 text-sky-600" />
                <div>
                  <div className="font-medium text-sky-800">Image Resolution</div>
                  <div className="text-sm text-sky-600">
                    {metadata['Resolution']} — {metadata['Megapixels']}
                  </div>
                </div>
              </div>

              {verdict && (
                <div
                  className={`rounded-lg p-4 flex items-start gap-3 ${
                    verdict.highRes ? 'bg-green-50' : 'bg-amber-50'
                  }`}
                >
                  {verdict.highRes ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
                  )}
                  <div>
                    <div
                      className={`font-medium ${
                        verdict.highRes ? 'text-green-800' : 'text-amber-800'
                      }`}
                    >
                      Verdict: {verdict.label}
                    </div>
                    <ul
                      className={`text-sm mt-1 space-y-1 ${
                        verdict.highRes ? 'text-green-700' : 'text-amber-700'
                      }`}
                    >
                      {verdict.lines.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

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
