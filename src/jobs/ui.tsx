import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function JobsInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full max-w-xs border border-solid border-stroke-secondary bg-transparent px-xl py-md text-body-default text-foreground-primary outline-none placeholder:text-foreground-quaternary',
        className,
      )}
      type="search"
      {...props}
    />
  )
}

const actionClass = (variant: 'default' | 'danger' | 'icon', className?: string) =>
  cx(
    'inline-flex items-center justify-center border border-solid text-body-small no-underline disabled:cursor-default disabled:opacity-60',
    variant === 'icon' ? 'size-8 shrink-0' : 'px-lg py-md',
    variant === 'danger'
      ? 'border-stroke-secondary text-foreground-secondary hover:border-foreground-primary hover:bg-foreground-primary hover:text-background-primary'
      : 'border-stroke-secondary text-foreground-secondary hover:bg-background-secondary hover:text-foreground-primary',
    className,
  )

type JobsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'danger' | 'icon'
}

export function JobsButton({ className, variant = 'default', type = 'button', ...props }: JobsButtonProps) {
  return <button className={actionClass(variant, className)} type={type} {...props} />
}

type JobsLinkProps = {
  href: string
  label: string
  children: ReactNode
  className?: string
}

export function JobsLink({ href, label, children, className }: JobsLinkProps) {
  return (
    <a
      aria-label={label}
      className={actionClass('icon', className)}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}

type JobsCheckboxProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  className?: string
}

export function JobsCheckbox({ checked, onCheckedChange, label, className }: JobsCheckboxProps) {
  return (
    <label className={cx('inline-flex cursor-pointer items-center', className)}>
      <input
        aria-label={label}
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onCheckedChange(event.target.checked)}
        type="checkbox"
      />
      <span
        aria-hidden
        className={cx(
          'pointer-events-none inline-flex size-4 items-center justify-center border border-solid border-stroke-secondary bg-background-primary text-background-primary',
          'peer-checked:border-foreground-primary peer-checked:bg-foreground-primary',
          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground-primary',
        )}
      >
        <svg fill="none" height="10" viewBox="0 0 10 10" width="10">
          <path d="M1.5 5.2 3.8 7.5 8.5 2.5" stroke="currentColor" strokeLinecap="square" strokeWidth="1.4" />
        </svg>
      </span>
    </label>
  )
}

export function ApplyIcon() {
  return (
    <svg aria-hidden fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M4 12 12 4M6.5 4H12v5.5" stroke="currentColor" strokeLinecap="square" strokeWidth="1.2" />
    </svg>
  )
}

export function DeleteIcon() {
  return (
    <svg aria-hidden fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M3.5 4.5h9M6 4.5V3.5h4v1M5 6.5l.5 6h5l.5-6" stroke="currentColor" strokeLinecap="square" strokeWidth="1.2" />
    </svg>
  )
}
