'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { MascotDropVisual } from '@/components/mascot-drop-visual'

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
  // Visual-only drag state: drives the mascot's wiggle/chomp and the zone highlight.
  const [isDragging, setIsDragging] = useState(false)
  const [chompKey, setChompKey] = useState(0)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      setChompKey((k) => k + 1)
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
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
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
      onDragLeave={handleDragLeave}
      className={`border-dashed border-2 transition-colors cursor-pointer ${
        isDragging ? 'border-sky-500 bg-sky-50' : 'hover:border-sky-400'
      }`}
    >
      <CardContent className="p-8 md:p-10 flex flex-col items-center justify-center text-center">
        <div className="mb-2">
          <MascotDropVisual active={isDragging} chompKey={chompKey} />
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
