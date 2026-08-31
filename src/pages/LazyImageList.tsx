import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { ImageLightbox } from './ImageLightbox'

const BATCH_SIZE = 5

type LazyImageListProps = {
  images: string[]
  title: string
}

export function LazyImageList({ images, title }: LazyImageListProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loadedCount, setLoadedCount] = useState(() => Math.min(BATCH_SIZE, images.length))
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      const column = rootRef.current
      if (!column) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('button', column)
        if (items.length === 0) return

        const proxy = { skew: 0 }
        const skewSetter = gsap.quickSetter(items, 'skewY', 'deg')
        const clamp = gsap.utils.clamp(-1.5, 1.5)

        gsap.set(items, { transformOrigin: 'right center', force3D: true })

        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -1800)
            if (Math.abs(skew) <= Math.abs(proxy.skew)) return
            proxy.skew = skew
            gsap.to(proxy, {
              skew: 0,
              duration: 1.4,
              ease: 'power3',
              overwrite: true,
              onUpdate: () => {
                skewSetter(proxy.skew)
              },
            })
          },
        })
      })

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [images], revertOnUpdate: true },
  )

  useEffect(() => {
    if (loadedCount >= images.length) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const maybeLoad = () => {
      if (sentinel.getBoundingClientRect().top < window.innerHeight + 400) {
        setLoadedCount((count) => Math.min(count + BATCH_SIZE, images.length))
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) maybeLoad()
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(sentinel)
    window.addEventListener('scroll', maybeLoad, { passive: true })
    maybeLoad()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', maybeLoad)
    }
  }, [images.length, loadedCount])

  return (
    <div className="flex min-w-px flex-1 flex-col items-start gap-2xl" ref={rootRef}>
      {images.map((src, index) => (
        <button
          aria-label={`View ${title} image ${index + 1} larger`}
          className={[
            'relative block aspect-[2048/1536] w-full overflow-clip bg-background-secondary p-0 will-change-transform',
            index < loadedCount ? 'cursor-zoom-in' : 'cursor-default',
          ].join(' ')}
          key={src}
          onClick={index < loadedCount ? () => setLightboxIndex(index) : undefined}
          ref={index === loadedCount - 1 && loadedCount < images.length ? sentinelRef : undefined}
          type="button"
        >
          {index < loadedCount ? (
            <img
              alt={index === 0 ? title : ''}
              className="absolute inset-0 size-full object-cover"
              decoding="async"
              loading={index === 0 ? 'eager' : 'lazy'}
              src={src}
            />
          ) : null}
        </button>
      ))}
      {lightboxIndex !== null ? (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
          title={title}
        />
      ) : null}
    </div>
  )
}
