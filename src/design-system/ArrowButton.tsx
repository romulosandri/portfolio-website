import { forwardRef } from 'react'
import { DsImage } from './DsImage'

export type ArrowButtonVariant = 'default' | 'dark'

type ArrowButtonProps = {
  variant?: ArrowButtonVariant
  href?: string
  className?: string
}

const restIcon = '/design-system/icons/arrow-up-right-dark.svg'
const hoverIcon = '/design-system/icons/arrow-up-right-light.svg'

export const ArrowButton = forwardRef<HTMLSpanElement, ArrowButtonProps>(
  function ArrowButton({ variant = 'default', href, className }, ref) {
    const isDark = variant === 'dark'
    const classes = [
      'relative inline-flex size-[48px] shrink-0 items-center justify-center will-change-transform md:size-[80px]',
      isDark
        ? 'rounded-all bg-foreground-secondary'
        : 'border border-solid border-stroke-secondary bg-background-primary',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const icon = (
      <span className="relative size-[32px] shrink-0">
        <span
          className={[
            'absolute inset-0 flex items-center justify-center',
            isDark ? 'opacity-0' : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
          data-arrow-rest=""
        >
          <DsImage alt="" height={32} src={restIcon} width={32} />
        </span>
        <span
          className={[
            'absolute inset-0 flex items-center justify-center',
            isDark ? undefined : 'opacity-0',
          ]
            .filter(Boolean)
            .join(' ')}
          data-arrow-hover=""
        >
          <DsImage alt="" height={32} src={hoverIcon} width={32} />
        </span>
      </span>
    )

    if (href) {
      return (
        <a className="inline-flex" href={href}>
          <span className={classes} ref={ref}>
            {icon}
          </span>
        </a>
      )
    }

    return (
      <span className={classes} ref={ref}>
        {icon}
      </span>
    )
  },
)
