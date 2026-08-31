import { useEffect, useRef, type ReactNode } from 'react'
import { projectBySlug, projectItems, workBySlug, workItems } from '../content/portfolio'
import { LazyImageList } from './LazyImageList'
import { PageLayout } from './PageLayout'
import { DisplayHero, SectionHeader, WorkCard } from './WorkCard'

type ProjectDetailPageProps = {
  pathname: string
  slug: string
  collection: 'work' | 'projects'
}

function MetaField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={['flex flex-col items-start gap-[10px]', className].filter(Boolean).join(' ')}>
      <p className="whitespace-nowrap text-body-small text-foreground-tertiary">{label}</p>
      <p className="w-full text-body-default text-foreground-primary">{value}</p>
    </div>
  )
}

const DRAG_THRESHOLD_PX = 4

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

export function ProjectDetailPage({ pathname, slug, collection }: ProjectDetailPageProps) {
  const item = collection === 'work' ? workBySlug(slug) : projectBySlug(slug)
  const related = collection === 'work' ? workItems : projectItems
  const relatedTitle = collection === 'work' ? 'Work' : 'Projects'
  const relatedCaption =
    collection === 'work' ? 'Selected work from 2023 to 2026' : 'Selected projects from 2022 to 2026'

  if (!item) {
    return (
      <PageLayout pathname={pathname}>
        <DisplayHero>Not found</DisplayHero>
      </PageLayout>
    )
  }

  return (
    <PageLayout pathname={pathname}>
      <DisplayHero>{item.title}</DisplayHero>
      <section className="flex w-full items-center justify-center bg-background-primary px-4xl pt-4xl pb-[164px]">
        <div className="flex min-w-px flex-1 items-start justify-center gap-4xl">
          <div className="sticky top-4xl flex w-[480px] shrink-0 flex-col items-start justify-center gap-3xl self-start border-t border-solid border-stroke-secondary pt-2xl">
            <MetaField label="Description" value={item.description} className="w-full" />
            <div className="flex w-full items-start gap-xl">
              <MetaField className="w-[160px] shrink-0" label="Client" value={item.client} />
              <MetaField className="min-w-px flex-1" label="Role" value={item.role} />
            </div>
            <div className="flex w-full items-start gap-xl">
              <MetaField className="w-[160px] shrink-0" label="Year" value={item.year} />
              <MetaField className="min-w-px flex-1" label="Duration" value={item.duration} />
            </div>
            <div className="flex w-full flex-col items-start gap-[10px]">
              <p className="whitespace-nowrap text-body-small text-foreground-tertiary">Delivered</p>
              <div className="flex w-full flex-col items-start gap-lg rounded-sm">
                {item.delivered.map((line) => (
                  <div className="flex w-full flex-col gap-lg" key={line}>
                    <div className="h-px w-full border-t border-dashed border-stroke-secondary" />
                    <p className="text-body-small text-foreground-primary">{line}</p>
                  </div>
                ))}
                <div className="h-px w-full border-t border-dashed border-stroke-secondary" />
              </div>
            </div>
          </div>
          <LazyImageList images={item.images} key={item.slug} title={item.title} />
        </div>
      </section>
      <section className="flex w-full flex-col items-center justify-center overflow-clip bg-background-secondary p-4xl">
        <div className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader caption={relatedCaption} title={relatedTitle} />
          <DragScroll>
            {related.map((card) => (
              <WorkCard
                className="w-[853px] shrink-0"
                cover={card.cover}
                href={card.href}
                images={card.images}
                key={card.slug}
                title={card.title}
                year={card.year}
              />
            ))}
          </DragScroll>
        </div>
      </section>
    </PageLayout>
  )
}
