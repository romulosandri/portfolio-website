import { Letter, LETTER_CHARS, type LetterChar, type LetterStyle } from './Letter'

type WordmarkProps = {
  text: string
  style: LetterStyle
  className?: string
  gap?: number
}

const allowed = new Set<string>(LETTER_CHARS)

export function Wordmark({ text, style, className, gap = 2 }: WordmarkProps) {
  const letters = [...text.toLowerCase()].filter((char): char is LetterChar =>
    allowed.has(char),
  )

  return (
    <span
      className={['inline-flex items-end', className].filter(Boolean).join(' ')}
      style={{ gap }}
    >
      {letters.map((letter, index) => (
        <Letter key={`${letter}-${style}-${index}`} letter={letter} style={style} />
      ))}
    </span>
  )
}
