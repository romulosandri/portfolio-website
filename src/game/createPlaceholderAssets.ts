import Phaser from 'phaser'

const FRAME = 32

const C = {
  outline: '#1a1410',
  skin: '#e8c4a8',
  hair: '#3a2418',
  shirt: '#d46a4c',
  pants: '#3d4a58',
  shoe: '#1a1410',
  grass: '#4e7a48',
  grassDark: '#3a5c36',
  dirt: '#6b4a32',
  dirtDark: '#4a3222',
  bark: '#5c3a24',
  leaf: '#3d6b3a',
  leafDark: '#2c4e2a',
}

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  w = 1,
  h = 1,
) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  ox: number,
  gait: number,
  bob: number,
) {
  const x = ox + 10
  const y = 6 + bob
  const leg = gait % 4
  const leftLeg = leg === 1 || leg === 2 ? 1 : 0
  const rightLeg = leg === 2 || leg === 3 ? 1 : 0
  const arm = leg === 1 || leg === 2 ? 1 : 0

  px(ctx, x + 3, y, C.hair, 6, 2)
  px(ctx, x + 2, y + 1, C.hair, 8, 3)
  px(ctx, x + 2, y + 3, C.skin, 8, 4)
  px(ctx, x + 4, y + 4, C.outline, 1, 1)
  px(ctx, x + 7, y + 4, C.outline, 1, 1)
  px(ctx, x + 3, y + 7, C.skin, 6, 1)

  px(ctx, x + 2, y + 8, C.shirt, 8, 6)
  px(ctx, x + 1, y + 9, C.shirt, 10, 4)
  px(ctx, x + arm, y + 9, C.skin, 2, 4)
  px(ctx, x + 10 - arm, y + 9, C.skin, 2, 4)

  px(ctx, x + 3, y + 14, C.pants, 6, 3)
  px(ctx, x + 3 - leftLeg, y + 16, C.pants, 2, 5)
  px(ctx, x + 7 + rightLeg, y + 16, C.pants, 2, 5)
  px(ctx, x + 3 - leftLeg, y + 21, C.shoe, 3, 2)
  px(ctx, x + 7 + rightLeg, y + 21, C.shoe, 3, 2)
}

function addSheet(
  scene: Phaser.Scene,
  key: string,
  canvas: HTMLCanvasElement,
  frameWidth: number,
  frameHeight: number,
) {
  scene.textures.addCanvas(key, canvas)
  scene.textures.addSpriteSheet('', scene.textures.get(key), {
    frameWidth,
    frameHeight,
  })
}

function createPlayerSheet(scene: Phaser.Scene) {
  const frames = 8
  const canvas = document.createElement('canvas')
  canvas.width = FRAME * frames
  canvas.height = FRAME
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.imageSmoothingEnabled = false

  for (let i = 0; i < frames; i += 1) {
    const isWalk = i >= 4
    const bob = !isWalk && i % 2 === 1 ? 1 : 0
    const gait = isWalk ? i - 3 : 0
    drawPlayer(ctx, i * FRAME, gait, bob)
  }

  addSheet(scene, 'player', canvas, FRAME, FRAME)
}

function createGround(scene: Phaser.Scene) {
  const canvas = document.createElement('canvas')
  canvas.width = FRAME
  canvas.height = FRAME
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = C.dirt
  ctx.fillRect(0, 8, FRAME, 24)
  ctx.fillStyle = C.dirtDark
  ctx.fillRect(0, 20, FRAME, 12)
  ctx.fillStyle = C.grass
  ctx.fillRect(0, 0, FRAME, 10)
  ctx.fillStyle = C.grassDark
  ctx.fillRect(0, 8, FRAME, 3)

  for (let i = 0; i < 8; i += 1) {
    px(ctx, i * 4 + 1, 1, C.grassDark, 1, 3)
  }

  scene.textures.addCanvas('ground', canvas)
}

function createTree(scene: Phaser.Scene) {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 48
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  px(ctx, 13, 24, C.bark, 6, 24)
  px(ctx, 6, 10, C.leafDark, 20, 16)
  px(ctx, 8, 4, C.leaf, 16, 18)
  px(ctx, 10, 2, C.leaf, 12, 8)

  scene.textures.addCanvas('tree', canvas)
}

export function createPlaceholderAssets(scene: Phaser.Scene) {
  createPlayerSheet(scene)
  createGround(scene)
  createTree(scene)
}
