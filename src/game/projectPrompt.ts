import Phaser from 'phaser'
import { gsap } from '../motion-system/gsap'
import { DEPTH, PROMPT } from './constants'
import { requestOpenProject, type ResolvedHotspot } from './hotspots'

const SPACE_KEY_TEXTURE = 'prompt-space-key'
const KEY_SOURCE_WIDTH = 76
const KEY_SOURCE_HEIGHT = 34

type Spark = {
  dot: Phaser.GameObjects.Ellipse
  /** Position in the rise cycle at t=0, so the embers never leave in lockstep. */
  phase: number
  drift: number
  x: number
}

/**
 * The "you can enter this" marker: a lit patch of ground with sonar ripples and
 * rising embers, tethered to a floating label that names the project.
 *
 * Everything animates off one clock tween instead of a tween per element, which
 * keeps the per-frame work to plain arithmetic while the scene is running.
 */
export class ProjectPrompt {
  private readonly root: Phaser.GameObjects.Container
  private readonly pool: Phaser.GameObjects.Ellipse
  private readonly ripples: Phaser.GameObjects.Ellipse[] = []
  private readonly sparks: Spark[] = []
  private readonly tether: Phaser.GameObjects.Graphics
  private readonly card: Phaser.GameObjects.Container
  private readonly cardHit: Phaser.GameObjects.Rectangle
  private readonly plate: Phaser.GameObjects.Graphics
  private readonly title: Phaser.GameObjects.Text
  private readonly spaceKey: Phaser.GameObjects.Image
  private readonly reducedMotion: boolean
  private readonly clock = { t: 0 }
  private keyBaseY = 0
  private hotspot: ResolvedHotspot | null = null
  private shown = false
  private opening = false
  private destroyed = false
  private clockTween?: gsap.core.Tween
  private appearTween?: gsap.core.Tween

  constructor(scene: Phaser.Scene) {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ensureSpaceKeyTexture(scene)

    this.pool = scene.add
      .ellipse(0, PROMPT.poolY, PROMPT.poolWidth, PROMPT.poolHeight, PROMPT.cream, 0.22)
      .setStrokeStyle(1, PROMPT.cream, 0.5)

    for (let i = 0; i < PROMPT.rippleCount; i += 1) {
      this.ripples.push(
        scene.add
          .ellipse(0, PROMPT.poolY, PROMPT.poolWidth, PROMPT.poolHeight, PROMPT.cream, 0)
          .setStrokeStyle(1.25, PROMPT.cream, 0.9),
      )
    }

    for (let i = 0; i < PROMPT.sparkCount; i += 1) {
      const x = (i / (PROMPT.sparkCount - 1) - 0.5) * PROMPT.sparkSpread * 2
      this.sparks.push({
        dot: scene.add.ellipse(x, PROMPT.poolY, 2.6, 2.6, PROMPT.cream, 1),
        phase: (i * 0.37) % 1,
        drift: i * 1.7,
        x,
      })
    }

    this.tether = scene.add.graphics()

    this.plate = scene.add.graphics()
    this.title = scene.add
      .text(0, 0, '', {
        fontFamily: '"Saans", ui-sans-serif, system-ui, sans-serif',
        fontSize: '11px',
        color: '#fbfbf8',
        align: 'center',
      })
      .setOrigin(0.5)
      .setResolution(3)
    this.spaceKey = scene.add
      .image(0, 0, SPACE_KEY_TEXTURE)
      .setOrigin(0.5)
      .setDisplaySize(
        PROMPT.keyWidth,
        (PROMPT.keyWidth * KEY_SOURCE_HEIGHT) / KEY_SOURCE_WIDTH,
      )

    // Phaser normalizes hit tests by displayOrigin, which Containers don't
    // define, so the card takes its clicks through an invisible Shape.
    this.cardHit = scene.add.rectangle(0, 0, 10, 10, PROMPT.cream, 0)

    this.card = scene.add.container(0, PROMPT.cardY, [
      this.cardHit,
      this.plate,
      this.title,
      this.spaceKey,
    ])

    this.root = scene.add.container(0, 0, [
      this.pool,
      ...this.ripples,
      ...this.sparks.map((spark) => spark.dot),
      this.tether,
      this.card,
    ])
    this.root.setDepth(DEPTH.prompt)
    this.root.setAlpha(0)
    this.root.setVisible(false)

    for (const target of [this.pool, this.cardHit]) {
      target.on('pointerdown', () => this.tryOpen())
    }
    // Hit areas are tested in origin-normalized space, so they run 0..size.
    this.pool.setInteractive(
      new Phaser.Geom.Ellipse(
        PROMPT.poolWidth / 2,
        PROMPT.poolHeight / 2,
        PROMPT.poolWidth,
        PROMPT.poolHeight,
      ),
      Phaser.Geom.Ellipse.Contains,
    )
    if (this.pool.input) this.pool.input.cursor = 'pointer'

    if (this.reducedMotion) {
      this.ripples.forEach((ripple) => ripple.setVisible(false))
      this.sparks.forEach((spark) => spark.dot.setVisible(false))
    } else {
      this.clockTween = gsap.to(this.clock, {
        t: 600,
        duration: 600,
        ease: 'none',
        repeat: -1,
        onUpdate: () => this.tick(),
      })
    }
  }

  setHotspot(next: ResolvedHotspot | null) {
    if (this.hotspot?.id === next?.id) return
    this.hotspot = next
    if (!next) {
      this.hide()
      return
    }
    this.layoutCard(next.title)
    this.root.setPosition(next.x, next.y)
    this.show()
  }

  tryOpen() {
    if (!this.hotspot || !this.shown || this.opening) return false
    this.opening = true
    requestOpenProject(this.hotspot)
    return true
  }

  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    this.appearTween?.kill()
    this.clockTween?.kill()
    this.root.destroy(true)
  }

  /**
   * Sizes the plate around the title and key, then redraws the plate, its
   * pointer, and the tether down to the ground marker.
   */
  private layoutCard(title: string) {
    this.title.setText(title)

    const keyHeight = this.spaceKey.displayHeight
    const width = Math.max(this.title.width, PROMPT.keyWidth) + PROMPT.cardPaddingX * 2
    const height =
      PROMPT.cardPaddingY * 2 + this.title.height + PROMPT.cardGap + keyHeight
    const left = -width / 2
    const top = -height / 2
    const bottom = height / 2
    const point = bottom + 6

    this.title.setPosition(0, top + PROMPT.cardPaddingY + this.title.height / 2)
    this.keyBaseY = bottom - PROMPT.cardPaddingY - keyHeight / 2
    this.spaceKey.setPosition(0, this.keyBaseY)

    this.plate.clear()
    this.plate.fillStyle(PROMPT.ink, 0.35)
    this.plate.fillRoundedRect(left, top + 2.5, width, height, PROMPT.cardRadius)
    this.plate.fillStyle(PROMPT.ink, 0.92)
    this.plate.fillRoundedRect(left, top, width, height, PROMPT.cardRadius)
    this.plate.fillTriangle(-5, bottom - 1, 5, bottom - 1, 0, point)
    this.plate.lineStyle(1, PROMPT.cream, 0.9)
    this.plate.strokeRoundedRect(left, top, width, height, PROMPT.cardRadius)
    this.plate.lineBetween(-5, bottom, 0, point)
    this.plate.lineBetween(5, bottom, 0, point)
    // Erases the plate outline the pointer grows out of.
    this.plate.lineStyle(1.6, PROMPT.ink, 0.92)
    this.plate.lineBetween(-4.2, bottom, 4.2, bottom)

    this.cardHit.setSize(width, height)
    this.cardHit.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains,
    )
    if (this.cardHit.input) this.cardHit.input.cursor = 'pointer'

    this.tether.clear()
    this.tether.lineStyle(1, PROMPT.cream, 0.32)
    // Starts a bob's worth above the pointer so the card never floats off it.
    this.tether.lineBetween(
      0,
      PROMPT.cardY + point - PROMPT.cardBob,
      0,
      PROMPT.poolY - PROMPT.poolHeight / 2,
    )
  }

  private show() {
    this.shown = true
    this.opening = false
    this.root.setVisible(true)
    this.setInputEnabled(true)
    this.appearTween?.kill()

    if (this.reducedMotion) {
      this.root.setAlpha(1)
      this.card.setScale(1)
      this.pool.setScale(1)
      return
    }

    this.card.setScale(0.72)
    this.pool.setScale(0.4)
    this.appearTween = gsap.to(this.root, {
      alpha: 1,
      duration: 0.26,
      ease: 'power2.out',
      overwrite: true,
    })
    gsap.to(this.card, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.5,
      ease: 'back.out(2.2)',
      overwrite: true,
    })
    gsap.to(this.pool, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.42,
      ease: 'power3.out',
      overwrite: true,
    })
  }

  private hide() {
    this.shown = false
    this.setInputEnabled(false)
    this.appearTween?.kill()

    if (this.reducedMotion || this.root.alpha === 0) {
      this.root.setAlpha(0)
      this.root.setVisible(false)
      return
    }

    gsap.to(this.card, { scaleX: 0.8, scaleY: 0.8, duration: 0.18, ease: 'power2.in' })
    this.appearTween = gsap.to(this.root, {
      alpha: 0,
      duration: 0.18,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        if (!this.shown) this.root.setVisible(false)
      },
    })
  }

  private setInputEnabled(enabled: boolean) {
    if (this.pool.input) this.pool.input.enabled = enabled
    if (this.cardHit.input) this.cardHit.input.enabled = enabled
  }

  private tick() {
    if (this.destroyed) return
    const t = this.clock.t

    this.pool.setAlpha(0.82 + Math.sin(t * 1.9) * 0.18)

    for (let i = 0; i < this.ripples.length; i += 1) {
      const progress = (t / PROMPT.ripplePeriod + i / this.ripples.length) % 1
      this.ripples[i].setScale(0.45 + progress * 1.15)
      this.ripples[i].setAlpha((1 - progress) ** 1.6 * 0.8)
    }

    for (const spark of this.sparks) {
      const progress = (t / PROMPT.sparkPeriod + spark.phase) % 1
      spark.dot.setPosition(
        spark.x + Math.sin(progress * Math.PI * 2 + spark.drift) * 3,
        PROMPT.poolY - progress * PROMPT.sparkRise,
      )
      spark.dot.setAlpha(Math.sin(progress * Math.PI) * 0.85)
      spark.dot.setScale(0.55 + (1 - progress) * 0.7)
    }

    this.card.y = PROMPT.cardY + Math.sin(t * 1.5) * PROMPT.cardBob
    this.spaceKey.y = this.keyBaseY + keyPress(t) * 1.8
  }
}

/** 0 to 1 to 0: a quick press and release once per cycle, idle in between. */
function keyPress(t: number) {
  const cycle = t % PROMPT.keyPressPeriod
  if (cycle < 0.16) return cycle / 0.16
  if (cycle < 0.42) return 1 - (cycle - 0.16) / 0.26
  return 0
}

function ensureSpaceKeyTexture(scene: Phaser.Scene) {
  if (scene.textures.exists(SPACE_KEY_TEXTURE)) return

  const scale = 3
  const canvas = document.createElement('canvas')
  canvas.width = KEY_SOURCE_WIDTH * scale
  canvas.height = KEY_SOURCE_HEIGHT * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create a 2D canvas context')
  }
  ctx.scale(scale, scale)

  ctx.fillStyle = 'rgba(14, 9, 7, 0.4)'
  ctx.beginPath()
  ctx.ellipse(38, 31.6, 28, 1.7, 0, 0, Math.PI * 2)
  ctx.fill()

  roundRect(ctx, 2, 9, 72, 21, 7, '#807164')
  roundRect(ctx, 2, 22, 72, 8, 7, '#5d5548')
  roundRect(ctx, 2, 2, 72, 22, 7, '#fbfbf8')

  ctx.strokeStyle = '#2c2321'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  roundedPath(ctx, 2, 2, 72, 22, 7)
  ctx.stroke()

  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1.25
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(16, 5.4)
  ctx.lineTo(60, 5.4)
  ctx.stroke()

  ctx.font = '500 11px Saans, ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = '#1f1814'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('space', 38, 14.5)

  scene.textures.addCanvas(SPACE_KEY_TEXTURE, canvas)
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
) {
  ctx.fillStyle = fill
  ctx.beginPath()
  roundedPath(ctx, x, y, w, h, r)
  ctx.fill()
}

function roundedPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}
