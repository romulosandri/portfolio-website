import { mkdir, readdir, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public/images/projects',
)
const MAX_WIDTH = 2560
const QUALITY = 60
const EFFORT = 4
const CONCURRENCY = Math.max(2, Math.min(6, os.cpus().length - 1))

function toAvifPath(pngPath) {
  const dir = path.dirname(pngPath)
  const name = path.basename(pngPath, path.extname(pngPath))
  if (path.basename(dir).toLowerCase() === 'png') {
    return path.join(path.dirname(dir), 'avif', `${name}.avif`)
  }
  return path.join(dir, `${name}.avif`)
}

async function collectPngs(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectPngs(full)))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      files.push(full)
    }
  }
  return files
}

async function convertOne(src) {
  const dest = toAvifPath(src)
  await mkdir(path.dirname(dest), { recursive: true })
  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .avif({ quality: QUALITY, effort: EFFORT })
    .toFile(dest)
  const [inStat, outStat] = await Promise.all([stat(src), stat(dest)])
  return { src, dest, inBytes: inStat.size, outBytes: outStat.size }
}

async function runPool(items, limit, worker) {
  const results = []
  let index = 0
  async function next() {
    const i = index++
    if (i >= items.length) return
    results[i] = await worker(items[i], i)
    await next()
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next))
  return results
}

const pngs = await collectPngs(ROOT)
if (pngs.length === 0) {
  console.log('No PNGs found under public/images/projects')
  process.exit(0)
}

console.log(
  `Converting ${pngs.length} PNGs → AVIF (max width ${MAX_WIDTH}px, q${QUALITY}, concurrency ${CONCURRENCY})`,
)

const started = Date.now()
let done = 0
const results = await runPool(pngs, CONCURRENCY, async (src) => {
  const result = await convertOne(src)
  done += 1
  const pct = ((1 - result.outBytes / result.inBytes) * 100).toFixed(0)
  console.log(
    `[${done}/${pngs.length}] ${path.relative(ROOT, src)} → ${path.relative(ROOT, result.dest)} (${pct}% smaller)`,
  )
  return result
})

const inBytes = results.reduce((sum, item) => sum + item.inBytes, 0)
const outBytes = results.reduce((sum, item) => sum + item.outBytes, 0)
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

console.log(
  `\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s — ${mb(inBytes)} PNG → ${mb(outBytes)} AVIF (${((1 - outBytes / inBytes) * 100).toFixed(0)}% smaller)`,
)
