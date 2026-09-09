import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'icon'

type ButtonShared = {
  variant?: ButtonVariant
  forceHover?: boolean
  className?: string
  children?: ReactNode
}

type ButtonAsButton = ButtonShared &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
    ref?: Ref<HTMLButtonElement>
  }

type ButtonAsLink = ButtonShared &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    href: string
    ref?: Ref<HTMLAnchorElement>
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

function buttonClassName({
  variant = 'default',
  forceHover = false,
  className,
  disabled = false,
}: {
  variant?: ButtonVariant
  forceHover?: boolean
  className?: string
  disabled?: boolean
}) {
  const hovered = forceHover && !disabled

  return cx(
    'inline-flex items-center justify-center border border-solid text-body-small no-underline',
    disabled ? 'cursor-default opacity-60' : 'cursor-pointer',
    variant === 'icon' ? 'size-8 shrink-0' : 'px-lg py-md',
    variant === 'primary'
      ? hovered
        ? 'border-foreground-primary bg-foreground-primary text-background-primary opacity-90'
        : 'border-foreground-primary bg-foreground-primary text-background-primary hover:opacity-90'
      : variant === 'danger'
        ? hovered
          ? 'border-foreground-primary bg-foreground-primary text-background-primary'
          : 'border-stroke-secondary text-foreground-secondary hover:border-foreground-primary hover:bg-foreground-primary hover:text-background-primary'
        : hovered
          ? 'border-stroke-secondary bg-background-secondary text-foreground-primary'
          : 'border-stroke-secondary text-foreground-secondary hover:bg-background-secondary hover:text-foreground-primary',
    className,
  )
}

export function Button(props: ButtonProps) {
  const { variant = 'default', forceHover = false, className, children, ...rest } = props
  const disabled = 'disabled' in rest ? Boolean(rest.disabled) : false
  const classNames = buttonClassName({ variant, forceHover, className, disabled })

  if ('href' in rest && rest.href) {
    const { href, ref, ...linkRest } = rest
    return (
      <a className={classNames} href={href} ref={ref} {...linkRest}>
        {children}
      </a>
    )
  }

  const { ref, type = 'button', href: _href, ...buttonRest } = rest as ButtonAsButton
  return (
    <button className={classNames} ref={ref} type={type} {...buttonRest}>
      {children}
    </button>
  )
}
