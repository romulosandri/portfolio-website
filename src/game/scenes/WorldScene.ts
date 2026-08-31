import Phaser from 'phaser'
import { gsap } from '../../motion-system/gsap'
import {
  CAMERA_RUN_ZOOM,
  CAMERA_ZOOM,
  CAMERA_ZOOM_IN_DURATION,
  CAMERA_ZOOM_OUT_DURATION,
  DEPTH,
  PLAYER_SCALE,
  PLAYER_SPEED,
  PLAYER_WALK_FRAME_RATE,
  PLAYER_WALK_SCALE,
} from '../constants'
import {
  CELL_SIZE,
  GRID_COLS,
  GRID_ROWS,
  SPAWN_COL,
  SPAWN_ROW,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  cellKindAt,
  cellName,
  forEachCell,
  type CellKind,
} from '../grid'

const DEBUG_FILL: Record<CellKind, { color: number; alpha: number }> = {
  regular: { color: 0x000000, alpha: 0.12 },
  blocked: { color: 0xc43c4a, alpha: 0.42 },
  'scene-above': { color: 0x2ec9c0, alpha: 0.38 },
}

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>
  private blocked: Phaser.Physics.Arcade.StaticBody[] = []
  private debugGrid!: Phaser.GameObjects.Graphics
  private debugLabels!: Phaser.GameObjects.Image
  private debugFeet!: Phaser.GameObjects.Rectangle
  private debugVisible = true
  private walking = false
  private readonly cameraZoom = { value: CAMERA_ZOOM }
  private cameraZoomTween?: ReturnType<typeof gsap.to>

  constructor() {
    super('WorldScene')
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

    this.addLayer('grass', DEPTH.grass)
    this.addLayer('street', DEPTH.street)
    this.addLayer('flowers', DEPTH.flowers)
    this.addLayer('scene', DEPTH.scene)
    this.createSceneAboveLayer()

    this.createBlockedCells()
    this.createPlayer()
    this.createInput()
    this.createDebugGrid()

    this.physics.add.collider(this.player, this.blocked)

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setRoundPixels(false)
    this.cameras.main.setZoom(CAMERA_ZOOM)
    this.cameras.main.startFollow(this.player, true, 0.14, 0.14)
    this.cameras.main.setDeadzone(80, 60)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.killCameraZoomTween, this)
    this.events.once(Phaser.Scenes.Events.DESTROY, this.killCameraZoomTween, this)
  }

  update() {
    const left = this.cursors.left.isDown || this.wasd.A.isDown
    const right = this.cursors.right.isDown || this.wasd.D.isDown
    const up = this.cursors.up.isDown || this.wasd.W.isDown
    const down = this.cursors.down.isDown || this.wasd.S.isDown

    let vx = 0
    let vy = 0
    if (left) vx -= 1
    if (right) vx += 1
    if (up) vy -= 1
    if (down) vy += 1

    if (vx !== 0 || vy !== 0) {
      const length = Math.hypot(vx, vy)
      this.player.setVelocity(
        (vx / length) * PLAYER_SPEED,
        (vy / length) * PLAYER_SPEED,
      )
    } else {
      this.player.setVelocity(0, 0)
    }

    this.setPlayerMoving(vx !== 0 || vy !== 0)

    if (vx < 0) this.player.setFlipX(true)
    else if (vx > 0) this.player.setFlipX(false)

    this.updatePlayerDepth()
    this.updateDebugFeet()
  }

  private addLayer(key: string, depth: number) {
    return this.add
      .image(0, 0, key)
      .setOrigin(0, 0)
      .setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT)
      .setDepth(depth)
  }

  private createSceneAboveLayer() {
    const source = this.textures.get('scene').getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement
    const canvas = document.createElement('canvas')
    canvas.width = source.width
    canvas.height = source.height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not create a 2D canvas context')
    }

    const cellWidth = canvas.width / GRID_COLS
    const cellHeight = canvas.height / GRID_ROWS

    forEachCell((col, row, kind) => {
      if (kind !== 'scene-above') return
      ctx.drawImage(
        source,
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
      )
    })

    if (this.textures.exists('scene-above')) {
      this.textures.remove('scene-above')
    }
    this.textures.addCanvas('scene-above', canvas)
    this.addLayer('scene-above', DEPTH.sceneAbove)
  }

  private createBlockedCells() {
    this.blocked = []

    forEachCell((col, row, kind) => {
      if (kind !== 'blocked') return

      this.blocked.push(
        this.physics.add.staticBody(
          col * CELL_SIZE,
          row * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE,
        ),
      )
    })
  }

  private createPlayer() {
    const x = SPAWN_COL * CELL_SIZE + CELL_SIZE / 2
    const y = SPAWN_ROW * CELL_SIZE + CELL_SIZE

    this.createPlayerAnims()

    this.player = this.physics.add.sprite(x, y, 'player')
    this.player.setOrigin(0.5, 1)
    this.player.setScale(PLAYER_SCALE)
    this.player.setCollideWorldBounds(true)
    this.player.setDepth(DEPTH.player)
    this.syncPlayerFeetBody()
    this.updatePlayerDepth()
  }

  private createPlayerAnims() {
    if (this.anims.exists('walk')) return
    this.anims.create({
      key: 'walk',
      frames: [
        { key: 'player-run-1' },
        { key: 'player-run-2' },
        { key: 'player-run-3' },
        { key: 'player-run-4' },
      ],
      frameRate: PLAYER_WALK_FRAME_RATE,
      repeat: -1,
    })
  }

  private setPlayerMoving(moving: boolean) {
    if (moving) {
      if (this.walking) return
      this.walking = true
      this.player.play('walk')
      this.player.setScale(PLAYER_WALK_SCALE)
      this.syncPlayerFeetBody()
      this.tweenCameraZoom(CAMERA_RUN_ZOOM, CAMERA_ZOOM_IN_DURATION, 'sine.inOut')
      return
    }

    if (!this.walking) return
    this.walking = false
    this.player.stop()
    this.player.setTexture('player')
    this.player.setScale(PLAYER_SCALE)
    this.syncPlayerFeetBody()
    this.tweenCameraZoom(CAMERA_ZOOM, CAMERA_ZOOM_OUT_DURATION, 'power2.out')
  }

  private tweenCameraZoom(zoom: number, duration: number, ease: string) {
    this.cameraZoomTween?.kill()
    this.cameraZoomTween = gsap.to(this.cameraZoom, {
      value: zoom,
      duration,
      ease,
      overwrite: true,
      onUpdate: () => {
        this.cameras.main.setZoom(this.cameraZoom.value)
      },
    })
  }

  private killCameraZoomTween() {
    this.cameraZoomTween?.kill()
    this.cameraZoomTween = undefined
  }

  private syncPlayerFeetBody() {
    const scaleX = this.player.scaleX
    const scaleY = this.player.scaleY
    const displayWidth = this.player.displayWidth
    const displayHeight = this.player.displayHeight
    this.player.setBodySize(CELL_SIZE / scaleX, CELL_SIZE / scaleY, false)
    this.player.setOffset(
      (displayWidth / 2 - CELL_SIZE / 2) / scaleX,
      (displayHeight - CELL_SIZE) / scaleY,
    )
  }

  private updatePlayerDepth() {
    // Origin is the feet. Only the bottom 32px tile decides layering.
    const feetKind = cellKindAt(this.player.x, this.player.y - 1)
    this.player.setDepth(
      feetKind === 'scene-above' ? DEPTH.player : DEPTH.playerFront,
    )
  }

  private createInput() {
    const keyboard = this.input.keyboard
    if (!keyboard) {
      throw new Error('Keyboard plugin is not available')
    }

    this.cursors = keyboard.createCursorKeys()
    this.wasd = keyboard.addKeys('W,A,S,D') as typeof this.wasd

    keyboard.on('keydown-G', () => {
      this.debugVisible = !this.debugVisible
      this.debugGrid.setVisible(this.debugVisible)
      this.debugLabels.setVisible(this.debugVisible)
      this.debugFeet.setVisible(this.debugVisible)
    })
  }

  private createDebugGrid() {
    this.debugGrid = this.add.graphics().setDepth(DEPTH.debug)
    this.debugGrid.setVisible(this.debugVisible)

    this.debugFeet = this.add
      .rectangle(0, 0, CELL_SIZE, CELL_SIZE, 0xffe14d, 0.28)
      .setStrokeStyle(1, 0xffe14d, 0.95)
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.debug)
      .setVisible(this.debugVisible)

    forEachCell((col, row, kind) => {
      const { color, alpha } = DEBUG_FILL[kind]
      this.debugGrid.fillStyle(color, alpha)
      this.debugGrid.fillRect(
        col * CELL_SIZE,
        row * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
      )
      this.debugGrid.lineStyle(1, 0x000000, 0.35)
      this.debugGrid.strokeRect(
        col * CELL_SIZE,
        row * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
      )
    })

    this.debugLabels = this.createDebugLabels()
  }

  private createDebugLabels() {
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = WORLD_WIDTH * scale
    canvas.height = WORLD_HEIGHT * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not create a 2D canvas context')
    }

    ctx.scale(scale, scale)
    ctx.font = '7px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'

    forEachCell((col, row) => {
      const label = cellName(col, row)
      const x = col * CELL_SIZE + CELL_SIZE / 2
      const y = row * CELL_SIZE + CELL_SIZE / 2
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)'
      ctx.strokeText(label, x, y)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(label, x, y)
    })

    if (this.textures.exists('debug-labels')) {
      this.textures.remove('debug-labels')
    }
    this.textures.addCanvas('debug-labels', canvas)

    return this.add
      .image(0, 0, 'debug-labels')
      .setOrigin(0, 0)
      .setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT)
      .setDepth(DEPTH.debug)
      .setVisible(this.debugVisible)
  }

  private updateDebugFeet() {
    if (!this.debugVisible) return
    this.debugFeet.setPosition(this.player.x, this.player.y)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}
