import { useMemo, useRef, useState, type ReactNode } from 'react'
import { collectionFromHref, track } from '../lib/analytics'
import { RevealBlock, RevealGroup, RevealLine, RevealText, useScrollSkew } from '../motion-system'
import { gsap, useGSAP } from '../motion-system/gsap'
import { displayFitStyle } from '../lib/displayFit'

const HOVER_PREVIEW_COUNT = 5
const HOVER_PREVIEW_INTERVAL_MS = 1000
const CROSSFADE_DURATION = 0.22
const CROSSFADE_BLUR = 'blur(28px)'
const FRAME_CLASS = 'absolute inset-0 size-full object-cover will-change-[opacity,filter]'

type WorkCardProps = {
  title: string
  year: string
  cover: string
  href: string
  images?: string[]
  className?: string
  compact?: boolean
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function blurCrossfade(outgoing: Element | undefined, incoming: Element | undefined) {
  if (!incoming) return
  if (outgoing) gsap.killTweensOf(outgoing)
  gsap.killTweensOf(incoming)

  if (!outgoing || outgoing === incoming || prefersReducedMotion()) {
    if (outgoing && outgoing !== incoming) gsap.set(outgoing, { autoAlpha: 0, filter: 'blur(0px)' })
    gsap.set(incoming, { autoAlpha: 1, filter: 'blur(0px)' })
    return
  }

  gsap.set(incoming, { autoAlpha: 0, filter: CROSSFADE_BLUR })
  gsap.to(outgoing, {
    autoAlpha: 0,
    duration: CROSSFADE_DURATION,
    ease: 'power2.inOut',
    filter: CROSSFADE_BLUR,
  })
  gsap.to(incoming, {
    autoAlpha: 1,
    duration: CROSSFADE_DURATION,
    ease: 'power2.inOut',
    filter: 'blur(0px)',
  })
}

export function WorkCard({ title, year, cover, href, images = [], className, compact = false }: WorkCardProps) {
  const mediaRef = useRef<HTMLSpanElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const indexRef = useRef(0)
  const hoveredRef = useRef(false)
  const intervalRef = useRef(0)
  const goToRef = useRef<(nextIndex: number) => void>(() => {})
  const [primed, setPrimed] = useState(false)

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

  const firstPreviewIndex = previewImages[0] === cover && previewImages.length > 1 ? 1 : 0

  const clearCycle = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = 0
    }
  }

  const startCycle = () => {
    const frames = framesRef.current
    if (frames.length < 2) return
    clearCycle()
    goToRef.current(firstPreviewIndex)
    intervalRef.current = window.setInterval(() => {
      const count = framesRef.current.length
      if (count < 2) return
      goToRef.current((indexRef.current + 1) % count)
    }, HOVER_PREVIEW_INTERVAL_MS)
  }

  useGSAP(
    (_, contextSafe) => {
      const root = mediaRef.current
      if (!root) return

      const frames = gsap.utils.toArray<HTMLImageElement>('img', root)
      framesRef.current = frames
      if (frames.length === 0) return

      goToRef.current = contextSafe((nextIndex: number) => {
        const list = framesRef.current
        if (nextIndex === indexRef.current) return
        const incoming = list[nextIndex]
        if (!incoming) return
        blurCrossfade(list[indexRef.current], incoming)
        indexRef.current = nextIndex
      })

      gsap.set(
        frames.filter((_, index) => index !== indexRef.current),
        { autoAlpha: 0, filter: CROSSFADE_BLUR },
      )
      const current = frames[indexRef.current] ?? frames[0]
      if (current) gsap.set(current, { autoAlpha: 1, filter: 'blur(0px)' })

      if (hoveredRef.current) startCycle()

      return () => clearCycle()
    },
    { scope: mediaRef, dependencies: [cover, primed, previewImages] },
  )

  // Priming mounts up to four extra full-size AVIFs per card. On a touch device
  // there is no hover to reveal them, so the fetch would be pure waste -- and
  // `focus` fires on tap, which is what would otherwise trigger it.
  const startPreview = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    hoveredRef.current = true
    setPrimed(true)
    startCycle()
  }

  const stopPreview = () => {
    hoveredRef.current = false
    clearCycle()
    goToRef.current(0)
  }

  return (
    <a
      className={[
        'flex flex-col items-start no-underline will-change-transform',
        compact ? 'gap-[10px]' : 'gap-2xl',
        className || 'w-full',
      ]
        .filter(Boolean)
        .join(' ')}
      href={href}
      onClick={() =>
        track('project_card_clicked', {
          title,
          href,
          collection: collectionFromHref(href),
          pathname: window.location.pathname,
        })
      }
      onBlur={stopPreview}
      onFocus={startPreview}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <span className="relative block aspect-[2048/1536] w-full overflow-clip" ref={mediaRef}>
        <img
          alt={`${title} — project cover`}
          className={FRAME_CLASS}
          decoding="async"
          draggable={false}
          src={cover}
        />
        {primed
          ? previewImages.map((src) =>
              src === cover ? null : (
                <img
                  alt=""
                  className={`${FRAME_CLASS} opacity-0`}
                  decoding="async"
                  draggable={false}
                  key={src}
                  src={src}
                />
              ),
            )
          : null}
      </span>
      {compact ? (
        <RevealText
          as="h3"
          className="w-full text-body-small text-foreground-primary"
          variant="blur"
        >
          {title}
        </RevealText>
      ) : (
        <div className="flex w-full items-center justify-between">
          <RevealBlock>
            <RevealText
              as="h3"
              className="whitespace-nowrap text-h4 text-foreground-primary"
              variant="roll"
            >
              {title}
            </RevealText>
            <RevealText as="span" className="whitespace-nowrap text-body-large text-foreground-tertiary">
              {year}
            </RevealText>
          </RevealBlock>
        </div>
      )}
    </a>
  )
}

export function WorkGrid({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollSkew(rootRef, 'a')

  return (
    <div className="grid w-full grid-cols-1 gap-x-xl gap-y-2xl md:grid-cols-2" ref={rootRef}>
      {children}
    </div>
  )
}

type SectionHeaderProps = {
  title: string
  caption?: string
}

export function SectionHeader({ title, caption }: SectionHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-2xl">
      <RevealLine />
      <div className="flex w-full flex-col items-start justify-center gap-lg md:flex-row md:items-center md:gap-[10px]">
        <RevealText as="h2" className="w-full text-h2 text-foreground-primary md:min-w-px md:flex-1">
          {title}
        </RevealText>
        {caption ? (
          <RevealText
            as="p"
            className="text-body-large text-foreground-tertiary md:whitespace-nowrap"
          >
            {caption}
          </RevealText>
        ) : null}
      </div>
    </div>
  )
}

type DisplayHeroProps = {
  children: string
  srText?: string
}

export function DisplayHero({ children, srText }: DisplayHeroProps) {
  return (
    /* min-h rather than h: a title long enough to wrap has to be able to push
       the block taller. Desktop keeps the original 560px. */
    <RevealGroup className="flex min-h-[280px] w-full shrink-0 flex-col items-center justify-center bg-background-primary px-gutter py-4xl md:min-h-[400px] lg:min-h-[560px] [container-type:inline-size]">
      <RevealText
        as="h1"
        centerLines
        className="w-full min-w-0 text-center text-display text-foreground-primary"
        srText={srText}
        style={displayFitStyle(children)}
      >
        {children}
      </RevealText>
    </RevealGroup>
  )
}
