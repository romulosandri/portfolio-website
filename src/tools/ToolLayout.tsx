import type { ReactNode } from 'react'
import { Button } from '../design-system'

type ToolLayoutProps = {
  title: string
  description: string
  controls: ReactNode
  canvas: ReactNode
}

export function ToolLayout({ title, description, controls, canvas }: ToolLayoutProps) {
  return (
    <div className="min-h-svh bg-background-primary">
      <header className="border-b border-solid border-stroke-secondary bg-background-primary px-gutter py-xl xs:py-2xl">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-xl xs:flex-row xs:items-center xs:justify-between xs:gap-3xl">
          <div className="flex-1">
            <h1 className="text-h3 xs:text-h2 mb-sm xs:mb-md text-foreground-primary">{title}</h1>
            <p className="text-body-small xs:text-body-default text-foreground-secondary">{description}</p>
          </div>
          <Button href="/" variant="default" className="shrink-0">
            ← Tools
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-xl xs:gap-3xl px-gutter py-xl xs:py-3xl nav:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-xl xs:gap-2xl">
          <div className="border border-solid border-stroke-secondary bg-background-primary p-xl xs:p-2xl">
            <h2 className="text-body-default xs:text-h5 mb-lg xs:mb-xl text-foreground-primary">Controls</h2>
            {controls}
          </div>
        </aside>

        <main className="flex min-h-[400px] xs:min-h-[600px] items-center justify-center overflow-auto border border-solid border-stroke-secondary bg-background-primary p-xl xs:p-2xl nav:p-3xl">
          {canvas}
        </main>
      </div>
    </div>
  )
}
