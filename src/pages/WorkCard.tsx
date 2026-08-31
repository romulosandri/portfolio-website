import { useEffect, useMemo, useState } from 'react'

const HOVER_PREVIEW_COUNT = 5
const HOVER_PREVIEW_INTERVAL_MS = 600

type WorkCardProps = {
  title: string
  year: string
  cover: string
  href: string
  images?: string[]
  className?: string
}

export function WorkCard({ title, year, cover, href, images = [], className }: WorkCardProps) {
  const previewImages = useMemo(() => {
    const frames: string[] = []
    const seen = new Set<string>()
    for (const src of images.length > 0 ? images : [cover]) {
      if (seen.has(src)) continue
      seen.add(src)
      frames.push(src)
      if (frames.length === HOVER_PREVIEW_COUNT) break
    }
    return frames
  }, [cover, images])

  const [hovered, setHovered] = useState(false)
  const [primed, setPrimed] = useState(false)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!hovered || previewImages.length < 2) return

    const id = window.setInterval(() => {
      setFrame((current) => (current + 1) % previewImages.length)
    }, HOVER_PREVIEW_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [hovered, previewImages.length])

  const startPreview = () => {
    const next =
      previewImages.length > 1 && previewImages[0] === cover ? 1 : 0
    setFrame(next)
    setPrimed(true)
    setHovered(true)
  }

  const stopPreview = () => {
    setHovered(false)
    setFrame(0)
  }

  const activeSrc = hovered ? previewImages[frame] ?? cover : cover

  return (
    <a
      className={['flex flex-col items-start gap-2xl no-underline', className || 'w-full']
        .filter(Boolean)
        .join(' ')}
      href={href}
      onBlur={stopPreview}
      onFocus={startPreview}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <span className="relative block aspect-[2048/1536] w-full overflow-clip">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          draggable={false}
          src={cover}
        />
        {primed
          ? previewImages.map((src) =>
              src === cover ? null : (
                <img
                  alt=""
                  className={[
                    'absolute inset-0 size-full object-cover',
                    hovered && src === activeSrc ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                  decoding="async"
                  draggable={false}
                  key={src}
                  src={src}
                />
              ),
            )
          : null}
      </span>
      <span className="flex w-full items-center justify-between">
        <span className="whitespace-nowrap text-h4 text-foreground-primary">{title}</span>
        <span className="whitespace-nowrap text-body-large text-foreground-tertiary">{year}</span>
      </span>
    </a>
  )
}

type SectionHeaderProps = {
  title: string
  caption?: string
}

export function SectionHeader({ title, caption }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-center gap-[10px] border-t border-solid border-stroke-secondary pt-2xl">
      <h2 className="min-w-px flex-1 text-h2 text-foreground-primary">{title}</h2>
      {caption ? (
        <p className="whitespace-nowrap text-body-large text-foreground-tertiary">{caption}</p>
      ) : null}
    </div>
  )
}

type DisplayHeroProps = {
  children: string
}

export function DisplayHero({ children }: DisplayHeroProps) {
  return (
    <div className="flex h-[560px] w-full shrink-0 flex-col items-center justify-center bg-background-primary p-4xl">
      <h1 className="whitespace-nowrap text-center text-display text-foreground-primary">
        {children}
      </h1>
    </div>
  )
}
