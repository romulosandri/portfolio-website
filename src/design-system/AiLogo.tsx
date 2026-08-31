import { AI_LOGOS } from './catalog'
import { DsHoverImage } from './DsImage'

export type AiLogoName = keyof typeof AI_LOGOS

type AiLogoProps = {
  name: AiLogoName
  className?: string
  width?: number
  height?: number
}

export function AiLogo({ name, className, width, height }: AiLogoProps) {
  const asset = AI_LOGOS[name]
  return (
    <DsHoverImage
      alt={name}
      className={className}
      defaultSrc={asset.defaultSrc}
      height={height ?? asset.height}
      hoverSrc={asset.hoverSrc}
      width={width ?? asset.width}
    />
  )
}
