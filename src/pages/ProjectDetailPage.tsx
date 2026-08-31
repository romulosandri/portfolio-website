import { workBySlug, workItems } from '../content/portfolio'
import { PageLayout } from './PageLayout'
import { DisplayHero, SectionHeader, WorkCard } from './WorkCard'

type ProjectDetailPageProps = {
  pathname: string
  slug: string
}

function MetaField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={['flex flex-col items-start gap-[10px]', className].filter(Boolean).join(' ')}>
      <p className="whitespace-nowrap text-body-small text-foreground-tertiary">{label}</p>
      <p className="w-full text-body-default text-foreground-primary">{value}</p>
    </div>
  )
}

export function ProjectDetailPage({ pathname, slug }: ProjectDetailPageProps) {
  const item = workBySlug(slug)

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
          <div className="flex w-[480px] shrink-0 flex-col items-start justify-center gap-3xl border-t border-solid border-stroke-secondary pt-2xl">
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
          <div className="flex min-w-px flex-1 flex-col items-start gap-2xl">
            {item.images.map((src) => (
              <span className="relative block aspect-[2048/1536] w-full overflow-clip" key={src}>
                <img alt="" className="absolute inset-0 size-full object-cover" src={src} />
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="flex w-full flex-col items-center justify-center overflow-clip bg-background-secondary p-4xl">
        <div className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader caption="Selected work from 2023 to 2026" title="Work" />
          <div className="flex w-full items-start gap-1xl overflow-x-auto">
            {workItems.map((card) => (
              <WorkCard
                className="w-[904px] shrink-0"
                cover={card.cover}
                href={card.href}
                key={card.slug}
                title={card.title}
                year={card.year}
              />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
