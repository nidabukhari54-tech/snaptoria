'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated visual tile for a tool card. Pure inline SVG + CSS keyframes
 * (see .tool-visual rules in app/globals.css). Each scene demonstrates
 * what the tool does in a ~2s loop. Animations play on card hover or
 * when the card scrolls into view; they honour prefers-reduced-motion.
 */

const INK = '#0284c7'
const MID = '#38bdf8'
const PALE = '#bae6fd'
const FILL = '#e0f2fe'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#f59e0b'

/** Simple photo glyph: frame + mountain + sun. */
function Img({
  x,
  y,
  w,
  h,
  className,
  style,
}: {
  x: number
  y: number
  w: number
  h: number
  className?: string
  style?: React.CSSProperties
}) {
  const mx = x + w * 0.14
  const my = y + h * 0.78
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={FILL} stroke={INK} strokeWidth={1.6} />
      <circle cx={x + w * 0.72} cy={y + h * 0.3} r={w * 0.09} fill={AMBER} />
      <polyline
        points={`${mx},${my} ${x + w * 0.42},${y + h * 0.42} ${x + w * 0.6},${y + h * 0.62} ${x + w * 0.74},${y + h * 0.48} ${x + w * 0.88},${my}`}
        fill="none"
        stroke={MID}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </g>
  )
}

/** Simple document glyph. */
function Doc({
  x,
  y,
  w,
  h,
  className,
  style,
}: {
  x: number
  y: number
  w: number
  h: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#ffffff" stroke={INK} strokeWidth={1.6} />
      <path d={`M ${x + w - 10} ${y} l 10 10 l -10 0 z`} fill={PALE} />
    </g>
  )
}

function Txt({
  x,
  y,
  children,
  size = 9,
  fill = INK,
  weight = 600,
  className,
  style,
  anchor = 'middle',
}: {
  x: number
  y: number
  children: React.ReactNode
  size?: number
  fill?: string
  weight?: number
  className?: string
  style?: React.CSSProperties
  anchor?: string
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor as 'middle'}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      className={className}
      style={style}
    >
      {children}
    </text>
  )
}

function Scene({ id }: { id: string }) {
  switch (id) {
    case 'image-compressor':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <g className="ta ta-shrink">
            <Img x={30} y={8} w={52} h={36} />
          </g>
          <path d="M 92 18 l 0 12 M 87 25 l 5 6 l 5 -6" stroke={GREEN} strokeWidth={2.2} fill="none" strokeLinecap="round" className="ta ta-bob" />
          <Txt x={56} y={60} size={10} className="ta ta-c1 ta-cycle2">2.4 MB</Txt>
          <Txt x={56} y={60} size={10} fill={GREEN} className="ta ta-c2 ta-cycle2" style={{ animationDelay: '-1.2s' }}>212 KB</Txt>
        </svg>
      )
    case 'image-resizer':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <g className="ta ta-pulse">
            <rect x={31} y={10} width={50} height={36} rx={3} fill={FILL} stroke={INK} strokeWidth={1.6} strokeDasharray="4 3" />
            {[
              [31, 10], [81, 10], [31, 46], [81, 46],
            ].map(([cx, cy], i) => (
              <rect key={i} x={cx - 3.5} y={cy - 3.5} width={7} height={7} fill="#ffffff" stroke={INK} strokeWidth={1.6} />
            ))}
            <polyline points="40,38 52,24 60,32 66,26 72,38" fill="none" stroke={MID} strokeWidth={1.8} strokeLinejoin="round" />
          </g>
          <Txt x={56} y={62} size={9} className="ta ta-c1 ta-cycle2">800 × 600</Txt>
          <Txt x={56} y={62} size={9} fill={GREEN} className="ta ta-c2 ta-cycle2" style={{ animationDelay: '-1.2s' }}>1920 × 1080</Txt>
        </svg>
      )
    case 'image-cropper':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={22} y={10} w={68} h={44} />
          <g className="ta ta-glide">
            <rect x={36} y={19} width={42} height={28} fill="rgba(255,255,255,0.25)" stroke={INK} strokeWidth={1.8} strokeDasharray="5 3" />
            {[
              [36, 19], [78, 19], [36, 47], [78, 47],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={2.6} fill="#ffffff" stroke={INK} strokeWidth={1.5} />
            ))}
          </g>
        </svg>
      )
    case 'image-format-converter':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={10} y={18} w={34} h={32} />
          <path d="M 48 34 l 10 0 M 54 29 l 6 5 l -6 5" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" className="ta ta-bob" />
          <g className="ta ta-c1 ta-cycle3">
            <rect x={64} y={19} width={40} height={30} rx={5} fill={FILL} stroke={INK} strokeWidth={1.6} />
            <Txt x={84} y={38} size={11}>JPG</Txt>
          </g>
          <g className="ta ta-c2 ta-cycle3" style={{ animationDelay: '-2s' }}>
            <rect x={64} y={19} width={40} height={30} rx={5} fill="#dcfce7" stroke={GREEN} strokeWidth={1.6} />
            <Txt x={84} y={38} size={11} fill={GREEN}>PNG</Txt>
          </g>
          <g className="ta ta-c3 ta-cycle3" style={{ animationDelay: '-1s' }}>
            <rect x={64} y={19} width={40} height={30} rx={5} fill="#ede9fe" stroke="#7c3aed" strokeWidth={1.6} />
            <Txt x={84} y={38} size={10} fill="#7c3aed">WebP</Txt>
          </g>
        </svg>
      )
    case 'image-to-pdf':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Doc x={62} y={8} w={38} h={52} />
          <Txt x={81} y={26} size={10} fill={RED} weight={700}>PDF</Txt>
          <rect x={70} y={34} width={22} height={3.4} rx={1.7} fill={PALE} className="ta ta-fade-seq" style={{ animationDelay: '0.9s' }} />
          <rect x={70} y={41} width={22} height={3.4} rx={1.7} fill={PALE} className="ta ta-fade-seq" style={{ animationDelay: '1.2s' }} />
          <rect x={70} y={48} width={15} height={3.4} rx={1.7} fill={PALE} className="ta ta-fade-seq" style={{ animationDelay: '1.5s' }} />
          <Img x={12} y={8} w={26} h={15} className="ta ta-fade-seq" />
          <Img x={12} y={27} w={26} h={15} className="ta ta-fade-seq" style={{ animationDelay: '0.3s' }} />
          <Img x={12} y={46} w={26} h={15} className="ta ta-fade-seq" style={{ animationDelay: '0.6s' }} />
          <path d="M 42 34 l 12 0 M 50 29 l 6 5 l -6 5" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'pdf-dpi-checker':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Doc x={18} y={6} w={42} h={54} />
          <rect x={26} y={16} width={26} height={3.4} rx={1.7} fill={PALE} />
          <rect x={26} y={23} width={26} height={3.4} rx={1.7} fill={PALE} />
          <rect x={26} y={30} width={18} height={3.4} rx={1.7} fill={PALE} />
          <g className="ta ta-magnify">
            <circle cx={46} cy={40} r={11} fill="rgba(224,242,254,0.5)" stroke={INK} strokeWidth={2.6} />
            <line x1={54} y1={48} x2={64} y2={58} stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
          </g>
          <g className="ta ta-pop">
            <rect x={66} y={44} width={44} height={16} rx={8} fill={GREEN} />
            <text x={88} y={55.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">300 DPI</text>
          </g>
        </svg>
      )
    case 'dpi-checker':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={10} y={12} w={40} h={32} />
          <line x1={10} y1={56} x2={102} y2={56} stroke={INK} strokeWidth={1.6} />
          {[10, 26, 42, 58, 74, 90].map((x) => (
            <line key={x} x1={x} y1={56} x2={x} y2={51} stroke={INK} strokeWidth={1.4} />
          ))}
          <line x1={102} y1={56} x2={102} y2={49} stroke={INK} strokeWidth={1.4} />
          <Txt x={78} y={36} size={17} weight={700} className="ta ta-c1 ta-cycle3">72</Txt>
          <Txt x={78} y={36} size={17} weight={700} className="ta ta-c2 ta-cycle3" style={{ animationDelay: '-2s' }}>150</Txt>
          <Txt x={78} y={36} size={17} weight={700} fill={GREEN} className="ta ta-c3 ta-cycle3" style={{ animationDelay: '-1s' }}>300</Txt>
          <Txt x={78} y={48} size={8} fill="#64748b">DPI</Txt>
        </svg>
      )
    case 'exif-viewer':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={8} y={14} w={42} h={38} />
          <g className="ta ta-fade-seq">
            <rect x={58} y={8} width={48} height={13} rx={6.5} fill={FILL} stroke={INK} strokeWidth={1.2} />
            <Txt x={82} y={17.5} size={7.5}>GPS 40.7°N</Txt>
            <line x1={61} y1={14.5} x2={103} y2={14.5} stroke={RED} strokeWidth={2} className="ta ta-write" style={{ animationDelay: '1.1s' }} />
          </g>
          <g className="ta ta-fade-seq" style={{ animationDelay: '0.3s' }}>
            <rect x={58} y={27} width={48} height={13} rx={6.5} fill={FILL} stroke={INK} strokeWidth={1.2} />
            <Txt x={82} y={36.5} size={7.5}>Canon EOS</Txt>
          </g>
          <g className="ta ta-fade-seq" style={{ animationDelay: '0.6s' }}>
            <rect x={58} y={46} width={48} height={13} rx={6.5} fill={FILL} stroke={INK} strokeWidth={1.2} />
            <Txt x={82} y={55.5} size={7.5}>ISO 200</Txt>
          </g>
        </svg>
      )
    case 'image-resolution-checker':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <g className="ta ta-pulse">
            <rect x={28} y={12} width={56} height={36} rx={3} fill={FILL} stroke={INK} strokeWidth={1.6} />
            <polyline points="38,40 54,24 64,33 70,27 76,40" fill="none" stroke={MID} strokeWidth={1.8} strokeLinejoin="round" />
            <path d="M 28 7 l 56 0 M 28 4 l 0 6 M 84 4 l 0 6" stroke={INK} strokeWidth={1.4} fill="none" />
            <path d="M 21 12 l 0 36 M 18 12 l 6 0 M 18 48 l 6 0" stroke={INK} strokeWidth={1.4} fill="none" />
          </g>
          <Txt x={56} y={63} size={9.5} className="ta ta-c1 ta-cycle3">1.2 MP</Txt>
          <Txt x={56} y={63} size={9.5} className="ta ta-c2 ta-cycle3" style={{ animationDelay: '-2s' }}>8 MP</Txt>
          <Txt x={56} y={63} size={9.5} fill={GREEN} className="ta ta-c3 ta-cycle3" style={{ animationDelay: '-1s' }}>24 MP</Txt>
        </svg>
      )
    case 'color-palette-extractor': {
      const swatches = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={34} y={4} w={44} h={30} />
          {swatches.map((c, i) => (
            <circle
              key={c}
              cx={20 + i * 15}
              cy={52}
              r={6}
              fill={c}
              stroke="#ffffff"
              strokeWidth={1.6}
              className="ta ta-drop"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </svg>
      )
    }
    case 'corrupt-image-detector':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={28} y={10} w={56} h={40} />
          <g className="ta ta-glitch">
            <rect x={28} y={22} width={56} height={6} fill={MID} opacity={0.55} />
            <rect x={28} y={36} width={56} height={4} fill={AMBER} opacity={0.5} />
          </g>
          <polyline points="48,10 42,24 52,32 44,50" fill="none" stroke={RED} strokeWidth={1.8} strokeLinejoin="round" />
          <rect x={28} y={11} width={56} height={3.4} fill={INK} className="ta ta-scan-y" />
          <g className="ta ta-pop">
            <circle cx={88} cy={50} r={11} fill={GREEN} stroke="#ffffff" strokeWidth={2} />
            <path d="M 82.5 50 l 4 4 l 7 -8" stroke="#ffffff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )
    case 'image-rotator':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <path d="M 82 12 a 26 26 0 0 1 6 14" fill="none" stroke={AMBER} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M 91 19 l -3 8 l -7 -3 z" fill={AMBER} />
          <g className="ta ta-spin-step">
            <Img x={34} y={13} w={44} h={40} />
          </g>
        </svg>
      )
    case 'base64-converter':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <g className="ta ta-dissolve">
            <Img x={10} y={17} w={36} h={32} />
          </g>
          <text x={58} y={26} fontSize={9} fontFamily="monospace" fill={INK} className="ta ta-code">&lt;/&gt;</text>
          <text x={58} y={40} fontSize={8} fontFamily="monospace" fill={MID} className="ta ta-code" style={{ animationDelay: '0.35s' }}>aGVsbG8=</text>
          <text x={58} y={54} fontSize={8} fontFamily="monospace" fill={INK} className="ta ta-code" style={{ animationDelay: '0.7s' }}>data:...</text>
        </svg>
      )
    case 'favicon-generator':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <rect x={14} y={5} width={84} height={15} rx={4} fill="#f1f5f9" stroke={INK} strokeWidth={1.4} />
          <rect x={19} y={8.5} width={8} height={8} rx={2} fill={AMBER} className="ta ta-pop" style={{ animationDelay: '0.5s' }} />
          <rect x={31} y={10.5} width={26} height={3.4} rx={1.7} fill={PALE} />
          <circle cx={91} cy={12.5} r={2.4} fill={PALE} />
          <g className="ta ta-fav">
            <Img x={40} y={28} w={34} h={30} />
          </g>
        </svg>
      )
    case 'image-splitter': {
      const cols = [28, 47.3, 66.6]
      const rows = [8, 24.6, 41.2]
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          {rows.map((y) =>
            cols.map((x, ci) => (
              <g key={`${x}-${y}`} className={`ta ${ci === 0 ? 'ta-nudge-l' : ci === 2 ? 'ta-nudge-r' : ''}`}>
                <rect x={x} y={y} width={17.3} height={14.6} fill={ci === 1 && y === 24.6 ? PALE : FILL} stroke={INK} strokeWidth={1.3} />
              </g>
            ))
          )}
          <polyline points="36,50 47,36 55,43 62,37 68,50" fill="none" stroke={MID} strokeWidth={1.6} strokeLinejoin="round" opacity={0.7} />
        </svg>
      )
    }
    case 'collage-maker':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <g className="ta ta-from-l"><rect x={27} y={11} width={28} height={22} rx={2} fill={FILL} stroke="#ffffff" strokeWidth={2} /></g>
          <g className="ta ta-from-t"><rect x={57} y={11} width={28} height={22} rx={2} fill="#fef3c7" stroke="#ffffff" strokeWidth={2} /></g>
          <g className="ta ta-from-b"><rect x={27} y={35} width={28} height={22} rx={2} fill="#dcfce7" stroke="#ffffff" strokeWidth={2} /></g>
          <g className="ta ta-from-r"><rect x={57} y={35} width={28} height={22} rx={2} fill="#ede9fe" stroke="#ffffff" strokeWidth={2} /></g>
          <circle cx={41} cy={19} r={3} fill={AMBER} />
          <circle cx={71} cy={43} r={3} fill={MID} />
        </svg>
      )
    case 'aspect-ratio-cropper':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <g className="ta ta-aspect">
            <rect x={33} y={13} width={46} height={40} rx={3} fill={FILL} stroke={INK} strokeWidth={1.8} strokeDasharray="5 3" />
            <polyline points="41,45 53,29 61,37 67,31 72,45" fill="none" stroke={MID} strokeWidth={1.8} strokeLinejoin="round" />
          </g>
          <Txt x={56} y={65} size={9} className="ta ta-c1 ta-cycle3">1 : 1</Txt>
          <Txt x={56} y={65} size={9} className="ta ta-c2 ta-cycle3" style={{ animationDelay: '-2s' }}>16 : 9</Txt>
          <Txt x={56} y={65} size={9} className="ta ta-c3 ta-cycle3" style={{ animationDelay: '-1s' }}>4 : 5</Txt>
        </svg>
      )
    case 'image-filters':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={31} y={8} w={50} h={38} />
          <rect x={31} y={8} width={50} height={38} rx={3} fill="#6b7280" fillOpacity={0.55} className="ta ta-c1 ta-cycle3" />
          <rect x={31} y={8} width={50} height={38} rx={3} fill="#b45309" fillOpacity={0.45} className="ta ta-c2 ta-cycle3" style={{ animationDelay: '-2s' }} />
          <rect x={31} y={8} width={50} height={38} rx={3} fill="#f43f5e" fillOpacity={0.3} className="ta ta-c3 ta-cycle3" style={{ animationDelay: '-1s' }} />
          <Txt x={56} y={60} size={9} className="ta ta-c1 ta-cycle3">B&amp;W</Txt>
          <Txt x={56} y={60} size={9} className="ta ta-c2 ta-cycle3" style={{ animationDelay: '-2s' }}>Sepia</Txt>
          <Txt x={56} y={60} size={9} fill={GREEN} className="ta ta-c3 ta-cycle3" style={{ animationDelay: '-1s' }}>Vivid</Txt>
        </svg>
      )
    case 'text-watermark':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={26} y={10} w={60} h={42} />
          <text
            x={56}
            y={38}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="#ffffff"
            stroke={INK}
            strokeWidth={0.4}
            transform="rotate(-16 56 34)"
            className="ta ta-wm"
          >
            © Snaptoria
          </text>
        </svg>
      )
    case 'qr-code-reader': {
      const cells: Array<[number, number]> = [
        [0, 0], [1, 0], [2, 0], [4, 0], [6, 0], [7, 0], [8, 0],
        [0, 1], [2, 1], [5, 1], [6, 1], [8, 1],
        [0, 2], [1, 2], [2, 2], [3, 2], [5, 2], [7, 2],
        [1, 3], [4, 3], [6, 3], [8, 3],
        [0, 4], [2, 4], [4, 4], [5, 4], [7, 4],
        [6, 5], [1, 5], [3, 5], [8, 5],
        [0, 6], [1, 6], [2, 6], [4, 6], [6, 6],
        [0, 7], [2, 7], [5, 7], [7, 7], [8, 7],
        [0, 8], [1, 8], [2, 8], [3, 8], [6, 8], [8, 8],
      ]
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <rect x={37} y={5} width={38} height={38} rx={3} fill="#ffffff" stroke={INK} strokeWidth={1.5} />
          {cells.map(([cx, cy], i) => (
            <rect key={i} x={39.5 + cx * 3.7} y={7.5 + cy * 3.7} width={3.1} height={3.1} fill="#111827" />
          ))}
          <rect x={35} y={6} width={42} height={3.4} fill={GREEN} className="ta ta-scan-y" />
          <g className="ta ta-pop">
            <rect x={28} y={50} width={56} height={14} rx={7} fill={INK} />
            <text x={56} y={59.5} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ffffff">✓ Link decoded</text>
          </g>
        </svg>
      )
    }
    case 'invoice-generator':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Doc x={34} y={5} w={44} h={58} />
          <Txt x={43} y={17} size={8} anchor="start">INVOICE</Txt>
          <rect x={41} y={22} width={30} height={3.4} rx={1.7} fill={PALE} className="ta ta-write" />
          <rect x={41} y={29} width={30} height={3.4} rx={1.7} fill={PALE} className="ta ta-write" style={{ animationDelay: '0.3s' }} />
          <rect x={41} y={36} width={22} height={3.4} rx={1.7} fill={PALE} className="ta ta-write" style={{ animationDelay: '0.6s' }} />
          <line x1={41} y1={46} x2={71} y2={46} stroke={PALE} strokeWidth={1.6} />
          <Txt x={71} y={57} size={8.5} fill={GREEN} weight={700} anchor="end" className="ta ta-fade-seq" style={{ animationDelay: '1s' }}>TOTAL $240</Txt>
        </svg>
      )
    case 'receipt-generator':
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <g className="ta ta-print">
            <path
              d="M 38 6 L 74 6 L 74 58 L 69.5 54.5 L 65 58 L 60.5 54.5 L 56 58 L 51.5 54.5 L 47 58 L 42.5 54.5 L 38 58 Z"
              fill="#ffffff"
              stroke={INK}
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            <Txt x={56} y={17} size={7.5}>RECEIPT</Txt>
            <rect x={44} y={22} width={24} height={3.2} rx={1.6} fill={PALE} className="ta ta-fade-seq" />
            <rect x={44} y={29} width={24} height={3.2} rx={1.6} fill={PALE} className="ta ta-fade-seq" style={{ animationDelay: '0.3s' }} />
            <rect x={44} y={36} width={18} height={3.2} rx={1.6} fill={PALE} className="ta ta-fade-seq" style={{ animationDelay: '0.6s' }} />
            <Txt x={68} y={50} size={8} fill={GREEN} weight={700} anchor="end" className="ta ta-fade-seq" style={{ animationDelay: '0.9s' }}>$58.00</Txt>
          </g>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 112 68" className="h-full w-full" aria-hidden="true">
          <Img x={31} y={14} w={50} h={38} />
        </svg>
      )
  }
}

export function ToolCardVisual({ toolId }: { toolId: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          el.classList.toggle('ta-inview', entry.isIntersecting)
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="tool-visual bg-sky-50 rounded-lg mb-4 h-[76px] overflow-hidden group-hover:bg-sky-100 transition-colors"
    >
      <Scene id={toolId} />
    </div>
  )
}
