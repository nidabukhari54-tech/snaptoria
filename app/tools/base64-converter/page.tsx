'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Copy, Check, Code, Image as ImageIcon } from 'lucide-react'

export default function Base64ConverterPage() {
  const tool = tools.find((t) => t.id === 'base64-converter')!
  const [mode, setMode] = useState<'image-to-base64' | 'base64-to-image'>('image-to-base64')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [base64String, setBase64String] = useState('')
  const [copied, setCopied] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setGeneratedImage(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      setBase64String(result)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setBase64String('')
    setGeneratedImage(null)
  }

  const handleConvertBase64ToImage = () => {
    if (!base64String.trim()) return

    // Add data URI prefix if missing
    let dataUri = base64String.trim()
    if (!dataUri.startsWith('data:image')) {
      dataUri = `data:image/png;base64,${dataUri}`
    }

    setGeneratedImage(dataUri)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(base64String)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage
    link.download = 'converted-image.png'
    link.click()
  }

  return (
    <ToolLayout tool={tool}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'image-to-base64' | 'base64-to-image')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="image-to-base64">Image to Base64</TabsTrigger>
              <TabsTrigger value="base64-to-image">Base64 to Image</TabsTrigger>
            </TabsList>

            <TabsContent value="image-to-base64" className="space-y-6">
              <FileDropzone
                onFileSelect={handleFileSelect}
                file={file}
                preview={preview}
                onClear={handleClear}
              />

              {base64String && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Base64 String ({base64String.length} characters)
                    </span>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <Textarea
                    value={base64String}
                    onChange={(e) => setBase64String(e.target.value)}
                    className="font-mono text-xs h-48"
                    readOnly
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="base64-to-image" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Paste Base64 String</span>
                </div>
                <Textarea
                  value={base64String}
                  onChange={(e) => setBase64String(e.target.value)}
                  placeholder="Paste your base64 string here (with or without data URI prefix)..."
                  className="font-mono text-xs h-48"
                />
                <Button
                  onClick={handleConvertBase64ToImage}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                  disabled={!base64String.trim()}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Convert to Image
                </Button>
              </div>

              {generatedImage && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 text-green-700 text-center">
                    <Check className="h-5 w-5 mx-auto mb-2" />
                    Image converted successfully!
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={generatedImage}
                      alt="Converted from Base64"
                      className="max-h-64 rounded-lg border"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
