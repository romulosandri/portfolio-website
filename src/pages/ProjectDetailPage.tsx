import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import {
  MOTION,
  prefersReducedMotion,
  RevealBlock,
  RevealGroup,
  RevealLine,
  RevealText,
} from '../motion-system'
import { gsap, ScrollTrigger, useGSAP } from '../motion-system/gsap'
import {
  imageAltFor,
  projectBySlug,
  projectItems,
  workBySlug,
  workItems,
} from '../content/portfolio'
import { LazyImageList } from './LazyImageList'
import { NotFoundPage } from './NotFoundPage'
import { PageLayout } from './PageLayout'
import { DisplayHero, SectionHeader, WorkCard } from './WorkCard'

type ProjectDetailPageProps = {
  slug: string
  collection: 'work' | 'projects'
}

// Rendered as a description list so crawlers read client, role, year, and
// duration as labelled key-value pairs instead of four unrelated paragraphs.
function MetaField({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <RevealBlock>
      <dl className={['flex flex-col items-start gap-[10px]', className].filter(Boolean).join(' ')}>
        <RevealText as="dt" className="whitespace-nowrap text-body-small text-foreground-tertiary">
          {label}
        </RevealText>
        <RevealText as="dd" className="m-0 w-full text-body-default text-foreground-primary">
          {value}
        </RevealText>
      </dl>
    </RevealBlock>
  )
}

/** Labelled list of deliverables, as a real ul/li so crawlers read it as a list. */
function MetaList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null

  return (
    <div className="flex w-full flex-col items-start gap-[10px]">
      <RevealText as="h2" className="whitespace-nowrap text-body-small text-foreground-tertiary" variant="blur">
        {label}
      </RevealText>
      <ul className="m-0 flex w-full list-none flex-col items-start gap-lg rounded-sm p-0">
        {items.map((line) => (
          <RevealBlock key={line}>
            <li className="flex w-full flex-col gap-lg">
              <RevealLine dashed />
              <RevealText as="span" className="text-body-small text-foreground-primary">
                {line}
              </RevealText>
            </li>
          </RevealBlock>
        ))}
        <RevealLine dashed />
      </ul>
    </div>
  )
}

const DRAG_THRESHOLD_PX = 4
const SEE_NEXT_COUNT = 3

function nextItems<T extends { slug: string }>(items: T[], slug: string, count: number) {
  const index = items.findIndex((item) => item.slug === slug)
  if (index === -1 || items.length <= 1) return []

  const next: T[] = []
  for (let offset = 1; offset < items.length && next.length < count; offset += 1) {
    const item = items[(index + offset) % items.length]
    if (item) next.push(item)
  }
  return next
}

type SeeNextItem = {
  slug: string
  title: string
  year: string
  cover: string
  href: string
  images: string[]
}

function SeeNextSection({
  items,
  rootRef,
}: {
  items: SeeNextItem[]
  rootRef: RefObject<HTMLDivElement | null>
}) {
  if (items.length === 0) return null

  return (
    <div className="w-full pt-4xl" ref={rootRef}>
      <div className="flex w-full flex-col items-start gap-[10px] will-change-transform">
        <RevealText as="p" className="whitespace-nowrap text-body-small text-foreground-tertiary">
          See next
        </RevealText>
        <div className="flex w-full items-start gap-xl">
          {items.map((card) => (
            <WorkCard
              className="min-w-px flex-1"
              compact
              cover={card.cover}
              href={card.href}
              images={card.images}
              key={card.slug}
              title={card.title}
              year={card.year}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function DragScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const drag = {
      active: false,
      moved: false,
      startX: 0,
      scrollLeft: 0,
      pointerId: -1,
    }
    let resetMovedTimer = 0

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.active || event.pointerId !== drag.pointerId) return
      const dx = event.clientX - drag.startX
      if (Math.abs(dx) > DRAG_THRESHOLD_PX) {
        drag.moved = true
        el.classList.add('cursor-grabbing')
      }
      if (!drag.moved) return
      el.scrollLeft = drag.scrollLeft - dx
    }

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return
      drag.active = false
      el.classList.remove('cursor-grabbing')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.clearTimeout(resetMovedTimer)
      resetMovedTimer = window.setTimeout(() => {
        drag.moved = false
      }, 0)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      window.clearTimeout(resetMovedTimer)
      drag.active = true
      drag.moved = false
      drag.startX = event.clientX
      drag.scrollLeft = el.scrollLeft
      drag.pointerId = event.pointerId
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!drag.moved) return
      event.preventDefault()
      event.stopPropagation()
      drag.moved = false
    }

    const onDragStart = (event: DragEvent) => {
      event.preventDefault()
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('click', onClickCapture, true)
    el.addEventListener('dragstart', onDragStart)

    return () => {
      window.clearTimeout(resetMovedTimer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('click', onClickCapture, true)
      el.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return (
    <div
      className="flex w-full cursor-grab items-start gap-[10px] overflow-x-auto overscroll-x-contain scrollbar-none select-none active:cursor-grabbing [&_a]:cursor-grab [&_a]:active:cursor-grabbing"
      ref={ref}
    >
      {children}
    </div>
  )
}

export function ProjectDetailPage({ slug, collection }: ProjectDetailPageProps) {
  const galleryRef = useRef<HTMLElement>(null)
  const seeNextRef = useRef<HTMLDivElement>(null)
  const item = collection === 'work' ? workBySlug(slug) : projectBySlug(slug)
  const related = collection === 'work' ? workItems : projectItems
  const relatedTitle = collection === 'work' ? 'Work' : 'Projects'
  const relatedCaption =
    collection === 'work' ? 'Selected work from 2023 to 2026' : 'Selected projects from 2022 to 2026'

  useGSAP(
    () => {
      const root = seeNextRef.current
      const inner = root?.firstElementChild
      const gallery = galleryRef.current
      if (!root || !(inner instanceof HTMLElement) || !gallery) return

      gsap.set(root, { overflow: 'hidden' })

      const duration = prefersReducedMotion() ? 0 : MOTION.duration.interactive
      const hide = gsap.timeline({ paused: true })
      hide.to(inner, { autoAlpha: 0, duration, ease: MOTION.ease.inOut, yPercent: 100 }, 0)
      hide.to(root, { duration, ease: MOTION.ease.inOut, height: 0, paddingTop: 0 }, 0)

      const trigger = ScrollTrigger.create({
        trigger: gallery,
        start: 'top bottom',
        onEnter: () => hide.play(),
        onLeaveBack: () => hide.reverse(),
      })

      if (trigger.isActive) hide.progress(1)

      return () => trigger.kill()
    },
    { dependencies: [slug, collection], revertOnUpdate: true },
  )

  if (!item) {
    return <NotFoundPage />
  }

  const upcoming = nextItems(related, item.slug, SEE_NEXT_COUNT)

  return (
    <PageLayout>
      <DisplayHero>{item.title}</DisplayHero>
      <section className="flex w-full items-center justify-center bg-background-primary px-gutter pt-4xl pb-[clamp(72px,12vw,164px)]">
        <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-4xl lg:flex-row">
          {/* Only sticky once it sits beside the gallery. Stacked above it, a
              sticky sidebar would pin over the images as you scroll past. */}
          <RevealGroup className="flex w-full shrink-0 flex-col items-start lg:sticky lg:top-4xl lg:w-[400px] lg:self-start xl:w-[480px]">
            <RevealLine />
            <div className="flex w-full flex-col items-start justify-center gap-3xl pt-2xl">
              <MetaField label="Description" value={item.description} className="w-full" />
              <div className="flex w-full items-start gap-xl">
                <MetaField className="w-[120px] shrink-0 xs:w-[160px]" label="Client" value={item.client} />
                <MetaField className="min-w-px flex-1" label="Role" value={item.role} />
              </div>
              <div className="flex w-full items-start gap-xl">
                <MetaField className="w-[120px] shrink-0 xs:w-[160px]" label="Year" value={item.year} />
                <MetaField className="min-w-px flex-1" label="Duration" value={item.duration} />
              </div>
              <MetaList items={item.delivered} label="Delivered" />
            </div>
            <SeeNextSection items={upcoming} rootRef={seeNextRef} />
          </RevealGroup>
          <LazyImageList
            alts={item.images.map((_, index) => imageAltFor(item, index))}
            images={item.images}
            key={item.slug}
            title={item.title}
          />
        </div>
      </section>
      <section
        className="flex w-full flex-col items-center justify-center overflow-clip bg-background-secondary px-gutter py-4xl"
        ref={galleryRef}
      >
        <RevealGroup className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader caption={relatedCaption} title={relatedTitle} />
          <DragScroll>
            {related.map((card) => (
              <WorkCard
                className="w-[min(85vw,853px)] shrink-0"
                cover={card.cover}
                href={card.href}
                images={card.images}
                key={card.slug}
                title={card.title}
                year={card.year}
              />
            ))}
          </DragScroll>
        </RevealGroup>
      </section>
    </PageLayout>
  )
}
