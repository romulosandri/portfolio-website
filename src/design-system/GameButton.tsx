import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { DsImage } from './DsImage'
import { GameThumbnailImage } from './GameThumbnailImage'

type GameButtonProps = {
  href?: string
  forceHover?: boolean
  className?: string
}

const MAGNET_STRENGTH = 0.18
const INNER_STRENGTH = 0.08

export function GameButton({
  href = '/game',
  forceHover = false,
  className,
}: GameButtonProps) {
  const rootRef = useRef<HTMLAnchorElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      const inner = innerRef.current
      if (!root || !inner) return

      const mm = gsap.matchMedia()

      mm.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set([root, inner], { x: 0, y: 0 })

          const magnetVars = { duration: 0.4, ease: 'power3.out' } as const
          const xTo = gsap.quickTo(root, 'x', { ...magnetVars })
          const yTo = gsap.quickTo(root, 'y', { ...magnetVars })
          const innerXTo = gsap.quickTo(inner, 'x', { ...magnetVars })
          const innerYTo = gsap.quickTo(inner, 'y', { ...magnetVars })

          const onMove = contextSafe((event: PointerEvent) => {
            const rect = root.getBoundingClientRect()
            const currentX = Number(gsap.getProperty(root, 'x')) || 0
            const currentY = Number(gsap.getProperty(root, 'y')) || 0
            const relX = event.clientX - (rect.left + rect.width / 2 - currentX)
            const relY = event.clientY - (rect.top + rect.height / 2 - currentY)

            xTo(relX * MAGNET_STRENGTH)
            yTo(relY * MAGNET_STRENGTH)
            innerXTo(relX * INNER_STRENGTH)
            innerYTo(relY * INNER_STRENGTH)
          })

          const onLeave = contextSafe(() => {
            xTo(0)
            yTo(0)
            innerXTo(0)
            innerYTo(0)
          })

          root.addEventListener('pointermove', onMove)
          root.addEventListener('pointerleave', onLeave)

          return () => {
            root.removeEventListener('pointermove', onMove)
            root.removeEventListener('pointerleave', onLeave)
          }
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <a
      className={[
        'group inline-flex items-center rounded-xsm bg-background-white py-xsm pr-md pl-sm no-underline will-change-transform',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-hover={forceHover ? 'true' : undefined}
      href={href}
      ref={rootRef}
    >
      <span
        className="inline-flex items-center gap-[7px] will-change-transform"
        ref={innerRef}
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
      </span>
    </a>
  )
}
