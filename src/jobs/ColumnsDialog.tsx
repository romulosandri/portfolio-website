import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { Button, Checkbox, Dialog, DragHandleIcon, Input } from '../design-system'
import { columnIdFromLabel, reorderColumns, visibleColumns, type KanbanColumn } from './columns'

type ColumnsDialogProps = {
  columns: KanbanColumn[]
  jobCounts: Record<string, number>
  onCancel: () => void
  onSave: (columns: KanbanColumn[]) => void
}

export function ColumnsDialog({ columns, jobCounts, onCancel, onSave }: ColumnsDialogProps) {
  const addRef = useRef<HTMLInputElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [draft, setDraft] = useState(columns)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')
  const [error, setError] = useState<string | null>(null)

  const shownCount = visibleColumns(draft).length
  const removed = columns.filter((column) => !draft.some((item) => item.id === column.id))
  const movingCount = removed.reduce((total, column) => total + (jobCounts[column.id] ?? 0), 0)

  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  function updateLabel(id: string, label: string) {
    setDraft((current) => current.map((column) => (column.id === id ? { ...column, label } : column)))
    setError(null)
  }

  function toggleVisible(id: string, visible: boolean) {
    setDraft((current) => {
      const next = current.map((column) => (column.id === id ? { ...column, visible } : column))
      if (visibleColumns(next).length === 0) return current
      return next
    })
    setError(null)
  }

  function removeColumn(id: string) {
    setDraft((current) => {
      if (current.length <= 1) return current
      const next = current.filter((column) => column.id !== id)
      if (visibleColumns(next).length === 0) {
        const first = next[0]
        return first ? [{ ...first, visible: true }, ...next.slice(1)] : current
      }
      return next
    })
    setError(null)
  }

  function addColumn(event: FormEvent) {
    event.preventDefault()
    const label = newLabel.trim()
    if (!label) return
    if (draft.some((column) => column.label.toLowerCase() === label.toLowerCase())) {
      setError('That column name is already in use.')
      return
    }
    setDraft((current) => [
      ...current,
      { id: columnIdFromLabel(label, current), label, visible: true },
    ])
    setNewLabel('')
    setError(null)
    addRef.current?.focus()
  }

  function save() {
    const cleaned = draft
      .map((column) => ({ ...column, label: column.label.trim() }))
      .filter((column) => column.label)
    if (cleaned.length === 0) {
      setError('Keep at least one column.')
      return
    }
    if (visibleColumns(cleaned).length === 0) {
      setError('Show at least one column.')
      return
    }
    const labels = cleaned.map((column) => column.label.toLowerCase())
    if (new Set(labels).size !== labels.length) {
      setError('Column names must be unique.')
      return
    }
    onSave(cleaned)
  }

  return (
    <Dialog
      className="flex max-h-[min(40rem,calc(100svh-4rem))] flex-col overflow-hidden"
      labelledBy="jobs-columns-title"
      onClose={onCancel}
    >
      <h2 className="shrink-0 text-h3 text-foreground-primary" id="jobs-columns-title">
        Columns
      </h2>
      <p className="mt-md shrink-0 text-body-default text-foreground-secondary">
        Choose which columns appear, add or remove them, and drag to change their order.
      </p>

      <div className="mt-xl min-h-0 shrink overflow-y-auto">
        <ul className="flex flex-col gap-md">
          {draft.map((column) => {
            const count = jobCounts[column.id] ?? 0
            const lastVisible = column.visible && shownCount === 1
            const lastColumn = draft.length === 1

            return (
              <li
                className={[
                  'flex shrink-0 items-center gap-md border border-solid border-stroke-secondary px-lg py-md',
                  draggingId === column.id ? 'opacity-40' : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={column.id}
                onDragOver={(event) => {
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'move'
                  if (!draggingId || draggingId === column.id) return
                  setDraft((current) => {
                    const from = current.findIndex((item) => item.id === draggingId)
                    const to = current.findIndex((item) => item.id === column.id)
                    return reorderColumns(current, from, to)
                  })
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  setDraggingId(null)
                }}
              >
                <Button
                  aria-label={`Drag to reorder ${column.label}`}
                  className="cursor-grab text-foreground-quaternary active:cursor-grabbing"
                  draggable
                  onDragEnd={() => setDraggingId(null)}
                  onDragStart={(event: DragEvent<HTMLButtonElement>) => {
                    event.dataTransfer.setData('text/plain', column.id)
                    event.dataTransfer.effectAllowed = 'move'
                    setDraggingId(column.id)
                  }}
                  variant="icon"
                >
                  <DragHandleIcon />
                </Button>

                <Checkbox
                  checked={column.visible}
                  label={`Show ${column.label}`}
                  onCheckedChange={(checked) => toggleVisible(column.id, checked)}
                />

                <Input
                  aria-label={`Name for ${column.label}`}
                  className="min-w-0 flex-1 px-md py-sm"
                  draggable={false}
                  onChange={(event) => updateLabel(column.id, event.target.value)}
                  type="text"
                  value={column.label}
                />

                <span className="w-8 shrink-0 text-right text-body-small text-foreground-quaternary">
                  {count}
                </span>

                <Button
                  aria-label={`Remove ${column.label}`}
                  disabled={lastColumn}
                  onClick={() => removeColumn(column.id)}
                  variant="icon"
                >
                  <span aria-hidden className="text-body-default leading-none">
                    ×
                  </span>
                </Button>

                {lastVisible ? (
                  <span className="sr-only">This is the last visible column.</span>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>

      <form className="mt-lg flex shrink-0 gap-md" onSubmit={addColumn}>
        <Input
          className="min-w-0 flex-1"
          onChange={(event) => {
            setNewLabel(event.target.value)
            setError(null)
          }}
          placeholder="New column name"
          ref={addRef}
          type="text"
          value={newLabel}
        />
        <Button type="submit">Add</Button>
      </form>

      {error ? <p className="mt-md text-body-small text-foreground-secondary">{error}</p> : null}
      {movingCount > 0 ? (
        <p className="mt-md text-body-small text-foreground-quaternary">
          Saving will move {movingCount} {movingCount === 1 ? 'job' : 'jobs'} from removed columns
          into {visibleColumns(draft)[0]?.label ?? 'the first visible column'}.
        </p>
      ) : null}

      <div className="mt-xl flex shrink-0 justify-end gap-sm">
        <Button onClick={onCancel} ref={cancelRef}>
          Cancel
        </Button>
        <Button onClick={save} variant="primary">
          Save
        </Button>
      </div>
    </Dialog>
  )
}
