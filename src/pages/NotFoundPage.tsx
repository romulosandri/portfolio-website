import { RevealGroup, RevealText } from '../motion-system'
import { PageLayout } from './PageLayout'
import { DisplayHero, SectionHeader } from './WorkCard'

const destinations = [
  { href: '/', label: 'Home', hint: 'Back to the beginning' },
  { href: '/work', label: 'Work', hint: 'Selected product design' },
  { href: '/projects', label: 'Projects', hint: 'Side products and experiments' },
  { href: '/contact', label: 'Contact', hint: 'Say hello' },
]

export function NotFoundPage() {
  return (
    <PageLayout>
      <DisplayHero srText="Page not found">404</DisplayHero>
      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-4xl pt-none pb-[164px]">
        <RevealGroup className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader
            caption="This URL is not a page on this site"
            title="That page does not exist"
          />
          <div className="flex w-full flex-col items-start gap-4xl">
            <RevealText
              as="p"
              className="w-full max-w-[640px] text-h2 leading-[1.2] text-foreground-primary"
            >
              Browse the work, look at side projects, or get in touch. The rest of the site is still here.
            </RevealText>
            <nav aria-label="Suggested pages" className="flex h-[380px] w-full items-stretch">
              {destinations.map((item, index) => (
                <a
                  aria-label={item.label}
                  className={[
                    'flex h-full min-w-px flex-1 flex-col items-start justify-between p-2xl no-underline',
                    index === 0
                      ? 'border border-solid border-stroke-secondary'
                      : 'border-t border-r border-b border-solid border-stroke-secondary',
                  ].join(' ')}
                  href={item.href}
                  key={item.href}
                >
                  <RevealText as="span" className="text-h3 text-foreground-primary">
                    {item.label}
                  </RevealText>
                  <RevealText as="p" className="text-body-default text-foreground-secondary">
                    {item.hint}
                  </RevealText>
                </a>
              ))}
            </nav>
          </div>
        </RevealGroup>
      </section>
    </PageLayout>
  )
}
