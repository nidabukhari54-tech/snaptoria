'use client'

import { useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface FileDropzoneProps {
  accept?: string
  onFileSelect: (file: File) => void
  file?: File | null
  preview?: string | null
  onClear?: () => void
  multiple?: boolean
  files?: File[]
  previews?: string[]
  label?: string
}

export function FileDropzone({
  accept = 'image/*',
  onFileSelect,
  file,
  preview,
  onClear,
  multiple = false,
  files,
  previews,
  label = 'Drop an image here or click to upload'
}: FileDropzoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const droppedFiles = Array.from(e.dataTransfer.files)
      if (multiple && droppedFiles.length > 0) {
        droppedFiles.forEach((f) => onFileSelect(f))
      } else if (droppedFiles.length > 0) {
        onFileSelect(droppedFiles[0])
      }
    },
    [onFileSelect, multiple]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles) {
        if (multiple) {
          Array.from(selectedFiles).forEach((f) => onFileSelect(f))
        } else {
          onFileSelect(selectedFiles[0])
        }
      }
    },
    [onFileSelect, multiple]
  )

  if (multiple && previews && previews.length > 0) {
    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {previews.map((p, i) => (
            <div key={i} className="relative group">
              <img
                src={p}
                alt={`Preview ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              {onClear && (
                <button
                  onClick={() => onClear()}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={() => document.getElementById('file-input')?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Add more images
        </Button>
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    )
  }

  if (preview && file) {
    return (
      <div className="relative inline-block">
        <img
          src={preview}
          alt={file.name}
          className="max-h-96 mx-auto rounded-lg shadow-md"
        />
        {onClear && (
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <Card
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-dashed border-2 hover:border-sky-400 transition-colors cursor-pointer"
    >
      <CardContent className="p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-sky-50 rounded-full p-4 mb-4">
          <Upload className="h-8 w-8 text-sky-500" />
        </div>
        <p className="text-gray-600 mb-4">{label}</p>
        <Button
          variant="outline"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Choose file
        </Button>
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
