'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import {
  Info,
  FileSearch,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
} from 'lucide-react'

interface PdfImageInfo {
  page: number
  widthPx: number
  heightPx: number
  displayWidthIn: number
  displayHeightIn: number
  dpi: number
}

interface PdfPageInfo {
  page: number
  widthPt: number
  heightPt: number
  widthIn: number
  heightIn: number
}

interface PdfResult {
  pageCount: number
  pages: PdfPageInfo[]
  images: PdfImageInfo[]
  lowestImage: PdfImageInfo | null
}

// PDF transformation matrix in [a b c d e f] form:
//   | a c e |
//   | b d f |
//   | 0 0 1 |
type Matrix = [number, number, number, number, number, number]

const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0]

function multiplyMatrix(m: Matrix, n: Matrix): Matrix {
  // Returns m x n
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ]
}

let workerConfigured = false

function getResolvedObject(objs: any, id: string): Promise<any> {
  return new Promise((resolve) => {
    let settled = false
    const done = (value: any) => {
      if (!settled) {
        settled = true
        resolve(value)
      }
    }
    try {
      const direct = objs.get(id)
      if (direct) {
        done(direct)
        return
      }
    } catch {
      // Object not resolved yet — fall through to the callback form.
    }
    try {
      objs.get(id, (data: any) => done(data))
    } catch {
      done(null)
    }
    setTimeout(() => done(null), 5000)
  })
}

async function getPageObject(page: any, name: string): Promise<any> {
  const fromObjs = await getResolvedObject(page.objs, name)
  if (fromObjs) return fromObjs
  try {
    return await getResolvedObject(page.commonObjs, name)
  } catch {
    return null
  }
}

function imageDimensions(img: any): { w: number; h: number } | null {
  if (!img) return null
  const w = typeof img.width === 'number' ? img.width : img.naturalWidth
  const h = typeof img.height === 'number' ? img.height : img.naturalHeight
  if (typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0) {
    return { w, h }
  }
  return null
}

function verdictFor(dpi: number): { label: string; tone: 'green' | 'amber' | 'red' } {
  if (dpi >= 300) return { label: 'Print-ready (300 DPI)', tone: 'green' }
  if (dpi >= 150) return { label: 'OK for large prints / drafts', tone: 'amber' }
  return { label: 'Low — screen/web only', tone: 'red' }
}

const badgeClasses: Record<'green' | 'amber' | 'red', string> = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
}

export default function PdfDpiCheckerPage() {
  const tool = tools.find((t) => t.id === 'pdf-dpi-checker')!
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<PdfResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setError(null)

    const isPdf =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setError('That file is not a PDF. Please choose a PDF document to check.')
      return
    }

    setLoading(true)
    try {
      const pdfjs: any = await import('pdfjs-dist')
      if (!workerConfigured) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.js',
          import.meta.url
        ).toString()
        workerConfigured = true
      }

      const buffer = await selectedFile.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise
      const OPS = pdfjs.OPS

      const pages: PdfPageInfo[] = []
      const images: PdfImageInfo[] = []

      const recordImage = (
        pageNumber: number,
        dims: { w: number; h: number },
        ctm: Matrix
      ) => {
        // The image is painted into the unit square; the CTM maps that square
        // onto the page, so the axis lengths of the CTM are the printed size
        // in points (1 point = 1/72 inch).
        const displayWidthPt = Math.hypot(ctm[0], ctm[1])
        const displayHeightPt = Math.hypot(ctm[2], ctm[3])
        if (displayWidthPt < 0.5 || displayHeightPt < 0.5) return
        const dpiX = dims.w / (displayWidthPt / 72)
        const dpiY = dims.h / (displayHeightPt / 72)
        images.push({
          page: pageNumber,
          widthPx: dims.w,
          heightPx: dims.h,
          displayWidthIn: displayWidthPt / 72,
          displayHeightIn: displayHeightPt / 72,
          dpi: Math.round(Math.min(dpiX, dpiY)),
        })
      }

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p)
        const view: number[] = page.view
        let pageWidthPt = Math.abs(view[2] - view[0])
        let pageHeightPt = Math.abs(view[3] - view[1])
        if ((page.rotate || 0) % 180 !== 0) {
          const swap = pageWidthPt
          pageWidthPt = pageHeightPt
          pageHeightPt = swap
        }
        pages.push({
          page: p,
          widthPt: Math.round(pageWidthPt),
          heightPt: Math.round(pageHeightPt),
          widthIn: pageWidthPt / 72,
          heightIn: pageHeightPt / 72,
        })

        const opList = await page.getOperatorList()
        let ctm: Matrix = [...IDENTITY]
        const stack: Matrix[] = []

        for (let i = 0; i < opList.fnArray.length; i++) {
          const fn = opList.fnArray[i]
          const args = opList.argsArray[i]

          if (fn === OPS.save) {
            stack.push([...ctm])
          } else if (fn === OPS.restore) {
            const prev = stack.pop()
            if (prev) ctm = prev
          } else if (fn === OPS.transform) {
            ctm = multiplyMatrix(args as Matrix, ctm)
          } else if (fn === OPS.paintFormXObjectBegin) {
            stack.push([...ctm])
            const formMatrix = args?.[0] as Matrix | undefined
            if (formMatrix) ctm = multiplyMatrix(formMatrix, ctm)
          } else if (fn === OPS.paintFormXObjectEnd) {
            const prev = stack.pop()
            if (prev) ctm = prev
          } else if (fn === OPS.paintImageXObject || fn === OPS.paintJpegXObject) {
            const name = args?.[0] as string | undefined
            if (name) {
              const img = await getPageObject(page, name)
              const dims = imageDimensions(img)
              if (dims) recordImage(p, dims, ctm)
            }
          } else if (fn === OPS.paintInlineImageXObject) {
            const dims = imageDimensions(args?.[0])
            if (dims) recordImage(p, dims, ctm)
          }
        }

        page.cleanup()
      }

      const lowestImage =
        images.length > 0
          ? images.reduce((min, img) => (img.dpi < min.dpi ? img : min), images[0])
          : null

      setResult({ pageCount: pdf.numPages, pages, images, lowestImage })

      try {
        await pdf.destroy()
      } catch {
        // Nothing to clean up if destroy fails.
      }
    } catch (err: any) {
      if (err?.name === 'PasswordException') {
        setError(
          'This PDF is password-protected, so it cannot be analysed. Remove the password and try again.'
        )
      } else {
        setError(
          'We could not read that PDF. The file may be corrupt or may not be a valid PDF document.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  const overall = result?.lowestImage ? verdictFor(result.lowestImage.dpi) : null

  return (
    <ToolLayout tool={tool}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <FileDropzone
            accept="application/pdf"
            label="Drop a PDF here or click to upload"
            onFileSelect={handleFileSelect}
            file={file}
            onClear={handleClear}
          />

          {file && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium truncate">{file.name}</span>
                <span className="text-gray-500 flex-shrink-0">({formatSize(file.size)})</span>
              </div>
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {loading && (
            <div className="mt-6 text-center text-gray-500">
              <Info className="h-5 w-5 animate-pulse mx-auto mb-2" />
              Analysing your PDF — reading pages and measuring every image...
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-red-800">Could not check this PDF</div>
                <div className="text-sm text-red-700 mt-1">{error}</div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="bg-sky-50 rounded-lg p-4 flex items-center gap-3">
                <FileSearch className="h-6 w-6 text-sky-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sky-800">PDF DPI Report</div>
                  <div className="text-sm text-sky-600">
                    {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'} —{' '}
                    {result.images.length} embedded{' '}
                    {result.images.length === 1 ? 'image' : 'images'} found
                  </div>
                </div>
              </div>

              {result.images.length === 0 && (
                <div className="bg-sky-50 rounded-lg p-4 flex items-start gap-3">
                  <Info className="h-6 w-6 text-sky-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sky-800">No embedded photos found</div>
                    <p className="text-sm text-sky-700 mt-1">
                      This PDF appears to contain only text and vector graphics. Text and
                      vectors are resolution-independent — they print sharply at any size —
                      so there is no image DPI to worry about in this document.
                    </p>
                  </div>
                </div>
              )}

              {result.lowestImage && overall && (
                <div
                  className={`rounded-lg p-4 flex items-start gap-3 ${
                    overall.tone === 'green'
                      ? 'bg-green-50'
                      : overall.tone === 'amber'
                        ? 'bg-amber-50'
                        : 'bg-red-50'
                  }`}
                >
                  {overall.tone === 'green' ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : overall.tone === 'amber' ? (
                    <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div
                      className={`font-medium ${
                        overall.tone === 'green'
                          ? 'text-green-800'
                          : overall.tone === 'amber'
                            ? 'text-amber-800'
                            : 'text-red-800'
                      }`}
                    >
                      {overall.tone === 'green'
                        ? 'Verdict: Print-ready — every image is 300 DPI or higher'
                        : overall.tone === 'amber'
                          ? 'Verdict: Close — the weakest image is below the 300 DPI print standard'
                          : 'Verdict: Not print-ready — the weakest image is low resolution'}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        overall.tone === 'green'
                          ? 'text-green-700'
                          : overall.tone === 'amber'
                            ? 'text-amber-700'
                            : 'text-red-700'
                      }`}
                    >
                      The lowest-resolution image is on page {result.lowestImage.page} at{' '}
                      {result.lowestImage.dpi} DPI ({result.lowestImage.widthPx} x{' '}
                      {result.lowestImage.heightPx} pixels, printed at{' '}
                      {result.lowestImage.displayWidthIn.toFixed(2)} x{' '}
                      {result.lowestImage.displayHeightIn.toFixed(2)} inches). One weak image
                      decides the print quality of the whole document, so this is the number
                      your print shop will judge by.
                    </p>
                  </div>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                        File Name
                      </td>
                      <td className="px-4 py-3 text-gray-900">{file?.name}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                        File Size
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {file ? formatSize(file.size) : ''}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                        Pages
                      </td>
                      <td className="px-4 py-3 text-gray-900">{result.pageCount}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                        Embedded Images
                      </td>
                      <td className="px-4 py-3 text-gray-900">{result.images.length}</td>
                    </tr>
                    <tr className="last:border-b-0">
                      <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                        Lowest Image DPI
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {result.lowestImage
                          ? `${result.lowestImage.dpi} DPI (page ${result.lowestImage.page})`
                          : 'None — no raster images in this PDF'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Page sizes</h3>
                <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-2 font-medium text-gray-600">Page</th>
                        <th className="px-4 py-2 font-medium text-gray-600">Size (points)</th>
                        <th className="px-4 py-2 font-medium text-gray-600">Size (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.pages.map((pg) => (
                        <tr key={pg.page} className="border-t">
                          <td className="px-4 py-2 text-gray-900">{pg.page}</td>
                          <td className="px-4 py-2 text-gray-900">
                            {pg.widthPt} x {pg.heightPt} pt
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {pg.widthIn.toFixed(2)} x {pg.heightIn.toFixed(2)} in
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {result.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Embedded images</h3>
                  <div className="border rounded-lg overflow-hidden max-h-[28rem] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-2 font-medium text-gray-600">#</th>
                          <th className="px-4 py-2 font-medium text-gray-600">Page</th>
                          <th className="px-4 py-2 font-medium text-gray-600">Image size</th>
                          <th className="px-4 py-2 font-medium text-gray-600">Printed at</th>
                          <th className="px-4 py-2 font-medium text-gray-600">
                            Effective DPI
                          </th>
                          <th className="px-4 py-2 font-medium text-gray-600">Verdict</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.images.map((img, i) => {
                          const v = verdictFor(img.dpi)
                          return (
                            <tr key={i} className="border-t">
                              <td className="px-4 py-2 text-gray-900">{i + 1}</td>
                              <td className="px-4 py-2 text-gray-900">{img.page}</td>
                              <td className="px-4 py-2 text-gray-900">
                                {img.widthPx} x {img.heightPx} px
                              </td>
                              <td className="px-4 py-2 text-gray-900">
                                {img.displayWidthIn.toFixed(2)} x{' '}
                                {img.displayHeightIn.toFixed(2)} in
                              </td>
                              <td className="px-4 py-2 text-gray-900 font-medium">
                                {img.dpi} DPI
                              </td>
                              <td className="px-4 py-2">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeClasses[v.tone]}`}
                                >
                                  {v.label}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
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
