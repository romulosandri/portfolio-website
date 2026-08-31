import { useLayoutEffect, useRef } from 'react'
import { renderPage, type PageKey } from '../pages/renderPage'
import { gsap } from './gsap'

export type PanelTransitionMode = 'enter' | 'leave'

type PanelTransitionProps = {
  from: PageKey
  to: PageKey
  mode: PanelTransitionMode
  fromScrollY: number
  onComplete: () => void
}

function FrozenPage({ page, scrollY }: { page: PageKey; scrollY: number }) {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="w-full" style={{ transform: `translateY(${-scrollY}px)` }}>
        {renderPage(page)}
      </div>
    </div>
  )
}

export function PanelTransition({ from, to, mode, fromScrollY, onComplete }: PanelTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const outgoingRef = useRef<HTMLDivElement>(null)
  const incomingRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useLayoutEffect(() => {
    const root = rootRef.current
    const outgoing = outgoingRef.current
    const incoming = incomingRef.current
    if (!root || !outgoing || !incoming) return

    let finished = false
    const rootEl = document.documentElement
    const widthBeforeLock = rootEl.clientWidth
    rootEl.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const released = rootEl.clientWidth - widthBeforeLock
    if (released > 0) rootEl.style.paddingRight = `${released}px`

    const unlockViewport = () => {
      rootEl.style.overflow = ''
      document.body.style.overflow = ''
      rootEl.style.paddingRight = ''
    }

    const finish = () => {
      if (finished) return
      finished = true
      onCompleteRef.current()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return () => {
        unlockViewport()
      }
    }

    const ctx = gsap.context(() => {
      if (mode === 'leave') {
        gsap.set(outgoing, { y: 0, yPercent: 0 })
        gsap.set(incoming, { y: 0, yPercent: 0 })
        gsap.to(incoming, {
          yPercent: 100,
          duration: 0.92,
          ease: 'power3.inOut',
          onComplete: finish,
        })
        return
      }

      gsap.set(outgoing, { y: 0, yPercent: 0 })
      gsap.set(incoming, { y: 0, yPercent: 100 })
      gsap.to(incoming, {
        yPercent: 0,
        duration: 1.02,
        ease: 'power3.inOut',
        onComplete: finish,
      })
    }, root)

    const safety = window.setTimeout(finish, 1600)

    return () => {
      window.clearTimeout(safety)
      ctx.revert()
      unlockViewport()
    }
  }, [from.pathname, to.pathname, mode, fromScrollY])

  const under = mode === 'leave' ? to : from
  const over = mode === 'leave' ? from : to
  const underScrollY = mode === 'leave' ? 0 : fromScrollY
  const overScrollY = mode === 'leave' ? fromScrollY : 0

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden" data-panel-transition="" ref={rootRef}>
      <div className="absolute inset-0 z-0 overflow-hidden" ref={outgoingRef}>
        <FrozenPage page={under} scrollY={underScrollY} />
      </div>
      <div
        className="absolute inset-0 z-10 overflow-hidden bg-background-primary shadow-[0_-24px_64px_rgba(14,9,7,0.1)] will-change-transform"
        ref={incomingRef}
      >
        <FrozenPage page={over} scrollY={overScrollY} />
      </div>
    </div>
  )
}
