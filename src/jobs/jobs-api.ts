import type { KanbanColumn } from './columns'
import type { Job } from './types'

export type JobsPayload = {
  jobs: Job[]
  columns: KanbanColumn[]
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (!response.ok) {
    const text = await response.text()
    let message = text || 'Request failed'
    try {
      const body = JSON.parse(text) as { error?: string }
      if (body.error) message = body.error
    } catch {
      /* keep text */
    }
    throw new Error(message)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function fetchJobs() {
  return request<JobsPayload>('/api/jobs')
}

export function saveKanbanColumns(columns: KanbanColumn[]) {
  return request<{ ok: true; columns: KanbanColumn[] }>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'setColumns', columns }),
  })
}

export function deleteJobs(ids: string[]) {
  return request<{ ok: true }>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', ids }),
  })
}

export function setJobsStatus(ids: string[], status: string) {
  return request<{ ok: true }>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'setStatus', ids, status }),
  })
}

export function setJobsFavorite(ids: string[], favorite: boolean) {
  return request<{ ok: true }>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'setFavorite', ids, favorite }),
  })
}

export function createJob(input: { title: string; company: string; url: string; location?: string }) {
  return request<Job>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', ...input }),
  })
}
