import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

const RUN_FRAMES = [
  '/design-system/game/sprites/pluto/sprite-1.png',
  '/design-system/game/sprites/pluto/sprite-2.png',
  '/design-system/game/sprites/pluto/sprite-3.png',
  '/design-system/game/sprites/pluto/sprite-4.png',
] as const

const PLUTO_HEIGHT = 207
const PLUTO_WIDTH = 424
const FRAME_DURATION = 0.1
const RUN_PX_PER_SECOND = 520
const REPEAT_DELAY = 2.8
const REST_X = 37

/**
 * Scaled in CSS rather than in JS so the run animation stays correct: it reads
 * `pluto.offsetWidth` and `track.offsetWidth` at start, which report the scaled
 * pixel sizes, and a ResizeObserver already restarts the run on resize. The
 * owning footer sets --pluto-scale per breakpoint and uses it for its own bottom
 * padding, so the clearance under the sprite tracks the sprite.
 */
const scaled = (px: number) => `calc(${px}px * var(--pluto-scale, 1))`

export function FooterPluto() {
  const trackRef = useRef<HTMLDivElement>(null)
  const plutoRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      const pluto = plutoRef.current
      if (!track || !pluto) return

      const frames = Array.from(pluto.querySelectorAll<HTMLElement>('[data-pluto-frame]'))
      if (frames.length === 0) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(frames, { autoAlpha: 0 })
        gsap.set(frames[2] ?? frames[0], { autoAlpha: 1 })
        gsap.set(pluto, { x: REST_X, autoAlpha: 1 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(frames, { autoAlpha: 0 })
        gsap.set(frames[0], { autoAlpha: 1 })
        gsap.set(pluto, { x: -PLUTO_WIDTH, autoAlpha: 1 })

        const frameTl = gsap.timeline({ repeat: -1, paused: true })
        for (let i = 0; i < frames.length; i += 1) {
          const next = (i + 1) % frames.length
          const time = (i + 1) * FRAME_DURATION
          frameTl.set(frames[i], { autoAlpha: 0 }, time)
          frameTl.set(frames[next], { autoAlpha: 1 }, time)
        }

        let playing = false
        let runTween: gsap.core.Tween | undefined

        const startRun = () => {
          const startX = -pluto.offsetWidth
          const endX = track.offsetWidth
          runTween?.kill()
          gsap.set(pluto, { x: startX, autoAlpha: 1 })
          runTween = gsap.to(pluto, {
            x: endX,
            duration: Math.max((endX - startX) / RUN_PX_PER_SECOND, 0.5),
            ease: 'none',
            repeat: -1,
            repeatDelay: REPEAT_DELAY,
            paused: !playing,
          })
        }

        const setPlaying = (next: boolean) => {
          if (next === playing) return
          playing = next
          if (playing) {
            startRun()
            frameTl.play(0)
          } else {
            runTween?.pause()
            frameTl.pause()
          }
        }

        const trigger = ScrollTrigger.create({
          trigger: track,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => setPlaying(self.isActive),
        })
        setPlaying(trigger.isActive)

        let resizeTimer = 0
        const observer = new ResizeObserver(() => {
          window.clearTimeout(resizeTimer)
          resizeTimer = window.setTimeout(() => {
            if (playing) startRun()
          }, 120)
        })
        observer.observe(track)

        return () => {
          window.clearTimeout(resizeTimer)
          observer.disconnect()
          trigger.kill()
          runTween?.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: trackRef },
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden"
      data-prerender="strip"
      ref={trackRef}
      style={{ height: scaled(PLUTO_HEIGHT) }}
    >
      <div
        className="absolute bottom-0 left-0 will-change-transform"
        ref={plutoRef}
        style={{
          width: scaled(PLUTO_WIDTH),
          height: scaled(PLUTO_HEIGHT),
          transform: 'translateX(-100%)',
        }}
      >
        {RUN_FRAMES.map((src) => (
          <img
            alt=""
            className="absolute inset-0 block size-full object-contain object-bottom"
            data-pluto-frame=""
            decoding="async"
            draggable={false}
            height={PLUTO_HEIGHT}
            key={src}
            src={src}
            width={PLUTO_WIDTH}
          />
        ))}
      </div>
    </div>
  )
}
