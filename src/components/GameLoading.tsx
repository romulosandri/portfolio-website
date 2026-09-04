import { useEffect, useState } from 'react'

const RUN_FRAMES = [
  '/design-system/game/sprites/pluto/sprite-1.png',
  '/design-system/game/sprites/pluto/sprite-2.png',
  '/design-system/game/sprites/pluto/sprite-3.png',
  '/design-system/game/sprites/pluto/sprite-4.png',
] as const

const IDLE_FRAME = '/design-system/game/sprites/pluto/idle.png'
const FRAME_MS = 110

type GameLoadingProps = {
  progress: number
  failed: boolean
  fading: boolean
  onFaded: () => void
}

export function GameLoading({ progress, failed, fading, onFaded }: GameLoadingProps) {
  const clamped = Math.min(1, Math.max(0, progress))
  const percent = Math.round(clamped * 100)

  return (
    <div
      aria-busy={!failed && !fading}
      aria-live="polite"
      className={[
        'absolute inset-0 z-20 flex items-center justify-center bg-background-primary transition-opacity duration-300 ease-out',
        fading ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (fading) onFaded()
      }}
      role="status"
    >
      <div className="flex w-56 flex-col items-center gap-2xl px-gutter">
        <LoadingPluto failed={failed} />
        <div className="flex w-full flex-col items-center gap-xl">
          <p className="text-center text-h3 text-foreground-primary">
            {failed ? "Couldn't load the game" : 'Loading'}
          </p>
          {failed ? (
            <p className="text-center text-body-default text-foreground-tertiary">
              Check your connection and try again.
            </p>
          ) : (
            <div
              aria-label="Game load progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={percent}
              className="h-1 w-full overflow-hidden rounded-all bg-cobblestone-200"
              role="progressbar"
            >
              <div
                className="h-full origin-left rounded-all bg-foreground-primary transition-transform duration-200 ease-out"
                style={{ transform: `scaleX(${clamped})` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingPluto({ failed }: { failed: boolean }) {
  const frame = useRunFrame(failed)
  const src = failed ? IDLE_FRAME : frame

  return (
    <img
      alt=""
      className="h-24 w-auto object-contain object-bottom"
      decoding="async"
      draggable={false}
      height={96}
      src={src}
      width={197}
    />
  )
}

function useRunFrame(paused: boolean) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % RUN_FRAMES.length)
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [paused])

  return RUN_FRAMES[index]
}
