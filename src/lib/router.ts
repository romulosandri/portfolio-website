import { useEffect, useState } from 'react'

export type Route =
  | { name: 'home' }
  | { name: 'work' }
  | { name: 'workDetail'; slug: string }
  | { name: 'projects' }
  | { name: 'projectDetail'; slug: string }
  | { name: 'howAi' }
  | { name: 'contact' }
  | { name: 'game' }
  | { name: 'ds' }
  | { name: 'notFound' }

export function parseLocation(pathname: string, search: string): Route {
  if (new URLSearchParams(search).has('ds')) return { name: 'ds' }

  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') return { name: 'home' }
  if (path === '/work') return { name: 'work' }
  const workDetail = path.match(/^\/work\/([^/]+)$/)
  if (workDetail) return { name: 'workDetail', slug: workDetail[1] }
  if (path === '/projects') return { name: 'projects' }
  const projectDetail = path.match(/^\/projects\/([^/]+)$/)
  if (projectDetail) return { name: 'projectDetail', slug: projectDetail[1] }
  if (path === '/how-i-use-ai') return { name: 'howAi' }
  if (path === '/contact') return { name: 'contact' }
  if (path === '/game') return { name: 'game' }
  return { name: 'notFound' }
}

export function navigate(href: string) {
  if (window.location.pathname + window.location.search === href) return
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function isInternalHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//')
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() =>
    parseLocation(window.location.pathname, window.location.search),
  )
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    window.history.scrollRestoration = 'manual'

    const sync = () => {
      setPathname(window.location.pathname)
      setRoute(parseLocation(window.location.pathname, window.location.search))
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = (event.target as HTMLElement | null)?.closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || !isInternalHref(href)) return
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

  return { route, pathname }
}
