import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'
import { withContent } from './lib/content.mjs'

/**
 * Renders every route of the SPA to static HTML.
 *
 * The site is client-rendered, so `dist/index.html` ships an empty #root and any
 * crawler that does not execute JavaScript sees nothing. This drives a real
 * browser over each route and writes the resulting DOM to disk, so GPTBot,
 * ClaudeBot, PerplexityBot, and friends get real content.
 *
 * The key detail is `reducedMotion: 'reduce'`. Every reveal animation in
 * src/motion-system/Reveal.tsx short-circuits to fully visible when
 * `prefersReducedMotion()` is true, so emulating that flag produces markup with
 * all text present and nothing stuck at `opacity: 0`.
 *
 * React still boots with `createRoot().render()` and discards this markup on
 * mount. That is intentional: hydrating would mismatch against GSAP's inline
 * styles. This output exists for crawlers, not for the browser.
 */

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const DIST = path.join(ROOT, 'dist')
const READY_TIMEOUT_MS = 20000
const CONCURRENCY = 4

/** Runs inside the page, immediately before serialization. */
function sanitize() {
  // With reduced motion the reveals should already be visible, but GSAP also
  // writes inline styles from hover, ticker, and panel-transition timelines.
  // Anything left at zero opacity would read as hidden text to a crawler.
  document.querySelectorAll('[style]').forEach((node) => {
    const style = node.style
    const hidden =
      style.opacity === '0' ||
      style.visibility === 'hidden' ||
      style.autoAlpha === '0'
    if (hidden) {
      style.removeProperty('opacity')
      style.removeProperty('visibility')
    }
    // Blur filters and offset transforms are mid-animation state, never final.
    if (style.filter?.includes('blur')) style.removeProperty('filter')
  })

  // Roll animations (RevealText variant="roll", RollingText) render every
  // character as three stacked copies for the rolling effect, so "Contact"
  // serialises as "CCCooonnntttaaaccctt". Each of those blocks is aria-hidden and
  // sits next to an .sr-only span holding the clean string, so dropping the
  // aria-hidden twin leaves exactly one correct copy of the text.
  document.querySelectorAll('.sr-only').forEach((label) => {
    const parent = label.parentElement
    if (!parent) return
    parent.querySelectorAll(':scope > [aria-hidden="true"]').forEach((twin) => twin.remove())
  })

  // The Phaser game canvas serialises as a large empty element with no content.
  document.querySelectorAll('canvas').forEach((node) => node.remove())

  // Vite injects a preload helper marker that is meaningless in static output.
  document.documentElement.setAttribute('data-prerendered', 'true')
}

async function renderRoute(browser, origin, routePath) {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()

  // Images and video do not affect the serialised DOM but dominate load time.
  await page.route('**/*', (route) => {
    const type = route.request().resourceType()
    if (type === 'image' || type === 'media') return route.abort()
    return route.continue()
  })

  const url = new URL(routePath, origin).toString()
  let warning = null

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: READY_TIMEOUT_MS })
    await page.waitForFunction(
      () => document.documentElement.dataset.prerenderReady === 'true',
      null,
      { timeout: READY_TIMEOUT_MS },
    )
  } catch (error) {
    warning = error.message.split('\n')[0]
  }

  await page.evaluate(sanitize)
  const html = `<!doctype html>\n${await page.evaluate(() => document.documentElement.outerHTML)}`

  await context.close()
  return { html, warning }
}

/**
 * `/work/pacelane` -> `dist/work/pacelane.html`, `/` -> `dist/index.html`.
 *
 * Flat files rather than `<route>/index.html`: Netlify treats a directory index
 * as a directory and 301s `/work/pacelane` to `/work/pacelane/`, which every
 * canonical tag, sitemap entry, and JSON-LD @id on the site would then disagree
 * with. A document at `work/pacelane.html` is served at `/work/pacelane` with no
 * redirect and no trailing slash.
 */
function outputPath(routePath) {
  if (routePath === '/') return path.join(DIST, 'index.html')
  return path.join(DIST, `${routePath.replace(/^\//, '')}.html`)
}

async function main() {
  const routePaths = await withContent(async ({ routes }) => routes.routePaths)

  const server = await preview({
    preview: { port: 4183, strictPort: false, open: false },
    logLevel: 'error',
  })
  const origin = server.resolvedUrls?.local?.[0] ?? 'http://localhost:4183'

  const browser = await chromium.launch()
  const results = new Map()
  const warnings = []
  const queue = [...routePaths]

  const worker = async () => {
    for (;;) {
      const routePath = queue.shift()
      if (!routePath) return
      const { html, warning } = await renderRoute(browser, origin, routePath)
      results.set(routePath, html)
      if (warning) warnings.push(`${routePath}: ${warning}`)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  await browser.close()
  await server.close()

  // Written only after every route is rendered, so a freshly written
  // dist/work/index.html can never be served to a later render pass.
  for (const [routePath, html] of results) {
    const file = outputPath(routePath)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, html, 'utf8')
  }

  console.log(`prerender: wrote ${results.size} routes`)
  for (const warning of warnings) console.warn(`prerender: ${warning}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
