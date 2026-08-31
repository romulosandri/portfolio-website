import { GameCanvas } from '../components/GameCanvas'
import { FooterSection, NavBar } from '../design-system'

type GamePageProps = {
  pathname: string
}

export function GamePage({ pathname }: GamePageProps) {
  return (
    <div className="flex min-h-full w-full flex-col bg-background-primary">
      <div className="flex h-dvh w-full flex-col">
        <NavBar pathname={pathname} />
        <div className="flex min-h-px flex-1 flex-col items-center justify-center px-4xl py-xl">
          <div className="flex min-h-px w-full flex-1 flex-col items-center gap-4xl">
            <div className="flex w-full shrink-0 items-center justify-center border-t border-solid border-stroke-secondary pt-2xl">
              <h1 className="min-w-px flex-1 text-h2 text-foreground-primary">My life game</h1>
            </div>
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
