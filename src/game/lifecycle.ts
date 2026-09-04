export const GAME_LOAD_EVENT = 'portfolio:game-load'

export type GameLoadDetail = {
  progress: number
  ready?: boolean
  failed?: boolean
}

export function reportGameLoad(detail: GameLoadDetail) {
  window.dispatchEvent(new CustomEvent<GameLoadDetail>(GAME_LOAD_EVENT, { detail }))
}

export function subscribeGameLoad(fn: (detail: GameLoadDetail) => void) {
  const handler = (event: Event) => {
    fn((event as CustomEvent<GameLoadDetail>).detail)
  }
  window.addEventListener(GAME_LOAD_EVENT, handler)
  return () => window.removeEventListener(GAME_LOAD_EVENT, handler)
}
