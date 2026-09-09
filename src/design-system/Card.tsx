import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

export type CardVariant = 'plain' | 'cell' | 'job' | 'list'

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: CardVariant
  forceHover?: boolean
  dragging?: boolean
  pending?: boolean
  as?: 'div' | 'article' | 'section'
  children: ReactNode
}

export function Card({
  variant = 'plain',
  forceHover = false,
  dragging = false,
  pending = false,
  as: Component = 'div',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cx(
        variant === 'cell' &&
          'flex min-w-px flex-col items-start justify-between gap-2xl border-r border-b border-solid border-stroke-secondary',
        variant === 'job' &&
          cx(
            'border border-solid bg-background-primary p-lg transition-colors duration-200 ease-out motion-reduce:transition-none',
            forceHover ? 'border-stroke-hover' : 'border-stroke-secondary hover:border-stroke-hover',
          ),
        variant === 'list' &&
          'border-b border-solid border-stroke-secondary bg-background-primary px-xl py-lg last:border-b-0 transition-colors duration-200 ease-out hover:bg-background-secondary motion-reduce:transition-none',
        variant === 'plain' &&
          'border border-solid border-stroke-secondary bg-background-primary p-lg',
        dragging ? 'opacity-40' : pending ? 'opacity-60' : undefined,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
