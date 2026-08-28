import type { ReactNode } from 'react'
import { AI_LOGOS, APP_LOGOS, LOGOS, SOCIAL_ICONS, SYMBOLS } from './catalog'
import { AiLogo } from './AiLogo'
import { AppLogo } from './AppLogo'
import { Letter, LETTER_CHARS, LETTER_STYLES } from './Letter'
import { Logo } from './Logo'
import { SocialIcon } from './SocialIcon'
import { Symbol } from './Symbol'
import { Wordmark } from './Wordmark'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-xl">
      <h2 className="text-h4 text-foreground-primary">{title}</h2>
      {children}
    </section>
  )
}

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-sm">
      {children}
      <span className="font-mono text-body-small text-foreground-quaternary">{label}</span>
    </div>
  )
}

export function DesignSystemGallery() {
  return (
    <div className="min-h-full overflow-auto bg-background-primary text-foreground-primary">
      <main className="mx-auto flex max-w-[1200px] flex-col gap-4xl px-2xl py-3xl">
        <header className="flex flex-col gap-md">
          <p className="font-mono text-body-small text-foreground-tertiary">
            Design system
          </p>
          <h1 className="text-h2">Portfolio 2026 marks</h1>
          <p className="max-w-[640px] text-body-default text-foreground-secondary">
            Logos, letters, and icons exported from Figma. Social and AI marks swap
            on hover. Open this view with <code className="font-mono">?ds=1</code>.
          </p>
        </header>

        <Section title="Letters">
          <div className="flex flex-col gap-2xl" style={{ zoom: 2.5 }}>
            <div className="flex flex-wrap items-end gap-2xl">
              <Wordmark style={1} text="romul" />
              <Wordmark style={1} text="sand" />
              <Wordmark style={1} text="i" />
            </div>
            {LETTER_CHARS.map((letter) => (
              <div className="flex flex-col gap-sm" key={letter}>
                <p className="font-mono text-body-small uppercase text-foreground-tertiary">
                  {letter}
                </p>
                <div className="flex flex-wrap items-end gap-xl">
                  {LETTER_STYLES.map((style) => (
                    <Letter key={`${letter}-${style}`} letter={letter} style={style} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="App logos">
          <div className="flex flex-wrap items-center gap-2xl" style={{ zoom: 2 }}>
            {(Object.keys(APP_LOGOS) as Array<keyof typeof APP_LOGOS>).map((name) => (
              <Tile key={name} label={name}>
                <AppLogo name={name} />
              </Tile>
            ))}
          </div>
        </Section>

        <Section title="Client logos">
          <div className="flex flex-wrap items-center gap-3xl">
            {(Object.keys(LOGOS) as Array<keyof typeof LOGOS>).map((name) => (
              <Tile key={name} label={name}>
                <Logo name={name} />
              </Tile>
            ))}
          </div>
        </Section>

        <Section title="Symbols">
          <div className="flex flex-wrap items-center gap-xl" style={{ zoom: 2 }}>
            {(Object.keys(SYMBOLS) as Array<keyof typeof SYMBOLS>).map((variant) => (
              <Tile key={variant} label={String(variant)}>
                <Symbol variant={variant} />
              </Tile>
            ))}
          </div>
        </Section>

        <Section title="Social icons">
          <div className="flex flex-wrap items-center gap-2xl" style={{ zoom: 2 }}>
            {(Object.keys(SOCIAL_ICONS) as Array<keyof typeof SOCIAL_ICONS>).map(
              (type) => (
                <Tile key={type} label={type}>
                  <SocialIcon type={type} />
                </Tile>
              ),
            )}
          </div>
        </Section>

        <Section title="AI logos">
          <div className="flex flex-wrap items-center gap-2xl" style={{ zoom: 2 }}>
            {(Object.keys(AI_LOGOS) as Array<keyof typeof AI_LOGOS>).map((name) => (
              <Tile key={name} label={name}>
                <AiLogo name={name} />
              </Tile>
            ))}
          </div>
        </Section>
      </main>
    </div>
  )
}
