import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { withContent } from './lib/content.mjs'

/**
 * Loads every route at each breakpoint and fails if the document scrolls
 * horizontally.
 *
 * Runs against a dev server rather than `dist/`, so it needs no build and can
 * never pass against stale prerendered HTML. Unlike prerender.mjs this does not
 * emulate reduced motion: the reveal animations translate elements before
 * settling, and a transform that overflows is still a horizontal scrollbar.
 *
 * On failure it names the widest offending elements. `scrollWidth > clientWidth`
 * on its own tells you a page is broken but not which fixed-pixel value did it.
 */

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const WIDTHS = [390, 768, 1024, 1440]
const HEIGHT = 844
const READY_TIMEOUT_MS = 20000
const CONCURRENCY = 4
/** Sub-pixel layout rounding shows up as ~0.5px of phantom overflow. */
const TOLERANCE_PX = 1

/** Runs in the page. Returns the elements sticking out past the viewport. */
function findOverflow(tolerance) {
  const doc = document.documentElement
  const limit = doc.clientWidth
  const overflowBy = doc.scrollWidth - limit
  if (overflowBy <= tolerance) return { overflowBy, culprits: [] }

  const describe = (el) => {
    const id = el.id ? `#${el.id}` : ''
    const cls =
      typeof el.className === 'string' && el.className
        ? `.${el.className.trim().split(/\s+/).slice(0, 6).join('.')}`
        : ''
    return `${el.tagName.toLowerCase()}${id}${cls}`
  }

  const culprits = []
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) continue
    const past = Math.round(rect.right - limit)
    if (past <= tolerance) continue
    // An overflowing child inside a clipped or scrollable parent is contained
    // and cannot move the document, so only report the outermost real cause.
    let contained = false
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const style = getComputedStyle(p)
      const clips = /hidden|clip|auto|scroll/.test(style.overflowX)
      if (clips) {
        contained = true
        break
      }
    }
    if (contained) continue
    culprits.push({ selector: describe(el), past, width: Math.round(rect.width) })
  }

  culprits.sort((a, b) => b.past - a.past)
  const seen = new Set()
  const unique = culprits.filter((c) => {
    if (seen.has(c.selector)) return false
    seen.add(c.selector)
    return true
  })

  return { overflowBy, culprits: unique.slice(0, 5) }
}

async function checkRoute(browser, origin, routePath, width) {
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  // Images do not affect layout here: every image box is sized by CSS or an
  // aspect-ratio wrapper. Blocking them keeps the run fast.
  await page.route('**/*', (route) => {
    const type = route.request().resourceType()
    if (type === 'image' || type === 'media' || type === 'font') return route.abort()
    return route.continue()
  })

  let warning = null
  try {
    await page.goto(new URL(routePath, origin).toString(), {
      waitUntil: 'domcontentloaded',
      timeout: READY_TIMEOUT_MS,
    })
    await page.waitForFunction(
      () => document.documentElement.dataset.prerenderReady === 'true',
      null,
      { timeout: READY_TIMEOUT_MS },
    )
  } catch (error) {
    warning = error.message.split('\n')[0]
  }

  const result = await page.evaluate(findOverflow, TOLERANCE_PX)
  await context.close()
  return { routePath, width, warning, ...result }
}

async function main() {
  const routePaths = await withContent(async ({ routes }) => routes.routePaths)

  const server = await createServer({
    root: ROOT,
    server: { port: 4184, strictPort: false },
    logLevel: 'error',
  })
  await server.listen()
  const origin = server.resolvedUrls?.local?.[0] ?? 'http://localhost:4184'

  const browser = await chromium.launch()
  const queue = []
  for (const width of WIDTHS) {
    for (const routePath of [...routePaths, '/404']) queue.push({ routePath, width })
  }

  const failures = []
  const warnings = []

  const worker = async () => {
    for (;;) {
      const job = queue.shift()
      if (!job) return
      const result = await checkRoute(browser, origin, job.routePath, job.width)
      if (result.warning) warnings.push(`${job.routePath} @${job.width}: ${result.warning}`)
      if (result.overflowBy > TOLERANCE_PX) failures.push(result)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  await browser.close()
  await server.close()

  const total = WIDTHS.length * (routePaths.length + 1)
  for (const warning of warnings) console.warn(`check-responsive: ${warning}`)

  if (failures.length === 0) {
    console.log(`check-responsive: ${total} checks passed at ${WIDTHS.join(' / ')}px`)
    return
  }

  failures.sort((a, b) => a.width - b.width || a.routePath.localeCompare(b.routePath))
  console.error(`check-responsive: ${failures.length} of ${total} checks overflow horizontally\n`)
  for (const failure of failures) {
    console.error(`  ${failure.routePath} @${failure.width}px  +${failure.overflowBy}px`)
    for (const culprit of failure.culprits) {
      console.error(`      +${culprit.past}px (w:${culprit.width}) ${culprit.selector}`)
    }
  }
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
