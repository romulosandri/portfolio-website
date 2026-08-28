import { SYMBOLS } from './catalog'
import { DsImage } from './DsImage'

export type SymbolVariant = keyof typeof SYMBOLS

type SymbolProps = {
  variant: SymbolVariant
  className?: string
}

export function Symbol({ variant, className }: SymbolProps) {
  const asset = SYMBOLS[variant]
  return (
    <DsImage
      alt=""
      className={className}
      height={asset.height}
      src={asset.src}
      width={asset.width}
    />
  )
}
