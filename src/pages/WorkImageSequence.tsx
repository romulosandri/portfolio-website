import { useRef, useState } from 'react'
import { randomWorkImages } from '../content/portfolio'
import { gsap, useGSAP } from '../motion-system/gsap'

const INTERVAL = 3
const FADE = 0.36
const BLUR = 'blur(20px)'
const FRAME_CLASS = 'absolute inset-0 size-full object-cover will-change-[opacity,filter]'

function preload(src: string, priority: 'high' | 'low') {
  const image = new Image()
  image.fetchPriority = priority
  image.src = src
}

export function WorkImageSequence() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [images] = useState(() => {
    const list = randomWorkImages(10)
    if (list[0]) preload(list[0], 'high')
    if (list[1]) preload(list[1], 'low')
    return list
  })

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || images.length < 2) return

      const frames = gsap.utils.toArray<HTMLImageElement>('img', root)
      const first = frames[0]
      const second = frames[1]
      if (!first || !second) return

      gsap.set(first, { autoAlpha: 1, filter: 'blur(0px)' })
      gsap.set(second, { autoAlpha: 0, filter: BLUR })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      let index = 0
      const hold = INTERVAL - FADE
      let pending: HTMLImageElement | null = null
      let onReady: (() => void) | null = null

      const disarm = () => {
        if (pending && onReady) pending.removeEventListener('load', onReady)
        pending = null
        onReady = null
      }

      const whenReady = (image: HTMLImageElement, run: () => void) => {
        disarm()
        if (image.complete && image.naturalWidth > 0) {
          run()
          return
        }
        pending = image
        onReady = run
        image.addEventListener('load', run, { once: true })
      }

      const cycle = () => {
        const incoming = index % 2 === 0 ? second : first
        const outgoing = index % 2 === 0 ? first : second

        whenReady(incoming, () => {
          gsap.to(outgoing, { autoAlpha: 0, filter: BLUR, duration: FADE, ease: 'power2.inOut' })
          gsap.to(incoming, {
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: FADE,
            ease: 'power2.inOut',
            onComplete: () => {
              index = (index + 1) % images.length
              const upcoming = images[(index + 1) % images.length]
              if (upcoming) outgoing.src = upcoming
              gsap.delayedCall(hold, cycle)
            },
          })
        })
      }

      gsap.delayedCall(hold, cycle)
      return disarm
    },
    { scope: rootRef, dependencies: [images] },
  )

  if (images.length === 0) return null

  const first = images[0]
  const second = images[1]

  return (
    <div
      aria-hidden
      className="relative aspect-904/678 w-full overflow-clip"
      ref={rootRef}
    >
      <img
        alt=""
        className={FRAME_CLASS}
        decoding="sync"
        draggable={false}
        fetchPriority="high"
        loading="eager"
        src={first}
      />
      {second ? (
        <img
          alt=""
          className={`${FRAME_CLASS} opacity-0`}
          decoding="async"
          draggable={false}
          src={second}
        />
      ) : null}
    </div>
  )
}
