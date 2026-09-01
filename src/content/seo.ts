import type { Route } from '../lib/router'
import { toPngSrc } from '../lib/images'
import { projectBySlug, projectItems, workBySlug, workItems } from './portfolio'
import { absoluteUrl, site } from './site'

export type PageMeta = {
  title: string
  description: string
  /** Site-root-relative path to the social preview image. */
  ogImage: string
  /** 'website' for index pages, 'article' for case studies, 'profile' for home. */
  ogType: 'website' | 'article' | 'profile'
  /** Canonical path. Kept separate from the live pathname so unknown slugs don't self-canonicalise. */
  path: string
  breadcrumbs: { name: string; path: string }[]
}

const MAX_DESCRIPTION = 155

/** Trim to a whole word within the length search engines actually display. */
function clamp(text: string, max = MAX_DESCRIPTION) {
  const collapsed = text.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= max) return collapsed
  const cut = collapsed.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/**
 * Social preview images must be PNG or JPEG -- no major crawler decodes AVIF,
 * and every cover in portfolio.ts is AVIF. The PNG twins already exist on disk.
 */
function socialImage(avifPath: string) {
  return toPngSrc(avifPath)
}

const DEFAULT_OG_IMAGE = '/images/home/hero-character.png'

export function getPageMeta(route: Route): PageMeta {
  switch (route.name) {
    case 'work':
      return {
        title: `Work — ${site.name}`,
        description: clamp(
          `Selected product design work by ${site.name} from 2023 to 2026, including ${workItems
            .slice(0, 3)
            .map((item) => item.title)
            .join(', ')}.`,
        ),
        ogImage: socialImage(workItems[0]?.cover ?? DEFAULT_OG_IMAGE),
        ogType: 'website',
        path: '/work',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ],
      }

    case 'projects':
      return {
        title: `Projects — ${site.name}`,
        description: clamp(
          `Side projects and products founded by ${site.name}, including ${projectItems
            .slice(0, 3)
            .map((item) => item.title)
            .join(', ')}.`,
        ),
        ogImage: socialImage(projectItems[0]?.cover ?? DEFAULT_OG_IMAGE),
        ogType: 'website',
        path: '/projects',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
        ],
      }

    case 'workDetail':
    case 'projectDetail': {
      const isWork = route.name === 'workDetail'
      const item = isWork ? workBySlug(route.slug) : projectBySlug(route.slug)
      const parentPath = isWork ? '/work' : '/projects'
      const parentName = isWork ? 'Work' : 'Projects'

      if (!item) return notFoundMeta()

      return {
        title: `${item.title} — ${item.role} — ${site.name}`,
        description: clamp(item.summary || item.description),
        ogImage: socialImage(item.cover),
        ogType: 'article',
        path: item.href,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: parentName, path: parentPath },
          { name: item.title, path: item.href },
        ],
      }
    }

    case 'howAi':
      return {
        title: `How I use AI — ${site.name}`,
        description: clamp(
          `The AI tools, agent harnesses, and language models ${site.name} uses day to day in the product design process, and what each one is actually good for.`,
        ),
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'article',
        path: '/how-i-use-ai',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'How I use AI', path: '/how-i-use-ai' },
        ],
      }

    case 'contact':
      return {
        title: `Contact — ${site.name}`,
        description: clamp(
          `Get in touch with ${site.name}, ${site.role} based in ${site.location.city}, ${site.location.country}. Available by email and WhatsApp.`,
        ),
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        path: '/contact',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ],
      }

    case 'game':
      return {
        title: `My life game — ${site.name}`,
        description: clamp(
          `A small browser game built by ${site.name} as an interactive way to walk through his life and work.`,
        ),
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        path: '/game',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'My life game', path: '/game' },
        ],
      }

    case 'ds':
      return {
        // The design-system gallery is an internal tool. robots.txt disallows it
        // and useDocumentHead adds a noindex tag for this route.
        title: `Design system — ${site.name}`,
        description: 'Internal design system gallery.',
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        path: '/',
        breadcrumbs: [],
      }

    case 'notFound':
      return notFoundMeta()

    case 'home':
    default:
      return {
        title: `${site.name} — ${site.role}`,
        description: clamp(site.blurb),
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'profile',
        path: '/',
        breadcrumbs: [],
      }
  }
}

function notFoundMeta(): PageMeta {
  return {
    title: `Page not found — ${site.name}`,
    description: clamp(`That page does not exist. Browse the work and projects of ${site.name}.`),
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    path: '/',
    breadcrumbs: [],
  }
}

/** Routes that must never be indexed. */
export function isNoIndex(route: Route) {
  return route.name === 'ds' || route.name === 'notFound'
}

export function canonicalUrl(meta: PageMeta) {
  return absoluteUrl(meta.path)
}
