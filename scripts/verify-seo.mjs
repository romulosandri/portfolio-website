import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Post-build smoke test for the crawlable output.
 *
 * Verifies the things that silently regress: prerendered pages containing real
 * text, no content left hidden at zero opacity, one h1 per page, valid JSON-LD,
 * and the presence of the agent-facing files.
 */

const DIST = path.resolve(fileURLToPath(new URL('../dist', import.meta.url)))

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

async function htmlFiles(dir, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'assets') continue
      await htmlFiles(full, found)
    } else if (entry.name.endsWith('.html')) {
      found.push(full)
    }
  }
  return found
}

let failures = 0
const fail = (message) => {
  failures += 1
  console.log(`  FAIL  ${message}`)
}

const files = await htmlFiles(DIST)
console.log(`Checking ${files.length} prerendered pages\n`)

const rows = []

for (const file of files.sort()) {
  const relative = path.relative(DIST, file).replace(/\\/g, '/')
  const route = relative === 'index.html' ? '/' : `/${relative.replace(/\.html$/, '')}`
  const html = await readFile(file, 'utf8')
  const text = strip(html)

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)]
  const hidden =
    [...html.matchAll(/opacity:\s*0[;"']/g)].length +
    [...html.matchAll(/visibility:\s*hidden/g)].length
  const ldMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)

  let ldTypes = '—'
  if (!ldMatch) {
    fail(`${route}: no JSON-LD`)
  } else {
    try {
      ldTypes = JSON.parse(ldMatch[1])['@graph']
        .map((node) => node['@type'])
        .join('+')
    } catch {
      fail(`${route}: JSON-LD does not parse`)
    }
  }

  const isNotFound = relative === '404.html'

  if (text.length < 400 && route !== '/game') fail(`${route}: only ${text.length} chars of text`)
  if (h1s.length !== 1) fail(`${route}: expected 1 <h1>, found ${h1s.length}`)
  if (hidden > 0) fail(`${route}: ${hidden} hidden-style declarations remain`)
  if (!/<meta name="description"/.test(html)) fail(`${route}: no meta description`)
  if (isNotFound) {
    if (!/noindex/.test(html)) fail(`${route}: expected noindex`)
    if (/<link rel="canonical"/.test(html)) fail(`${route}: 404 must not self-canonicalise`)
  } else if (!/<link rel="canonical"/.test(html)) {
    fail(`${route}: no canonical`)
  }
  if (!/<meta property="og:image"/.test(html)) fail(`${route}: no og:image`)

  if (route === '/' && ldMatch) {
    try {
      const person = JSON.parse(ldMatch[1])['@graph']?.find((node) => node['@type'] === 'Person')
      const imageUrl = typeof person?.image === 'string' ? person.image : person?.image?.url
      if (!imageUrl) fail('/: Person JSON-LD has no image')
    } catch {
      // Parse failure is already reported above.
    }
  }

  rows.push({
    route,
    chars: text.length,
    h1: h1s[0] ? strip(h1s[0][1]).slice(0, 34) : '—',
    hidden,
    jsonLd: ldTypes.slice(0, 44),
  })
}

console.table(rows)

const required = [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'agents.md',
  'resume.md',
  'resume.json',
  'index.md',
  'work.md',
  'projects.md',
  'contact.md',
  'how-i-use-ai.md',
  'work/pacelane.md',
  'projects/fotospin.md',
]

console.log('\nAgent-facing files:')
for (const name of required) {
  try {
    const body = await readFile(path.join(DIST, name), 'utf8')
    console.log(`  ok    ${name.padEnd(22)} ${String(body.length).padStart(7)} bytes`)
  } catch {
    fail(`missing ${name}`)
  }
}

try {
  const resume = JSON.parse(await readFile(path.join(DIST, 'resume.json'), 'utf8'))
  console.log('  ok    resume.json parses as JSON')
  if (!resume.basics?.image) fail('resume.json: basics.image is missing')
  const siteUrl = resume.basics?.url?.replace(/\/$/, '') ?? ''
  for (const job of resume.work ?? []) {
    if (!job.url) continue
    let pathname
    try {
      pathname = new URL(job.url).pathname
    } catch {
      fail(`resume.json ${job.name}: url is not absolute (${job.url})`)
      continue
    }
    if (siteUrl && !job.url.startsWith(siteUrl)) {
      fail(`resume.json ${job.name}: url is off-site (${job.url})`)
      continue
    }
    const twin = `${pathname.replace(/^\//, '')}.md`
    try {
      await readFile(path.join(DIST, twin), 'utf8')
    } catch {
      fail(`resume.json ${job.name}: ${job.url} has no matching ${twin}`)
    }
  }
} catch {
  fail('resume.json is not valid JSON')
}

const home = files.find((file) => path.relative(DIST, file).replace(/\\/g, '/') === 'index.html')
if (home) {
  const html = await readFile(home, 'utf8')
  const leftover = (html.match(/data-prerender=/g) ?? []).length
  const family = (html.match(/data-family-frame/g) ?? []).length
  const pluto = (html.match(/data-pluto-frame/g) ?? []).length
  const logos = (html.match(/data-ticker-logo/g) ?? []).length
  if (leftover > 0) fail(`/: ${leftover} data-prerender markers left in the HTML`)
  if (family > 0) fail(`/: ${family} family sprite frames still in the HTML`)
  if (pluto > 0) fail(`/: ${pluto} footer Pluto frames still in the HTML`)
  if (html.includes('hero-character.webm')) fail('/: hero video still in the HTML')
  if (logos > 24) fail(`/: logo ticker still duplicated (${logos} logos)`)
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
