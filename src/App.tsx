import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BackToTop, ChatWidget, NavBar } from './design-system'
import { useRoute } from './lib/router'
import { useDocumentHead } from './lib/useDocumentHead'
import { PanelTransition, type PanelTransitionMode } from './motion-system/PanelTransition'
import {
  getScrollY,
  jumpToScrollY,
  pauseSmoothScroll,
  resumeSmoothScroll,
} from './motion-system/smoothScroll'
import { GameModalProvider } from './pages/GameModal'
import { isWorkOrProjectsRoute, renderPage, type PageKey } from './pages/renderPage'

type PendingTransition = {
  from: PageKey
  to: PageKey
  mode: PanelTransitionMode
  fromScrollY: number
}

function isHomeChrome(page: PageKey) {
  return page.route.name === 'home'
}

/** `/game` is a modal over the current site, not its own page. */
function pageKeyFor(route: PageKey['route'], pathname: string): PageKey {
  if (route.name === 'game') return { route: { name: 'home' }, pathname: '/' }
  return { route, pathname }
}

/**
 * Tells scripts/prerender.mjs the page has settled and is safe to serialise.
 * Waits for fonts plus two frames so GSAP's reveal pass has already run.
 */
function usePrerenderSignal(pathname: string) {
  useEffect(() => {
    let cancelled = false
    delete document.documentElement.dataset.prerenderReady

    const markReady = () => {
      if (cancelled) return
      document.documentElement.dataset.prerenderReady = 'true'
    }

    const afterFonts = () =>
      requestAnimationFrame(() => requestAnimationFrame(markReady))

    document.fonts?.ready.then(afterFonts).catch(afterFonts) ?? afterFonts()

    return () => {
      cancelled = true
    }
  }, [pathname])
}

function App() {
  const { route, pathname } = useRoute()
  useDocumentHead(route)
  usePrerenderSignal(pathname)
  const [active, setActive] = useState<PageKey>(() => pageKeyFor(route, pathname))
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
    const to = pageKeyFor(route, pathname)
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
  const hideBackToTop = Boolean(pending)
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
    <GameModalProvider gameRoute={route.name === 'game'}>
      <div className={transitioning ? 'flex h-svh flex-col overflow-hidden' : undefined}>
        {hideNav ? null : (
          /* Sticky only below the nav breakpoint, so the menu button stays
             reachable after scrolling. Sticky stays in flow, so the
             ResizeObserver above and the hero's negative top margin both keep
             measuring the same box. */
          <div className="sticky top-0 z-30 shrink-0 nav:static" ref={navRef}>
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
        {/* Stays mounted across route changes so an open conversation survives
            navigation. Hidden only on the design-system gallery. */}
        {hideNav ? null : <ChatWidget />}
      </div>
    </GameModalProvider>
  )
}

export default App
