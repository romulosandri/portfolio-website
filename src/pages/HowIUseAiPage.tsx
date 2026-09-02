import { AppLogo } from '../design-system'
import { RevealBlock, RevealGroup, RevealText } from '../motion-system'
import { modelRows, toolCards } from '../content/portfolio'
import { PageLayout } from './PageLayout'
import { DisplayHero, SectionHeader } from './WorkCard'

export function HowIUseAiPage() {
  return (
    <PageLayout>
      <DisplayHero>How I use AI</DisplayHero>
      <section className="flex w-full flex-col items-center justify-center gap-[clamp(72px,12vw,164px)] bg-background-primary px-gutter pt-none pb-[clamp(72px,12vw,164px)]">
        <RevealGroup className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader
            caption="A selection of the AI tools I use and the context where I use them"
            title="Tools"
          />
          {/* One flat grid rather than three rows of four, so the column count
              can change without the border pattern breaking. The container
              draws the top and left edge and every cell draws its own right and
              bottom, which gives clean single-width rules at any column count. */}
          <div className="grid w-full grid-cols-1 border-t border-l border-solid border-stroke-secondary xs:grid-cols-2 lg:grid-cols-4">
            {toolCards.map((tool) => (
              <div
                // No minimum height in the single-column stack: a fixed 300px
                // per card is mostly dead space once the cards are full width.
                className="flex min-w-px flex-col items-start justify-between gap-2xl border-r border-b border-solid border-stroke-secondary p-2xl xs:min-h-[320px] lg:min-h-[380px]"
                key={tool.name}
              >
                <AppLogo name={tool.name} size={32} />
                <RevealBlock>
                  <div className="flex w-full flex-col items-start gap-xl">
                    <RevealText as="p" className="text-body-large text-foreground-primary">
                      {tool.title}
                    </RevealText>
                    <RevealText
                      as="p"
                      className="w-full whitespace-pre-wrap text-body-default text-foreground-secondary"
                    >
                      {tool.body}
                    </RevealText>
                  </div>
                </RevealBlock>
              </div>
            ))}
          </div>
        </RevealGroup>

        <RevealGroup className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader title="Models" />
          <div className="flex w-full flex-col rounded-sm bg-background-primary">
            {modelRows.map((row, index) => (
              <RevealBlock key={`${row.provider}-${row.name}`}>
                <div
                  className={[
                    'flex w-full flex-col items-start gap-lg bg-background-primary p-2xl md:flex-row',
                    index === 0
                      ? 'border border-solid border-stroke-secondary'
                      : 'border-r border-b border-l border-solid border-stroke-secondary',
                  ].join(' ')}
                >
                  <RevealText as="p" className="w-full text-body-large text-foreground-secondary md:w-[120px] md:shrink-0">
                    {row.provider}
                  </RevealText>
                  <RevealText as="p" className="w-full text-body-large text-foreground-primary md:w-[280px] md:shrink-0">
                    {row.name}
                  </RevealText>
                  <RevealText as="p" className="text-body-default text-foreground-tertiary">
                    {row.note}
                  </RevealText>
                </div>
              </RevealBlock>
            ))}
          </div>
        </RevealGroup>
      </section>
    </PageLayout>
  )
}
