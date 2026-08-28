import { APP_LOGOS } from './catalog'
import { DsImage } from './DsImage'

export type AppLogoName = keyof typeof APP_LOGOS

type AppLogoProps = {
  name: AppLogoName
  className?: string
}

export function AppLogo({ name, className }: AppLogoProps) {
  const asset = APP_LOGOS[name]
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
