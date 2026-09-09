import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronDownIcon } from './Icons'
import { cx } from './cx'

export type DropdownOption = {
  value: string
  label: string
}

type DropdownMenuItemProps = {
  selected?: boolean
  forceHover?: boolean
  disabled?: boolean
  children: ReactNode
  className?: string
  onClick?: () => void
  id?: string
}

export function DropdownMenuItem({
  selected = false,
  forceHover = false,
  disabled = false,
  children,
  className,
  onClick,
  id,
}: DropdownMenuItemProps) {
  const hovered = forceHover && !disabled

  return (
    <button
      aria-selected={selected}
      className={cx(
        'flex w-full items-center justify-between gap-md px-md py-sm text-left text-body-small',
        disabled ? 'cursor-default opacity-60' : 'cursor-pointer',
        selected ? 'text-foreground-primary' : 'text-foreground-secondary',
        hovered ? 'bg-background-secondary text-foreground-primary' : 'hover:bg-background-secondary hover:text-foreground-primary',
        className,
      )}
      disabled={disabled}
      id={id}
      onClick={onClick}
      role="option"
      type="button"
    >
      <span className="min-w-0 truncate">{children}</span>
    </button>
  )
}

type DropdownMenuProps = {
  children: ReactNode
  className?: string
  labelledBy?: string
  id?: string
  placement?: 'absolute' | 'static'
}

export function DropdownMenu({
  children,
  className,
  labelledBy,
  id,
  placement = 'absolute',
}: DropdownMenuProps) {
  return (
    <div
      aria-labelledby={labelledBy}
      className={cx(
        'z-20 min-w-full border border-solid border-stroke-secondary bg-background-primary py-xsm',
        placement === 'absolute' ? 'absolute top-full left-0 mt-xsm' : null,
        className,
      )}
      id={id}
      role="listbox"
    >
      {children}
    </div>
  )
}

type DropdownProps = {
  value: string
  options: DropdownOption[]
  onChange?: (value: string) => void
  disabled?: boolean
  label: string
  className?: string
  forceHover?: boolean
  forceOpen?: boolean
}

export function Dropdown({
  value,
  options,
  onChange,
  disabled = false,
  label,
  className,
  forceHover = false,
  forceOpen = false,
}: DropdownProps) {
  const triggerId = useId()
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const shown = forceOpen || open
  const hovered = forceHover && !disabled
  const selected = options.find((option) => option.value === value)
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  useEffect(() => {
    if (!shown || forceOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [forceOpen, shown])

  function choose(next: string) {
    if (disabled) return
    onChange?.(next)
    if (!forceOpen) setOpen(false)
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
      return
    }
    if (!shown) return
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const next = options[selectedIndex <= 0 ? options.length - 1 : selectedIndex - 1]
      if (next) choose(next.value)
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = options[(selectedIndex + 1) % options.length]
      if (next) choose(next.value)
    }
  }

  return (
    <div className={cx('relative inline-flex min-w-0', className)} ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={shown}
        aria-haspopup="listbox"
        aria-label={label}
        className={cx(
          'inline-flex w-full items-center justify-between gap-md border border-solid bg-background-primary px-md py-xsm text-body-small',
          disabled ? 'cursor-default opacity-60' : 'cursor-pointer',
          shown || hovered
            ? 'border-foreground-quaternary text-foreground-primary'
            : 'border-stroke-secondary text-foreground-secondary hover:border-foreground-quaternary hover:text-foreground-primary',
        )}
        disabled={disabled}
        draggable={false}
        id={triggerId}
        onClick={() => {
          if (!disabled && !forceOpen) setOpen((current) => !current)
        }}
        onKeyDown={onTriggerKeyDown}
        type="button"
      >
        <span className="min-w-0 truncate">{selected?.label ?? value}</span>
        <span className={cx('inline-flex shrink-0', shown && 'rotate-180')}>
          <ChevronDownIcon />
        </span>
      </button>
      {shown ? (
        <DropdownMenu id={menuId} labelledBy={triggerId}>
          {options.map((option) => (
            <DropdownMenuItem
              id={`${menuId}-${option.value}`}
              key={option.value}
              onClick={() => choose(option.value)}
              selected={option.value === value}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      ) : null}
    </div>
  )
}
