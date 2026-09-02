import { site } from '../content/site'
import { track } from '../lib/analytics'
import { AiLogo, type AiLogoName } from './AiLogo'

const PROVIDER_LABELS: Record<AiLogoName, string> = {
  openai: 'ChatGPT',
  claude: 'Claude',
  grok: 'Grok',
  perplexity: 'Perplexity',
}

type AiButtonProps = {
  name?: AiLogoName
  href?: string
  label?: string
  className?: string
}

export function AiButton({
  name = 'openai',
  href,
  label,
  className,
}: AiButtonProps) {
  const classes = [
    'inline-flex size-[32px] shrink-0 items-center justify-center border border-solid border-stroke-secondary bg-background-secondary p-sm hover:bg-background-tertiary',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const icon = <AiLogo height={18} name={name} width={18} />
  const provider = label ?? PROVIDER_LABELS[name]

  if (href) {
    return (
      <a
        aria-label={`Ask about ${site.name} on ${provider} (opens in a new tab)`}
        className={classes}
        href={href}
        onClick={() =>
          track('ask_ai_clicked', {
            provider,
            href,
            pathname: window.location.pathname,
          })
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        {icon}
      </a>
    )
  }

  return (
    <span className={classes}>
      {icon}
    </span>
  )
}
