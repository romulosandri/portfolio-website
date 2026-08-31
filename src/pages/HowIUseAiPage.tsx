import { AppLogo } from '../design-system'
import { modelRows, toolCards } from '../content/portfolio'
import { PageLayout } from './PageLayout'
import { DisplayHero, SectionHeader } from './WorkCard'

type HowIUseAiPageProps = {
  pathname: string
}

const toolRows = [toolCards.slice(0, 4), toolCards.slice(4, 8), toolCards.slice(8, 12)]

export function HowIUseAiPage({ pathname }: HowIUseAiPageProps) {
  return (
    <PageLayout pathname={pathname}>
      <DisplayHero>How I use AI</DisplayHero>
      <section className="flex w-full flex-col items-center justify-center gap-[164px] bg-background-primary px-4xl pt-none pb-[164px]">
        <div className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader
            caption="A selection of the AI tools I use and the context where I use them"
            title="Tools"
          />
          <div className="flex w-full flex-col">
            {toolRows.map((row, rowIndex) => (
              <div className="flex h-[380px] w-full items-start" key={rowIndex}>
                {row.map((tool, index) => {
                  const last = index === row.length - 1
                  return (
                    <div
                      className={[
                        'flex h-full min-w-px flex-1 flex-col items-start justify-between p-2xl',
                        last
                          ? 'border border-solid border-stroke-secondary'
                          : 'border-t border-b border-l border-solid border-stroke-secondary',
                        rowIndex > 0 ? 'border-t-0' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={tool.name}
                    >
                      <AppLogo name={tool.name} />
                      <div className="flex w-full flex-col items-start gap-xl">
                        <p className="text-body-large text-foreground-primary">{tool.title}</p>
                        <p className="w-full whitespace-pre-wrap text-body-default text-foreground-secondary">
                          {tool.body}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader title="Models" />
          <div className="flex w-full flex-col rounded-sm bg-background-primary">
            {modelRows.map((row, index) => (
              <div
                className={[
                  'flex w-full items-start gap-lg bg-background-primary p-2xl',
                  index === 0
                    ? 'border border-solid border-stroke-secondary'
                    : 'border-r border-b border-l border-solid border-stroke-secondary',
                ].join(' ')}
                key={`${row.provider}-${row.name}`}
              >
                <p className="w-[120px] shrink-0 text-body-large text-foreground-secondary">
                  {row.provider}
                </p>
                <p className="w-[320px] shrink-0 text-body-large text-foreground-primary">
                  {row.name}
                </p>
                <p className="text-body-default text-foreground-tertiary">{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
