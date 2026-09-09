import type { KeyboardEvent, ReactNode } from 'react'
import { cx } from './cx'

type TabProps = {
  selected?: boolean
  forceHover?: boolean
  children: ReactNode
  className?: string
  id?: string
  controls?: string
  onClick?: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void
}

export function Tab({
  selected = false,
  forceHover = false,
  children,
  className,
  id,
  controls,
  onClick,
  onKeyDown,
}: TabProps) {
  const hovered = forceHover && !selected

  return (
    <button
      aria-controls={controls}
      aria-selected={selected}
      className={cx(
        '-mb-px cursor-pointer border-b border-solid pb-md text-body-default',
        selected
          ? 'border-foreground-primary text-foreground-primary'
          : hovered
            ? 'border-transparent text-foreground-secondary'
            : 'border-transparent text-foreground-quaternary hover:text-foreground-secondary',
        className,
      )}
      id={id}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="tab"
      type="button"
    >
      {children}
    </button>
  )
}

type TabMenuProps = {
  children: ReactNode
  label: string
  className?: string
}

export function TabMenu({ children, label, className }: TabMenuProps) {
  return (
    <div
      aria-label={label}
      className={cx('flex gap-xl border-b border-solid border-stroke-secondary', className)}
      role="tablist"
    >
      {children}
    </div>
  )
}

export type TabItem<T extends string = string> = {
  id: T
  label: string
}

type TabsProps<T extends string> = {
  items: Array<TabItem<T>>
  value: T
  onChange: (value: T) => void
  label: string
  idPrefix?: string
  className?: string
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  idPrefix = 'tab',
  className,
}: TabsProps<T>) {
  return (
    <TabMenu className={className} label={label}>
      {items.map((item, index) => (
        <Tab
          controls={`${idPrefix}-panel-${item.id}`}
          id={`${idPrefix}-button-${item.id}`}
          key={item.id}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
            event.preventDefault()
            const next = event.key === 'ArrowRight' ? index + 1 : index - 1
            const wrapped = items[(next + items.length) % items.length]
            if (wrapped) onChange(wrapped.id)
          }}
          selected={value === item.id}
        >
          {item.label}
        </Tab>
      ))}
    </TabMenu>
  )
}
