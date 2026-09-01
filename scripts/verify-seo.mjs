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
    } else if (entry.name === 'index.html') {
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
  const route = `/${path.relative(DIST, path.dirname(file)).replace(/\\/g, '/')}`.replace(/\/\.$/, '/')
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

  if (text.length < 400 && route !== '/game') fail(`${route}: only ${text.length} chars of text`)
  if (h1s.length !== 1) fail(`${route}: expected 1 <h1>, found ${h1s.length}`)
  if (hidden > 0) fail(`${route}: ${hidden} hidden-style declarations remain`)
  if (!/<meta name="description"/.test(html)) fail(`${route}: no meta description`)
  if (!/<link rel="canonical"/.test(html)) fail(`${route}: no canonical`)
  if (!/<meta property="og:image"/.test(html)) fail(`${route}: no og:image`)

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
  JSON.parse(await readFile(path.join(DIST, 'resume.json'), 'utf8'))
  console.log('  ok    resume.json parses as JSON')
} catch {
  fail('resume.json is not valid JSON')
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
