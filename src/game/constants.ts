import { CELL_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from './grid'

export const GAME_WIDTH = 1600
export const GAME_HEIGHT = 900

export { WORLD_HEIGHT, WORLD_WIDTH }

export const PLAYER_SPEED = 240
export const PLAYER_SOURCE_HEIGHT = 256
export const PLAYER_SCALE = (CELL_SIZE * 2) / PLAYER_SOURCE_HEIGHT
export const PLAYER_WALK_SCALE = PLAYER_SCALE / 1.5
export const PLAYER_WALK_FRAME_RATE = 10

export const DEPTH = {
  grass: 0,
  street: 1,
  flowers: 2,
  scene: 3,
  player: 4,
  sceneAbove: 5,
  playerFront: 6,
  debug: 20,
} as const
