import { DsImage } from './DsImage'

type HumanImageProps = {
  className?: string
}

export function HumanImage({ className }: HumanImageProps) {
  return (
    <DsImage
      alt=""
      className={['rounded-all', className].filter(Boolean).join(' ')}
      height={24}
      src="/design-system/tag-images/human-image.png"
      width={24}
    />
  )
}
