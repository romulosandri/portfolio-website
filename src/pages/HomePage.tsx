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
import { displayFitStyle } from '../lib/displayFit'
import { SectionHeader, WorkCard, WorkGrid } from './WorkCard'

/** The newline is the composition -- two stacked words, never one line. */
const HERO_TITLE = 'Product\nDesigner'

export function HomePage() {
  return (
    <div className="flex min-h-full w-full flex-col bg-background-primary">
      <section className="hero-stage relative -mt-[var(--site-nav-height,0px)] flex h-svh w-full flex-col items-start overflow-clip bg-background-secondary pt-[var(--site-nav-height,0px)] [container-type:inline-size]">
        <CursorTrail />
        <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-start px-gutter pt-xl pb-gutter md:static md:justify-center md:p-gutter">
          {/* 132px of the original 316px video, so the gap tracks the character
              rather than the viewport and the three pieces hold their spacing
              relative to each other at every size. */}
          <RevealGroup className="flex w-full flex-col items-center gap-[calc(var(--hero-video)*0.418)] [container-type:inline-size]">
            <div className="flex flex-col items-center gap-3xl">
              <WelcomeTag />
              {/*
                On small screens the video is pinned to the title so they stay
                overlapped when this block sits under the nav. `md:contents`
                drops the wrapper so the video positions against the stage at
                50%, which is the original desktop composition.
              */}
              <div className="relative md:contents">
                <RevealText
                  as="h1"
                  className="text-center text-display text-foreground-primary"
                  srText={`${site.name} — ${site.role}`}
                  style={displayFitStyle(HERO_TITLE)}
                >
                  {HERO_TITLE}
                </RevealText>
                <video
                  aria-hidden
                  autoPlay
                  className="pointer-events-none absolute top-[60%] left-1/2 z-10 size-[var(--hero-video)] -translate-x-1/2 -translate-y-1/2 bg-transparent object-cover md:top-[calc(50%+var(--hero-video)*0.0863)]"
                  data-prerender="strip"
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
              </div>
            </div>
            <RevealText
              as="p"
              className="w-[256px] text-center font-body text-xl leading-[1.35] text-foreground-tertiary"
            >
              +8 Years working with amazing software
            </RevealText>
          </RevealGroup>
        </div>
        <div className="relative z-20 w-full shrink-0 max-md:-mt-[200px]">
          <HeroFamily />
          <LogosTicker />
        </div>
      </section>

      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-gutter py-4xl">
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

      <section className="flex w-full flex-col items-center justify-center bg-background-primary px-gutter py-[clamp(72px,12vw,164px)]">
        <RevealGroup className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-[clamp(56px,9vw,120px)] py-4xl">
          <div className="flex flex-col items-center gap-xl text-center">
            <RevealText
              as="h2"
              className="whitespace-nowrap text-body-default text-foreground-secondary"
              variant="blur"
            >
              About Me
            </RevealText>
            <RevealText as="p" className="w-full max-w-[640px] text-h2 leading-[1.2] text-foreground-primary">
              {site.blurb}
            </RevealText>
          </div>
          <div className="flex w-full max-w-[1176px] flex-col items-start gap-4xl">
            <div className="flex w-full flex-col items-stretch">
              <div className="grid w-full grid-cols-1 border-t border-l border-solid border-stroke-secondary md:grid-cols-3">
                {valueCards.map((card) => (
                  <div
                    className="flex min-w-px flex-col items-start justify-between gap-2xl border-r border-b border-solid border-stroke-secondary p-xl md:min-h-[380px]"
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
