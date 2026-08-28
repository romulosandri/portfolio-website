import { SOCIAL_ICONS } from './catalog'
import { DsHoverImage } from './DsImage'

export type SocialIconType = keyof typeof SOCIAL_ICONS

type SocialIconProps = {
  type: SocialIconType
  className?: string
}

export function SocialIcon({ type, className }: SocialIconProps) {
  const asset = SOCIAL_ICONS[type]
  return (
    <DsHoverImage
      alt={type}
      className={className}
      defaultSrc={asset.defaultSrc}
      height={asset.height}
      hoverSrc={asset.hoverSrc}
      width={asset.width}
    />
  )
}
