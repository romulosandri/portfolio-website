import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

type KanbanColumnProps = HTMLAttributes<HTMLElement> & {
  label: string
  count: number
  over?: boolean
  children: ReactNode
}

export function KanbanColumn({
  label,
  count,
  over = false,
  children,
  className,
  ...props
}: KanbanColumnProps) {
  return (
    <section
      aria-label={label}
      className={cx(
        'flex h-full max-h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden border border-solid bg-background-primary transition-colors duration-200 ease-out motion-reduce:transition-none',
        over ? 'border-stroke-hover' : 'border-stroke-secondary hover:border-stroke-hover',
        className,
      )}
      {...props}
    >
      <header className="flex shrink-0 items-center justify-between gap-md border-b border-solid border-stroke-secondary px-lg py-lg">
        <h2 className="text-body-default text-foreground-primary">{label}</h2>
        <span className="text-body-small text-foreground-quaternary">{count}</span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-md" data-kanban-list>
        {children}
      </div>
    </section>
  )
}
