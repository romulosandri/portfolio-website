import { useRef } from 'react'
import { Button, Dialog, StarIcon } from '../design-system'

type JobsConfirmModalProps = {
  title: string
  description: string
  confirmLabel?: string
  pending?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function JobsConfirmModal({
  title,
  description,
  confirmLabel = 'Delete',
  pending = false,
  onCancel,
  onConfirm,
}: JobsConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog
      closeDisabled={pending}
      describedBy="jobs-confirm-description"
      labelledBy="jobs-confirm-title"
      onClose={onCancel}
    >
      <h2 className="text-h3 text-foreground-primary" id="jobs-confirm-title">
        {title}
      </h2>
      <p className="mt-md text-body-default text-foreground-secondary" id="jobs-confirm-description">
        {description}
      </p>
      <div className="mt-xl flex justify-end gap-sm">
        <Button disabled={pending} onClick={onCancel} ref={cancelRef}>
          Cancel
        </Button>
        <Button disabled={pending} onClick={onConfirm} variant="primary">
          {pending ? 'Deleting…' : confirmLabel}
        </Button>
      </div>
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
