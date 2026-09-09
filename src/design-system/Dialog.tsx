import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './cx'

type DialogProps = {
  labelledBy: string
  describedBy?: string
  onClose: () => void
  closeDisabled?: boolean
  children: ReactNode
  className?: string
}

export function Dialog({
  labelledBy,
  describedBy,
  onClose,
  closeDisabled = false,
  children,
  className,
}: DialogProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const closeDisabledRef = useRef(closeDisabled)
  onCloseRef.current = onClose
  closeDisabledRef.current = closeDisabled

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const previouslyFocused = document.activeElement

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !closeDisabledRef.current) {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return
      const root = rootRef.current
      if (!root) return
      const focusable = [
        ...root.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'),
      ]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[lastIndex(focusable)]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  return createPortal(
    <div
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-gutter py-xl"
      ref={rootRef}
      role="dialog"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-foreground-primary/40"
        onClick={() => {
          if (!closeDisabled) onClose()
        }}
      />
      <div
        className={cx(
          'relative w-full max-w-112 shrink-0 border border-solid border-stroke-secondary bg-background-primary p-xl',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

function lastIndex<T>(items: T[]) {
  return items.length - 1
}
