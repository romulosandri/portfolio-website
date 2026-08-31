import { Letter, type LetterChar, type LetterStyle } from './Letter'
import { Symbol } from './Symbol'

type NameLogoProps = {
  href?: string
  className?: string
}

const firstName: Array<[LetterChar, LetterStyle]> = [
  ['r', 2],
  ['o', 12],
  ['m', 6],
  ['u', 10],
  ['l', 4],
  ['o', 7],
]

const lastName: Array<[LetterChar, LetterStyle]> = [
  ['s', 2],
  ['a', 13],
  ['n', 5],
  ['d', 9],
  ['r', 1],
  ['i', 7],
]

function NameRow({ letters }: { letters: Array<[LetterChar, LetterStyle]> }) {
  return (
    <span className="inline-flex items-center gap-[14px]">
      {letters.map(([letter, style], index) => (
        <Letter key={`${letter}-${style}-${index}`} letter={letter} style={style} />
      ))}
    </span>
  )
}

export function NameLogo({ href = '#top', className }: NameLogoProps) {
  const mark = (
    <span className="inline-flex items-center gap-3xl">
      <NameRow letters={firstName} />
      <Symbol variant="16" />
      <NameRow letters={lastName} />
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
