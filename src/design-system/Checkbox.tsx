import { CheckIcon } from './Icons'
import { cx } from './cx'

type CheckboxProps = {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  label: string
  className?: string
  disabled?: boolean
  forceHover?: boolean
  forceFocus?: boolean
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  className,
  disabled = false,
  forceHover = false,
  forceFocus = false,
}: CheckboxProps) {
  const hovered = forceHover && !disabled
  const focused = forceFocus && !disabled

  return (
    <label
      className={cx(
        'relative inline-flex size-4 shrink-0 items-center justify-center',
        disabled ? 'cursor-default opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <input
        aria-label={label}
        checked={checked}
        className={cx(
          'peer absolute inset-0 z-10 m-0 size-full appearance-none opacity-0',
          disabled ? 'cursor-default' : 'cursor-pointer',
        )}
        disabled={disabled}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        type="checkbox"
      />
      <span
        aria-hidden
        className={cx(
          'pointer-events-none inline-flex size-4 items-center justify-center border border-solid bg-background-primary text-background-primary transition-colors duration-200 ease-out motion-reduce:transition-none',
          checked
            ? 'border-foreground-primary bg-foreground-primary'
            : hovered
              ? 'border-stroke-hover'
              : 'border-stroke-secondary',
          !checked && !hovered && 'peer-hover:border-stroke-hover',
          focused
            ? 'outline outline-2 outline-offset-2 outline-foreground-quaternary'
            : 'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground-quaternary',
        )}
      >
        <CheckIcon />
      </span>
    </label>
  )
}
