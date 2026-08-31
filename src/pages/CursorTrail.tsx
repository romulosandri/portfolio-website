import { useRef, useState } from 'react'
import { trailImages } from '../content/portfolio'
import { gsap, useGSAP } from '../lib/gsap'

const GAP = 100
const TRAIL_COUNT = 18

export function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [images] = useState(() => trailImages(TRAIL_COUNT))

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      if (!root || images.length === 0) return

      const mm = gsap.matchMedia()

      mm.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const flair = gsap.utils.toArray<HTMLImageElement>('img', root)
          if (flair.length === 0) return

          const wrapIndex = gsap.utils.wrap(0, flair.length)
          let index = 0
          const mousePos = { x: 0, y: 0 }
          const lastMousePos = { x: 0, y: 0 }

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
              x: mousePos.x - rect.left,
              y: mousePos.y - rect.top,
              xPercent: -50,
              yPercent: -50,
              rotation: 0,
              scale: 1,
            })
            playAnimation(img)
            index += 1
          })

          const onMove = (event: PointerEvent) => {
            mousePos.x = event.clientX
            mousePos.y = event.clientY
          }

          const imageTrail = contextSafe(() => {
            const rect = root.getBoundingClientRect()
            const inside =
              mousePos.x >= rect.left &&
              mousePos.x <= rect.right &&
              mousePos.y >= rect.top &&
              mousePos.y <= rect.bottom
            if (!inside) return

            const travelDistance = Math.hypot(
              lastMousePos.x - mousePos.x,
              lastMousePos.y - mousePos.y,
            )

            if (travelDistance > GAP) {
              animateImage()
              lastMousePos.x = mousePos.x
              lastMousePos.y = mousePos.y
            }
          })

          window.addEventListener('pointermove', onMove)
          gsap.ticker.add(imageTrail)

          return () => {
            window.removeEventListener('pointermove', onMove)
            gsap.ticker.remove(imageTrail)
          }
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [images] },
  )

  if (images.length === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      ref={rootRef}
    >
      {images.map((src, index) => (
        <img
          alt=""
          className="pointer-events-none absolute top-0 left-0 aspect-[4/3] w-40 origin-center object-cover opacity-0 will-change-transform"
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
