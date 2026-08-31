import { DsImage } from './DsImage'

type RobotImageProps = {
  className?: string
}

export function RobotImage({ className }: RobotImageProps) {
  return (
    <DsImage
      alt=""
      className={['rounded-all', className].filter(Boolean).join(' ')}
      height={24}
      src="/design-system/tag-images/robot-image.png"
      width={24}
    />
  )
}
