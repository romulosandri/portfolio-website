import { APP_LOGOS } from './catalog'
import { DsImage } from './DsImage'

export type AppLogoName = keyof typeof APP_LOGOS

type AppLogoProps = {
  name: AppLogoName
  className?: string
  size?: number
}

export function AppLogo({ name, className, size }: AppLogoProps) {
  const asset = APP_LOGOS[name]
  const scale = size ? size / asset.height : 1
  return (
    <DsImage
      alt={name}
      className={className}
      height={Math.round(asset.height * scale)}
      src={asset.src}
      width={Math.round(asset.width * scale)}
    />
  )
}
