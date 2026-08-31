import { useRef, useState } from 'react'
import { randomWorkImages } from '../content/portfolio'
import { gsap, useGSAP } from '../lib/gsap'

const INTERVAL = 3
const FADE = 0.4

export function WorkImageSequence() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [images] = useState(() => randomWorkImages(10))

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || images.length < 2) return

      const frames = gsap.utils.toArray<HTMLImageElement>('img', root)
      if (frames.length < 2) return

      gsap.set(frames, { autoAlpha: 0 })
      gsap.set(frames[0], { autoAlpha: 1 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const hold = INTERVAL - FADE
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { duration: FADE, ease: 'power2.inOut' },
      })

      for (let index = 0; index < frames.length; index += 1) {
        const current = frames[index]
        const next = frames[(index + 1) % frames.length]
        if (!current || !next) continue
        tl.to(current, { autoAlpha: 0 }, `+=${hold}`)
        tl.to(next, { autoAlpha: 1 }, '<')
      }
    },
    { scope: rootRef, dependencies: [images] },
  )

  if (images.length === 0) return null

  return (
    <div
      aria-hidden
      className="relative h-[678px] w-[904px] shrink-0 overflow-clip bg-[#e6e6e6]"
      ref={rootRef}
    >
      {images.map((src, index) => (
        <img
          alt=""
          className={[
            'absolute inset-0 size-full object-cover',
            index === 0 ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          decoding="async"
          draggable={false}
          key={src}
          loading="eager"
          src={src}
        />
      ))}
    </div>
  )
}
