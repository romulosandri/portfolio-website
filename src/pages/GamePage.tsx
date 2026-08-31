import { GameCanvas } from '../components/GameCanvas'
import { FooterSection } from '../design-system'
import { RevealGroup, RevealLine, RevealText } from '../motion-system'

export function GamePage() {
  return (
    <div className="flex min-h-full w-full flex-col bg-background-primary">
      <div className="flex h-[calc(100dvh-var(--site-nav-height,0px))] w-full flex-col">
        <div className="flex min-h-px flex-1 flex-col items-center justify-center px-4xl py-xl">
          <div className="flex min-h-px w-full flex-1 flex-col items-center gap-4xl">
            <RevealGroup className="flex w-full shrink-0 flex-col">
              <RevealLine />
              <div className="flex w-full items-center justify-center pt-2xl">
                <RevealText as="h1" className="min-w-px flex-1 text-h2 text-foreground-primary">
                  My life game
                </RevealText>
              </div>
            </RevealGroup>
            <div className="relative min-h-0 w-full flex-1 overflow-clip">
              <GameCanvas />
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
