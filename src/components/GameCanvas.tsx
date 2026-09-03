import { useEffect, useRef } from 'react'
import { track } from '../lib/analytics'

type PhaserGame = {
  destroy: (removeCanvas: boolean) => void
  scale: {
    resize: (width: number, height: number) => void
  }
}

function syncGameSize(game: PhaserGame, parent: HTMLElement) {
  const width = parent.clientWidth
  const height = parent.clientHeight
  if (width > 0 && height > 0) game.scale.resize(width, height)
}

export function GameCanvas() {
  const parentRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<PhaserGame | null>(null)

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    let cancelled = false
    let game: PhaserGame | null = null
    let observer: ResizeObserver | null = null

    const boot = async () => {
      const { createGame } = await import('../game/config')
      if (cancelled || !parentRef.current) return

      game = createGame(parentRef.current) as PhaserGame
      gameRef.current = game
      syncGameSize(game, parentRef.current)
      observer = new ResizeObserver(() => {
        if (game && parentRef.current) syncGameSize(game, parentRef.current)
      })
      observer.observe(parentRef.current)
      track('game_loaded')
    }

    void boot()

    return () => {
      cancelled = true
      observer?.disconnect()
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
      className="absolute inset-0 overflow-hidden bg-game-bezel [&_canvas]:block"
      aria-label="Portfolio mini game"
    />
  )
}
