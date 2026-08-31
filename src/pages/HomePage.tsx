import { FooterSection, HowAi, LogosTicker, NavBar, TalkButton, WelcomeTag } from '../design-system'
import { site } from '../content/site'
import { valueCards, workItems } from '../content/portfolio'
import { SectionHeader, WorkCard } from './WorkCard'

type HomePageProps = {
  pathname: string
}

export function HomePage({ pathname }: HomePageProps) {
  return (
    <div className="flex min-h-full w-full flex-col bg-background-primary">
      <section className="relative flex w-full flex-col items-start overflow-clip bg-background-secondary">
        <NavBar className="bg-background-secondary" pathname={pathname} />
        <div className="flex h-[778.973px] w-full flex-col items-center justify-center p-[10px]">
          <div className="flex flex-col items-center gap-[132px]">
            <div className="flex flex-col items-center gap-3xl">
              <WelcomeTag />
              <h1 className="whitespace-pre text-center text-display text-foreground-primary">
                {`Product \nDesigner`}
              </h1>
            </div>
            <p className="w-[256px] text-center font-body text-xl leading-[1.35] text-foreground-tertiary">
              +8 Years working with amazing software
            </p>
          </div>
        </div>
        <LogosTicker />
        <img
          alt=""
          className="pointer-events-none absolute top-[calc(50%+27.26px)] left-1/2 size-[316px] -translate-x-1/2 -translate-y-1/2 object-cover"
          height={316}
          src="/images/home/hero-character.png"
          width={316}
        />
      </section>

      <section className="flex w-full flex-col items-center justify-center bg-background-primary p-4xl">
        <div className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader caption="Selected work from 2023 to 2026" title="Work" />
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
        </div>
      </section>

      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-[10px] py-[164px]">
        <div className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-[120px] px-3xl py-4xl">
          <div className="flex flex-col items-center gap-xl text-center">
            <p className="whitespace-nowrap text-body-default text-foreground-secondary">About Me</p>
            <p className="w-[640px] text-h2 leading-[1.2] text-foreground-primary">{site.blurb}</p>
          </div>
          <div className="flex w-full max-w-[1176px] flex-col items-start gap-4xl">
            <div className="flex h-[380px] w-full items-start">
              {valueCards.map((card, index) => (
                <div
                  className={[
                    'flex h-full min-w-px flex-1 flex-col items-start justify-between p-xl',
                    index === valueCards.length - 1
                      ? 'border border-solid border-stroke-secondary'
                      : 'border-t border-b border-l border-solid border-stroke-secondary',
                  ].join(' ')}
                  key={card.title}
                >
                  <p className="text-body-default text-foreground-primary">{card.title}</p>
                  <p className="w-full text-body-small text-foreground-secondary">{card.body}</p>
                </div>
              ))}
            </div>
            <HowAi href="/how-i-use-ai" />
            <TalkButton href="/contact" />
          </div>
        </div>
      </section>

      <section className="flex w-full items-center justify-center gap-[10px] overflow-clip bg-background-secondary px-[10px] py-4xl">
        {workItems.slice(0, 3).map((item) => (
          <img
            alt=""
            className="h-[640px] w-[853px] shrink-0 object-cover"
            height={640}
            key={item.slug}
            src={item.cover}
            width={853}
          />
        ))}
      </section>
      <FooterSection />
    </div>
  )
}
