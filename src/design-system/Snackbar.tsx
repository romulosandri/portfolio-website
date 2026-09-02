import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, useGSAP } from '../motion-system/gsap'
import { MOTION, prefersReducedMotion } from '../motion-system/tokens'

type SnackbarApi = {
  show: (message: string) => void
}

const SnackbarContext = createContext<SnackbarApi | null>(null)
const HIDE_AFTER_MS = 2800

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) throw new Error('useSnackbar must be used within SnackbarProvider')
  return context
}

type SnackbarProviderProps = {
  children: ReactNode
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState(0)
  const hideTimer = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const show = useCallback((next: string) => {
    setMessage(next)
    setOpen(true)
    setToken((current) => current + 1)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setOpen(false), HIDE_AFTER_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  useGSAP(
    () => {
      const node = rootRef.current
      if (!node) return

      const reduced = prefersReducedMotion()
      const duration = reduced ? 0 : open ? MOTION.duration.interactive : MOTION.duration.micro

      if (!open) {
        gsap.to(node, {
          autoAlpha: 0,
          y: reduced ? 0 : 12,
          duration,
          ease: MOTION.ease.inOut,
          overwrite: 'auto',
        })
        return
      }

      gsap.fromTo(
        node,
        { autoAlpha: 0, y: reduced ? 0 : 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          ease: MOTION.ease.out,
          overwrite: 'auto',
        },
      )
    },
    { dependencies: [open, token] },
  )

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-4xl left-1/2 z-60 -translate-x-1/2">
        <div aria-live="polite" className="invisible opacity-0" ref={rootRef} role="status">
          {message ? (
            <p className="bg-foreground-primary px-xl py-lg text-body-default text-background-primary">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </SnackbarContext.Provider>
  )
}
