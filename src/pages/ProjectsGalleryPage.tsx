import { RevealGroup } from '../motion-system'
import { projectItems } from '../content/portfolio'
import { PageLayout } from './PageLayout'
import { DisplayHero, WorkCard, WorkGrid } from './WorkCard'

export function ProjectsGalleryPage() {
  return (
    <PageLayout>
      <DisplayHero>Projects</DisplayHero>
      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-4xl pt-none pb-[164px]">
        <RevealGroup className="w-full">
          <WorkGrid>
            {projectItems.map((item) => (
              <WorkCard
                cover={item.cover}
                href={item.href}
                images={item.images}
                key={item.slug}
                title={item.title}
                year={item.year}
              />
            ))}
          </WorkGrid>
        </RevealGroup>
      </section>
    </PageLayout>
  )
}
