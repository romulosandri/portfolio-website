import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { GameCanvas } from '../components/GameCanvas'
import { GAME_OPEN_PROJECT_EVENT } from '../game/hotspots'
import { navigate } from '../lib/router'
import { gsap, useGSAP } from '../motion-system/gsap'
import { pauseSmoothScroll, resumeSmoothScroll } from '../motion-system/smoothScroll'

type GameModalApi = {
  open: () => void
  close: () => void
  isOpen: boolean
}

const GameModalContext = createContext<GameModalApi | null>(null)

export function useGameModal() {
  const context = useContext(GameModalContext)
  if (!context) throw new Error('useGameModal must be used within GameModalProvider')
  return context
}

type GameModalProviderProps = {
  children: ReactNode
  /** Direct visits to `/game` open the modal over home. */
  gameRoute: boolean
}

export function GameModalProvider({ children, gameRoute }: GameModalProviderProps) {
  const [open, setOpen] = useState(gameRoute)

  useEffect(() => {
    if (gameRoute) setOpen(true)
  }, [gameRoute])

  const openGame = useCallback(() => setOpen(true), [])

  const close = useCallback((href?: string) => {
    setOpen(false)
    if (href) navigate(href)
    else if (gameRoute) navigate('/')
  }, [gameRoute])

  return (
    <GameModalContext.Provider value={{ open: openGame, close, isOpen: open }}>
      {children}
      {open ? <GameModalDialog onClose={close} /> : null}
    </GameModalContext.Provider>
  )
}

function GameModalDialog({ onClose }: { onClose: (href?: string) => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(
        root,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: reduced ? 0 : 0.28, ease: 'power2.out' },
      )
    },
    { scope: rootRef },
  )

  const requestClose = useCallback((href?: string) => {
    if (closingRef.current) return
    closingRef.current = true
    const root = rootRef.current
    if (!root) {
      onCloseRef.current(href)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to(root, {
      autoAlpha: 0,
      duration: reduced ? 0 : 0.2,
      ease: 'power2.in',
      onComplete: () => onCloseRef.current(href),
    })
  }, [])

  useEffect(() => {
    pauseSmoothScroll()
    const root = document.documentElement
    const widthBeforeLock = root.clientWidth
    const previousOverflow = document.body.style.overflow
    root.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const released = root.clientWidth - widthBeforeLock
    if (released > 0) root.style.paddingRight = `${released}px`

    const app = document.getElementById('root')
    const previouslyFocused = document.activeElement
    if (app) {
      app.setAttribute('aria-hidden', 'true')
      app.inert = true
    }
    closeRef.current?.blur()
    rootRef.current?.focus()

    return () => {
      resumeSmoothScroll()
      root.style.overflow = ''
      document.body.style.overflow = previousOverflow
      root.style.paddingRight = ''
      if (app) {
        app.removeAttribute('aria-hidden')
        app.inert = false
      }
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
        return
      }
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [requestClose])

  useEffect(() => {
    const onOpenProject = (event: Event) => {
      const href = (event as CustomEvent<{ href?: string }>).detail?.href
      if (!href?.startsWith('/') || href.startsWith('//')) return
      requestClose(href)
    }
    window.addEventListener(GAME_OPEN_PROJECT_EVENT, onOpenProject)
    return () => window.removeEventListener(GAME_OPEN_PROJECT_EVENT, onOpenProject)
  }, [requestClose])

  return createPortal(
    <div
      aria-labelledby="game-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-100 outline-none"
      ref={rootRef}
      role="dialog"
      tabIndex={-1}
    >
      <button
        aria-label="Close game"
        className="absolute inset-0 cursor-default bg-cobblestone-950/80"
        onClick={() => requestClose()}
        type="button"
      />
      <h2 className="sr-only" id="game-modal-title">
        My life game
      </h2>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto relative h-[95dvh] w-[95dvw] overflow-hidden rounded-lg">
          <GameCanvas />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute top-4xl right-4xl">
          <button
            aria-label="Close"
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-all bg-cobblestone-800 text-cobblestone-50 hover:bg-cobblestone-700 focus-visible:bg-cobblestone-700 md:size-14"
            onClick={() => requestClose()}
            ref={closeRef}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-8 shrink-0"
              fill="none"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.4 9.4L22.6 22.6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M22.6 9.4L9.4 22.6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
