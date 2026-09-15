import { useEffect, useState } from 'react'
import { ToolsLanding } from './ToolsLanding'
import { CandleSticks } from './CandleSticks'
import { BlockGradients } from './BlockGradients'
import { ColorStripes } from './ColorStripes'

type ToolRoute = 'landing' | 'candle-sticks' | 'block-gradients' | 'color-stripes'

function parseRoute(pathname: string): ToolRoute {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return 'landing'
  if (path === '/candle-sticks') return 'candle-sticks'
  if (path === '/block-gradients') return 'block-gradients'
  if (path === '/color-stripes') return 'color-stripes'
  return 'landing'
}

function navigate(href: string) {
  if (window.location.pathname === href) return
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function useToolRoute() {
  const [route, setRoute] = useState<ToolRoute>(() => parseRoute(window.location.pathname))

  useEffect(() => {
    const sync = () => setRoute(parseRoute(window.location.pathname))

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = (event.target as HTMLElement | null)?.closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      if (target.getAttribute('target') === '_blank') return
      event.preventDefault()
      navigate(href)
    }

    window.addEventListener('popstate', sync)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', sync)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return route
}

export function ToolsApp() {
  const route = useToolRoute()

  return (
    <div className="min-h-svh bg-background-primary">
      {route === 'landing' && <ToolsLanding />}
      {route === 'candle-sticks' && <CandleSticks />}
      {route === 'block-gradients' && <BlockGradients />}
      {route === 'color-stripes' && <ColorStripes />}
    </div>
  )
}
