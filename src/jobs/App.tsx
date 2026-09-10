import { useEffect, useState } from 'react'
import { RevealGroup, RevealText } from '../motion-system'
import { Tabs, useSnackbar } from '../design-system'
import { AddJobDialog } from './AddJobDialog'
import { JobsBoard } from './JobsBoard'
import { JobsKanban } from './JobsKanban'
import {
  DEFAULT_COLUMNS,
  columnsMatch,
  isDefaultColumns,
  parseColumns,
  takeStoredColumns,
  type KanbanColumn,
} from './columns'
import { createJob, fetchJobs, saveKanbanColumns, updateJob, type JobWriteInput } from './jobs-api'
import type { Job } from './types'

export type JobsTab = 'board' | 'kanban'

const JOBS_TABS: Array<{ id: JobsTab; label: string }> = [
  { id: 'board', label: 'Job board' },
  { id: 'kanban', label: 'Kanban' },
]

function tabFromHash(hash = window.location.hash): JobsTab {
  return hash === '#kanban' ? 'kanban' : 'board'
}

function hashFromTab(tab: JobsTab) {
  return tab === 'kanban' ? '#kanban' : '#board'
}

export function JobsApp() {
  const { show } = useSnackbar()
  const [jobs, setJobs] = useState<Job[]>([])
  const [columns, setColumns] = useState<KanbanColumn[]>(DEFAULT_COLUMNS)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<JobsTab>(tabFromHash)
  const [formJob, setFormJob] = useState<Job | 'add' | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetchJobs()
      .then((data) => {
        if (cancelled) return
        setJobs(data.jobs)

        const remote = parseColumns(data.columns) ?? DEFAULT_COLUMNS
        const stored = takeStoredColumns()
        if (stored && isDefaultColumns(remote) && !columnsMatch(stored, remote)) {
          setColumns(stored)
          void saveKanbanColumns(stored).catch(() => {
            if (!cancelled) setColumns(remote)
          })
          return
        }
        setColumns(remote)
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Failed to load jobs')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const syncTab = () => setTab(tabFromHash())
    window.addEventListener('hashchange', syncTab)
    window.addEventListener('popstate', syncTab)
    return () => {
      window.removeEventListener('hashchange', syncTab)
      window.removeEventListener('popstate', syncTab)
    }
  }, [])

  function changeTab(next: JobsTab) {
    setTab(next)
    const hash = hashFromTab(next)
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash)
    }
  }

  async function submitJobForm(input: JobWriteInput, password: string) {
    setSaving(true)
    try {
      if (formJob && formJob !== 'add') {
        const job = await updateJob(formJob.id, input, password)
        setJobs((current) => current.map((item) => (item.id === job.id ? job : item)))
        setFormJob(null)
        show(`Updated ${job.title}`)
        return
      }

      const job = await createJob(input, password)
      setJobs((current) => [job, ...current])
      setFormJob(null)
      show(`Added ${job.title}`)
    } catch (error) {
      show(error instanceof Error ? error.message : formJob === 'add' ? 'Could not add job' : 'Could not update job')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background-primary px-gutter">
        <p className="text-body-default text-foreground-quaternary">Loading jobs…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background-primary px-gutter text-center">
        <p className="text-body-default text-foreground-secondary">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-svh w-full max-w-[1400px] flex-col overflow-hidden bg-background-primary px-gutter py-4xl">
      <RevealGroup className="mb-xl shrink-0">
        <RevealText as="h1" className="text-h1 text-foreground-primary">
          Jobs
        </RevealText>
      </RevealGroup>
      <div className="mb-2xl shrink-0">
        <Tabs idPrefix="jobs-tab" items={JOBS_TABS} label="Jobs views" onChange={changeTab} value={tab} />
      </div>
      <div
        aria-labelledby={`jobs-tab-button-${tab}`}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        id={`jobs-tab-panel-${tab}`}
        role="tabpanel"
      >
        {tab === 'board' ? (
          <JobsBoard
            addDisabled={saving}
            jobs={jobs}
            onAddJob={() => setFormJob('add')}
            onChange={setJobs}
            onEditJob={setFormJob}
          />
        ) : (
          <JobsKanban
            addDisabled={saving}
            columns={columns}
            jobs={jobs}
            onAddJob={() => setFormJob('add')}
            onChange={setJobs}
            onColumnsChange={setColumns}
            onEditJob={setFormJob}
          />
        )}
      </div>

      {formJob ? (
        <AddJobDialog
          job={formJob === 'add' ? undefined : formJob}
          pending={saving}
          onCancel={() => {
            if (!saving) setFormJob(null)
          }}
          onSubmit={submitJobForm}
        />
      ) : null}
    </div>
  )
}
