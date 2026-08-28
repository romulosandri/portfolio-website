import { LETTERS } from './catalog'
import { DsImage } from './DsImage'

export const LETTER_CHARS = ['r', 'o', 'm', 'u', 'l', 's', 'a', 'n', 'd', 'i'] as const
export const LETTER_STYLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const

export type LetterChar = (typeof LETTER_CHARS)[number]
export type LetterStyle = (typeof LETTER_STYLES)[number]
export type LetterKey = `${LetterChar}-${LetterStyle}`

type LetterProps = {
  letter: LetterChar
  style: LetterStyle
  className?: string
}

export function Letter({ letter, style, className }: LetterProps) {
  const key: LetterKey = `${letter}-${style}`
  const asset = LETTERS[key]
  return (
    <DsImage
      alt={letter}
      className={className}
      height={asset.height}
      src={asset.src}
      width={asset.width}
    />
  )
}
