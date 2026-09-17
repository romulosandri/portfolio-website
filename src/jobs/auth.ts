const STORAGE_KEY = 'jobs.auth.session'

let memoryPassword: string | null = null

export function readJobsPassword() {
  if (memoryPassword) return memoryPassword
  try {
    memoryPassword =
      sessionStorage.getItem(STORAGE_KEY) ||
      sessionStorage.getItem('jobs.auth.board') ||
      sessionStorage.getItem('jobs.auth.kanban')
    if (memoryPassword) sessionStorage.setItem(STORAGE_KEY, memoryPassword)
    return memoryPassword
  } catch {
    return memoryPassword
  }
}

export function writeJobsPassword(password: string) {
  memoryPassword = password
  try {
    sessionStorage.setItem(STORAGE_KEY, password)
  } catch {
    /* private mode or blocked storage */
  }
}

export function clearJobsPassword() {
  memoryPassword = null
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* private mode or blocked storage */
  }
}

export function isJobsAuthError(error: unknown) {
  return error instanceof Error && error.message === 'Incorrect password'
}
