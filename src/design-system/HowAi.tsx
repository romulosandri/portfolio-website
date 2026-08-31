import { AppLogo, type AppLogoName } from './AppLogo'
import { DsImage } from './DsImage'

const logos: AppLogoName[] = [
  'hermes',
  'cursor',
  'fal',
  'granola',
  'agent-mail',
  'openai',
  'composio',
  'firecrawl',
  'manus',
  'zernio',
  'apify',
  'tavily',
  'openrouter',
]

type HowAiProps = {
  href?: string
  forceHover?: boolean
  className?: string
}

export function HowAi({ href = '#', forceHover = false, className }: HowAiProps) {
  return (
    <a
      className={[
        'group flex h-[52px] w-full items-center justify-center gap-xl border-b border-l border-r border-solid p-xl no-underline',
        forceHover
          ? 'border-transparent bg-foreground-primary'
          : 'border-stroke-secondary bg-background-primary hover:border-transparent hover:bg-foreground-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-hover={forceHover ? 'true' : undefined}
      href={href}
    >
      <span
        className={[
          'min-w-px flex-1 text-body-default group-hover:text-background-primary group-data-[hover=true]:text-background-primary',
          forceHover ? 'text-background-primary' : 'text-foreground-primary',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        See how I use AI
      </span>
      <span className="flex items-center gap-xl group-hover:hidden group-data-[hover=true]:hidden">
        {logos.map((name) => (
          <AppLogo key={name} name={name} />
        ))}
      </span>
      <span className="hidden size-[24px] shrink-0 group-hover:inline-flex group-data-[hover=true]:inline-flex">
        <DsImage
          alt=""
          height={24}
          src="/design-system/icons/arrow-up-right-light.svg"
          width={24}
        />
      </span>
    </a>
  )
}
