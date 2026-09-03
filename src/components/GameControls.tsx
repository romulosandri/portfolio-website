import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react'
import {
  getActiveHotspot,
  isProjectModalOpen,
  requestOpenProject,
  subscribeActiveHotspot,
  subscribeProjectModal,
  type ResolvedHotspot,
} from '../game/hotspots'
import {
  clearVirtualPad,
  setVirtualPad,
  type PadDir,
} from '../game/virtualPad'

export function GameControls() {
  const [projectOpen, setProjectOpen] = useState(isProjectModalOpen)

  useEffect(() => subscribeProjectModal(setProjectOpen), [])
  useEffect(() => clearVirtualPad, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.code !== 'Space') return
      if (event.repeat || isProjectModalOpen()) return
      const hotspot = getActiveHotspot()
      if (!hotspot) return
      event.preventDefault()
      requestOpenProject(hotspot)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (projectOpen) return null

  return (
    <>
      <div
        aria-label="How to play. Walk with W A S D or arrow keys. Press Space near a project to open it."
        className="pointer-events-none absolute bottom-xl left-xl z-10 hidden items-end gap-xl md:pointer-fine:flex"
        role="note"
      >
        <KeyCluster
          down={<GameKey label="S">S</GameKey>}
          left={<GameKey label="A">A</GameKey>}
          right={<GameKey label="D">D</GameKey>}
          up={<GameKey label="W">W</GameKey>}
        />
        <KeyCluster
          down={
            <GameKey label="Down">
              <ArrowGlyph dir="down" />
            </GameKey>
          }
          left={
            <GameKey label="Left">
              <ArrowGlyph dir="left" />
            </GameKey>
          }
          right={
            <GameKey label="Right">
              <ArrowGlyph dir="right" />
            </GameKey>
          }
          up={
            <GameKey label="Up">
              <ArrowGlyph dir="up" />
            </GameKey>
          }
        />
      </div>
      <VirtualPad />
      <HotspotSpace />
    </>
  )
}

function HotspotSpace() {
  const [hotspot, setHotspot] = useState<ResolvedHotspot | null>(null)
  const [pressed, setPressed] = useState(false)

  useEffect(() => subscribeActiveHotspot(setHotspot), [])

  if (!hotspot) return null

  return (
    <div
      className="absolute right-xl bottom-xl z-10 touch-none select-none md:pointer-fine:hidden"
    >
      <SpaceKey
        interactive
        label={`Open ${hotspot.title}`}
        pressed={pressed}
        onPointerCancel={() => setPressed(false)}
        onPointerDown={(event) => {
          event.preventDefault()
          event.currentTarget.setPointerCapture(event.pointerId)
          setPressed(true)
          requestOpenProject(getActiveHotspot() ?? hotspot)
        }}
        onPointerUp={() => setPressed(false)}
        onLostPointerCapture={() => setPressed(false)}
      />
    </div>
  )
}

function VirtualPad() {
  const [held, setHeld] = useState<Partial<Record<PadDir, boolean>>>({})

  const press = (dir: PadDir, down: boolean) => {
    setVirtualPad(dir, down)
    setHeld((current) => {
      if (Boolean(current[dir]) === down) return current
      return { ...current, [dir]: down }
    })
  }

  const bind = (dir: PadDir) => ({
    onContextMenu: (event: { preventDefault: () => void }) => {
      event.preventDefault()
    },
    onPointerCancel: () => press(dir, false),
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      press(dir, true)
    },
    onPointerUp: () => press(dir, false),
    onLostPointerCapture: () => press(dir, false),
  })

  return (
    <div
      aria-label="Move"
      className="absolute bottom-xl left-xl z-10 touch-none select-none md:pointer-fine:hidden"
      role="group"
    >
      <KeyCluster
        down={
          <GameKey interactive label="Down" pressed={held.down} size="lg" {...bind('down')}>
            <ArrowGlyph dir="down" size="lg" />
          </GameKey>
        }
        left={
          <GameKey interactive label="Left" pressed={held.left} size="lg" {...bind('left')}>
            <ArrowGlyph dir="left" size="lg" />
          </GameKey>
        }
        right={
          <GameKey interactive label="Right" pressed={held.right} size="lg" {...bind('right')}>
            <ArrowGlyph dir="right" size="lg" />
          </GameKey>
        }
        up={
          <GameKey interactive label="Up" pressed={held.up} size="lg" {...bind('up')}>
            <ArrowGlyph dir="up" size="lg" />
          </GameKey>
        }
      />
    </div>
  )
}

function GameKey({
  children,
  interactive = false,
  label,
  pressed = false,
  size = 'sm',
  ...buttonProps
}: {
  children: ReactNode
  interactive?: boolean
  label: string
  pressed?: boolean
  size?: 'sm' | 'lg'
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const large = size === 'lg'
  const className = [
    'relative inline-flex items-center justify-center',
    large ? 'h-[52px] w-12' : 'h-8.5 w-8',
    interactive ? 'cursor-pointer touch-none appearance-none border-0 bg-transparent p-0' : undefined,
    pressed ? 'translate-y-[3px]' : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      <svg
        aria-hidden="true"
        className="absolute inset-0"
        fill="none"
        viewBox="0 0 32 34"
      >
        <ellipse cx="16" cy="31.6" fill="#0e0907" opacity="0.4" rx="11" ry="1.7" />
        <rect fill="#807164" height="21" rx="7" width="28" x="2" y="9" />
        <rect fill="#5d5548" height="8" rx="7" width="28" x="2" y="22" />
        <rect fill="#fbfbf8" height="22" rx="7" width="28" x="2" y="2" />
        <rect
          fill="none"
          height="22"
          rx="7"
          stroke="#2c2321"
          strokeWidth="1.5"
          width="28"
          x="2"
          y="2"
        />
        <path
          d="M8 5.4h16"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth="1.25"
        />
      </svg>
      <span
        className={[
          'relative flex items-center justify-center font-body leading-none font-medium text-cobblestone-900',
          large ? 'mb-2.5 text-sm' : 'mb-[8px] text-xsm',
        ].join(' ')}
      >
        {children}
      </span>
    </>
  )

  if (interactive) {
    return (
      <button
        aria-label={label}
        aria-pressed={pressed}
        className={className}
        type="button"
        {...buttonProps}
      >
        {body}
      </button>
    )
  }

  return (
    <kbd aria-label={label} className={className}>
      {body}
    </kbd>
  )
}

function KeyCluster({
  down,
  left,
  right,
  up,
}: {
  down: ReactNode
  left: ReactNode
  right: ReactNode
  up: ReactNode
}) {
  return (
    <div className="grid grid-cols-3 gap-[4px]">
      <span />
      {up}
      <span />
      {left}
      {down}
      {right}
    </div>
  )
}

function ArrowGlyph({
  dir,
  size = 'sm',
}: {
  dir: PadDir
  size?: 'sm' | 'lg'
}) {
  const rotate = { up: 0, right: 90, down: 180, left: 270 }[dir]
  return (
    <svg
      aria-hidden="true"
      className={size === 'lg' ? 'size-3.5' : 'size-2.5'}
      fill="currentColor"
      style={{ transform: `rotate(${rotate}deg)` }}
      viewBox="0 0 10 10"
    >
      <path d="M5 1.5 8.6 7.4H1.4Z" />
    </svg>
  )
}

function SpaceKey({
  interactive = false,
  label,
  pressed = false,
  ...buttonProps
}: {
  interactive?: boolean
  label: string
  pressed?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const className = [
    'relative inline-flex items-center justify-center',
    'h-[52px] w-[108px]',
    interactive ? 'cursor-pointer touch-none appearance-none border-0 bg-transparent p-0' : undefined,
    pressed ? 'translate-y-[3px]' : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      <svg
        aria-hidden="true"
        className="absolute inset-0"
        fill="none"
        viewBox="0 0 76 34"
      >
        <ellipse cx="38" cy="31.6" fill="#0e0907" opacity="0.4" rx="28" ry="1.7" />
        <rect fill="#807164" height="21" rx="7" width="72" x="2" y="9" />
        <rect fill="#5d5548" height="8" rx="7" width="72" x="2" y="22" />
        <rect fill="#fbfbf8" height="22" rx="7" width="72" x="2" y="2" />
        <rect
          fill="none"
          height="22"
          rx="7"
          stroke="#2c2321"
          strokeWidth="1.5"
          width="72"
          x="2"
          y="2"
        />
        <path
          d="M16 5.4h44"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth="1.25"
        />
      </svg>
      <span className="relative mb-2.5 font-body text-sm leading-none font-medium text-cobblestone-900">
        space
      </span>
    </>
  )

  if (interactive) {
    return (
      <button
        aria-label={label}
        aria-pressed={pressed}
        className={className}
        type="button"
        {...buttonProps}
      >
        {body}
      </button>
    )
  }

  return (
    <kbd aria-label={label} className={className}>
      {body}
    </kbd>
  )
}
