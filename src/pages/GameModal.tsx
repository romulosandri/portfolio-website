import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { GameCanvas } from '../components/GameCanvas'
import { GAME_OPEN_PROJECT_EVENT, setProjectModalOpen } from '../game/hotspots'
import { navigate, parseLocation } from '../lib/router'
import { gsap, ScrollTrigger, useGSAP } from '../motion-system/gsap'
import { pauseSmoothScroll, resumeSmoothScroll } from '../motion-system/smoothScroll'
import { ProjectDetailPage } from './ProjectDetailPage'

type GameModalApi = {
  open: () => void
  close: () => void
  isOpen: boolean
}

type WorkModalTarget = {
  collection: 'work' | 'projects'
  slug: string
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

function workFromHref(href: string): WorkModalTarget | null {
  const path = href.split('?')[0] ?? href
  const route = parseLocation(path, '')
  if (route.name === 'workDetail') return { collection: 'work', slug: route.slug }
  if (route.name === 'projectDetail') return { collection: 'projects', slug: route.slug }
  return null
}

function isInternalPath(href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return false
  return !/\.[a-z0-9]+$/i.test(href.split('?')[0] ?? href)
}

function GameModalDialog({ onClose }: { onClose: (href?: string) => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef(false)
  const onCloseRef = useRef(onClose)
  const [work, setWork] = useState<WorkModalTarget | null>(null)
  const workRef = useRef(work)
  onCloseRef.current = onClose
  workRef.current = work

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
    setProjectModalOpen(false)
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

  const closeWork = useCallback(() => {
    setWork(null)
    setProjectModalOpen(false)
    rootRef.current?.focus()
  }, [])

  useEffect(() => {
    return () => setProjectModalOpen(false)
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
        if (workRef.current) {
          closeWork()
          return
        }
        requestClose()
        return
      }
      if ((event.key === ' ' || event.code === 'Space') && !workRef.current) {
        event.preventDefault()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeWork, requestClose])

  useEffect(() => {
    const onOpenProject = (event: Event) => {
      const href = (event as CustomEvent<{ href?: string }>).detail?.href
      if (!href || !isInternalPath(href)) return
      const next = workFromHref(href)
      if (!next) {
        requestClose(href)
        return
      }
      setWork(next)
      setProjectModalOpen(true)
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
      <h2 className="sr-only" id="game-modal-title">
        My life game
      </h2>
      <div aria-hidden={work ? true : undefined} className="absolute inset-0 z-0">
        <GameCanvas />
      </div>
      {work ? (
        <WorkPageModal
          collection={work.collection}
          onClose={closeWork}
          onLeave={requestClose}
          onOpenWork={setWork}
          slug={work.slug}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="pointer-events-auto absolute top-4xl right-4xl">
          <CloseButton
            label={work ? 'Close project' : 'Close'}
            onClick={() => (work ? closeWork() : requestClose())}
            ref={closeRef}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

function WorkPageModal({
  collection,
  slug,
  onClose,
  onLeave,
  onOpenWork,
}: {
  collection: 'work' | 'projects'
  slug: string
  onClose: () => void
  onLeave: (href?: string) => void
  onOpenWork: (next: WorkModalTarget) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.scrollTo(0, 0)
  }, [collection, slug])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(
        root,
        { opacity: 0 },
        {
          opacity: 1,
          duration: reduced ? 0 : 0.22,
          ease: 'power2.out',
          onComplete: () => ScrollTrigger.refresh(),
        },
      )
    },
    { scope: rootRef },
  )

  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement | null)?.closest('a')
    if (!target) return
    const href = target.getAttribute('href')
    if (!href || !isInternalPath(href)) return
    if (target.getAttribute('target') === '_blank') return
    event.preventDefault()
    event.stopPropagation()
    const next = workFromHref(href)
    if (next) {
      onOpenWork(next)
      return
    }
    onLeave(href)
  }

  return (
    <div
      aria-labelledby="game-work-modal-title"
      aria-modal="true"
      className="absolute inset-0 z-20 outline-none"
      onClick={onClick}
      ref={rootRef}
      role="dialog"
      tabIndex={-1}
    >
      <button
        aria-label="Close project"
        className="absolute inset-0 cursor-default bg-cobblestone-950/80"
        onClick={onClose}
        type="button"
      />
      <h2 className="sr-only" id="game-work-modal-title">
        Project
      </h2>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="pointer-events-auto relative h-[80dvh] w-[80dvw] overflow-x-hidden overflow-y-auto overscroll-y-contain rounded-lg bg-background-primary"
          data-reveal-scroller=""
          ref={panelRef}
        >
          <ProjectDetailPage collection={collection} key={`${collection}-${slug}`} slug={slug} />
        </div>
      </div>
    </div>
  )
}

function CloseButton({
  label,
  onClick,
  ref,
}: {
  label: string
  onClick: () => void
  ref?: Ref<HTMLButtonElement>
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-all bg-cobblestone-800 text-cobblestone-50 hover:bg-cobblestone-700 focus-visible:bg-cobblestone-700 md:size-14"
      onClick={onClick}
      ref={ref}
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
  )
}
