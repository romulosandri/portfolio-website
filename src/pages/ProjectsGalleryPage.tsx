import { projectItems } from '../content/portfolio'
import { PageLayout } from './PageLayout'
import { DisplayHero, WorkCard } from './WorkCard'

type ProjectsGalleryPageProps = {
  pathname: string
}

export function ProjectsGalleryPage({ pathname }: ProjectsGalleryPageProps) {
  return (
    <PageLayout pathname={pathname}>
      <DisplayHero>Projects</DisplayHero>
      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-4xl pt-none pb-[164px]">
        <div className="grid w-full grid-cols-2 gap-x-xl gap-y-2xl">
          {projectItems.map((item) => (
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
