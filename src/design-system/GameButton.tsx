import { DsImage } from './DsImage'
import { GameThumbnailImage } from './GameThumbnailImage'

type GameButtonProps = {
  href?: string
  forceHover?: boolean
  className?: string
}

export function GameButton({
  href = '/game',
  forceHover = false,
  className,
}: GameButtonProps) {
  return (
    <a
      className={[
        'group inline-flex items-center gap-[7px] rounded-xsm bg-background-white py-xsm pr-md pl-sm no-underline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-hover={forceHover ? 'true' : undefined}
      href={href}
    >
      <GameThumbnailImage />
      <span className="relative inline-flex" style={{ width: 67, height: 16 }}>
        <DsImage
          alt="Play Game"
          className="group-hover:opacity-0 group-focus-visible:opacity-0 group-data-[hover=true]:opacity-0"
          height={16}
          src="/design-system/icons/play-game-default.svg"
          width={67}
        />
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[hover=true]:opacity-100">
          <DsImage
            alt=""
            height={16}
            src="/design-system/icons/play-game-hover.svg"
            width={67}
          />
        </span>
      </span>
      <span className="inline-flex size-[21px] shrink-0 items-center justify-center overflow-visible">
        <DsImage
          alt=""
          className="origin-center transition-transform duration-200 group-hover:rotate-[24deg] group-focus-visible:rotate-[24deg] group-data-[hover=true]:rotate-[24deg]"
          height={16}
          src="/design-system/icons/joystick.svg"
          width={16}
        />
      </span>
    </a>
  )
}
