import { useEffect, useRef, useState } from 'react'
import { trailImages } from '../content/portfolio'
import { gsap, useGSAP } from './gsap'

const GAP = 100
const TAP_SLOP = 14
const TRAIL_COUNT_DESKTOP = 18
const TRAIL_COUNT_TOUCH = 6
const MOTION_OK = '(prefers-reduced-motion: no-preference)'
const DESKTOP_POINTER = '(hover: hover) and (pointer: fine)'
const DESKTOP_TRAIL = `${DESKTOP_POINTER} and ${MOTION_OK}`
const TOUCH_TRAIL = `(any-pointer: coarse) and ${MOTION_OK}`

/**
 * Gating the render, not just the animation, is what keeps trail image
 * requests off reduced-motion sessions -- a hidden <img> still has a src and
 * still downloads. Touch loads 6; desktop keeps 18.
 *
 * This is the one place a JS branch is safe despite the no-branching rule: the
 * trail is absolutely positioned and `pointer-events-none`, so it contributes
 * no layout for the desktop branch to get wrong. Starting false also means
 * scripts/prerender.mjs, which emulates reduced motion, serialises none of them.
 *
 * Desktop follows the pointer. Touch devices spawn one flair per tap on the
 * hero; a finger that moves more than TAP_SLOP is treated as a scroll.
 */
export function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<string[]>([])
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia(MOTION_OK)
    const desktopPointer = window.matchMedia(DESKTOP_POINTER)
    const syncEnabled = () => setEnabled(motion.matches)
    const syncImages = () => {
      setImages(
        trailImages(desktopPointer.matches ? TRAIL_COUNT_DESKTOP : TRAIL_COUNT_TOUCH),
      )
    }
    syncEnabled()
    syncImages()
    motion.addEventListener('change', syncEnabled)
    desktopPointer.addEventListener('change', syncImages)
    return () => {
      motion.removeEventListener('change', syncEnabled)
      desktopPointer.removeEventListener('change', syncImages)
    }
  }, [])

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      if (!root || images.length === 0) return

      const flair = gsap.utils.toArray<HTMLImageElement>('img', root)
      if (flair.length === 0) return

      const wrapIndex = gsap.utils.wrap(0, flair.length)
      let index = 0
      const pointerPos = { x: 0, y: 0 }

      gsap.set(flair, { autoAlpha: 0 })

      const playAnimation = contextSafe((shape: HTMLImageElement) => {
        const tl = gsap.timeline({ defaults: { duration: 1 } })
        tl.from(shape, {
          autoAlpha: 0,
          scale: 0.85,
          ease: 'elastic.out(1, 0.3)',
        })
          .to(
            shape,
            {
              rotation: 'random(-24, 24)',
            },
            '<',
          )
          .to(
            shape,
            {
              y: '+=120vh',
              ease: 'back.in(0.4)',
              duration: 1,
            },
            0,
          )
      })

      const animateImage = contextSafe(() => {
        const img = flair[wrapIndex(index)]
        if (!img) return

        const rect = root.getBoundingClientRect()
        gsap.killTweensOf(img)
        gsap.set(img, { clearProps: 'all' })
        gsap.set(img, {
          autoAlpha: 1,
          x: pointerPos.x - rect.left,
          y: pointerPos.y - rect.top,
          xPercent: -50,
          yPercent: -50,
          rotation: 0,
          scale: 1,
        })
        playAnimation(img)
        index += 1
      })

      const mm = gsap.matchMedia()

      mm.add(DESKTOP_TRAIL, () => {
        const lastPointerPos = { x: 0, y: 0 }

        const onMove = (event: PointerEvent) => {
          pointerPos.x = event.clientX
          pointerPos.y = event.clientY
        }

        const imageTrail = contextSafe(() => {
          const rect = root.getBoundingClientRect()
          const inside =
            pointerPos.x >= rect.left &&
            pointerPos.x <= rect.right &&
            pointerPos.y >= rect.top &&
            pointerPos.y <= rect.bottom
          if (!inside) return

          const travelDistance = Math.hypot(
            lastPointerPos.x - pointerPos.x,
            lastPointerPos.y - pointerPos.y,
          )

          if (travelDistance > GAP) {
            animateImage()
            lastPointerPos.x = pointerPos.x
            lastPointerPos.y = pointerPos.y
          }
        })

        window.addEventListener('pointermove', onMove)
        gsap.ticker.add(imageTrail)

        return () => {
          window.removeEventListener('pointermove', onMove)
          gsap.ticker.remove(imageTrail)
        }
      })

      mm.add(TOUCH_TRAIL, () => {
        const host = root.parentElement
        if (!host) return

        let tapStart: { x: number; y: number; id: number } | null = null

        const onPointerDown = (event: PointerEvent) => {
          if (event.pointerType !== 'touch') return
          tapStart = { x: event.clientX, y: event.clientY, id: event.pointerId }
        }

        const onPointerUp = contextSafe((event: PointerEvent) => {
          if (event.pointerType !== 'touch') return
          if (!tapStart || event.pointerId !== tapStart.id) return
          const travel = Math.hypot(event.clientX - tapStart.x, event.clientY - tapStart.y)
          tapStart = null
          if (travel > TAP_SLOP) return

          pointerPos.x = event.clientX
          pointerPos.y = event.clientY
          animateImage()
        })

        const onPointerCancel = (event: PointerEvent) => {
          if (tapStart?.id === event.pointerId) tapStart = null
        }

        host.addEventListener('pointerdown', onPointerDown)
        host.addEventListener('pointerup', onPointerUp)
        host.addEventListener('pointercancel', onPointerCancel)

        return () => {
          host.removeEventListener('pointerdown', onPointerDown)
          host.removeEventListener('pointerup', onPointerUp)
          host.removeEventListener('pointercancel', onPointerCancel)
        }
      })

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [images, enabled] },
  )

  if (!enabled || images.length === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      data-prerender="strip"
      ref={rootRef}
    >
      {images.map((src, index) => (
        <img
          alt=""
          className="pointer-events-none absolute top-0 left-0 aspect-4/3 w-40 origin-center object-cover opacity-0 will-change-transform"
          decoding="async"
          draggable={false}
          height={120}
          key={`${src}-${index}`}
          src={src}
          width={160}
        />
      ))}
    </div>
  )
}
