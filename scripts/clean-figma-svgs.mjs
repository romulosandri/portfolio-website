import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public', 'design-system')

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(path)))
    else if (entry.name.endsWith('.svg')) files.push(path)
  }
  return files
}

function clean(svg) {
  return svg
    .replace(/<rect width="[^"]+" height="[^"]+" fill="#C8C8C8"\s*\/>\r?\n?/g, '')
    .replace(/<rect [^>]*stroke="#8A38F5"[^>]*\/?>\r?\n?/g, '')
}

const files = await walk(root)
let changed = 0
for (const file of files) {
  const original = await readFile(file, 'utf8')
  const next = clean(original)
  if (next !== original) {
    await writeFile(file, next)
    changed += 1
  }
}
console.log(`cleaned ${changed} of ${files.length} svgs`)
