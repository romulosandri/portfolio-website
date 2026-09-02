import { useRef, useState } from 'react'
import { randomTickerImages, type TickerImage } from '../content/portfolio'
import { gsap, useGSAP } from './gsap'

type ImagesTickerProps = {
  className?: string
}

/**
 * Height-driven with an auto width, so a phone decodes a fraction of the pixel
 * area for what is a purely decorative marquee.
 */
function ImageTrack({ copy, images }: { copy: number; images: TickerImage[] }) {
  return (
    <div aria-hidden={copy > 0} className="flex items-center gap-[10px]">
      {images.map((image) => (
        <img
          alt=""
          className="h-[clamp(220px,45vh,640px)] w-auto shrink-0 object-cover"
          decoding="async"
          height={640}
          key={`${copy}-${image.src}`}
          src={image.src}
          width={853}
        />
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
      <div className="flex w-max items-center gap-[10px] will-change-transform" ref={trackRef}>
        <ImageTrack copy={0} images={images} />
        <ImageTrack copy={1} images={images} />
      </div>
    </div>
  )
}
