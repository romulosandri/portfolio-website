import { projectItems, workItems } from './portfolio'

/**
 * The single source of truth for every crawlable URL on the site.
 *
 * Consumed by scripts/prerender.mjs (which pages to render to static HTML),
 * scripts/generate-seo-assets.mjs (sitemap.xml, llms.txt, markdown mirrors),
 * and the router's SEO layer. Keeping one list means the sitemap can never
 * drift from what actually exists.
 */
export type RouteEntry = {
  path: string
  /** sitemap.xml priority, 0.0 to 1.0. */
  priority: number
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  /** Whether to emit a markdown mirror at `<path>.md`. */
  markdown: boolean
}

const staticRoutes: RouteEntry[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly', markdown: true },
  { path: '/work', priority: 0.9, changefreq: 'weekly', markdown: true },
  { path: '/projects', priority: 0.9, changefreq: 'weekly', markdown: true },
  { path: '/how-i-use-ai', priority: 0.7, changefreq: 'monthly', markdown: true },
  { path: '/contact', priority: 0.8, changefreq: 'yearly', markdown: true },
  // The game is a Phaser canvas with no indexable content, so it stays in the
  // sitemap for completeness but gets no markdown mirror.
  { path: '/game', priority: 0.2, changefreq: 'yearly', markdown: false },
]

export const routes: RouteEntry[] = [
  ...staticRoutes,
  ...workItems.map((item) => ({
    path: item.href,
    priority: 0.8,
    changefreq: 'monthly' as const,
    markdown: true,
  })),
  ...projectItems.map((item) => ({
    path: item.href,
    priority: 0.7,
    changefreq: 'monthly' as const,
    markdown: true,
  })),
]

export const routePaths = routes.map((route) => route.path)
