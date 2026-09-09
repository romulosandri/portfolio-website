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

const STORAGE_KEY = 'jobs.kanban.columns'

const LEGACY_STATUS: Record<string, string> = {
  saved: 'selected',
  interviewing: 'interview',
  declined: 'rejected',
}

function asColumn(value: unknown): KanbanColumn | null {
  if (!value || typeof value !== 'object') return null
  const record = value as { id?: unknown; label?: unknown; visible?: unknown }
  const id = typeof record.id === 'string' ? record.id.trim() : ''
  const label = typeof record.label === 'string' ? record.label.trim() : ''
  if (!id || !label) return null
  return { id, label, visible: record.visible !== false }
}

function ensureVisible(columns: KanbanColumn[]) {
  if (columns.some((column) => column.visible)) return columns
  return columns.map((column, index) => (index === 0 ? { ...column, visible: true } : column))
}

export function parseColumns(value: unknown): KanbanColumn[] | null {
  if (!Array.isArray(value)) return null
  const columns = value.map(asColumn).filter((column): column is KanbanColumn => column !== null)
  return columns.length > 0 ? ensureVisible(columns) : null
}

export function columnsMatch(left: KanbanColumn[], right: KanbanColumn[]) {
  return (
    left.length === right.length &&
    left.every((column, index) => {
      const other = right[index]
      return (
        !!other &&
        column.id === other.id &&
        column.label === other.label &&
        column.visible === other.visible
      )
    })
  )
}

export function isDefaultColumns(columns: KanbanColumn[]) {
  return columnsMatch(columns, DEFAULT_COLUMNS)
}

export function takeStoredColumns(): KanbanColumn[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const columns = parseColumns(JSON.parse(raw) as unknown)
    localStorage.removeItem(STORAGE_KEY)
    return columns
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function visibleColumns(columns: KanbanColumn[]) {
  return columns.filter((column) => column.visible)
}

export function resolveColumnId(status: string | null | undefined, columns: KanbanColumn[]) {
  const raw = status?.trim()
  if (raw && columns.some((column) => column.id === raw)) return raw

  const mapped = raw ? LEGACY_STATUS[raw.toLowerCase()] : undefined
  if (mapped && columns.some((column) => column.id === mapped)) return mapped

  return visibleColumns(columns)[0]?.id ?? columns[0]?.id ?? 'selected'
}

export function columnIdFromLabel(label: string, existing: KanbanColumn[]) {
  const base =
    label
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'column'
  const used = new Set(existing.map((column) => column.id))
  if (!used.has(base)) return base
  let index = 2
  while (used.has(`${base}-${index}`)) index += 1
  return `${base}-${index}`
}

export function reorderColumns(columns: KanbanColumn[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= columns.length || to >= columns.length) {
    return columns
  }
  const next = [...columns]
  const [column] = next.splice(from, 1)
  if (!column) return columns
  next.splice(to, 0, column)
  return next
}
