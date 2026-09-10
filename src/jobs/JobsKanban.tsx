import { useMemo, useState, type DragEvent, type WheelEvent } from 'react'
import {
  ApplyIcon,
  Button,
  Card,
  Dropdown,
  EditIcon,
  Input,
  KanbanColumn,
  PlusIcon,
  useSnackbar,
} from '../design-system'
import { ColumnsDialog } from './ColumnsDialog'
import {
  resolveColumnId,
  visibleColumns,
  type KanbanColumn as KanbanColumnConfig,
} from './columns'
import { applyUrl, displayCompany, formatLocation, isJobFavorite } from './display'
import { saveKanbanColumns, setJobsFavorite, setJobsStatus } from './jobs-api'
import { CompanyLogo } from './CompanyLogo'
import { FavoritesFilterButton, JobFavoriteButton, JobsConfirmModal } from './ui'
import type { Job } from './types'

type JobsKanbanProps = {
  jobs: Job[]
  columns: KanbanColumnConfig[]
  onChange: (jobs: Job[]) => void
  onColumnsChange: (columns: KanbanColumnConfig[]) => void
  onAddJob: () => void
  onEditJob: (job: Job) => void
  addDisabled?: boolean
}

function matchesQuery(job: Job, needle: string) {
  if (!needle) return true
  return (
    job.title.toLowerCase().includes(needle) ||
    displayCompany(job).toLowerCase().includes(needle) ||
    formatLocation(job).toLowerCase().includes(needle)
  )
}

export function JobsKanban({
  jobs,
  columns,
  onChange,
  onColumnsChange,
  onAddJob,
  onEditJob,
  addDisabled = false,
}: JobsKanbanProps) {
  const { show } = useSnackbar()
  const [query, setQuery] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(true)
  const [editingColumns, setEditingColumns] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [pendingFavorite, setPendingFavorite] = useState<string | null>(null)
  const [pendingFavoriteChange, setPendingFavoriteChange] = useState<{
    id: string
    title: string
    favorite: boolean
  } | null>(null)
  const [pendingMove, setPendingMove] = useState<{ id: string; status: string; title: string } | null>(null)

  const needle = query.trim().toLowerCase()
  const shown = visibleColumns(columns)
  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const job of jobs) {
      const id = resolveColumnId(job.status, columns)
      counts[id] = (counts[id] ?? 0) + 1
    }
    return counts
  }, [jobs, columns])

  const grouped = useMemo(() => {
    const next = Object.fromEntries(shown.map((column) => [column.id, [] as Job[]])) as Record<
      string,
      Job[]
    >

    for (const job of jobs) {
      if (favoritesOnly && !isJobFavorite(job)) continue
      if (!matchesQuery(job, needle)) continue
      const id = resolveColumnId(job.status, columns)
      next[id]?.push(job)
    }

    return next
  }, [columns, favoritesOnly, jobs, needle, shown])

  function requestFavorite(job: Job) {
    setPendingFavoriteChange({
      id: job.id,
      title: job.title,
      favorite: !isJobFavorite(job),
    })
  }

  function confirmFavorite(password: string) {
    if (!pendingFavoriteChange) return

    const { id, favorite } = pendingFavoriteChange
    const previous = jobs
    onChange(jobs.map((item) => (item.id === id ? { ...item, is_favorite: favorite ? 1 : 0 } : item)))
    setPendingFavorite(id)
    setPendingFavoriteChange(null)

    void setJobsFavorite([id], favorite, password)
      .catch((error) => {
        onChange(previous)
        show(error instanceof Error ? error.message : 'Could not update favorite')
      })
      .finally(() => {
        setPendingFavorite((value) => (value === id ? null : value))
      })
  }

  function requestMove(id: string, status: string) {
    const current = jobs.find((job) => job.id === id)
    if (!current || resolveColumnId(current.status, columns) === status) return
    setPendingMove({ id, status, title: current.title })
  }

  function confirmMove(password: string) {
    if (!pendingMove) return

    const { id, status } = pendingMove
    const previous = jobs
    onChange(jobs.map((job) => (job.id === id ? { ...job, status } : job)))
    setPendingId(id)
    setPendingMove(null)

    void setJobsStatus([id], status, password)
      .catch((error) => {
        onChange(previous)
        show(error instanceof Error ? error.message : 'Could not update status')
      })
      .finally(() => {
        setPendingId((value) => (value === id ? null : value))
      })
  }

  function saveColumnSetup(next: KanbanColumnConfig[], password?: string) {
    const previousColumns = columns
    const previousJobs = jobs
    const removedIds = columns
      .filter((column) => !next.some((item) => item.id === column.id))
      .map((column) => column.id)
    const fallback = visibleColumns(next)[0]?.id
    const moving = jobs.filter((job) => removedIds.includes(resolveColumnId(job.status, columns)))

    onColumnsChange(next)
    setEditingColumns(false)

    const ids = moving.map((job) => job.id)
    if (fallback && ids.length > 0) {
      onChange(jobs.map((job) => (ids.includes(job.id) ? { ...job, status: fallback } : job)))
    }

    void saveKanbanColumns(next)
      .then(() => {
        if (!fallback || ids.length === 0) return
        return setJobsStatus(ids, fallback, password ?? '')
      })
      .catch((error) => {
        onColumnsChange(previousColumns)
        onChange(previousJobs)
        show(error instanceof Error ? error.message : 'Could not save columns')
      })
  }

  function readDragId(event: DragEvent) {
    return event.dataTransfer.getData('text/plain')
  }

  function onBoardWheel(event: WheelEvent<HTMLDivElement>) {
    const board = event.currentTarget
    if (board.scrollWidth <= board.clientWidth) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

    const columnList = event.target instanceof Element ? event.target.closest('[data-kanban-list]') : null
    if (columnList instanceof HTMLElement) {
      const goingDown = event.deltaY > 0
      const canScrollColumn = goingDown
        ? columnList.scrollTop + columnList.clientHeight < columnList.scrollHeight - 1
        : columnList.scrollTop > 1
      if (canScrollColumn) return
    }

    event.preventDefault()
    board.scrollLeft += event.deltaY
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-xl flex shrink-0 flex-col gap-md sm:flex-row sm:items-center">
        <div className="flex flex-col gap-md sm:flex-row sm:items-center">
          <Input
            className="sm:max-w-xs"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, company, location"
            type="search"
            value={query}
          />
          <FavoritesFilterButton active={favoritesOnly} onToggle={() => setFavoritesOnly((current) => !current)} />
        </div>
        <div className="flex items-center gap-md sm:ml-auto">
          <Button onClick={() => setEditingColumns(true)}>Columns</Button>
          <Button className="gap-sm" disabled={addDisabled} onClick={onAddJob}>
            <PlusIcon />
            Add job
          </Button>
        </div>
      </div>

      <div
        className="scrollbar-none flex min-h-0 flex-1 items-stretch gap-lg overflow-x-auto overflow-y-hidden"
        onWheel={onBoardWheel}
      >
        {shown.map((column) => {
          const columnJobs = grouped[column.id] ?? []
          const over = overStatus === column.id

          return (
            <KanbanColumn
              count={columnJobs.length}
              key={column.id}
              label={column.label}
              onDragEnter={(event) => {
                event.preventDefault()
                setOverStatus(column.id)
              }}
              onDragLeave={(event) => {
                const next = event.relatedTarget
                if (next instanceof Node && event.currentTarget.contains(next)) return
                setOverStatus((current) => (current === column.id ? null : current))
              }}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
                setOverStatus(column.id)
              }}
              onDrop={(event) => {
                event.preventDefault()
                setOverStatus(null)
                setDraggingId(null)
                const id = readDragId(event)
                if (id) requestMove(id, column.id)
              }}
              over={over}
            >
              <div className="flex flex-col gap-md">
                {columnJobs.length === 0 ? (
                  <p className="px-md py-2xl text-center text-body-small text-foreground-quaternary">
                    No jobs
                  </p>
                ) : (
                  columnJobs.map((job) => {
                    const company = displayCompany(job)
                    const jobStatus = resolveColumnId(job.status, columns)

                    return (
                      <Card
                        as="article"
                        dragging={draggingId === job.id}
                        draggable
                        key={job.id}
                        onDragEnd={() => {
                          setDraggingId(null)
                          setOverStatus(null)
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', job.id)
                          event.dataTransfer.effectAllowed = 'move'
                          setDraggingId(job.id)
                        }}
                        pending={pendingId === job.id}
                        variant="job"
                      >
                        <div className="flex items-center gap-md">
                          <CompanyLogo name={company} />
                          <span className="truncate text-body-default text-foreground-primary">{company}</span>
                        </div>
                        <p className="mt-sm text-body-default text-foreground-primary">{job.title}</p>
                        <p className="mt-xsm text-body-small text-foreground-tertiary">{formatLocation(job)}</p>
                        <div className="mt-lg flex items-center justify-between gap-sm">
                          <Dropdown
                            disabled={pendingId === job.id}
                            label={`Status for ${job.title}`}
                            onChange={(value) => requestMove(job.id, value)}
                            options={shown.map((option) => ({ value: option.id, label: option.label }))}
                            value={shown.some((item) => item.id === jobStatus) ? jobStatus : shown[0]?.id ?? ''}
                          />
                          <div className="flex shrink-0 items-center gap-sm">
                            <JobFavoriteButton
                              disabled={pendingFavorite === job.id}
                              favorited={isJobFavorite(job)}
                              onToggle={() => requestFavorite(job)}
                              title={job.title}
                            />
                            <Button
                              aria-label={`Edit ${job.title}`}
                              onClick={(event) => {
                                event.stopPropagation()
                                onEditJob(job)
                              }}
                              onPointerDown={(event) => event.stopPropagation()}
                              variant="icon"
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              aria-label="Open application"
                              href={applyUrl(job)}
                              rel="noreferrer"
                              target="_blank"
                              variant="icon"
                            >
                              <ApplyIcon />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </KanbanColumn>
          )
        })}
      </div>

      {editingColumns ? (
        <ColumnsDialog
          columns={columns}
          jobCounts={jobCounts}
          onCancel={() => setEditingColumns(false)}
          onSave={saveColumnSetup}
        />
      ) : null}

      {pendingFavoriteChange ? (
        <JobsConfirmModal
          confirmLabel={pendingFavoriteChange.favorite ? 'Add' : 'Remove'}
          description={`Enter the jobs password to ${pendingFavoriteChange.favorite ? 'add' : 'remove'} ${pendingFavoriteChange.title} ${pendingFavoriteChange.favorite ? 'to' : 'from'} favorites.`}
          pendingLabel="Saving…"
          title={pendingFavoriteChange.favorite ? 'Add to favorites?' : 'Remove from favorites?'}
          onCancel={() => setPendingFavoriteChange(null)}
          onConfirm={confirmFavorite}
        />
      ) : null}

      {pendingMove ? (
        <JobsConfirmModal
          confirmLabel="Move"
          description={`Enter the jobs password to move ${pendingMove.title}.`}
          pendingLabel="Moving…"
          title="Change job status?"
          onCancel={() => setPendingMove(null)}
          onConfirm={confirmMove}
        />
      ) : null}
    </div>
  )
}
