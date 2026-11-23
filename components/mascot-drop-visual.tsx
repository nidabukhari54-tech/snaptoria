'use client'

interface MascotDropVisualProps {
  /** True while a file is dragged over the zone: the mascot wiggles with excitement. */
  active?: boolean
  /** Bump this number after a drop to replay the one-shot chomp animation. */
  chompKey?: number
}

/**
 * The big-mouth Camera Buddy as a drop-zone centrepiece — the same visual
 * language as the homepage hero: idle float sway, wiggle while a file is
 * dragged over, and a one-shot chomp when a file lands. Animation classes
 * (hero-float / hero-wiggle / hero-chomp) live in app/globals.css and are
 * disabled under prefers-reduced-motion there.
 */
export function MascotDropVisual({ active = false, chompKey = 0 }: MascotDropVisualProps) {
  return (
    <span className={`inline-block ${active ? 'hero-wiggle' : 'hero-float'}`}>
      <span key={chompKey} className={`block ${chompKey > 0 ? 'hero-chomp' : ''}`}>
        <img
          src="/mascot-mouth.webp"
          alt="Snaptoria mascot with its mouth wide open, ready for your file"
          className="h-32 w-32 object-contain md:h-[150px] md:w-[150px]"
          draggable={false}
        />
      </span>
    </span>
  )
}
