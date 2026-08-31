import { workItems } from '../content/portfolio'
import { PageLayout } from './PageLayout'
import { DisplayHero, WorkCard } from './WorkCard'

type WorkGalleryPageProps = {
  pathname: string
}

export function WorkGalleryPage({ pathname }: WorkGalleryPageProps) {
  return (
    <PageLayout pathname={pathname}>
      <DisplayHero>Work</DisplayHero>
      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-4xl pt-none pb-[164px]">
        <div className="grid w-full grid-cols-2 gap-x-xl gap-y-2xl">
          {workItems.map((item) => (
            <WorkCard
              cover={item.cover}
              href={item.href}
              key={item.slug}
              title={item.title}
              year={item.year}
            />
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
