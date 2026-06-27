'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Grid3x3 } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const gridOptions = [
  { value: '2x2', cols: 2, rows: 2 },
  { value: '3x3', cols: 3, rows: 3 },
  { value: '4x4', cols: 4, rows: 4 },
  { value: 'custom', cols: 0, rows: 0 },
]

export default function ImageSplitterPage() {
  const tool = tools.find((t) => t.id === 'image-splitter')!
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [gridSize, setGridSize] = useState('2x2')
  const [customRows, setCustomRows] = useState(3)
  const [customCols, setCustomCols] = useState(3)
  const [splitPreviews, setSplitPreviews] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setSplitPreviews([])

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setSplitPreviews([])
  }

  const getGridDimensions = () => {
    const selected = gridOptions.find((g) => g.value === gridSize)
    if (gridSize === 'custom') {
      return { rows: customRows, cols: customCols }
    }
    return { rows: selected?.rows || 2, cols: selected?.cols || 2 }
  }

  const splitImage = async () => {
    if (!preview || !file) return

    setProcessing(true)

    const { rows, cols } = getGridDimensions()
    const img = new Image()

    img.onload = async () => {
      const pieceWidth = img.width / cols
      const pieceHeight = img.height / rows

      const zip = new JSZip()
      const previews: string[] = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const canvas = document.createElement('canvas')
          canvas.width = pieceWidth
          canvas.height = pieceHeight

          const ctx = canvas.getContext('2d')
          if (!ctx) continue

          ctx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          )

          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/png')
          })

          if (blob) {
            const url = URL.createObjectURL(blob)
            previews.push(url)

            // Add to zip
            const filename = `piece_${row + 1}_${col + 1}.png`
            zip.file(filename, blob)
          }
        }
      }

      setSplitPreviews(previews)

      // Generate zip
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'split-images.zip')
    }

    img.src = preview
    setProcessing(false)
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Grid Size</label>
                  <Select value={gridSize} onValueChange={setGridSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gridOptions.map((g) => (
                        <SelectItem key={g.value} value={g.value}>{g.value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {gridSize === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Rows</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={customRows}
                      onChange={(e) => setCustomRows(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Columns</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={customCols}
                      onChange={(e) => setCustomCols(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={splitImage}
                disabled={processing}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                {processing ? (
                  <>
                    <Grid3x3 className="h-4 w-4 mr-2 animate-pulse" />
                    Splitting...
                  </>
                ) : (
                  <>
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Split Image ({getGridDimensions().rows}x{getGridDimensions().cols})
                  </>
                )}
              </Button>

              {splitPreviews.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center text-green-700">
                    <Download className="h-5 w-5 mx-auto mb-2" />
                    Downloaded! Your split-images.zip contains {splitPreviews.length} pieces
                  </div>

                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${getGridDimensions().cols}, 1fr)`
                    }}
                  >
                    {splitPreviews.map((url, i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img src={url} alt={`Piece ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
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
