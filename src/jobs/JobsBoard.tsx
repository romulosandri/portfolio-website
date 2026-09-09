import { useMemo, useState } from 'react'
import { RevealGroup, RevealText } from '../motion-system'
import { useSnackbar } from '../design-system'
import { applyUrl, companyLogoDomain, displayCompany, formatLocation } from './display'
import { deleteJobs, setJobsLive } from './jobs-api'
import { CompanyLogo } from './CompanyLogo'
import { ApplyIcon, DeleteIcon, JobsButton, JobsCheckbox, JobsInput, JobsLink } from './ui'
import type { Job } from './types'

type JobsBoardProps = {
  jobs: Job[]
  onChange: (jobs: Job[]) => void
}

export function JobsBoard({ jobs, onChange }: JobsBoardProps) {
  const { show } = useSnackbar()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState(false)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return jobs.filter((job) => {
      const company = displayCompany(job).toLowerCase()
      return (
        !needle ||
        job.title.toLowerCase().includes(needle) ||
        company.includes(needle) ||
        formatLocation(job).toLowerCase().includes(needle)
      )
    })
  }, [jobs, query])

  const visibleIds = filtered.map((job) => job.id)
  const selectedIds = visibleIds.filter((id) => selected.has(id))
  const allVisibleSelected = visibleIds.length > 0 && selectedIds.length === visibleIds.length

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

  function patchLocal(ids: string[], isLive: number) {
    const idSet = new Set(ids)
    onChange(jobs.map((job) => (idSet.has(job.id) ? { ...job, is_live: isLive } : job)))
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1400px] flex-col bg-background-primary px-gutter py-4xl">
      <RevealGroup className="mb-3xl flex flex-col gap-xl">
        <RevealText as="h1" className="text-h1 text-foreground-primary">
          Jobs
        </RevealText>
      </RevealGroup>

      <div className="mb-xl flex flex-wrap items-center gap-md">
        <JobsInput
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, company, location"
          value={query}
        />

        {selectedIds.length > 0 ? (
          <div className="flex flex-wrap items-center gap-md">
            <span className="text-body-small text-foreground-quaternary">{selectedIds.length} selected</span>
            <JobsButton
              disabled={pending}
              onClick={() =>
                void run(async () => {
                  await setJobsLive(selectedIds, true)
                  patchLocal(selectedIds, 1)
                })
              }
            >
              Mark active
            </JobsButton>
            <JobsButton
              disabled={pending}
              onClick={() =>
                void run(async () => {
                  await setJobsLive(selectedIds, false)
                  patchLocal(selectedIds, 0)
                })
              }
            >
              Mark inactive
            </JobsButton>
            <JobsButton
              disabled={pending}
              onClick={() => {
                const label = selectedIds.length === 1 ? 'job' : 'jobs'
                if (!window.confirm(`Delete ${selectedIds.length} ${label}?`)) return
                void run(async () => {
                  await deleteJobs(selectedIds)
                  removeLocal(selectedIds)
                })
              }}
              variant="danger"
            >
              Delete
            </JobsButton>
          </div>
        ) : null}

        <p className="ml-auto text-body-small text-foreground-quaternary">
          {filtered.length} of {jobs.length}
        </p>
      </div>

      <div className="overflow-x-auto border border-solid border-stroke-secondary bg-background-primary">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-solid border-stroke-secondary">
              <th className="w-10 px-xl py-lg">
                <JobsCheckbox
                  checked={allVisibleSelected}
                  label="Select all visible jobs"
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="px-xl py-lg text-body-small text-foreground-quaternary">Company</th>
              <th className="px-xl py-lg text-body-small text-foreground-quaternary">Role</th>
              <th className="px-xl py-lg text-body-small text-foreground-quaternary">Location</th>
              <th className="px-xl py-lg text-body-small text-foreground-quaternary">Status</th>
              <th className="px-xl py-lg text-right text-body-small text-foreground-quaternary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="px-xl py-4xl text-center text-body-default text-foreground-quaternary" colSpan={6}>
                  No jobs match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((job) => {
                const company = displayCompany(job)
                const live = job.is_live === 1

                return (
                  <tr
                    className={[
                      'border-b border-solid border-stroke-secondary last:border-b-0',
                      live ? undefined : 'opacity-60',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    key={job.id}
                  >
                    <td className="px-xl py-lg">
                      <JobsCheckbox
                        checked={selected.has(job.id)}
                        label={`Select ${job.title}`}
                        onCheckedChange={(checked) => toggleOne(job.id, checked)}
                      />
                    </td>
                    <td className="px-xl py-lg">
                      <div className="flex min-w-36 items-center gap-md">
                        <CompanyLogo domain={companyLogoDomain(job)} name={company} />
                        <span className="truncate text-body-default text-foreground-primary">{company}</span>
                      </div>
                    </td>
                    <td className="max-w-80 px-xl py-lg">
                      <span className="line-clamp-2 text-body-default text-foreground-primary">{job.title}</span>
                    </td>
                    <td className="whitespace-nowrap px-xl py-lg text-body-default text-foreground-tertiary">
                      {formatLocation(job)}
                    </td>
                    <td className="px-xl py-lg">
                      <button
                        className={[
                          'whitespace-nowrap border border-solid px-md py-xsm text-body-small uppercase tracking-wide disabled:opacity-60',
                          live
                            ? 'border-foreground-primary bg-foreground-primary text-background-primary'
                            : 'border-stroke-secondary bg-background-secondary text-foreground-quaternary',
                        ].join(' ')}
                        disabled={pending}
                        onClick={() =>
                          void run(async () => {
                            await setJobsLive([job.id], !live)
                            patchLocal([job.id], live ? 0 : 1)
                          })
                        }
                        type="button"
                      >
                        {live ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-xl py-lg">
                      <div className="flex justify-end gap-sm">
                        <JobsLink href={applyUrl(job)} label="Open application">
                          <ApplyIcon />
                        </JobsLink>
                        <JobsButton
                          aria-label="Delete job"
                          disabled={pending}
                          onClick={() => {
                            if (!window.confirm(`Delete ${job.title}?`)) return
                            void run(async () => {
                              await deleteJobs([job.id])
                              removeLocal([job.id])
                            })
                          }}
                          variant="icon"
                        >
                          <DeleteIcon />
                        </JobsButton>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
