import { tools, type Tool } from './tools'

/**
 * Snaptoria Assistant brain: 100% client-side keyword matching.
 * No AI, no API calls. The visitor describes what they want to do,
 * we score every tool by keyword hits and answer with tool links.
 */

export interface ChatLink {
  label: string
  href: string
}

export interface ChatAnswer {
  text: string
  links: ChatLink[]
}

export const QUICK_CHIPS = [
  'Compress an image',
  'Crop an image',
  'Check image DPI',
  'Is my image corrupted?',
  'Create a receipt',
] as const

/** Synonyms / visitor phrasing per tool id (on top of name + description). */
const KEYWORDS: Record<string, string[]> = {
  'image-compressor': [
    'compress', 'compression', 'compressor', 'shrink', 'reduce file size',
    'file size', 'smaller file', 'make it smaller', 'kb', 'mb', 'optimize',
    'optimise', 'reduce size', 'squash', 'minify', 'too big', 'large file',
  ],
  'image-resizer': [
    'resize', 'resizer', 'dimensions', 'enlarge', 'make bigger',
    'change dimensions', 'pixels', 'scale', 'resize image', 'width', 'height',
  ],
  'image-cropper': [
    'crop', 'cropper', 'cut', 'trim', 'cut out', 'crop image', 'crop photo',
  ],
  'image-format-converter': [
    'convert', 'converter', 'conversion', 'jpg to png', 'png to jpg',
    'webp to png', 'png to webp', 'jpg to webp', 'heic', 'format',
    'change format', 'gif to png',
  ],
  'image-to-pdf': [
    'image to pdf', 'jpg to pdf', 'png to pdf', 'photo to pdf',
    'photos to pdf', 'images to pdf', 'make a pdf', 'create pdf',
    'combine into pdf', 'pdf from images', 'to pdf',
  ],
  'pdf-dpi-checker': [
    'pdf dpi', 'dpi of a pdf', 'dpi in pdf', 'print ready pdf',
    'pdf resolution', 'check a pdf', 'pdf quality', 'pdf print quality',
  ],
  'dpi-checker': [
    'dpi', 'ppi', '300 dpi', 'print resolution', 'check dpi', 'image dpi',
    'what dpi', 'is it 300 dpi', 'dpi checker',
  ],
  'exif-viewer': [
    'exif', 'metadata', 'gps', 'location data', 'camera info',
    'remove metadata', 'strip metadata', 'photo info', 'remove exif',
    'metadata remover', 'remove location', 'photo details',
  ],
  'image-resolution-checker': [
    'resolution', 'megapixels', 'megapixel', 'high resolution',
    'print size', 'how big can i print', 'is my image high res',
    'pixel dimensions', 'image resolution', 'quality check',
  ],
  'color-palette-extractor': [
    'color palette', 'colour palette', 'colors from image',
    'colours from image', 'extract colors', 'hex', 'hex code',
    'dominant color', 'color picker', 'palette', 'get colors',
  ],
  'corrupt-image-detector': [
    'corrupt', 'corrupted', 'corruption', 'broken image', 'damaged',
    'not opening', "won't open", 'wont open', 'invalid image',
    'image error', 'validate image', 'check if my image', 'file error',
  ],
  'image-rotator': [
    'rotate', 'rotator', 'flip', 'sideways', 'upside down', 'mirror',
    'rotation', 'turn image', 'turn photo', 'flipped',
  ],
  'base64-converter': [
    'base64', 'encode', 'decode', 'data url', 'data uri',
    'embed image', 'base64 string', 'to base64', 'from base64',
  ],
  'favicon-generator': [
    'favicon', 'tab icon', 'website icon', 'favicon.ico', 'browser icon',
    'site icon', 'favicon generator',
  ],
  'image-splitter': [
    'split', 'splitter', 'split image', 'instagram grid', 'grid maker',
    'cut into pieces', 'tiles', 'grid', 'carousel grid',
  ],
  'collage-maker': [
    'collage', 'combine photos', 'combine images', 'montage',
    'photo collage', 'merge photos', 'merge images', 'photo grid',
    'put photos together', 'multiple photos into one',
  ],
  'aspect-ratio-cropper': [
    'aspect ratio', '16:9', '16/9', '1:1', '9:16', '4:5', 'ratio',
    'youtube thumbnail', 'instagram post size', 'story size', 'reel size',
    'tiktok size',
  ],
  'image-filters': [
    'filter', 'filters', 'black and white', 'sepia', 'grayscale',
    'greyscale', 'brightness', 'contrast', 'saturation', 'vintage',
    'edit photo', 'photo effects',
  ],
  'text-watermark': [
    'watermark', 'copyright text', 'logo on image', 'logo on photo',
    'text on image', 'add text', 'add watermark', 'protect my photo',
    'watermark adder',
  ],
  'qr-code-reader': [
    'qr', 'qr code', 'scan code', 'decode qr', 'read qr', 'scan qr',
    'barcode', 'qr reader', 'qr scanner',
  ],
  'invoice-generator': [
    'invoice', 'invoices', 'create invoice', 'invoice maker',
    'invoice generator', 'billing', 'bill',
  ],
  'receipt-generator': [
    'receipt', 'receipts', 'receipt maker', 'receipt generator',
    'create receipt', 'expense receipt', 'bill',
  ],
}

/** Words too generic to score from tool names. */
const NAME_STOPWORDS = new Set([
  'image', 'photo', 'online', 'free', 'tool', 'tools', 'maker',
  'generator', 'adder', 'the', 'a', 'an', 'to', '&',
])

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[?!.,;'"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function wordHit(token: string, keyword: string): boolean {
  if (token === keyword) return true
  // light stemming: "corrupted" hits "corrupt", "crop" hits "cropper"
  if (keyword.length >= 4 && token.startsWith(keyword)) return true
  if (token.length >= 4 && keyword.startsWith(token)) return true
  return false
}

export interface ToolMatch {
  tool: Tool
  score: number
}

export function findToolMatches(message: string): ToolMatch[] {
  const text = normalize(message)
  const padded = ` ${text} `
  const tokens = text.split(' ').filter(Boolean)

  const matches: ToolMatch[] = []
  for (const tool of tools) {
    let score = 0
    const keywords = KEYWORDS[tool.id] ?? []
    for (const kw of keywords) {
      if (kw.includes(' ') || kw.includes(':') || kw.includes('/')) {
        if (padded.includes(` ${kw} `) || text.includes(kw)) score += 3
      } else if (tokens.some((t) => wordHit(t, kw))) {
        score += 2
      }
    }
    // distinctive words from the tool's own name
    for (const w of tool.name.toLowerCase().split(/[\s/&-]+/)) {
      if (w && !NAME_STOPWORDS.has(w) && tokens.some((t) => wordHit(t, w))) {
        score += 2
      }
    }
    if (score > 0) matches.push({ tool, score })
  }
  return matches.sort((a, b) => b.score - a.score)
}

function firstSentence(description: string): string {
  const idx = description.indexOf('. ')
  return idx === -1 ? description : description.slice(0, idx + 1)
}

function toolLink(tool: Tool): ChatLink {
  return { label: `Open ${tool.name}`, href: `/tools/${tool.id}` }
}

const POPULAR_IDS = ['corrupt-image-detector', 'image-compressor', 'dpi-checker']

function popularLinks(): ChatLink[] {
  const links = POPULAR_IDS.map((id) => tools.find((t) => t.id === id))
    .filter((t): t is Tool => Boolean(t))
    .map(toolLink)
  links.push({ label: 'Browse all tools', href: '/tools' })
  return links
}

function hasWord(text: string, words: string[]): boolean {
  const tokens = text.split(' ')
  return words.some((w) => tokens.includes(w))
}

export function getChatAnswer(rawMessage: string): ChatAnswer {
  const text = normalize(rawMessage)
  const matches = findToolMatches(rawMessage)
  const top = matches[0]

  // Greetings (short messages only)
  if (
    text.length <= 24 &&
    /^(hi|hello|hey|salam|aoa|good morning|good afternoon|good evening)\b/.test(text)
  ) {
    return {
      text: "Hello! Tell me what you'd like to do with an image or document — for example \"compress a photo\" or \"make a receipt\" — and I'll take you straight to the right tool.",
      links: popularLinks(),
    }
  }

  // Thanks
  if (/\b(thanks|thank you|thx|shukria)\b/.test(text)) {
    return {
      text: "You're welcome! If you need another tool, just tell me what you want to do.",
      links: [{ label: 'Browse all tools', href: '/tools' }],
    }
  }

  // Confident tool match wins over generic intents
  if (top && top.score >= 4) {
    const close = matches
      .filter((m) => m.tool.id !== top.tool.id && m.score >= 4 && top.score - m.score <= 2)
      .slice(0, 2)
    if (close.length > 0) {
      return {
        text: `The ${top.tool.name} sounds like the best fit — ${firstSentence(top.tool.description)} A couple of close matches are below too.`,
        links: [top.tool, ...close.map((m) => m.tool)].map(toolLink),
      }
    }
    return {
      text: `The ${top.tool.name} is what you need — ${firstSentence(top.tool.description)}`,
      links: [toolLink(top.tool)],
    }
  }

  // Pricing
  if (hasWord(text, ['pricing', 'price', 'cost', 'plans', 'plan', 'subscription', 'upgrade', 'pro']) || text.includes('how much')) {
    return {
      text: 'Every tool is free to use — 10 actions a day, no signup needed. Pro ($9/month) gives you unlimited actions, usage history and priority support. Full details are on the pricing page.',
      links: [{ label: 'See Pricing', href: '/pricing' }],
    }
  }

  // Is it free?
  if (hasWord(text, ['free', 'charge', 'pay', 'payment'])) {
    return {
      text: 'Yes — all Snaptoria tools are free to use, and everything runs 100% in your browser. Your files are never uploaded to a server, so they never leave your device.',
      links: popularLinks(),
    }
  }

  // Account
  if (
    text.includes('sign up') || text.includes('sign in') || text.includes('log in') ||
    hasWord(text, ['signup', 'login', 'account', 'register'])
  ) {
    return {
      text: "You don't need an account to use the tools — just open one and start. Accounts are only for Pro features like usage history. Here are the links if you'd like one:",
      links: [
        { label: 'Sign up', href: '/signup' },
        { label: 'Log in', href: '/login' },
      ],
    }
  }

  // Privacy / safety
  if (hasWord(text, ['safe', 'privacy', 'private', 'upload', 'uploaded', 'server', 'secure', 'data'])) {
    return {
      text: 'Your files are completely safe here: every Snaptoria tool runs 100% in your browser. Nothing is uploaded to a server and nothing is stored — close the tab and your file is gone.',
      links: popularLinks(),
    }
  }

  // Tentative tool match
  if (top && top.score >= 2) {
    return {
      text: `This sounds like the ${top.tool.name} — ${firstSentence(top.tool.description)}`,
      links: [toolLink(top.tool), { label: 'Browse all tools', href: '/tools' }],
    }
  }

  // Fallback
  return {
    text: "I can point you to the right tool — just tell me what you want to do, like \"resize a photo\", \"check if my PDF is print-ready\" or \"read a QR code\". Meanwhile, these are our most popular tools:",
    links: popularLinks(),
  }
}
