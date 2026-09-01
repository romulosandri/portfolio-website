import { useEffect, useState } from 'react'
import { Letter, LETTER_STYLES, type LetterChar, type LetterStyle } from './Letter'
import { Symbol } from './Symbol'

type NameLogoProps = {
  href?: string
  className?: string
}

const TICK_MS = 1200

const firstName: LetterChar[] = ['r', 'o', 'm', 'u', 'l', 'o']
const lastName: LetterChar[] = ['s', 'a', 'n', 'd', 'r', 'i']

const initialStyles: LetterStyle[] = [
  2, 12, 6, 10, 4, 7, 2, 13, 5, 9, 1, 7,
]

function pickRandomStyle(current: LetterStyle): LetterStyle {
  let next = current
  while (next === current) {
    next = LETTER_STYLES[Math.floor(Math.random() * LETTER_STYLES.length)]!
  }
  return next
}

function NameRow({
  letters,
  styles,
}: {
  letters: LetterChar[]
  styles: LetterStyle[]
}) {
  return (
    <span className="inline-flex items-center gap-[14px]">
      {letters.map((letter, index) => (
        <Letter key={`${letter}-${index}`} letter={letter} style={styles[index]!} />
      ))}
    </span>
  )
}

export function NameLogo({ href = '/', className }: NameLogoProps) {
  const [styles, setStyles] = useState<LetterStyle[]>(initialStyles)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      setStyles((prev) => {
        const next = [...prev]
        const index = Math.floor(Math.random() * next.length)
        next[index] = pickRandomStyle(next[index]!)
        return next
      })
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [])

  const firstStyles = styles.slice(0, firstName.length)
  const lastStyles = styles.slice(firstName.length)

  const mark = (
    <span className="inline-flex items-center gap-3xl">
      {/* The wordmark is built from letter images, so the name only exists as
          real text here. Absolutely positioned, so it adds no flex gap. */}
      <span className="sr-only">Rômulo Sandri</span>
      <NameRow letters={firstName} styles={firstStyles} />
      <Symbol variant="16" />
      <NameRow letters={lastName} styles={lastStyles} />
    </span>
  )

  if (!href) {
    return <span className={className}>{mark}</span>
  }

  return (
    <a
      aria-label="Rômulo Sandri"
      className={['inline-flex no-underline', className].filter(Boolean).join(' ')}
      href={href}
    >
      {mark}
    </a>
  )
}
