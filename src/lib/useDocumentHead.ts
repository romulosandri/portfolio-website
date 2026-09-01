import { useEffect } from 'react'
import { canonicalUrl, getPageMeta, isNoIndex } from '../content/seo'
import { absoluteUrl, site } from '../content/site'
import { routes } from '../content/routes'
import { buildJsonLd } from './jsonLd'
import type { Route } from './router'

/**
 * Keeps <head> in sync with the active route.
 *
 * This runs client-side, which on its own would be invisible to crawlers that
 * don't execute JavaScript. It works because scripts/prerender.mjs drives a real
 * browser and serialises the DOM *after* this effect has run, so every tag below
 * ends up baked into the static HTML for each route.
 */

const MANAGED = 'data-managed-head'

/** Removes tags from a previous route before writing the current one's. */
function clearManaged() {
  document.head.querySelectorAll(`[${MANAGED}]`).forEach((node) => node.remove())
}

function appendMeta(attr: 'name' | 'property', key: string, content: string) {
  const el = document.createElement('meta')
  el.setAttribute(attr, key)
  el.setAttribute('content', content)
  el.setAttribute(MANAGED, '')
  document.head.appendChild(el)
}

function appendLink(rel: string, href: string, extra: Record<string, string> = {}) {
  const el = document.createElement('link')
  el.setAttribute('rel', rel)
  el.setAttribute('href', href)
  Object.entries(extra).forEach(([key, value]) => el.setAttribute(key, value))
  el.setAttribute(MANAGED, '')
  document.head.appendChild(el)
}

export function useDocumentHead(route: Route) {
  useEffect(() => {
    const meta = getPageMeta(route)
    const canonical = canonicalUrl(meta)
    const noindex = isNoIndex(route)

    document.title = meta.title
    clearManaged()

    appendMeta('name', 'description', meta.description)
    appendMeta('name', 'author', site.name)

    if (noindex) {
      appendMeta('name', 'robots', 'noindex, nofollow')
    } else {
      appendMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1')
      appendLink('canonical', canonical)
    }

    appendMeta('property', 'og:type', meta.ogType)
    appendMeta('property', 'og:title', meta.title)
    appendMeta('property', 'og:description', meta.description)
    appendMeta('property', 'og:url', canonical)
    appendMeta('property', 'og:image', absoluteUrl(meta.ogImage))
    appendMeta('property', 'og:site_name', `${site.name} — ${site.role}`)
    appendMeta('property', 'og:locale', 'en_US')

    appendMeta('name', 'twitter:card', 'summary_large_image')
    appendMeta('name', 'twitter:title', meta.title)
    appendMeta('name', 'twitter:description', meta.description)
    appendMeta('name', 'twitter:image', absoluteUrl(meta.ogImage))

    // Point agents at the clean markdown twin of this page. An agent that lands
    // on the HTML can follow this instead of parsing the rendered layout.
    const hasMarkdown = routes.some((entry) => entry.path === meta.path && entry.markdown)
    if (hasMarkdown && !noindex) {
      const mdPath = meta.path === '/' ? '/index.md' : `${meta.path}.md`
      appendLink('alternate', absoluteUrl(mdPath), {
        type: 'text/markdown',
        title: `${meta.title} (markdown)`,
      })
      appendLink('alternate', absoluteUrl('/llms.txt'), {
        type: 'text/plain',
        title: 'llms.txt',
      })
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(MANAGED, '')
    script.textContent = buildJsonLd(route, meta)
    document.head.appendChild(script)
  }, [route])
}
