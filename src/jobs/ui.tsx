import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Dialog, Field, StarIcon } from '../design-system'

type JobsPasswordFieldProps = {
  id?: string
  value: string
  disabled?: boolean
  autoFocus?: boolean
  onChange: (value: string) => void
}

export function JobsPasswordField({
  id = 'jobs-password',
  value,
  disabled,
  autoFocus = false,
  onChange,
}: JobsPasswordFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  return (
    <Field
      autoComplete="off"
      disabled={disabled}
      id={id}
      label="Password"
      onChange={(event) => onChange(event.target.value)}
      ref={inputRef}
      required
      type="password"
      value={value}
    />
  )
}

type JobsConfirmModalProps = {
  title: string
  description: string
  confirmLabel?: string
  pendingLabel?: string
  pending?: boolean
  onCancel: () => void
  onConfirm: (password: string) => void
}

export function JobsConfirmModal({
  title,
  description,
  confirmLabel = 'Delete',
  pendingLabel = 'Deleting…',
  pending = false,
  onCancel,
  onConfirm,
}: JobsConfirmModalProps) {
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || !password) return
    onConfirm(password)
  }

  return (
    <Dialog
      closeDisabled={pending}
      describedBy="jobs-confirm-description"
      labelledBy="jobs-confirm-title"
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit}>
        <h2 className="text-h3 text-foreground-primary" id="jobs-confirm-title">
          {title}
        </h2>
        <p className="mt-md text-body-default text-foreground-secondary" id="jobs-confirm-description">
          {description}
        </p>
        <div className="mt-xl">
          <JobsPasswordField autoFocus disabled={pending} onChange={setPassword} value={password} />
        </div>
        <div className="mt-xl flex justify-end gap-sm">
          <Button disabled={pending} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={pending} type="submit" variant="primary">
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export function JobFavoriteButton({
  favorited,
  disabled,
  onToggle,
  title,
}: {
  favorited: boolean
  disabled?: boolean
  onToggle: () => void
  title: string
}) {
  return (
    <Button
      aria-label={favorited ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      aria-pressed={favorited}
      disabled={disabled}
      forceHover={favorited}
      onClick={(event) => {
        event.stopPropagation()
        onToggle()
      }}
      onPointerDown={(event) => event.stopPropagation()}
      variant="icon"
    >
      <StarIcon filled={favorited} />
    </Button>
  )
}

export function FavoritesFilterButton({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: () => void
}) {
  return (
    <Button aria-pressed={active} className="gap-sm" forceHover={active} onClick={onToggle}>
      <StarIcon filled={active} />
      Favorites
    </Button>
  )
}
