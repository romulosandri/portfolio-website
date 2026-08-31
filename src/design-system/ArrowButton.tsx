import { DsImage } from './DsImage'

export type ArrowButtonVariant = 'default' | 'dark'

type ArrowButtonProps = {
  variant?: ArrowButtonVariant
  href?: string
  className?: string
}

const icons: Record<ArrowButtonVariant, string> = {
  default: '/design-system/icons/arrow-up-right-dark.svg',
  dark: '/design-system/icons/arrow-up-right-light.svg',
}

export function ArrowButton({
  variant = 'default',
  href,
  className,
}: ArrowButtonProps) {
  const classes = [
    'inline-flex size-[80px] shrink-0 items-center justify-center',
    variant === 'dark'
      ? 'rounded-all bg-foreground-secondary'
      : 'border border-solid border-stroke-secondary bg-background-primary',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const icon = (
    <DsImage alt="" height={32} src={icons[variant]} width={32} />
  )

  if (href) {
    return (
      <a className={classes} href={href}>
        {icon}
      </a>
    )
  }

  return <span className={classes}>{icon}</span>
}
