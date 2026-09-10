import { useEffect, useMemo, useState } from 'react'
import {
  ApplyIcon,
  Button,
  Card,
  Checkbox,
  DeleteIcon,
  Dropdown,
  EditIcon,
  Input,
  Pagination,
  PlusIcon,
  useSnackbar,
} from '../design-system'
import {
  applyUrl,
  displayCompany,
  formatAddedDate,
  formatLocation,
  isJobFavorite,
} from './display'
import { track, trackException } from '../lib/analytics'
import { deleteJobs, setJobsFavorite } from './jobs-api'
import { CompanyLogo } from './CompanyLogo'
import { FavoritesFilterButton, JobFavoriteButton, JobsConfirmModal } from './ui'
import type { Job } from './types'

const PAGE_SIZES = [10, 25, 50] as const
const DEFAULT_PAGE_SIZE = 25

type JobsBoardProps = {
  jobs: Job[]
  onChange: (jobs: Job[]) => void
  onAddJob: () => void
  onEditJob: (job: Job) => void
  addDisabled?: boolean
}

function JobActions({
  applyHref,
  disabled,
  favorited,
  title,
  onApply,
  onDelete,
  onEdit,
  onFavorite,
}: {
  applyHref: string
  disabled: boolean
  favorited: boolean
  title: string
  onApply: () => void
  onDelete: () => void
  onEdit: () => void
  onFavorite: () => void
}) {
  return (
    <div className="flex shrink-0 justify-end gap-sm">
      <JobFavoriteButton disabled={disabled} favorited={favorited} onToggle={onFavorite} title={title} />
      <Button aria-label={`Edit ${title}`} disabled={disabled} onClick={onEdit} variant="icon">
        <EditIcon />
      </Button>
      <Button
        aria-label="Open application"
        href={applyHref}
        onClick={onApply}
        rel="noreferrer"
        target="_blank"
        variant="icon"
      >
        <ApplyIcon />
      </Button>
      <Button aria-label="Delete job" disabled={disabled} onClick={onDelete} variant="icon">
        <DeleteIcon />
      </Button>
    </div>
  )
}

export function JobsBoard({ jobs, onChange, onAddJob, onEditJob, addDisabled = false }: JobsBoardProps) {
  const { show } = useSnackbar()
  const [query, setQuery] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState(false)
  const [pendingFavorite, setPendingFavorite] = useState<string | null>(null)
  const [pendingFavoriteChange, setPendingFavoriteChange] = useState<{
    id: string
    title: string
    favorite: boolean
  } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ ids: string[]; title: string; description: string } | null>(
    null,
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return jobs.filter((job) => {
      if (favoritesOnly && !isJobFavorite(job)) return false
      const company = displayCompany(job).toLowerCase()
      return (
        !needle ||
        job.title.toLowerCase().includes(needle) ||
        company.includes(needle) ||
        formatLocation(job).toLowerCase().includes(needle)
      )
    })
  }, [favoritesOnly, jobs, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, filtered.length)

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage)
  }, [currentPage, page])

  const visibleIds = paged.map((job) => job.id)
  const selectedIds = [...selected].filter((id) => filtered.some((job) => job.id === id))
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id))

  function toggleAll(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      if (checked) visibleIds.forEach((id) => next.add(id))
      else visibleIds.forEach((id) => next.delete(id))
      return next
    })
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function run(action: () => Promise<void>) {
    setPending(true)
    try {
      await action()
    } catch (error) {
      show(error instanceof Error ? error.message : 'Something went wrong')
      track('jobs_mutation_failed', { action: 'delete' })
      trackException(error, { source: 'jobs_board' })
    } finally {
      setPending(false)
    }
  }

  function removeLocal(ids: string[]) {
    const idSet = new Set(ids)
    onChange(jobs.filter((job) => !idSet.has(job.id)))
    setSelected((current) => {
      const next = new Set(current)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }

  function requestDelete(job: Job) {
    setPendingDelete({
      ids: [job.id],
      title: 'Delete this job?',
      description: `Are you sure you want to delete ${job.title} at ${displayCompany(job)}? This cannot be undone.`,
    })
  }

  function requestDeleteSelected() {
    const count = selectedIds.length
    const label = count === 1 ? 'job' : 'jobs'
    setPendingDelete({
      ids: selectedIds,
      title: `Delete ${count} ${label}?`,
      description: `Are you sure you want to delete ${count === 1 ? 'this job' : `these ${count} jobs`}? This cannot be undone.`,
    })
  }

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
        track('jobs_mutation_failed', { action: 'setFavorite' })
        trackException(error, { source: 'jobs_favorite' })
      })
      .finally(() => {
        setPendingFavorite((value) => (value === id ? null : value))
      })
  }

  function confirmPendingDelete(password: string) {
    if (!pendingDelete) return
    const ids = pendingDelete.ids
    void run(async () => {
      await deleteJobs(ids, password)
      removeLocal(ids)
      setPendingDelete(null)
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-xl flex shrink-0 flex-col gap-md sm:flex-row sm:items-center">
        <Input
          className="min-w-0 flex-1"
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder="Search title, company, location"
          type="search"
          value={query}
        />
        <div className="flex flex-wrap items-center gap-md sm:shrink-0">
          <FavoritesFilterButton
            active={favoritesOnly}
            onToggle={() => {
              setFavoritesOnly((current) => {
                const next = !current
                track('jobs_favorites_filtered', { enabled: next, view: 'board' })
                return next
              })
              setPage(1)
            }}
          />
          {selectedIds.length > 0 ? (
            <>
              <span className="text-body-small text-foreground-quaternary">{selectedIds.length} selected</span>
              <Button disabled={pending} onClick={requestDeleteSelected} variant="danger">
                Delete
              </Button>
            </>
          ) : null}
          <Button className="gap-sm" disabled={addDisabled} onClick={onAddJob}>
            <PlusIcon />
            Add job
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto border border-solid border-stroke-secondary bg-background-primary">
        <div className="flex items-center gap-md border-b border-solid border-stroke-secondary px-xl py-lg lg:hidden">
          <Checkbox
            checked={allVisibleSelected}
            label="Select all visible jobs"
            onCheckedChange={toggleAll}
          />
          <span className="text-body-small text-foreground-quaternary">Select all</span>
        </div>

        <div className="lg:hidden">
          {paged.length === 0 ? (
            <p className="px-xl py-4xl text-center text-body-default text-foreground-quaternary">
              {favoritesOnly && !query.trim() ? 'No favorite jobs yet.' : 'No jobs match these filters.'}
            </p>
          ) : (
            paged.map((job) => {
              const company = displayCompany(job)

              return (
                <Card as="article" key={job.id} variant="list">
                  <div className="flex items-start gap-md">
                    <Checkbox
                      className="mt-1 shrink-0"
                      checked={selected.has(job.id)}
                      label={`Select ${job.title}`}
                      onCheckedChange={(checked) => toggleOne(job.id, checked)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-md">
                        <CompanyLogo name={company} />
                        <span className="truncate text-body-default text-foreground-primary">{company}</span>
                      </div>
                      <p className="mt-sm text-body-default text-foreground-primary">{job.title}</p>
                      <p className="mt-xsm text-body-small text-foreground-tertiary">{formatLocation(job)}</p>
                      <p className="mt-xsm text-body-small text-foreground-quaternary">
                        Added {formatAddedDate(job.selected_at)}
                      </p>
                    </div>
                    <JobActions
                      applyHref={applyUrl(job)}
                      disabled={pending || pendingFavorite === job.id}
                      favorited={isJobFavorite(job)}
                      onApply={() => track('jobs_apply_clicked', { view: 'board', company, title: job.title })}
                      onDelete={() => requestDelete(job)}
                      onEdit={() => onEditJob(job)}
                      onFavorite={() => requestFavorite(job)}
                      title={job.title}
                    />
                  </div>
                </Card>
              )
            })
          )}
        </div>

        <div className="hidden lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-solid border-stroke-secondary">
                <th className="w-12 px-xl py-lg">
                  <Checkbox
                    checked={allVisibleSelected}
                    label="Select all visible jobs"
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="px-xl py-lg text-body-small text-foreground-quaternary">Company</th>
                <th className="px-xl py-lg text-body-small text-foreground-quaternary">Role</th>
                <th className="px-xl py-lg text-body-small text-foreground-quaternary">Location</th>
                <th className="whitespace-nowrap px-xl py-lg text-body-small text-foreground-quaternary">Added</th>
                <th className="px-xl py-lg text-right text-body-small text-foreground-quaternary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                    <td className="px-xl py-4xl text-center text-body-default text-foreground-quaternary" colSpan={6}>
                      {favoritesOnly && !query.trim() ? 'No favorite jobs yet.' : 'No jobs match these filters.'}
                    </td>
                </tr>
              ) : (
                paged.map((job) => {
                  const company = displayCompany(job)

                  return (
                    <tr
                      className="border-b border-solid border-stroke-secondary last:border-b-0 [&>td]:bg-background-primary [&>td]:transition-colors [&>td]:duration-200 [&>td]:ease-out hover:[&>td]:bg-background-secondary motion-reduce:[&>td]:transition-none"
                      key={job.id}
                    >
                      <td className="w-12 px-xl py-lg">
                        <Checkbox
                          checked={selected.has(job.id)}
                          label={`Select ${job.title}`}
                          onCheckedChange={(checked) => toggleOne(job.id, checked)}
                        />
                      </td>
                      <td className="px-xl py-lg">
                        <div className="flex min-w-36 items-center gap-md">
                          <CompanyLogo name={company} />
                          <span className="truncate text-body-default text-foreground-primary">{company}</span>
                        </div>
                      </td>
                      <td className="max-w-80 px-xl py-lg">
                        <span className="line-clamp-2 text-body-default text-foreground-primary">{job.title}</span>
                      </td>
                      <td className="px-xl py-lg text-body-default text-foreground-tertiary">
                        {formatLocation(job)}
                      </td>
                      <td className="whitespace-nowrap px-xl py-lg text-body-default text-foreground-tertiary">
                        <time dateTime={job.selected_at}>{formatAddedDate(job.selected_at)}</time>
                      </td>
                      <td className="px-xl py-lg">
                        <JobActions
                          applyHref={applyUrl(job)}
                          disabled={pending || pendingFavorite === job.id}
                          favorited={isJobFavorite(job)}
                          onApply={() => track('jobs_apply_clicked', { view: 'board', company, title: job.title })}
                          onDelete={() => requestDelete(job)}
                          onEdit={() => onEditJob(job)}
                          onFavorite={() => requestFavorite(job)}
                          title={job.title}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-xl flex shrink-0 flex-wrap items-center gap-md">
        <Pagination label="Job pages" onPageChange={setPage} page={currentPage} pageCount={pageCount} />
        <div className="ml-auto flex flex-wrap items-center gap-md">
          <label className="flex items-center gap-sm text-body-small text-foreground-quaternary">
            <span>Max</span>
            <Dropdown
              label="Jobs per page"
              onChange={(value) => {
                setPageSize(Number(value))
                setPage(1)
              }}
              options={PAGE_SIZES.map((size) => ({ value: String(size), label: String(size) }))}
              value={String(pageSize)}
            />
          </label>
          <p className="text-body-small text-foreground-quaternary">
            {filtered.length === 0 ? `0 of ${jobs.length}` : `${rangeStart}–${rangeEnd} of ${filtered.length}`}
          </p>
        </div>
      </div>

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

      {pendingDelete ? (
        <JobsConfirmModal
          description={pendingDelete.description}
          pending={pending}
          title={pendingDelete.title}
          onCancel={() => {
            if (!pending) setPendingDelete(null)
          }}
          onConfirm={confirmPendingDelete}
        />
      ) : null}
    </div>
  )
}
