'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { tools } from '@/lib/tools'
import {
  UploadCloud,
  X,
  Download,
  Loader2,
  Lock,
  FileText,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ChevronDown,
  Volume2,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Tool groups                                                         */
/* ------------------------------------------------------------------ */

// Tools that run end-to-end inside the hero panel for image files.
const IMAGE_RUN_HERE = [
  'image-compressor',
  'image-format-converter',
  'image-rotator',
  'dpi-checker',
  'image-resolution-checker',
  'exif-viewer',
  'corrupt-image-detector',
]

// Checkers analyse automatically as soon as a file + tool are chosen.
const CHECKERS = new Set([
  'dpi-checker',
  'image-resolution-checker',
  'exif-viewer',
  'corrupt-image-detector',
  'pdf-dpi-checker',
])

// Tools that need their full workspace — the dropdown hands off to the page.
const FULL_TOOL_IDS = [
  'image-resizer',
  'image-cropper',
  'aspect-ratio-cropper',
  'image-filters',
  'text-watermark',
  'image-splitter',
  'collage-maker',
  'color-palette-extractor',
  'image-to-pdf',
  'base64-converter',
  'favicon-generator',
  'qr-code-reader',
  'invoice-generator',
  'receipt-generator',
]

const FORMATS = [
  { value: 'image/png', label: 'PNG', extension: '.png' },
  { value: 'image/jpeg', label: 'JPG', extension: '.jpg' },
  { value: 'image/webp', label: 'WebP', extension: '.webp' },
]

const SAMPLES = [
  { src: '/samples/sample-mountain-lake.jpg', name: 'sample-mountain-lake.jpg', label: 'Mountain lake', size: '1.58 MB' },
  { src: '/samples/sample-flower-field.jpg', name: 'sample-flower-field.jpg', label: 'Flower field', size: '379 KB' },
  { src: '/samples/sample-sunset.jpg', name: 'sample-sunset.jpg', label: 'Sunset', size: '24 KB' },
]

const toolName = (id: string) => tools.find((t) => t.id === id)?.name ?? id

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function loadImageEl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('decode'))
    img.src = src
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('encode'))), type, quality)
  })
}

/* ------------------------------------------------------------------ */
/* Result model                                                        */
/* ------------------------------------------------------------------ */

type Tone = 'green' | 'amber' | 'red' | 'sky' | 'plain'

interface HeroResult {
  toolId: string
  title: string
  verdict?: string
  tone: Tone
  rows?: { label: string; value: string }[]
  note?: string
  before?: number
  after?: number
  download?: { url: string; name: string; label: string }
  previewUrl?: string
}

const bannerClasses: Record<Tone, string> = {
  green: 'bg-green-50 text-green-800',
  amber: 'bg-amber-50 text-amber-800',
  red: 'bg-red-50 text-red-800',
  sky: 'bg-sky-50 text-sky-800',
  plain: 'bg-gray-50 text-gray-800',
}

function BannerIcon({ tone }: { tone: Tone }) {
  const cls = 'h-5 w-5 flex-shrink-0 mt-0.5'
  if (tone === 'green') return <CheckCircle2 className={`${cls} text-green-600`} />
  if (tone === 'amber') return <AlertTriangle className={`${cls} text-amber-600`} />
  if (tone === 'red') return <XCircle className={`${cls} text-red-600`} />
  return <Info className={`${cls} text-sky-600`} />
}

/* ------------------------------------------------------------------ */
/* PDF DPI analysis (summary version of the PDF DPI Checker tool)      */
/* ------------------------------------------------------------------ */

type Matrix = [number, number, number, number, number, number]
const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0]

function multiplyMatrix(m: Matrix, n: Matrix): Matrix {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ]
}

let pdfWorkerConfigured = false

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
      // fall through to callback form
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
  if (typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0) return { w, h }
  return null
}

interface PdfSummary {
  pageCount: number
  imageCount: number
  lowest: { page: number; dpi: number; w: number; h: number; dw: number; dh: number } | null
}

async function analysePdf(file: File): Promise<PdfSummary> {
  const pdfjs: any = await import('pdfjs-dist')
  if (!pdfWorkerConfigured) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).toString()
    pdfWorkerConfigured = true
  }
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise
  const OPS = pdfjs.OPS
  const images: NonNullable<PdfSummary['lowest']>[] = []

  const recordImage = (pageNumber: number, dims: { w: number; h: number }, ctm: Matrix) => {
    const displayWidthPt = Math.hypot(ctm[0], ctm[1])
    const displayHeightPt = Math.hypot(ctm[2], ctm[3])
    if (displayWidthPt < 0.5 || displayHeightPt < 0.5) return
    const dpiX = dims.w / (displayWidthPt / 72)
    const dpiY = dims.h / (displayHeightPt / 72)
    images.push({
      page: pageNumber,
      dpi: Math.round(Math.min(dpiX, dpiY)),
      w: dims.w,
      h: dims.h,
      dw: displayWidthPt / 72,
      dh: displayHeightPt / 72,
    })
  }

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
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

  const lowest =
    images.length > 0 ? images.reduce((min, img) => (img.dpi < min.dpi ? img : min), images[0]) : null
  const summary = { pageCount: pdf.numPages, imageCount: images.length, lowest }
  try {
    await pdf.destroy()
  } catch {
    // nothing to clean up
  }
  return summary
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function HeroTool() {
  const [file, setFile] = useState<File | null>(null)
  const [kind, setKind] = useState<'image' | 'pdf' | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [toolId, setToolId] = useState('image-compressor')
  const [format, setFormat] = useState('image/png')
  const [rotation, setRotation] = useState(0)
  const [busy, setBusy] = useState<string | null>(null)
  const [sampleBusy, setSampleBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<HeroResult | null>(null)
  const [resultKey, setResultKey] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [chompKey, setChompKey] = useState(0)
  const [ttsSupported, setTtsSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const runSeq = useRef(0)
  const blobUrls = useRef<string[]>([])

  const trackUrl = (url: string) => {
    blobUrls.current.push(url)
    return url
  }

  useEffect(() => {
    return () => {
      blobUrls.current.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [])

  const showResult = (r: HeroResult) => {
    setResult(r)
    setResultKey((k) => k + 1)
  }

  /* ------------------------------ file intake ------------------------------ */

  const loadFile = (f: File) => {
    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    const isImage = f.type.startsWith('image/')
    if (!isPdf && !isImage) {
      setError('That file type is not supported here. Drop an image (JPG, PNG, WebP, GIF) or a PDF.')
      return
    }
    runSeq.current += 1
    setError(null)
    setResult(null)
    setBusy(null)
    setRotation(0)
    setChompKey((k) => k + 1) // mascot takes a happy chomp as the file lands
    setFile(f)
    if (isPdf) {
      setKind('pdf')
      setPreviewUrl(null)
      setDims(null)
      setToolId('pdf-dpi-checker')
    } else {
      setKind('image')
      const url = URL.createObjectURL(f)
      setPreviewUrl(url)
      setDims(null)
      const img = new Image()
      img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight })
      img.src = url
      setToolId((prev) => (IMAGE_RUN_HERE.includes(prev) || FULL_TOOL_IDS.includes(prev) ? prev : 'image-compressor'))
    }
  }

  const clearFile = () => {
    runSeq.current += 1
    setFile(null)
    setKind(null)
    setPreviewUrl(null)
    setDims(null)
    setResult(null)
    setError(null)
    setBusy(null)
    setRotation(0)
  }

  const loadSample = async (s: (typeof SAMPLES)[number]) => {
    setSampleBusy(true)
    setError(null)
    try {
      const res = await fetch(s.src)
      const blob = await res.blob()
      loadFile(new File([blob], s.name, { type: 'image/jpeg' }))
    } catch {
      setError('Could not load that sample. Check your connection and try again.')
    } finally {
      setSampleBusy(false)
    }
  }

  /* ------------------------------ runners ------------------------------ */

  const runCompress = async (f: File) => {
    const seq = ++runSeq.current
    setBusy('Compressing your image…')
    setError(null)
    try {
      const { default: imageCompression } = await import('browser-image-compression')
      const out = await imageCompression(f, {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: f.type,
      })
      if (seq !== runSeq.current) return
      const url = trackUrl(URL.createObjectURL(out))
      showResult({
        toolId: 'image-compressor',
        title: 'Compression complete',
        tone: 'plain',
        before: f.size,
        after: out.size,
        note:
          out.size >= f.size
            ? 'This file was already tightly compressed, so the copy comes out about the same size.'
            : undefined,
        download: { url, name: `compressed-${f.name}`, label: 'Download compressed image' },
      })
    } catch {
      if (seq === runSeq.current)
        setError('We could not compress that file. It may be corrupt or in an unsupported format.')
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  const runConvert = async (f: File, srcUrl: string) => {
    const seq = ++runSeq.current
    setBusy('Converting your image…')
    setError(null)
    try {
      const img = await loadImageEl(srcUrl)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas')
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
      const blob = await canvasToBlob(canvas, format, 0.9)
      if (seq !== runSeq.current) return
      const fmt = FORMATS.find((x) => x.value === format)!
      const url = trackUrl(URL.createObjectURL(blob))
      showResult({
        toolId: 'image-format-converter',
        title: `Converted to ${fmt.label}`,
        tone: 'plain',
        before: f.size,
        after: blob.size,
        download: {
          url,
          name: `${f.name.replace(/\.[^/.]+$/, '')}${fmt.extension}`,
          label: `Download ${fmt.label} image`,
        },
      })
    } catch {
      if (seq === runSeq.current)
        setError('We could not convert that file. It may be corrupt or in an unsupported format.')
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  const runRotate = async (f: File, srcUrl: string, deg: number) => {
    const seq = ++runSeq.current
    setBusy('Rotating your image…')
    setError(null)
    try {
      const img = await loadImageEl(srcUrl)
      const isRotated = deg === 90 || deg === 270
      const canvas = document.createElement('canvas')
      canvas.width = isRotated ? img.naturalHeight : img.naturalWidth
      canvas.height = isRotated ? img.naturalWidth : img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas')
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
      const blob = await canvasToBlob(canvas, f.type || 'image/png', 0.9)
      if (seq !== runSeq.current) return
      const url = trackUrl(URL.createObjectURL(blob))
      showResult({
        toolId: 'image-rotator',
        title: `Rotated ${deg}°`,
        tone: 'plain',
        previewUrl: url,
        download: { url, name: `transformed-${f.name}`, label: 'Download rotated image' },
      })
    } catch {
      if (seq === runSeq.current)
        setError('We could not rotate that file. It may be corrupt or in an unsupported format.')
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  const runDpiChecker = async (f: File, d: { w: number; h: number }) => {
    const seq = ++runSeq.current
    setBusy('Checking image DPI…')
    setError(null)
    try {
      const { default: exifr } = await import('exifr')
      let exif: Record<string, unknown> | null = null
      try {
        exif = await exifr.parse(f)
      } catch {
        // EXIF may not exist
      }
      if (seq !== runSeq.current) return
      const xRes = exif?.XResolution ? Number(exif.XResolution) : null
      const verdict =
        xRes === null
          ? 'No DPI value is embedded in this image'
          : xRes >= 300
            ? `Embedded at ${Math.round(xRes)} DPI — meets the 300 DPI print standard`
            : `Embedded at ${Math.round(xRes)} DPI — below the 300 DPI print standard`
      showResult({
        toolId: 'dpi-checker',
        title: 'Image DPI Check',
        verdict,
        tone: xRes === null ? 'amber' : xRes >= 300 ? 'green' : 'amber',
        rows: [
          { label: 'Dimensions', value: `${d.w} × ${d.h} px` },
          { label: 'Embedded DPI', value: xRes ? `${Math.round(xRes)} DPI` : 'Not embedded in image' },
          { label: 'Prints at 300 DPI up to', value: `${(d.w / 300).toFixed(1)} × ${(d.h / 300).toFixed(1)} in` },
          { label: 'Prints at 150 DPI up to', value: `${(d.w / 150).toFixed(1)} × ${(d.h / 150).toFixed(1)} in` },
        ],
        note:
          xRes === null
            ? 'Without an embedded DPI, printers and design apps fall back to a default (usually 72–96 DPI) — what matters is the pixel count versus the size you print at.'
            : undefined,
      })
    } catch {
      if (seq === runSeq.current) setError('We could not read that image. It may be corrupt or unsupported.')
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  const runResolutionChecker = async (f: File, d: { w: number; h: number }) => {
    const seq = ++runSeq.current
    setBusy('Checking image resolution…')
    setError(null)
    try {
      const { default: exifr } = await import('exifr')
      let exif: Record<string, unknown> | null = null
      try {
        exif = await exifr.parse(f)
      } catch {
        // EXIF may not exist
      }
      if (seq !== runSeq.current) return
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
      const w = d.w
      const h = d.h
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
      const label =
        megapixels >= 6 ? 'High resolution' : megapixels >= 2 ? 'Moderate resolution' : 'Low resolution'
      const longSide = Math.max(w, h)
      const screenLine =
        longSide >= 1920
          ? 'Plenty of resolution for websites, full-HD screens, and social media at full size.'
          : longSide >= 1080
            ? 'Good for social media posts and standard web use; may look soft as a full-width website hero image.'
            : 'Best kept to thumbnails, small web placements, or small prints — it will look pixelated if shown large.'
      showResult({
        toolId: 'image-resolution-checker',
        title: 'Image Resolution Check',
        verdict: `Verdict: ${label}`,
        tone: megapixels >= 6 ? 'green' : 'amber',
        rows: [
          { label: 'Resolution', value: `${w} × ${h} pixels` },
          { label: 'Megapixels', value: `${megapixels.toFixed(2)} MP` },
          { label: 'Aspect Ratio', value: aspectRatio },
          {
            label: 'Embedded DPI/PPI',
            value: exif?.XResolution ? `${Number(exif.XResolution).toFixed(0)} DPI` : 'Not embedded in image',
          },
          { label: 'Max Print Size at 300 DPI', value: `${print300W.toFixed(1)} × ${print300H.toFixed(1)} inches` },
          { label: 'Max Print Size at 150 DPI', value: `${print150W.toFixed(1)} × ${print150H.toFixed(1)} inches` },
        ],
        note: `Prints sharply at 300 DPI up to ${print300W.toFixed(1)} × ${print300H.toFixed(1)} inches. ${screenLine}`,
      })
    } catch {
      if (seq === runSeq.current) setError('We could not read that image. It may be corrupt or unsupported.')
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  const runExif = async (f: File, srcUrl: string, d: { w: number; h: number } | null) => {
    const seq = ++runSeq.current
    setBusy('Reading photo metadata…')
    setError(null)
    try {
      const { default: exifr } = await import('exifr')
      let exif: any = null
      try {
        exif = await exifr.parse(f)
      } catch {
        // treated as no metadata below
      }
      if (seq !== runSeq.current) return
      if (!exif || Object.keys(exif).length === 0) {
        showResult({
          toolId: 'exif-viewer',
          title: 'EXIF Viewer & Metadata Remover',
          verdict: 'No EXIF metadata found in this image',
          tone: 'sky',
          rows: d ? [{ label: 'Dimensions', value: `${d.w} × ${d.h} px` }] : [],
          note: 'There is nothing stored to strip — this image carries no camera or location data.',
        })
        return
      }
      const make = exif.Make ? String(exif.Make).trim() : ''
      const model = exif.Model ? String(exif.Model).trim() : ''
      const camera = model ? (make && !model.startsWith(make) ? `${make} ${model}` : model) : make || 'Not recorded'
      const lat = typeof exif.latitude === 'number' ? exif.latitude : null
      const lng = typeof exif.longitude === 'number' ? exif.longitude : null
      const hasGps = lat !== null && lng !== null ? true : 'GPSLatitude' in exif || 'GPSLongitude' in exif
      const gpsText =
        lat !== null && lng !== null
          ? `Present (${lat.toFixed(5)}, ${lng.toFixed(5)})`
          : hasGps
            ? 'Present'
            : 'Not present'
      let dateText = 'Not recorded'
      const dto: any = (exif as any).DateTimeOriginal
      if (dto instanceof Date) dateText = dto.toLocaleString()
      else if (dto) dateText = String(dto)

      // Cleaned copy — same canvas re-encode as the full tool.
      let download: HeroResult['download']
      try {
        const img = await loadImageEl(srcUrl)
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const blob = await canvasToBlob(canvas, 'image/jpeg', 0.9)
          const url = trackUrl(URL.createObjectURL(blob))
          download = {
            url,
            name: `cleaned-${f.name.replace(/\.[^/.]+$/, '')}.jpg`,
            label: 'Download cleaned copy (no EXIF)',
          }
        }
      } catch {
        // download is a bonus; the readout still stands
      }
      if (seq !== runSeq.current) return
      showResult({
        toolId: 'exif-viewer',
        title: 'EXIF Viewer & Metadata Remover',
        verdict: hasGps ? 'Location data found in this photo' : 'No location data found',
        tone: hasGps ? 'amber' : 'green',
        rows: [
          ...(d ? [{ label: 'Dimensions', value: `${d.w} × ${d.h} px` }] : []),
          { label: 'Camera', value: camera },
          { label: 'GPS Location', value: gpsText },
          { label: 'Date Taken', value: dateText },
          { label: 'Metadata Fields', value: `${Object.keys(exif).length} found` },
        ],
        note: hasGps
          ? 'This photo carries GPS coordinates. Download the cleaned copy before sharing it publicly — re-saving through a canvas strips the metadata.'
          : 'The full EXIF Viewer lists every stored field. Downloading the cleaned copy re-saves the photo with no metadata attached.',
        download,
      })
    } catch {
      if (seq === runSeq.current) setError('We could not read metadata from that image.')
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  const runCorrupt = async (f: File, srcUrl: string) => {
    const seq = ++runSeq.current
    setBusy('Testing the image…')
    setError(null)
    try {
      const img = await loadImageEl(srcUrl)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      let ok = false
      try {
        ctx?.drawImage(img, 0, 0)
        ctx?.getImageData(0, 0, 1, 1)
        ok = true
      } catch {
        ok = false
      }
      if (seq !== runSeq.current) return
      if (ok) {
        showResult({
          toolId: 'corrupt-image-detector',
          title: 'Corrupt Image Detector',
          verdict: 'Image is Valid',
          tone: 'green',
          rows: [
            { label: 'Dimensions', value: `${img.naturalWidth} × ${img.naturalHeight} px` },
            { label: 'File Size', value: formatSize(f.size) },
            { label: 'File Type', value: f.type || 'Unknown' },
          ],
          note: `Image is valid. Dimensions: ${img.naturalWidth} x ${img.naturalHeight} pixels`,
        })
      } else {
        showResult({
          toolId: 'corrupt-image-detector',
          title: 'Corrupt Image Detector',
          verdict: 'Image is Corrupt or Invalid',
          tone: 'red',
          note: 'Image has corrupt or missing data',
        })
      }
    } catch {
      if (seq !== runSeq.current) return
      showResult({
        toolId: 'corrupt-image-detector',
        title: 'Corrupt Image Detector',
        verdict: 'Image is Corrupt or Invalid',
        tone: 'red',
        note: 'Failed to load image - file may be corrupt or unsupported format',
      })
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  const runPdfDpi = async (f: File) => {
    const seq = ++runSeq.current
    setBusy('Analysing your PDF — measuring every embedded image…')
    setError(null)
    try {
      const s = await analysePdf(f)
      if (seq !== runSeq.current) return
      if (s.imageCount === 0) {
        showResult({
          toolId: 'pdf-dpi-checker',
          title: 'PDF DPI Report',
          verdict: 'No embedded photos found',
          tone: 'sky',
          rows: [
            { label: 'Pages', value: String(s.pageCount) },
            { label: 'Embedded Images', value: '0' },
          ],
          note: 'This PDF appears to contain only text and vector graphics. Text and vectors are resolution-independent — they print sharply at any size — so there is no image DPI to worry about.',
        })
        return
      }
      const low = s.lowest!
      const tone: Tone = low.dpi >= 300 ? 'green' : low.dpi >= 150 ? 'amber' : 'red'
      const verdict =
        tone === 'green'
          ? 'Print-ready — every image is 300 DPI or higher'
          : tone === 'amber'
            ? 'Close — the weakest image is below the 300 DPI print standard'
            : 'Not print-ready — the weakest image is low resolution'
      showResult({
        toolId: 'pdf-dpi-checker',
        title: 'PDF DPI Report',
        verdict: `Verdict: ${verdict}`,
        tone,
        rows: [
          { label: 'Pages', value: String(s.pageCount) },
          { label: 'Embedded Images', value: String(s.imageCount) },
          { label: 'Lowest Image DPI', value: `${low.dpi} DPI (page ${low.page})` },
        ],
        note: `The lowest-resolution image is on page ${low.page} at ${low.dpi} DPI (${low.w} x ${low.h} pixels, printed at ${low.dw.toFixed(2)} x ${low.dh.toFixed(2)} inches). One weak image decides the print quality of the whole document.`,
      })
    } catch (err: any) {
      if (seq !== runSeq.current) return
      if (err?.name === 'PasswordException') {
        setError('This PDF is password-protected, so it cannot be analysed. Remove the password and try again.')
      } else {
        setError('We could not read that PDF. The file may be corrupt or may not be a valid PDF document.')
      }
    } finally {
      if (seq === runSeq.current) setBusy(null)
    }
  }

  /* ------------------------------ effects ------------------------------ */

  // Checkers run automatically when a file and a checker tool are both set.
  useEffect(() => {
    if (!file || !CHECKERS.has(toolId)) return
    if (toolId === 'pdf-dpi-checker') {
      if (kind === 'pdf') void runPdfDpi(file)
      return
    }
    if (kind !== 'image' || !previewUrl) return
    if (toolId === 'corrupt-image-detector') {
      void runCorrupt(file, previewUrl)
      return
    }
    if (!dims) return // dpi / resolution / exif wait for dimensions
    if (toolId === 'dpi-checker') void runDpiChecker(file, dims)
    else if (toolId === 'image-resolution-checker') void runResolutionChecker(file, dims)
    else if (toolId === 'exif-viewer') void runExif(file, previewUrl, dims)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, toolId, kind, dims, previewUrl])

  const handleToolChange = (id: string) => {
    runSeq.current += 1
    setToolId(id)
    setResult(null)
    setError(null)
    setBusy(null)
    setRotation(0)
  }

  const handleRotateClick = () => {
    if (!file || !previewUrl) return
    const next = (rotation + 90) % 360
    setRotation(next)
    void runRotate(file, previewUrl, next)
  }

  const handleRunClick = () => {
    if (!file) return
    if (toolId === 'image-compressor') void runCompress(file)
    else if (toolId === 'image-format-converter' && previewUrl) void runConvert(file, previewUrl)
  }

  const downloadResult = () => {
    if (!result?.download) return
    const a = document.createElement('a')
    a.href = result.download.url
    a.download = result.download.name
    a.click()
  }

  /* ------------------------------ render ------------------------------ */

  const isFullTool = FULL_TOOL_IDS.includes(toolId)
  const savings =
    result && typeof result.before === 'number' && typeof result.after === 'number' && result.before > 0
      ? Math.round((1 - result.after / result.before) * 100)
      : null

  /* ------------------------- mascot + talking guide ------------------------- */

  const bubbleText = result
    ? 'Done! Download it below — or feed me another.'
    : dragOver
      ? 'Yes — drop it right here!'
      : file
        ? "Got it! Pick a tool below and I'll get to work."
        : "Feed me a photo or PDF — I'll do the work right here!"

  const guideLine = result
    ? 'Done! Download your result, or clear the file and try another tool.'
    : file && isFullTool
      ? 'That tool needs a full workspace — tap its button and it opens on its own page, ready to use.'
      : file
        ? 'Your file is in! Now choose what to do with it from the dropdown, then press Run.'
        : "Hi! I'm your guide. Drop a photo or PDF in the box above, pick a tool from the dropdown, and press Run — it all happens in your browser, nothing is uploaded."

  useEffect(() => {
    setTtsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  // Stop speaking when the flow moves on or the panel unmounts.
  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [guideLine])

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  const speakGuide = () => {
    if (!ttsSupported) return
    const synth = window.speechSynthesis
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(guideLine)
    utterance.lang = 'en-US'
    utterance.rate = 1
    const englishVoice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith('en'))
    if (englishVoice) utterance.voice = englishVoice
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    synth.speak(utterance)
  }

  const selectClasses =
    'w-full appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-gray-800 shadow-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200'

  return (
    <div className="relative z-10 mx-auto mt-6 max-w-3xl text-left">
      {/* Open-mouth mascot (public/mascot-mouth.webp — its mouth sits over the
          drop zone's top edge, "receiving" the file) */}
      <div className="pointer-events-none absolute -top-10 right-3 z-20 flex items-end md:-top-14 md:right-6">
        <div className="relative mb-14 mr-1 hidden max-w-[200px] rounded-2xl bg-white px-3.5 py-2.5 text-[13px] font-medium leading-snug text-gray-700 shadow-xl ring-1 ring-black/5 sm:block">
          {bubbleText}
          <span aria-hidden className="absolute -right-1 bottom-5 h-3 w-3 rotate-45 bg-white" />
        </div>
        <div className={dragOver ? 'hero-wiggle' : 'hero-float'}>
          <div key={chompKey} className={chompKey > 0 ? 'hero-chomp' : undefined}>
            <NextImage
              src="/mascot-mouth.webp"
              alt="Snaptoria mascot with its mouth open, ready for your file"
              width={128}
              height={128}
              priority
              className="h-[76px] w-[76px] rounded-full object-cover shadow-2xl ring-4 ring-white md:h-[120px] md:w-[120px]"
            />
          </div>
        </div>
      </div>
      <div
        className="rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/5 sm:p-7"
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const f = e.dataTransfer.files?.[0]
          if (f) loadFile(f)
        }}
      >
        {/* Drop zone / file state */}
        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-9 text-center transition-all ${
              dragOver
                ? 'border-sky-500 bg-sky-100/80 scale-[1.01]'
                : 'border-sky-300 bg-sky-50/70 hover:border-sky-400 hover:bg-sky-50'
            }`}
          >
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-200">
              <UploadCloud className="h-7 w-7" />
            </span>
            <span className="text-lg font-semibold text-gray-900">Drop your image or PDF here</span>
            <span className="mt-1 text-sm text-gray-500">
              or <span className="font-medium text-sky-600 underline underline-offset-2">click to browse</span> — JPG,
              PNG, WebP, GIF or PDF
            </span>
          </button>
        ) : (
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
              dragOver ? 'border-sky-400 bg-sky-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            {kind === 'image' && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <FileText className="h-7 w-7" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-gray-900">{file.name}</div>
              <div className="text-xs text-gray-500">
                {formatSize(file.size)}
                {dims ? ` · ${dims.w} × ${dims.h} px` : kind === 'pdf' ? ' · PDF document' : ''}
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove file and start over"
              className="flex-shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) loadFile(f)
            e.target.value = ''
          }}
        />

        {/* Controls */}
        {file && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <select
                value={toolId}
                onChange={(e) => handleToolChange(e.target.value)}
                className={selectClasses}
                aria-label="Choose a tool"
              >
                <optgroup label="Run it right here">
                  {kind === 'pdf' ? (
                    <option value="pdf-dpi-checker">{toolName('pdf-dpi-checker')}</option>
                  ) : (
                    IMAGE_RUN_HERE.map((id) => (
                      <option key={id} value={id}>
                        {toolName(id)}
                      </option>
                    ))
                  )}
                </optgroup>
                <optgroup label="Full tools — open the workspace">
                  {FULL_TOOL_IDS.map((id) => (
                    <option key={id} value={id}>
                      {toolName(id)}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {toolId === 'image-format-converter' && kind === 'image' && (
              <div className="relative sm:w-32">
                <select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value)
                    setResult(null)
                  }}
                  className={selectClasses}
                  aria-label="Target format"
                >
                  {FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>
                      To {f.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            )}

            {toolId === 'image-rotator' && kind === 'image' && (
              <button
                type="button"
                onClick={handleRotateClick}
                disabled={!!busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600 disabled:opacity-60"
              >
                <RotateCw className="h-4 w-4" />
                Rotate 90°
              </button>
            )}

            {(toolId === 'image-compressor' || toolId === 'image-format-converter') && kind === 'image' && (
              <button
                type="button"
                onClick={handleRunClick}
                disabled={!!busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {toolId === 'image-compressor' ? 'Compress image' : 'Convert image'}
              </button>
            )}
          </div>
        )}

        {/* Full-tool handoff */}
        {file && isFullTool && (
          <div className="hero-result-reveal mt-5 flex flex-col items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-sky-900">
              The <span className="font-semibold">{toolName(toolId)}</span> needs room to work — it opens in its
              full workspace.
            </p>
            <Link
              href={`/tools/${toolId}`}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
            >
              Open {toolName(toolId)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Busy + error */}
        {busy && (
          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-sky-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            {busy}
          </div>
        )}
        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div key={resultKey} className="hero-result-reveal mt-6 border-t border-gray-100 pt-5">
            <div className="mb-3 text-sm font-semibold text-gray-900">{result.title}</div>

            {result.verdict && (
              <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 ${bannerClasses[result.tone]}`}>
                <BannerIcon tone={result.tone} />
                <span className="text-sm font-medium">{result.verdict}</span>
              </div>
            )}

            {typeof result.before === 'number' && typeof result.after === 'number' && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">Original</div>
                  <div className="text-lg font-semibold text-gray-900">{formatSize(result.before)}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300" />
                <div>
                  <div className="text-xs text-gray-500">Result</div>
                  <div className="text-lg font-semibold text-green-600">{formatSize(result.after)}</div>
                </div>
                {savings !== null && savings > 0 ? (
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Saved {savings}%
                  </span>
                ) : savings !== null ? (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                    About the same size
                  </span>
                ) : null}
              </div>
            )}

            {result.previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.previewUrl}
                alt="Result preview"
                className="mx-auto mt-2 max-h-56 rounded-lg border border-gray-200"
              />
            )}

            {result.rows && result.rows.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <tbody>
                    {result.rows.map((row) => (
                      <tr key={row.label} className="border-b last:border-b-0">
                        <td className="w-2/5 bg-gray-50 px-3.5 py-2.5 font-medium text-gray-600">{row.label}</td>
                        <td className="px-3.5 py-2.5 text-gray-900">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.note && <p className="mt-3 text-sm leading-relaxed text-gray-500">{result.note}</p>}

            {result.download && (
              <button
                type="button"
                onClick={downloadResult}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600"
              >
                <Download className="h-4 w-4" />
                {result.download.label}
              </button>
            )}

            <p className="mt-3.5 text-center text-xs text-gray-400">
              Want more options?{' '}
              <Link href={`/tools/${result.toolId}`} className="font-medium text-sky-600 hover:underline">
                Open the full {toolName(result.toolId)} →
              </Link>
            </p>
          </div>
        )}

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5" />
          Your file never leaves this tab — everything runs in your browser.
        </p>
      </div>

      {/* Talking guide — Shutter Buddy explains the flow and can read it aloud */}
      <div className="mt-5 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:gap-4 sm:p-5">
        <div className={`flex-shrink-0 ${speaking ? 'guide-talk' : ''}`}>
          <NextImage
            src="/mascot-shutter.webp"
            alt="Snaptoria guide"
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-sky-100 md:h-16 md:w-16"
          />
        </div>
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-gray-700">{guideLine}</p>
        {ttsSupported && (
          <button
            type="button"
            onClick={speakGuide}
            aria-label="Listen to the guide"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600"
          >
            <Volume2 className="h-4 w-4" />
            Listen
          </button>
        )}
      </div>

      {/* Samples */}
      <div className="mt-7 text-center">
        <p className="mb-3 text-sm font-medium text-sky-100">Or try one of these:</p>
        <div className="flex items-start justify-center gap-4 sm:gap-5">
          {SAMPLES.map((s) => (
            <button
              key={s.src}
              type="button"
              onClick={() => loadSample(s)}
              disabled={sampleBusy}
              className="group w-20 sm:w-24"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.label}
                className="h-16 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-white/30 transition group-hover:ring-white sm:h-[4.5rem] sm:w-24"
                loading="lazy"
              />
              <span className="mt-1.5 block text-xs font-medium text-white">{s.label}</span>
              <span className="block text-[11px] text-sky-200">{s.size}</span>
            </button>
          ))}
        </div>
        {sampleBusy && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-sky-100">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading sample…
          </p>
        )}
      </div>
    </div>
  )
}
