import { useLayoutEffect, useRef, useState } from 'react'
import { BackToTop } from './design-system'
import { useRoute } from './lib/router'
import { PanelTransition, type PanelTransitionMode } from './pages/PanelTransition'
import { isWorkOrProjectsRoute, renderPage, type PageKey } from './pages/renderPage'

type PendingTransition = {
  from: PageKey
  to: PageKey
  mode: PanelTransitionMode
  fromScrollY: number
}

function App() {
  const { route, pathname } = useRoute()
  const [active, setActive] = useState<PageKey>(() => ({ route, pathname }))
  const [pending, setPending] = useState<PendingTransition | null>(null)
  const activeRef = useRef(active)
  const pendingRef = useRef(pending)
  const handledPathRef = useRef(pathname)
  activeRef.current = active
  pendingRef.current = pending

  useLayoutEffect(() => {
    if (handledPathRef.current === pathname) return
    handledPathRef.current = pathname

    const from = pendingRef.current?.to ?? activeRef.current
    const to = { route, pathname }
    const fromPanel = isWorkOrProjectsRoute(from.route)
    const toPanel = isWorkOrProjectsRoute(to.route)

    if (!fromPanel && !toPanel) {
      setActive(to)
      setPending(null)
      window.scrollTo(0, 0)
      return
    }

    setPending({
      from,
      to,
      mode: toPanel ? 'enter' : 'leave',
      fromScrollY: pendingRef.current ? 0 : window.scrollY,
    })
  }, [pathname, route])

  const completeTransition = () => {
    const current = pendingRef.current
    if (!current) return
    handledPathRef.current = current.to.pathname
    setActive(current.to)
    setPending(null)
    window.scrollTo(0, 0)
  }

  const shown = pending?.to ?? active
  const hideBackToTop = shown.route.name === 'game' || Boolean(pending)

  return (
    <>
      {pending ? (
        <PanelTransition
          from={pending.from}
          fromScrollY={pending.fromScrollY}
          key={`${pending.from.pathname}->${pending.to.pathname}:${pending.mode}`}
          mode={pending.mode}
          onComplete={completeTransition}
          to={pending.to}
        />
      ) : (
        renderPage(active)
      )}
      {hideBackToTop ? null : <BackToTop />}
    </>
  )
}

export default App
