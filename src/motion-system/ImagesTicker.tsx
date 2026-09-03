import { useRef, useState } from 'react'
import { randomTickerImages, type TickerImage } from '../content/portfolio'
import { gsap, useGSAP } from './gsap'

type ImagesTickerProps = {
  className?: string
}

/**
 * Frames keep the 853×640 ratio at every width. Height scales down on phones;
 * width is the matching clamp so Tailwind preflight `max-width: 100%` on `img`
 * cannot squash them to the viewport. `max-w-none` is unusable here because
 * `--spacing-none` is 0px, which would collapse the frame.
 */
function ImageTrack({ copy, images }: { copy: number; images: TickerImage[] }) {
  return (
    <div aria-hidden={copy > 0} className="flex items-center gap-2.5">
      {images.map((image) => (
        <div
          className="relative h-[clamp(220px,45vh,640px)] w-[clamp(calc(220px*853/640),calc(45vh*853/640),853px)] shrink-0 overflow-clip"
          key={`${copy}-${image.src}`}
        >
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            decoding="async"
            height={640}
            src={image.src}
            width={853}
          />
        </div>
      ))}
    </div>
  )
}

export function ImagesTicker({ className }: ImagesTickerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [images] = useState(() => randomTickerImages(10))

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track || images.length === 0) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.to(track, {
        xPercent: -50,
        duration: 50,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: rootRef, dependencies: [images] },
  )

  if (images.length === 0) return null

  return (
    <div
      aria-hidden
      className={['flex w-full items-center overflow-clip py-4xl', className]
        .filter(Boolean)
        .join(' ')}
      data-prerender="strip"
      ref={rootRef}
    >
      <div className="flex w-max items-center gap-2.5 will-change-transform" ref={trackRef}>
        <ImageTrack copy={0} images={images} />
        <ImageTrack copy={1} images={images} />
      </div>
    </div>
  )
}
