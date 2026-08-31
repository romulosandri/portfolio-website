import { DsImage } from './DsImage'

type GameThumbnailImageProps = {
  className?: string
}

export function GameThumbnailImage({ className }: GameThumbnailImageProps) {
  return (
    <DsImage
      alt=""
      className={['rounded-[2.727px]', className].filter(Boolean).join(' ')}
      height={35.455}
      src="/design-system/tag-images/game-thumbnail-image.png"
      width={60}
    />
  )
}
