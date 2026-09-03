import { track } from '../lib/analytics'
import { cellCenter, parseCellName, worldToCol, worldToRow } from './grid'
import { PROMPT } from './constants'

export type GameHotspot = {
  id: string
  cell: string
  title: string
  href: string
}

export type ResolvedHotspot = GameHotspot & {
  col: number
  row: number
  x: number
  y: number
}

export const GAME_OPEN_PROJECT_EVENT = 'portfolio:game-open-project'
export const GAME_PROJECT_CLOSED_EVENT = 'portfolio:game-project-closed'

export const GAME_HOTSPOTS: GameHotspot[] = [
  {
    id: 'pacelane',
    cell: 'L-15',
    title: 'Pacelane.ai',
    href: '/work/pacelane',
  },
  {
    id: 'meltwater',
    cell: 'Y-20',
    title: 'Meltwater',
    href: '/work/meltwater',
  },
  {
    id: 'gemhaus',
    cell: 'Y-29',
    title: 'Gemhaus',
    href: '/work/gemhaus',
  },
  {
    id: 'stream-stakes',
    cell: 'K-32',
    title: 'Stream Stakes',
    href: '/work/stream-stakes',
  },
  {
    id: 'cinepolis',
    cell: 'M-24',
    title: 'Cinepolis',
    href: '/work/cinepolis',
  },
  {
    id: 'spiiine',
    cell: 'AC-18',
    title: 'Spiiine',
    href: '/projects/spiiine',
  },
  {
    id: 'fotospin',
    cell: 'AG-15',
    title: 'Fotospin.ai',
    href: '/projects/fotospin',
  },
  {
    id: 'bunnyhop',
    cell: 'AE-9',
    title: 'Bunnyhop',
    href: '/projects/bunnyhop',
  },
  {
    id: 'ai-workshops',
    cell: 'V-14',
    title: 'AI Workshops',
    href: '/projects/ai-workshops',
  },
]

export const RESOLVED_HOTSPOTS: ResolvedHotspot[] = GAME_HOTSPOTS.map((hotspot) => {
  const { col, row } = parseCellName(hotspot.cell)
  const { x, y } = cellCenter(col, row)
  return { ...hotspot, col, row, x, y }
})

/**
 * `x, y` are the character's feet. The prompt appears when the standing
 * square is within `reach` cells of a hotspot (Chebyshev, so diagonals count).
 */
export function hotspotNear(
  x: number,
  y: number,
  reach = PROMPT.proximity,
): ResolvedHotspot | null {
  const col = worldToCol(x)
  const row = worldToRow(y - 1)
  let nearest: ResolvedHotspot | null = null
  let nearestDist: number = reach
  for (const hotspot of RESOLVED_HOTSPOTS) {
    const dist = Math.max(Math.abs(hotspot.col - col), Math.abs(hotspot.row - row))
    if (dist <= nearestDist) {
      nearest = hotspot
      nearestDist = dist
    }
  }
  return nearest
}

type HotspotListener = (hotspot: ResolvedHotspot | null) => void

let activeHotspot: ResolvedHotspot | null = null
const listeners = new Set<HotspotListener>()
const projectModalListeners = new Set<(open: boolean) => void>()
let openingProject = false
let projectModalOpen = false

export function getActiveHotspot() {
  return activeHotspot
}

export function isProjectModalOpen() {
  return projectModalOpen
}

export function setProjectModalOpen(open: boolean) {
  if (projectModalOpen === open) {
    if (!open) openingProject = false
    return
  }
  projectModalOpen = open
  if (!open) {
    openingProject = false
    window.dispatchEvent(new Event(GAME_PROJECT_CLOSED_EVENT))
  }
  projectModalListeners.forEach((fn) => fn(projectModalOpen))
}

export function subscribeProjectModal(fn: (open: boolean) => void) {
  projectModalListeners.add(fn)
  fn(projectModalOpen)
  return () => {
    projectModalListeners.delete(fn)
  }
}

export function setActiveHotspot(next: ResolvedHotspot | null) {
  if (activeHotspot?.id === next?.id) return
  activeHotspot = next
  if (!next) openingProject = false
  listeners.forEach((fn) => fn(activeHotspot))
}

export function subscribeActiveHotspot(fn: HotspotListener) {
  listeners.add(fn)
  fn(activeHotspot)
  return () => {
    listeners.delete(fn)
  }
}

export function requestOpenProject(hotspot: GameHotspot) {
  if (openingProject) return
  openingProject = true
  track('game_hotspot_opened', {
    id: hotspot.id,
    href: hotspot.href,
    title: hotspot.title,
    cell: hotspot.cell,
  })
  window.dispatchEvent(
    new CustomEvent(GAME_OPEN_PROJECT_EVENT, { detail: { href: hotspot.href } }),
  )
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}
