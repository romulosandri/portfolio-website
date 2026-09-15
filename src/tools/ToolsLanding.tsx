import { Button } from '../design-system'

const tools = [
  {
    name: 'Candle Sticks',
    href: '/candle-sticks',
    description: 'Generate vertical candle patterns with customizable colors and layouts',
  },
  {
    name: 'Block Gradients',
    href: '/block-gradients',
    description: 'Create random block compositions with OKLCH color gradients',
  },
  {
    name: 'Color Stripes',
    href: '/color-stripes',
    description: 'Generate random stripe patterns from your custom color palette',
  },
]

export function ToolsLanding() {
  return (
    <div className="min-h-svh px-gutter py-xl xs:py-4xl">
      <div className="mx-auto max-w-4xl">
        <header className="mb-3xl xs:mb-4xl">
          <h1 className="text-h2 xs:text-h1 mb-xl xs:mb-2xl text-foreground-primary">Brand Tools</h1>
          <p className="text-body-small xs:text-body-default text-foreground-secondary">
            Interactive tools for generating brand visuals and color patterns
          </p>
        </header>

        <div className="grid gap-xl xs:gap-3xl xs:grid-cols-1 nav:grid-cols-3">
          {tools.map((tool) => (
            <article
              key={tool.href}
              className="border border-solid border-stroke-secondary bg-background-primary p-xl xs:p-2xl transition-colors duration-200 hover:bg-background-secondary motion-reduce:transition-none"
            >
              <h2 className="text-h4 xs:text-h3 mb-lg xs:mb-xl text-foreground-primary">{tool.name}</h2>
              <p className="text-body-small xs:text-body-default mb-xl xs:mb-2xl text-foreground-secondary">{tool.description}</p>
              <Button href={tool.href} variant="primary" className="w-full xs:w-auto">
                Open Tool
              </Button>
            </article>
          ))}
        </div>

        <footer className="mt-3xl xs:mt-4xl border-t border-solid border-stroke-secondary pt-xl xs:pt-3xl">
          <p className="text-body-small text-foreground-tertiary">
            <a
              href="https://romulosandri.com"
              className="text-foreground-secondary underline hover:text-foreground-primary"
            >
              ← Back to Portfolio
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
