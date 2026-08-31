import { AiLogo, type AiLogoName } from './AiLogo'

type AiButtonProps = {
  name?: AiLogoName
  href?: string
  className?: string
}

export function AiButton({
  name = 'openai',
  href,
  className,
}: AiButtonProps) {
  const classes = [
    'inline-flex size-[32px] shrink-0 items-center justify-center border border-solid border-stroke-secondary bg-background-secondary p-sm hover:bg-background-tertiary',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const icon = <AiLogo height={18} name={name} width={18} />

  if (href) {
    return (
      <a aria-label={`Ask about Rômulo Sandri on ${name}`} className={classes} href={href}>
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
