import { useEffect, useRef, useState } from 'react'
import { useScrollSkew } from '../motion-system'
import { ImageLightbox } from './ImageLightbox'

const BATCH_SIZE = 5

type LazyImageListProps = {
  images: string[]
  title: string
  /** Per-image alt text, parallel to `images`. */
  alts?: string[]
}

export function LazyImageList({ images, title, alts }: LazyImageListProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loadedCount, setLoadedCount] = useState(() => Math.min(BATCH_SIZE, images.length))
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLButtonElement>(null)

  useScrollSkew(rootRef, 'button', [images])

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
              alt={alts?.[index] ?? (index === 0 ? title : '')}
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
