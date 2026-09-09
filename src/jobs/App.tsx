import { useEffect, useState } from 'react'
import { JobsBoard } from './JobsBoard'
import { fetchJobs } from './jobs-api'
import type { Job } from './types'

export function JobsApp() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchJobs()
      .then((data) => {
        if (!cancelled) setJobs(data)
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

  return <JobsBoard jobs={jobs} onChange={setJobs} />
}
