import { LOGOS } from './catalog'
import { DsImage } from './DsImage'

export type LogoName = keyof typeof LOGOS

type LogoProps = {
  name: LogoName
  className?: string
}

export function Logo({ name, className }: LogoProps) {
  const asset = LOGOS[name]
  return (
    <DsImage
      alt={name}
      className={className}
      height={asset.height}
      src={asset.src}
      width={asset.width}
    />
  )
}
