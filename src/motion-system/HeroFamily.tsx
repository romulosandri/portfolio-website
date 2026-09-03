import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

type FamilyMember = {
  id: string
  height: number
  width: number
  frames: readonly string[]
}

const MEMBERS: FamilyMember[] = [
  {
    id: 'pluto',
    width: 253,
    height: 128,
    frames: [
      '/images/hero-family/pluto-1.png',
      '/images/hero-family/pluto-2.png',
      '/images/hero-family/pluto-3.png',
      '/images/hero-family/pluto-4.png',
    ],
  },
  {
    id: 'naomi',
    width: 199,
    height: 114,
    frames: [
      '/images/hero-family/naomi-1.png',
      '/images/hero-family/naomi-2.png',
      '/images/hero-family/naomi-3.png',
      '/images/hero-family/naomi-4.png',
    ],
  },
  {
    id: 'tulipa',
    width: 109,
    height: 84,
    frames: [
      '/images/hero-family/tulipa-1.png',
      '/images/hero-family/tulipa-2.png',
      '/images/hero-family/tulipa-3.png',
      '/images/hero-family/tulipa-4.png',
      '/images/hero-family/tulipa-5.png',
    ],
  },
  {
    id: 'diogo',
    width: 118,
    height: 62,
    frames: [
      '/images/hero-family/diogo-1.png',
      '/images/hero-family/diogo-2.png',
      '/images/hero-family/diogo-3.png',
      '/images/hero-family/diogo-4.png',
      '/images/hero-family/diogo-5.png',
      '/images/hero-family/diogo-6.png',
      '/images/hero-family/diogo-7.png',
    ],
  },
  {
    id: 'luara',
    width: 192,
    height: 220,
    frames: [
      '/images/hero-family/luara-1.png',
      '/images/hero-family/luara-2.png',
      '/images/hero-family/luara-3.png',
      '/images/hero-family/luara-4.png',
      '/images/hero-family/luara-5.png',
      '/images/hero-family/luara-6.png',
      '/images/hero-family/luara-7.png',
      '/images/hero-family/luara-8.png',
    ],
  },
]

const PACK_GAP = 110
const BASE_HEIGHT = Math.max(...MEMBERS.map((member) => member.height))

/**
 * The pack is scaled in CSS, not by precomputing pixel sizes, so it can shrink
 * on narrow screens without the run animation drifting: `startRun` reads
 * `pack.offsetWidth` and `track.offsetWidth` at the moment it starts, and those
 * report the scaled values. Crossing a breakpoint always changes the track
 * width too, so the existing ResizeObserver restarts the run.
 *
 * `--family-scale-w` is the original stepped width scale (1.2 on desktop).
 * `--hero-scale` (from `.hero-stage`) also shrinks the pack on short
 * viewports, taking whichever is smaller so notebooks don't keep the 1080px
 * composition inside a 768px `svh`.
 */
const SCALE_CLASSES =
  '[--family-scale-w:0.6] xs:[--family-scale-w:0.8] md:[--family-scale-w:1] lg:[--family-scale-w:1.2]'
const scaled = (px: number) =>
  `calc(${px}px * min(var(--family-scale-w, 1.2), calc(1.2 * var(--hero-scale, 1))))`

const FRAME_DURATION = 0.1
const RUN_PX_PER_SECOND = 520
const RUN_PX_PER_SECOND_MOBILE = 240
const FRAME_TIME_SCALE_MOBILE = 0.6
const MOBILE_MQ = '(max-width: 767.98px)'
const REPEAT_DELAY = 2.8

function isMobileHero() {
  return window.matchMedia(MOBILE_MQ).matches
}

function frameTimeline(frames: HTMLElement[]) {
  const tl = gsap.timeline({ repeat: -1, paused: true })
  for (let i = 0; i < frames.length; i += 1) {
    const next = (i + 1) % frames.length
    const time = (i + 1) * FRAME_DURATION
    tl.set(frames[i], { autoAlpha: 0 }, time)
    tl.set(frames[next], { autoAlpha: 1 }, time)
  }
  return tl
}

export function HeroFamily() {
  const trackRef = useRef<HTMLDivElement>(null)
  const packRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      const pack = packRef.current
      if (!track || !pack) return

      const members = Array.from(pack.querySelectorAll<HTMLElement>('[data-family-member]'))
      if (members.length === 0) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // The pack is a crossing, not a posed illustration. If it cannot run,
        // park it off-screen and hidden rather than frozen mid-hero.
        gsap.set(pack, { x: -pack.offsetWidth, autoAlpha: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const frameTimelines = members.map((member, index) => {
          const frames = Array.from(member.querySelectorAll<HTMLElement>('[data-family-frame]'))
          gsap.set(frames, { autoAlpha: 0 })
          gsap.set(frames[0], { autoAlpha: 1 })
          const tl = frameTimeline(frames)
          tl.time(index * FRAME_DURATION * 1.4)
          return tl
        })

        gsap.set(pack, { x: -pack.offsetWidth, autoAlpha: 1 })

        let playing = false
        let runTween: gsap.core.Tween | undefined

        const startRun = () => {
          const startX = -pack.offsetWidth
          const endX = track.offsetWidth
          const mobile = isMobileHero()
          const speed = mobile ? RUN_PX_PER_SECOND_MOBILE : RUN_PX_PER_SECOND
          const frameScale = mobile ? FRAME_TIME_SCALE_MOBILE : 1
          runTween?.kill()
          gsap.set(pack, { x: startX, autoAlpha: 1 })
          runTween = gsap.to(pack, {
            x: endX,
            duration: Math.max((endX - startX) / speed, 0.5),
            ease: 'none',
            repeat: -1,
            repeatDelay: REPEAT_DELAY,
            paused: !playing,
          })
          for (const tl of frameTimelines) tl.timeScale(frameScale)
        }

        const setPlaying = (next: boolean) => {
          if (next === playing) return
          playing = next
          if (playing) {
            startRun()
            for (const tl of frameTimelines) tl.play()
          } else {
            runTween?.pause()
            for (const tl of frameTimelines) tl.pause()
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
      className={`pointer-events-none absolute inset-x-0 bottom-full overflow-hidden ${SCALE_CLASSES}`}
      data-prerender="strip"
      ref={trackRef}
      style={{ height: scaled(BASE_HEIGHT) }}
    >
      <div
        className="absolute bottom-0 left-0 flex flex-row-reverse items-end opacity-0 will-change-transform"
        ref={packRef}
        style={{
          gap: scaled(PACK_GAP),
          height: scaled(BASE_HEIGHT),
          transform: 'translateX(-100%)',
        }}
      >
        {MEMBERS.map((member) => (
          <div
            className="relative shrink-0"
            data-family-member={member.id}
            key={member.id}
            style={{
              width: scaled(member.width),
              height: scaled(member.height),
            }}
          >
            {member.frames.map((src) => (
              <img
                alt=""
                className="absolute inset-0 block size-full object-contain object-bottom"
                data-family-frame=""
                decoding="async"
                draggable={false}
                height={member.height}
                key={src}
                src={src}
                width={member.width}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
