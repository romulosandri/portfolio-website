import Phaser from 'phaser'
import { PLAYER_SOURCE_HEIGHT } from '../constants'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../grid'

const ART = '/design-system/game'
const MAP_KEYS = ['grass', 'street', 'flowers', 'scene'] as const
const RUN_KEYS = [
  'player-run-1',
  'player-run-2',
  'player-run-3',
  'player-run-4',
] as const

function maxTextureSize(scene: Phaser.Scene) {
  const renderer = scene.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
  if (typeof renderer.getMaxTextureSize === 'function') {
    return renderer.getMaxTextureSize()
  }
  return 4096
}

function fitMapTexture(scene: Phaser.Scene, key: string, maxSize: number) {
  const source = scene.textures.get(key).getSourceImage() as HTMLImageElement
  if (source.width <= maxSize && source.height <= maxSize) {
    return
  }

  const scale = Math.max(
    1,
    Math.floor(Math.min(maxSize / WORLD_WIDTH, maxSize / WORLD_HEIGHT)),
  )
  const width = WORLD_WIDTH * scale
  const height = WORLD_HEIGHT * scale

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create a 2D canvas context')
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, width, height)

  scene.textures.remove(key)
  const texture = scene.textures.addCanvas(key, canvas)
  texture?.setFilter(Phaser.Textures.FilterMode.LINEAR)
}

function sourceImage(scene: Phaser.Scene, key: string) {
  return scene.textures.get(key).getSourceImage() as
    | HTMLImageElement
    | HTMLCanvasElement
}

function fitRunTextures(scene: Phaser.Scene) {
  const sources = RUN_KEYS.map((key) => sourceImage(scene, key))
  const maxAspect = Math.max(...sources.map((image) => image.width / image.height))
  const frameHeight = PLAYER_SOURCE_HEIGHT
  const frameWidth = Math.ceil(maxAspect * frameHeight)

  for (let i = 0; i < RUN_KEYS.length; i += 1) {
    const key = RUN_KEYS[i]
    const source = sources[i]
    const canvas = document.createElement('canvas')
    canvas.width = frameWidth
    canvas.height = frameHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not create a 2D canvas context')
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const scale = Math.min(frameWidth / source.width, frameHeight / source.height)
    const width = source.width * scale
    const height = source.height * scale
    const x = (frameWidth - width) / 2
    const y = frameHeight - height
    ctx.drawImage(source, x, y, width, height)

    scene.textures.remove(key)
    const texture = scene.textures.addCanvas(key, canvas)
    texture?.setFilter(Phaser.Textures.FilterMode.LINEAR)
  }
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    this.load.image('grass', `${ART}/scenario/grass.png`)
    this.load.image('street', `${ART}/scenario/street.png`)
    this.load.image('flowers', `${ART}/scenario/flowers.png`)
    this.load.image('scene', `${ART}/scenario/scene.png`)
    this.load.image('player', `${ART}/sprites/pluto/idle.png`)
    this.load.image('player-run-1', `${ART}/sprites/pluto/sprite-1.png`)
    this.load.image('player-run-2', `${ART}/sprites/pluto/sprite-2.png`)
    this.load.image('player-run-3', `${ART}/sprites/pluto/sprite-3.png`)
    this.load.image('player-run-4', `${ART}/sprites/pluto/sprite-4.png`)
  }

  create() {
    const maxSize = maxTextureSize(this)
    for (const key of MAP_KEYS) {
      fitMapTexture(this, key, maxSize)
    }
    this.textures.get('player').setFilter(Phaser.Textures.FilterMode.LINEAR)
    fitRunTextures(this)
    this.scene.start('WorldScene')
  }
}
