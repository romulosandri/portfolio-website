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
  forEachCell,
} from '../grid'
import { hotspotNear, isProjectModalOpen, setActiveHotspot } from '../hotspots'
import { ProjectPrompt } from '../projectPrompt'
import { clearVirtualPad, getVirtualPad } from '../virtualPad'

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>
  private blocked: Phaser.Physics.Arcade.StaticBody[] = []
  private walking = false
  private prompt!: ProjectPrompt
  private shutDown = false
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
    this.prompt = new ProjectPrompt(this)
    this.createInput()

    this.physics.add.collider(this.player, this.blocked)

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setRoundPixels(false)
    this.cameras.main.setZoom(CAMERA_ZOOM)
    this.cameras.main.startFollow(this.player, true, 0.14, 0.14)
    this.cameras.main.setDeadzone(80, 60)
    this.fitCameraToGame()

    this.scale.on(Phaser.Scale.Events.RESIZE, this.fitCameraToGame, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this)
    this.events.once(Phaser.Scenes.Events.DESTROY, this.onShutdown, this)
  }

  private fitCameraToGame() {
    const { width, height } = this.scale.gameSize
    this.cameras.main.setSize(width, height)
  }

  private onShutdown() {
    if (this.shutDown) return
    this.shutDown = true
    this.scale.off(Phaser.Scale.Events.RESIZE, this.fitCameraToGame, this)
    this.killCameraZoomTween()
    this.prompt?.destroy()
    setActiveHotspot(null)
    clearVirtualPad()
  }

  update() {
    if (isProjectModalOpen()) {
      this.player.setVelocity(0, 0)
      this.setPlayerMoving(false)
      return
    }

    const pad = getVirtualPad()
    const left = this.cursors?.left.isDown || this.wasd?.A.isDown || pad.left
    const right = this.cursors?.right.isDown || this.wasd?.D.isDown || pad.right
    const up = this.cursors?.up.isDown || this.wasd?.W.isDown || pad.up
    const down = this.cursors?.down.isDown || this.wasd?.S.isDown || pad.down

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
    this.updateHotspot()
  }

  private updateHotspot() {
    const next = hotspotNear(this.player.x, this.player.y)
    setActiveHotspot(next)
    this.prompt.setHotspot(next)
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
    if (!keyboard) return

    this.cursors = keyboard.createCursorKeys()
    this.wasd = keyboard.addKeys('W,A,S,D') as typeof this.wasd

    keyboard.on('keydown-SPACE', (event: KeyboardEvent) => {
      if (isProjectModalOpen()) return
      event.preventDefault()
      this.prompt.tryOpen()
    })
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}
