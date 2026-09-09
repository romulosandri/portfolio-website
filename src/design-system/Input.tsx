import type {
  ChangeEventHandler,
  FormEvent,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
} from 'react'
import { cx } from './cx'

export type InputSize = 'md' | 'lg'
export type FieldLabelTone = 'quiet' | 'default'

type InputStateProps = {
  forceHover?: boolean
  forceFocus?: boolean
  size?: InputSize
}

function fieldControlClass({
  size = 'md',
  forceHover = false,
  forceFocus = false,
  disabled = false,
  className,
}: InputStateProps & { disabled?: boolean; className?: string }) {
  const focused = forceFocus && !disabled
  const hovered = forceHover && !focused && !disabled

  return cx(
    'w-full border border-solid bg-transparent text-body-default text-foreground-primary outline-none placeholder:text-foreground-quaternary transition-colors duration-200 ease-out motion-reduce:transition-none',
    size === 'lg' ? 'p-xl' : 'px-xl py-md',
    disabled && 'cursor-default opacity-60',
    focused
      ? 'border-foreground-quaternary'
      : hovered
        ? 'border-stroke-hover'
        : 'border-stroke-secondary hover:border-stroke-hover focus:border-foreground-quaternary',
    className,
  )
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  InputStateProps & {
    ref?: Ref<HTMLInputElement>
  }

export function Input({
  className,
  type = 'text',
  size = 'md',
  forceHover = false,
  forceFocus = false,
  disabled,
  ref,
  ...props
}: InputProps) {
  return (
    <input
      className={fieldControlClass({ size, forceHover, forceFocus, disabled, className })}
      disabled={disabled}
      ref={ref}
      type={type}
      {...props}
    />
  )
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  InputStateProps & {
    ref?: Ref<HTMLTextAreaElement>
  }

export function TextArea({
  className,
  size = 'md',
  forceHover = false,
  forceFocus = false,
  disabled,
  ref,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={fieldControlClass({ size, forceHover, forceFocus, disabled, className })}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
}

function requireTrimmed(field: HTMLInputElement | HTMLTextAreaElement) {
  field.setCustomValidity(field.value.trim() ? '' : 'This field is required.')
}

type FieldProps = InputStateProps & {
  id: string
  label: string
  multiline?: boolean
  labelTone?: FieldLabelTone
  hint?: ReactNode
  required?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
  value?: string
  name?: string
  autoComplete?: string
  type?: HTMLInputTypeAttribute
  ref?: Ref<HTMLInputElement>
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export function Field({
  id,
  label,
  multiline = false,
  labelTone = 'quiet',
  hint,
  required,
  className,
  type,
  size,
  forceHover,
  forceFocus,
  disabled,
  placeholder,
  value,
  name,
  autoComplete,
  ref,
  onChange,
}: FieldProps) {
  const requiredProps = required
    ? {
        'aria-required': true as const,
        onInput: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          requireTrimmed(event.currentTarget)
        },
        onInvalid: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          requireTrimmed(event.currentTarget)
        },
        required: true,
      }
    : {}

  return (
    <label className="flex w-full min-w-px flex-1 flex-col items-start gap-md" htmlFor={id}>
      <span
        className={cx(
          'w-full',
          labelTone === 'default' ? 'text-body-default text-foreground-secondary' : 'text-body-small text-foreground-quaternary',
        )}
      >
        {label}
        {required ? (
          <span aria-hidden className="text-foreground-quaternary">
            {' '}
            *
          </span>
        ) : null}
      </span>
      {multiline ? (
        <TextArea
          autoComplete={autoComplete}
          className={cx('min-h-px flex-1 resize-none', className)}
          disabled={disabled}
          forceFocus={forceFocus}
          forceHover={forceHover}
          id={id}
          name={name ?? id}
          onChange={onChange}
          placeholder={placeholder}
          size={size}
          value={value}
          {...requiredProps}
        />
      ) : (
        <Input
          autoComplete={autoComplete}
          className={className}
          disabled={disabled}
          forceFocus={forceFocus}
          forceHover={forceHover}
          id={id}
          name={name ?? id}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          size={size}
          type={type}
          value={value}
          {...requiredProps}
        />
      )}
      {hint}
    </label>
  )
}
