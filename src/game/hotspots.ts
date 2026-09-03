import { track } from '../lib/analytics'
import { cellCenter, parseCellName } from './grid'
import { PROMPT } from './constants'

export type GameHotspot = {
  id: string
  cell: string
  title: string
  href: string
}

export type ResolvedHotspot = GameHotspot & {
  x: number
  y: number
}

export const GAME_OPEN_PROJECT_EVENT = 'portfolio:game-open-project'

export const GAME_HOTSPOTS: GameHotspot[] = [
  {
    id: 'pacelane',
    cell: 'L-15',
    title: 'Pacelane.ai',
    href: '/work/pacelane',
  },
]

export const RESOLVED_HOTSPOTS: ResolvedHotspot[] = GAME_HOTSPOTS.map((hotspot) => {
  const { col, row } = parseCellName(hotspot.cell)
  const { x, y } = cellCenter(col, row)
  return { ...hotspot, x, y }
})

export function hotspotNear(
  x: number,
  y: number,
  radius = PROMPT.proximity,
): ResolvedHotspot | null {
  let nearest: ResolvedHotspot | null = null
  let nearestDist = radius
  for (const hotspot of RESOLVED_HOTSPOTS) {
    const dist = Math.hypot(hotspot.x - x, hotspot.y - y)
    if (dist < nearestDist) {
      nearest = hotspot
      nearestDist = dist
    }
  }
  return nearest
}

type HotspotListener = (hotspot: ResolvedHotspot | null) => void

let activeHotspot: ResolvedHotspot | null = null
const listeners = new Set<HotspotListener>()
let openingProject = false

export function getActiveHotspot() {
  return activeHotspot
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
