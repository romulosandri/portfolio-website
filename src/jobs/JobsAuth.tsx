import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { clearJobsPassword, readJobsPassword, writeJobsPassword } from './auth'
import { JobsConfirmModal } from './ui'

type JobsAuthContextValue = {
  ensurePassword: () => Promise<string | null>
  remember: (password: string) => void
  forget: () => void
}

const JobsAuthContext = createContext<JobsAuthContextValue | null>(null)

export function JobsAuthProvider({ children }: { children: ReactNode }) {
  const passwordRef = useRef<string | null>(readJobsPassword())
  const pendingRef = useRef<Promise<string | null> | null>(null)
  const [prompt, setPrompt] = useState<{ resolve: (password: string | null) => void } | null>(null)

  const remember = useCallback((password: string) => {
    passwordRef.current = password
    writeJobsPassword(password)
  }, [])

  const forget = useCallback(() => {
    passwordRef.current = null
    pendingRef.current = null
    clearJobsPassword()
  }, [])

  const ensurePassword = useCallback(() => {
    const stored = passwordRef.current ?? readJobsPassword()
    if (stored) {
      passwordRef.current = stored
      return Promise.resolve(stored)
    }
    if (pendingRef.current) return pendingRef.current

    pendingRef.current = new Promise<string | null>((resolve) => {
      setPrompt((current) => {
        current?.resolve(null)
        return { resolve }
      })
    }).finally(() => {
      pendingRef.current = null
    })

    return pendingRef.current
  }, [])

  const value = useMemo(
    () => ({ ensurePassword, remember, forget }),
    [ensurePassword, remember, forget],
  )

  return (
    <JobsAuthContext.Provider value={value}>
      {children}
      {prompt ? (
        <JobsConfirmModal
          confirmLabel="Continue"
          description="Enter the password to make changes. You will not be asked again until you close this tab."
          needPassword
          title="Unlock jobs"
          onCancel={() => {
            prompt.resolve(null)
            setPrompt(null)
          }}
          onConfirm={(password) => {
            if (password) remember(password)
            prompt.resolve(password || null)
            setPrompt(null)
          }}
        />
      ) : null}
    </JobsAuthContext.Provider>
  )
}

export function useJobsAuth() {
  const value = useContext(JobsAuthContext)
  if (!value) throw new Error('useJobsAuth must be used within JobsAuthProvider')
  return value
}
