import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { gsap, useGSAP } from '../motion-system/gsap'
import { pauseSmoothScroll, resumeSmoothScroll } from '../motion-system/smoothScroll'
import { toPngSrc } from '../lib/images'

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 1.25
const RESET_ZOOM = 2.5

type ImageLightboxProps = {
  images: string[]
  index: number
  title: string
  alts?: string[]
  onClose: () => void
  onIndexChange: (index: number) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="size-8 shrink-0"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex size-[56px] shrink-0 cursor-pointer items-center justify-center rounded-all bg-cobblestone-800 text-cobblestone-50 hover:bg-cobblestone-700 focus-visible:bg-cobblestone-700 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export function ImageLightbox({
  images,
  index,
  title,
  alts,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef(false)
  const draggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const pointerRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, id: -1 })
  const scaleRef = useRef(MIN_SCALE)
  const panRef = useRef({ x: 0, y: 0 })

  const [scale, setScale] = useState(MIN_SCALE)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [src, setSrc] = useState(images[index] ?? '')

  const avifSrc = images[index] ?? ''
  const pngSrc = toPngSrc(avifSrc)
  const count = images.length
  const canPrev = count > 1
  const canNext = count > 1
  const atMinZoom = scale <= MIN_SCALE + 0.001
  const atMaxZoom = scale >= MAX_SCALE - 0.001

  const applyScale = useCallback((next: number) => {
    const clamped = clamp(next, MIN_SCALE, MAX_SCALE)
    scaleRef.current = clamped
    setScale(clamped)
    if (clamped <= MIN_SCALE) {
      panRef.current = { x: 0, y: 0 }
      setPan({ x: 0, y: 0 })
    }
    return clamped
  }, [])

  const resetView = useCallback(() => {
    scaleRef.current = MIN_SCALE
    panRef.current = { x: 0, y: 0 }
    setScale(MIN_SCALE)
    setPan({ x: 0, y: 0 })
  }, [])

  const zoomBy = useCallback(
    (factor: number, clientX?: number, clientY?: number) => {
      const previous = scaleRef.current
      const next = applyScale(previous * factor)
      if (next <= MIN_SCALE || clientX == null || clientY == null || !stageRef.current) {
        return
      }

      const rect = stageRef.current.getBoundingClientRect()
      const offsetX = clientX - rect.left - rect.width / 2
      const offsetY = clientY - rect.top - rect.height / 2
      const ratio = next / previous
      const nextPan = {
        x: offsetX - (offsetX - panRef.current.x) * ratio,
        y: offsetY - (offsetY - panRef.current.y) * ratio,
      }
      panRef.current = nextPan
      setPan(nextPan)
    },
    [applyScale],
  )

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

  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    const root = rootRef.current
    if (!root) {
      onClose()
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to(root, {
      autoAlpha: 0,
      duration: reduced ? 0 : 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }, [onClose])

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count < 2) return
      const wrapped = (nextIndex + count) % count
      resetView()
      onIndexChange(wrapped)
    },
    [count, onIndexChange, resetView],
  )

  useEffect(() => {
    setSrc(avifSrc)
    if (!pngSrc || pngSrc === avifSrc) return

    let cancelled = false
    const image = new Image()
    image.onload = () => {
      if (!cancelled) setSrc(pngSrc)
    }
    image.src = pngSrc

    return () => {
      cancelled = true
    }
  }, [avifSrc, pngSrc])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pauseSmoothScroll()
    const app = document.getElementById('root')
    const previouslyFocused = document.activeElement
    if (app) {
      app.setAttribute('aria-hidden', 'true')
      app.inert = true
    }
    closeRef.current?.focus()

    return () => {
      resumeSmoothScroll()
      document.body.style.overflow = previousOverflow
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
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goTo(index - 1)
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goTo(index + 1)
        return
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        zoomBy(ZOOM_STEP)
        return
      }
      if (event.key === '-' || event.key === '_') {
        event.preventDefault()
        zoomBy(1 / ZOOM_STEP)
        return
      }
      if (event.key === '0') {
        event.preventDefault()
        resetView()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, index, requestClose, resetView, zoomBy])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
      zoomBy(factor, event.clientX, event.clientY)
    }

    root.addEventListener('wheel', onWheel, { passive: false })
    return () => root.removeEventListener('wheel', onWheel)
  }, [zoomBy])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    draggingRef.current = true
    dragMovedRef.current = false
    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
      id: event.pointerId,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || pointerRef.current.id !== event.pointerId) return
    const dx = event.clientX - pointerRef.current.x
    const dy = event.clientY - pointerRef.current.y
    if (Math.hypot(dx, dy) > 4) dragMovedRef.current = true
    if (scaleRef.current <= MIN_SCALE) return
    const nextPan = {
      x: pointerRef.current.panX + dx,
      y: pointerRef.current.panY + dy,
    }
    panRef.current = nextPan
    setPan(nextPan)
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current.id !== event.pointerId) return
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (scaleRef.current > MIN_SCALE) {
      resetView()
      return
    }
    zoomBy(RESET_ZOOM, event.clientX, event.clientY)
  }

  const onBackdropPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) dragMovedRef.current = false
  }

  const onBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (dragMovedRef.current) return
    requestClose()
  }

  const padded = String(index + 1).padStart(String(count).length, '0')

  return createPortal(
    <div
      aria-label={`${title}, image ${index + 1} of ${count}`}
      aria-modal="true"
      className="fixed inset-0 z-[100] touch-none"
      ref={rootRef}
      role="dialog"
    >
      <div className="absolute inset-0 bg-cobblestone-950/80" />
      <div
        className="absolute inset-0 flex items-center justify-center px-[120px] py-[112px]"
        onClick={onBackdropClick}
        onPointerDown={onBackdropPointerDown}
      >
        <div
          className={[
            'max-h-full max-w-full',
            scale > MIN_SCALE ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in',
          ].join(' ')}
          onDoubleClick={onDoubleClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          ref={stageRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <img
            alt={alts?.[index] ?? title}
            className="max-h-[calc(100vh-240px)] max-w-[min(calc(100vw-240px),1400px)] select-none object-contain"
            decoding="async"
            draggable={false}
            src={src}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute top-4xl right-4xl">
          <button
            aria-label="Close"
            className="inline-flex size-[56px] shrink-0 cursor-pointer items-center justify-center rounded-all bg-cobblestone-800 text-cobblestone-50 hover:bg-cobblestone-700 focus-visible:bg-cobblestone-700"
            onClick={requestClose}
            ref={closeRef}
            type="button"
          >
            <Icon>
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
            </Icon>
          </button>
        </div>

        {canPrev ? (
          <div className="pointer-events-auto absolute top-1/2 left-4xl -translate-y-1/2">
            <ControlButton label="Previous image" onClick={() => goTo(index - 1)}>
              <Icon>
                <path
                  d="M19.333 8L12 16L19.333 24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </Icon>
            </ControlButton>
          </div>
        ) : null}

        {canNext ? (
          <div className="pointer-events-auto absolute top-1/2 right-4xl -translate-y-1/2">
            <ControlButton label="Next image" onClick={() => goTo(index + 1)}>
              <Icon>
                <path
                  d="M12.667 8L20 16L12.667 24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </Icon>
            </ControlButton>
          </div>
        ) : null}

        <div className="pointer-events-auto absolute bottom-4xl left-1/2 flex -translate-x-1/2 items-center gap-lg">
          <ControlButton
            disabled={atMinZoom}
            label="Zoom out"
            onClick={() => zoomBy(1 / ZOOM_STEP)}
          >
            <Icon>
              <path
                d="M8 16H24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </Icon>
          </ControlButton>
          <p className="min-w-[72px] text-center text-body-small text-cobblestone-200">
            {Math.round(scale * 100)}%
          </p>
          <ControlButton disabled={atMaxZoom} label="Zoom in" onClick={() => zoomBy(ZOOM_STEP)}>
            <Icon>
              <path
                d="M8 16H24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M16 8V24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </Icon>
          </ControlButton>
        </div>

        <p
          aria-live="polite"
          className="absolute bottom-4xl left-4xl text-body-small text-cobblestone-300"
        >
          {padded} / {count}
        </p>
      </div>
    </div>,
    document.body,
  )
}
