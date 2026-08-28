import { AI_LOGOS } from './catalog'
import { DsHoverImage } from './DsImage'

export type AiLogoName = keyof typeof AI_LOGOS

type AiLogoProps = {
  name: AiLogoName
  className?: string
}

export function AiLogo({ name, className }: AiLogoProps) {
  const asset = AI_LOGOS[name]
  return (
    <DsHoverImage
      alt={name}
      className={className}
      defaultSrc={asset.defaultSrc}
      height={asset.height}
      hoverSrc={asset.hoverSrc}
      width={asset.width}
    />
  )
}
