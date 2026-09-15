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
      <header className="border-b border-solid border-stroke-secondary bg-background-primary px-gutter py-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3xl">
          <div>
            <h1 className="text-h2 mb-md text-foreground-primary">{title}</h1>
            <p className="text-body-default text-foreground-secondary">{description}</p>
          </div>
          <Button href="/" variant="default">
            ← Tools
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-3xl px-gutter py-3xl nav:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-2xl">
          <div className="border border-solid border-stroke-secondary bg-background-primary p-2xl">
            <h2 className="text-h5 mb-xl text-foreground-primary">Controls</h2>
            {controls}
          </div>
        </aside>

        <main className="flex min-h-[600px] items-center justify-center border border-solid border-stroke-secondary bg-background-primary p-3xl">
          {canvas}
        </main>
      </div>
    </div>
  )
}
