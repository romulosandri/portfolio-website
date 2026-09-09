import type { Job } from './types'

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function fetchJobs() {
  return request<Job[]>('/api/jobs')
}

export function setJobsLive(ids: string[], isLive: boolean) {
  return request<{ ok: true }>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'setLive',
      ids,
      is_live: isLive ? 1 : 0,
    }),
  })
}

export function deleteJobs(ids: string[]) {
  return request<{ ok: true }>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', ids }),
  })
}
