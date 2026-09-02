import { useEffect, useRef } from 'react'
import { track } from '../lib/analytics'

export function GameCanvas() {
  const parentRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<{ destroy: (removeCanvas: boolean) => void } | null>(
    null,
  )

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    let cancelled = false
    let game: { destroy: (removeCanvas: boolean) => void } | null = null

    const boot = async () => {
      const { createGame } = await import('../game/config')
      if (cancelled || !parentRef.current) return

      game = createGame(parentRef.current)
      gameRef.current = game
      track('game_loaded')
    }

    void boot()

    return () => {
      cancelled = true
      game?.destroy(true)
      gameRef.current = null
    }
  }, [])

  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      window.location.reload()
    })
  }

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-hidden bg-game-bezel [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      aria-label="Portfolio mini game"
    />
  )
}
