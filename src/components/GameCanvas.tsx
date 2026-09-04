import { useEffect, useRef, useState } from 'react'
import { track, trackException } from '../lib/analytics'
import { subscribeGameLoad } from '../game/lifecycle'
import { GameControls } from './GameControls'
import { GameLoading } from './GameLoading'

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
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    return subscribeGameLoad((detail) => {
      if (detail.failed) {
        setFailed(true)
        return
      }
      setProgress((current) => Math.max(current, detail.progress))
      if (detail.ready) {
        setProgress(1)
        setReady(true)
        track('game_loaded')
      }
    })
  }, [])

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    let cancelled = false
    let game: PhaserGame | null = null
    let observer: ResizeObserver | null = null

    const boot = async () => {
      setProgress((current) => Math.max(current, 0.04))
      const { createGame } = await import('../game/config')
      if (cancelled || !parentRef.current) return

      setProgress((current) => Math.max(current, 0.1))
      game = createGame(parentRef.current) as PhaserGame
      gameRef.current = game
      syncGameSize(game, parentRef.current)
      observer = new ResizeObserver(() => {
        if (game && parentRef.current) syncGameSize(game, parentRef.current)
      })
      observer.observe(parentRef.current)
      setProgress((current) => Math.max(current, 0.12))
    }

    void boot().catch((error) => {
      if (cancelled) return
      setFailed(true)
      trackException(error, { source: 'game_boot' })
    })

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
      aria-busy={showLoader && !failed}
      className={[
        'absolute inset-0 overflow-hidden',
        ready ? 'bg-game-bezel' : 'bg-background-primary',
      ].join(' ')}
    >
      <div
        ref={parentRef}
        className="absolute inset-0 [&_canvas]:block"
        aria-label="Portfolio mini game"
      />
      {ready ? <GameControls /> : null}
      {showLoader ? (
        <GameLoading
          fading={ready}
          failed={failed}
          onFaded={() => setShowLoader(false)}
          progress={progress}
        />
      ) : null}
    </div>
  )
}
