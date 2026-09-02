import { RevealGroup } from '../motion-system'
import { workItems } from '../content/portfolio'
import { PageLayout } from './PageLayout'
import { DisplayHero, WorkCard, WorkGrid } from './WorkCard'

export function WorkGalleryPage() {
  return (
    <PageLayout>
      <DisplayHero>Work</DisplayHero>
      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-gutter pt-none pb-[clamp(72px,12vw,164px)]">
        <RevealGroup className="w-full">
          <WorkGrid>
            {workItems.map((item) => (
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
