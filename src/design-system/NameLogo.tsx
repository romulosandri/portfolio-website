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

/**
 * Below the nav breakpoint the header shows only the two initials -- the `r` of
 * "romulo" and the `s` of "sandri" -- because the full wordmark renders anywhere
 * from 283px to 449px wide depending on which letter styles the randomiser has
 * landed on, and even its narrowest state crowds a phone header.
 *
 * It is done by hiding the other ten letters in CSS rather than by rendering a
 * separate compact mark. A second <NameLogo> would put twelve more letter images
 * in the DOM and run a second timer, and a JS branch would ship the desktop
 * wordmark in the prerendered HTML and flash on a phone.
 */
const COMPACT_INDICES = [0, firstName.length] as const
const COMPACT_QUERY = '(width < 1120px)'

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
        <span
          className={index === 0 ? 'inline-flex' : 'hidden nav:inline-flex'}
          key={`${letter}-${index}`}
        >
          <Letter letter={letter} style={styles[index]!} />
        </span>
      ))}
    </span>
  )
}

export function NameLogo({ href = '/', className }: NameLogoProps) {
  const [styles, setStyles] = useState<LetterStyle[]>(initialStyles)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Behaviour only, never layout: restyling a letter that CSS has hidden is a
    // no-op on screen, so in compact mode the mark would otherwise only appear
    // to change on 2 ticks in 12.
    const compact = window.matchMedia(COMPACT_QUERY)

    const id = window.setInterval(() => {
      const indices = compact.matches
        ? COMPACT_INDICES
        : initialStyles.map((_, index) => index)

      setStyles((prev) => {
        const next = [...prev]
        const index = indices[Math.floor(Math.random() * indices.length)]!
        next[index] = pickRandomStyle(next[index]!)
        return next
      })
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [])

  const firstStyles = styles.slice(0, firstName.length)
  const lastStyles = styles.slice(firstName.length)

  const mark = (
    <span className="inline-flex items-center gap-lg nav:gap-3xl">
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
