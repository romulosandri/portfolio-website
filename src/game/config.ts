import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { WorldScene } from './scenes/WorldScene'

export { GAME_HEIGHT, GAME_WIDTH, WORLD_WIDTH } from './constants'

export function createGameConfig(
  parent: HTMLElement,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: '100%',
    height: '100%',
    backgroundColor: '#0c1a12',
    pixelArt: false,
    banner: false,
    roundPixels: false,
    scale: {
      mode: Phaser.Scale.RESIZE,
      expandParent: false,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, WorldScene],
    audio: {
      noAudio: true,
    },
  }
}

export function createGame(parent: HTMLElement) {
  return new Phaser.Game(createGameConfig(parent))
}
