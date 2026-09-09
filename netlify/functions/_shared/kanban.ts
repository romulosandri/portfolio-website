import type { Client } from '@libsql/client/web'

export type KanbanColumn = {
  id: string
  label: string
  visible: boolean
}

export const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: 'selected', label: 'Saved', visible: true },
  { id: 'applied', label: 'Applied', visible: true },
  { id: 'interview', label: 'Interview', visible: true },
  { id: 'offer', label: 'Offer', visible: true },
  { id: 'rejected', label: 'Rejected', visible: true },
]

const MAX_COLUMNS = 30
const MAX_LABEL = 80

function asColumnId(value: unknown) {
  if (typeof value !== 'string') return null
  const id = value.trim().toLowerCase()
  if (!id || id.length > 64) return null
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(id)) return null
  return id
}

function asLabel(value: unknown) {
  if (typeof value !== 'string') return null
  const label = value.trim()
  if (!label || label.length > MAX_LABEL) return null
  return label
}

export function parseColumns(value: unknown): KanbanColumn[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_COLUMNS) return null

  const columns: KanbanColumn[] = []
  const ids = new Set<string>()
  const labels = new Set<string>()

  for (const item of value) {
    if (!item || typeof item !== 'object') return null
    const record = item as { id?: unknown; label?: unknown; visible?: unknown }
    const id = asColumnId(record.id)
    const label = asLabel(record.label)
    if (!id || !label) return null
    if (ids.has(id) || labels.has(label.toLowerCase())) return null
    ids.add(id)
    labels.add(label.toLowerCase())
    columns.push({ id, label, visible: record.visible !== false })
  }

  if (!columns.some((column) => column.visible)) return null
  return columns
}

function fromRow(row: unknown): KanbanColumn | null {
  if (!row || typeof row !== 'object') return null
  const record = row as { id?: unknown; label?: unknown; visible?: unknown }
  const id = asColumnId(record.id)
  const label = asLabel(record.label)
  if (!id || !label) return null
  return { id, label, visible: record.visible !== 0 && record.visible !== false }
}

export async function ensureKanbanColumns(db: Client) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS kanban_columns (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      position INTEGER NOT NULL
    )
  `)

  const existing = await db.execute('SELECT id FROM kanban_columns LIMIT 1')
  if (existing.rows.length > 0) return

  await db.batch(
    DEFAULT_COLUMNS.map((column, position) => ({
      sql: 'INSERT OR IGNORE INTO kanban_columns (id, label, visible, position) VALUES (?, ?, ?, ?)',
      args: [column.id, column.label, column.visible ? 1 : 0, position],
    })),
    'write',
  )
}

export async function listKanbanColumns(db: Client) {
  await ensureKanbanColumns(db)
  const result = await db.execute(
    'SELECT id, label, visible, position FROM kanban_columns ORDER BY position ASC, label ASC',
  )
  const columns = result.rows
    .map((row) => fromRow(row))
    .filter((column): column is KanbanColumn => column !== null)
  return columns.length > 0 ? columns : DEFAULT_COLUMNS
}

export async function replaceKanbanColumns(db: Client, columns: KanbanColumn[]) {
  await ensureKanbanColumns(db)
  await db.batch(
    [
      { sql: 'DELETE FROM kanban_columns', args: [] },
      ...columns.map((column, position) => ({
        sql: 'INSERT INTO kanban_columns (id, label, visible, position) VALUES (?, ?, ?, ?)',
        args: [column.id, column.label, column.visible ? 1 : 0, position],
      })),
    ],
    'write',
  )
  return columns
}

export function firstVisibleColumnId(columns: KanbanColumn[]) {
  return columns.find((column) => column.visible)?.id ?? columns[0]?.id ?? 'selected'
}
