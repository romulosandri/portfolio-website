import { useLayoutEffect, useRef, useState } from 'react'
import { BackToTop, NavBar } from './design-system'
import { useRoute } from './lib/router'
import { PanelTransition, type PanelTransitionMode } from './motion-system/PanelTransition'
import {
  getScrollY,
  jumpToScrollY,
  pauseSmoothScroll,
  resumeSmoothScroll,
} from './motion-system/smoothScroll'
import { isWorkOrProjectsRoute, renderPage, type PageKey } from './pages/renderPage'

type PendingTransition = {
  from: PageKey
  to: PageKey
  mode: PanelTransitionMode
  fromScrollY: number
}

function isHomeChrome(page: PageKey) {
  return page.route.name === 'home' || page.route.name === 'notFound'
}

function App() {
  const { route, pathname } = useRoute()
  const [active, setActive] = useState<PageKey>(() => ({ route, pathname }))
  const [pending, setPending] = useState<PendingTransition | null>(null)
  const activeRef = useRef(active)
  const pendingRef = useRef(pending)
  const handledPathRef = useRef(pathname)
  const navRef = useRef<HTMLDivElement>(null)
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
      jumpToScrollY(0)
      return
    }

    setPending({
      from,
      to,
      mode: toPanel ? 'enter' : 'leave',
      fromScrollY: pendingRef.current ? 0 : getScrollY(),
    })
  }, [pathname, route])

  const completeTransition = () => {
    const current = pendingRef.current
    if (!current) return
    handledPathRef.current = current.to.pathname
    setActive(current.to)
    setPending(null)
    jumpToScrollY(0)
  }

  const shown = pending?.to ?? active
  const chrome = pending?.from ?? active
  const hideNav = shown.route.name === 'ds'
  const hideBackToTop = shown.route.name === 'game' || Boolean(pending)
  const transitioning = Boolean(pending)

  useLayoutEffect(() => {
    if (!transitioning) return
    pauseSmoothScroll()
    return () => resumeSmoothScroll()
  }, [transitioning])

  useLayoutEffect(() => {
    const node = navRef.current
    if (!node) {
      document.documentElement.style.setProperty('--site-nav-height', '0px')
      return
    }

    const apply = () => {
      document.documentElement.style.setProperty('--site-nav-height', `${node.offsetHeight}px`)
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(node)
    return () => observer.disconnect()
  }, [hideNav])

  return (
    <div className={transitioning ? 'flex h-svh flex-col overflow-hidden' : undefined}>
      {hideNav ? null : (
        <div className="relative z-30 shrink-0" ref={navRef}>
          <NavBar
            className={isHomeChrome(chrome) ? 'bg-background-secondary' : undefined}
            pathname={chrome.pathname}
          />
        </div>
      )}
      <div className={transitioning ? 'relative min-h-0 flex-1' : undefined}>
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
      </div>
      {hideBackToTop ? null : <BackToTop />}
    </div>
  )
}

export default App
