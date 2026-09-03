import { CELL_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from './grid'

export const GAME_WIDTH = 1600
export const GAME_HEIGHT = 900

export { WORLD_HEIGHT, WORLD_WIDTH }

export const PLAYER_SPEED = 240
export const PLAYER_SOURCE_HEIGHT = 256
export const PLAYER_SCALE = (CELL_SIZE * 2) / PLAYER_SOURCE_HEIGHT
export const PLAYER_WALK_SCALE = PLAYER_SCALE / 1.5
export const PLAYER_WALK_FRAME_RATE = 10

export const CAMERA_ZOOM = 2
export const CAMERA_RUN_ZOOM = 2.3
export const CAMERA_ZOOM_IN_DURATION = 3.2
export const CAMERA_ZOOM_OUT_DURATION = 1.85

export const DEPTH = {
  grass: 0,
  street: 1,
  flowers: 2,
  scene: 3,
  player: 4,
  sceneAbove: 5,
  playerFront: 6,
  prompt: 12,
} as const

export const PROMPT = {
  /** Chebyshev reach in cells. 6 means any square within 6 of the hotspot. */
  proximity: 6,
  cream: 0xfbfbf8,
  ink: 0x0e0907,
  /** Ground marker. Flattened into an ellipse to sit in the scene's perspective. */
  poolWidth: 64,
  poolHeight: 28,
  poolY: 10,
  rippleCount: 3,
  ripplePeriod: 2.6,
  sparkCount: 7,
  sparkRise: 36,
  sparkSpread: 22,
  sparkPeriod: 2.4,
  cardY: -48,
  cardPaddingX: 9,
  cardPaddingY: 7,
  cardGap: 4,
  cardRadius: 6,
  cardBob: 2,
  keyWidth: 42,
  keyPressPeriod: 2.4,
} as const
