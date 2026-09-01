import {
  FooterSection,
  HowAi,
  TalkButton,
  WelcomeTag,
} from '../design-system'
import {
  CursorTrail,
  HeroFamily,
  ImagesTicker,
  LogosTicker,
  RevealBlock,
  RevealGroup,
  RevealText,
} from '../motion-system'
import { site } from '../content/site'
import { valueCards, workItems } from '../content/portfolio'
import { SectionHeader, WorkCard, WorkGrid } from './WorkCard'

export function HomePage() {
  return (
    <div className="flex min-h-full w-full flex-col bg-background-primary">
      <section className="relative -mt-[var(--site-nav-height,0px)] flex h-svh w-full flex-col items-start overflow-clip bg-background-secondary pt-[var(--site-nav-height,0px)]">
        <CursorTrail />
        <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center p-[10px]">
          <RevealGroup className="flex flex-col items-center gap-[132px]">
            <div className="flex flex-col items-center gap-3xl">
              <WelcomeTag />
              <RevealText
                as="h1"
                className="whitespace-pre text-center text-display text-foreground-primary"
                srText={`${site.name} — ${site.role}`}
              >
                {`Product \nDesigner`}
              </RevealText>
            </div>
            <RevealText
              as="p"
              className="w-[256px] text-center font-body text-xl leading-[1.35] text-foreground-tertiary"
            >
              +8 Years working with amazing software
            </RevealText>
          </RevealGroup>
        </div>
        <div className="relative z-20 w-full shrink-0">
          <HeroFamily />
          <LogosTicker />
        </div>
        <video
          aria-hidden
          autoPlay
          className="pointer-events-none absolute top-[calc(50%+27.26px)] left-1/2 z-10 size-[316px] -translate-x-1/2 -translate-y-1/2 bg-transparent object-cover"
          disablePictureInPicture
          height={316}
          loop
          muted
          playsInline
          poster="/images/home/hero-character.png"
          preload="auto"
          src="/videos/hero-character.webm"
          width={316}
        />
      </section>

      <section className="flex w-full flex-col items-center justify-center bg-background-primary p-4xl">
        <RevealGroup className="flex w-full flex-col items-center gap-4xl">
          <SectionHeader caption="Selected work from 2023 to 2026" title="Work" />
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

      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-[10px] py-[164px]">
        <RevealGroup className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-[120px] px-3xl py-4xl">
          <div className="flex flex-col items-center gap-xl text-center">
            <RevealText
              as="h2"
              className="whitespace-nowrap text-body-default text-foreground-secondary"
              variant="blur"
            >
              About Me
            </RevealText>
            <RevealText as="p" className="w-[640px] text-h2 leading-[1.2] text-foreground-primary">
              {site.blurb}
            </RevealText>
          </div>
          <div className="flex w-full max-w-[1176px] flex-col items-start gap-4xl">
            <div className="flex w-full flex-col items-stretch">
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
                    <RevealBlock>
                      <RevealText
                        as="h3"
                        className="text-body-default text-foreground-primary"
                        variant="blur"
                      >
                        {card.title}
                      </RevealText>
                      <RevealText as="p" className="w-full text-body-small text-foreground-secondary">
                        {card.body}
                      </RevealText>
                    </RevealBlock>
                  </div>
                ))}
              </div>
              <HowAi href="/how-i-use-ai" />
            </div>
            <TalkButton href="/contact" />
          </div>
        </RevealGroup>
      </section>

      <section className="flex w-full items-center overflow-clip bg-background-secondary">
        <ImagesTicker />
      </section>
      <FooterSection />
    </div>
  )
}
