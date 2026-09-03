export const CELL_SIZE = 32
export const GRID_COLS = 38
export const GRID_ROWS = 42

export const WORLD_WIDTH = GRID_COLS * CELL_SIZE
export const WORLD_HEIGHT = GRID_ROWS * CELL_SIZE

export type CellKind = 'regular' | 'blocked' | 'scene-above'

const CELL_CHARS: Record<string, CellKind> = {
  '.': 'regular',
  x: 'blocked',
  a: 'scene-above',
}

/** 42 rows x 38 cols. "." regular, "x" blocked, "a" scene-above. */
export const GRID: readonly string[] = [
  '......aaaaa...........aaa...aaaa.xxx..',
  '..aaa.xxxxx...aaaaaa..xxx...aaaa..xx..',
  '..aaa.........aaaaaaa.......aaa.....aa',
  '..aaa.........aaaaaaa..aaaa..x.....aaa',
  '...xx...aaa....aaaaaa..aaaa........aaa',
  'xx...aa.aaaa...xxxx...aaaaaa........aa',
  'aa...aaaxxx....xxxx.xx.aaaaa.........x',
  'xxx.aaaa.....aaxxxxaa..aaaaa..........',
  'xxx.aaaa.aa..xxxxxxxa..xxxxx.aaa.aaa..',
  'xxa.axx..xx........xx...xx.x.xxx.aaaa.',
  'xxxaa..............xx............aaaa.',
  'xxx..........aa..................aaaa.',
  'xxx......aaaaaa.....aa.....aaa....x...',
  'xxx......aaaaaa.....xxaaa..xx...a....x',
  'xxx......aaaaaa........aaa.....aaa...x',
  'xxx....aaaxxxxx.......aaaa.....xxx....',
  'xxx....aaxxxxxxa......aaaaa.aa........',
  'xxxa....xxxxxxxa......aaaaa.aa.....aaa',
  'xxxa.................aaaaaaaxx.....xxx',
  'xxx..................aaaaaaa.....axxxx',
  'xxx.......aaaa.......aaaaaaa.....xxxxx',
  'xxx......aaaaaa......xxxxxxx..........',
  'xxx.....aaaaaaaa.....xxxxxxxx.......aa',
  'xxx.....axxxxxxa....xxxxxxxxx......aaa',
  'xxx....aaxxxxxxa..................aaaa',
  'xxx.....axxxxxxx................aaaaaa',
  'xxx..................aaaaa......aaaaaa',
  'xxx..................aaaaaa.....axxxxx',
  'xx......aaaaa........aaaaaaa.....x..xx',
  'xxx.....aaaaaaa......xxxxxx........x.a',
  'xxx.....aaaaaaa......xxxxxx..........a',
  'xx......xxxxxxx......................a',
  '.x......xxxxxxx..............aaaaa....',
  '.aa.....xxxxxxxx...........aaxxxxx...a',
  '.xx......................aaaxxx......a',
  '..........................xxxxx...aaax',
  '.aaaa.................aa....xx.....xxx',
  '.aaaa......aaaa....aaaaaaaa.......xxxx',
  '.aaaa......aaaaa...axxxxaaa.......xxxx',
  '..xxa......aaaaa...xx.xxxxa.......axxx',
  '..xxx......aaaaa.......xxxxaaaaaaaxxxx',
  '....xx.....xxxx.......xxxxxxxxxxxxxxxx',
]

export function cellKind(col: number, row: number): CellKind | null {
  if (col < 0 || row < 0 || col >= GRID_COLS || row >= GRID_ROWS) {
    return null
  }
  return CELL_CHARS[GRID[row][col]] ?? null
}

export function worldToCol(x: number): number {
  return Math.floor(x / CELL_SIZE)
}

export function worldToRow(y: number): number {
  return Math.floor(y / CELL_SIZE)
}

export function cellKindAt(x: number, y: number): CellKind | null {
  return cellKind(worldToCol(x), worldToRow(y))
}

export function isWalkable(col: number, row: number): boolean {
  const kind = cellKind(col, row)
  return kind === 'regular' || kind === 'scene-above'
}

export function forEachCell(
  fn: (col: number, row: number, kind: CellKind) => void,
): void {
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      fn(col, row, CELL_CHARS[GRID[row][col]])
    }
  }
}

/** Excel-style column name. 0 → A, 12 → M, 26 → AA. */
export function colName(col: number): string {
  let n = col + 1
  let name = ''
  while (n > 0) {
    const rem = (n - 1) % 26
    name = String.fromCharCode(65 + rem) + name
    n = Math.floor((n - 1) / 26)
  }
  return name
}

/** Cell label matching the Figma grid, e.g. M-21. */
export function cellName(col: number, row: number): string {
  return `${colName(col)}-${row + 1}`
}

/** Inverse of `colName`. A → 0, L → 11, AA → 26. */
export function parseColName(name: string): number {
  let n = 0
  for (let i = 0; i < name.length; i += 1) {
    const code = name.charCodeAt(i)
    if (code < 65 || code > 90) {
      throw new Error(`Invalid column name: ${name}`)
    }
    n = n * 26 + (code - 64)
  }
  return n - 1
}

/** Inverse of `cellName`. `L-15` → `{ col: 11, row: 14 }`. */
export function parseCellName(name: string): { col: number; row: number } {
  const match = name.match(/^([A-Z]+)-(\d+)$/)
  if (!match) {
    throw new Error(`Invalid cell name: ${name}`)
  }
  return { col: parseColName(match[1]), row: Number(match[2]) - 1 }
}

export function cellCenter(col: number, row: number) {
  return {
    x: col * CELL_SIZE + CELL_SIZE / 2,
    y: row * CELL_SIZE + CELL_SIZE / 2,
  }
}

export const SPAWN_COL = 17
export const SPAWN_ROW = 11

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}
