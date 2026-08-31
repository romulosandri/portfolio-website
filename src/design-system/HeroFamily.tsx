import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

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

const SIZE_SCALE = 1.2
const PACK_GAP = 110

const SCALED_MEMBERS = MEMBERS.map((member) => ({
  ...member,
  width: Math.round(member.width * SIZE_SCALE),
  height: Math.round(member.height * SIZE_SCALE),
}))

const TRACK_HEIGHT = Math.max(...SCALED_MEMBERS.map((member) => member.height))
const FRAME_DURATION = 0.1
const RUN_PX_PER_SECOND = 520
const REPEAT_DELAY = 2.8
const REST_X = 48

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
        for (const member of members) {
          const frames = Array.from(member.querySelectorAll<HTMLElement>('[data-family-frame]'))
          gsap.set(frames, { autoAlpha: 0 })
          gsap.set(frames[2] ?? frames[0], { autoAlpha: 1 })
        }
        gsap.set(pack, { x: REST_X, autoAlpha: 1 })
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
          runTween?.kill()
          gsap.set(pack, { x: startX, autoAlpha: 1 })
          runTween = gsap.to(pack, {
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
      className="pointer-events-none absolute inset-x-0 bottom-full overflow-hidden"
      ref={trackRef}
      style={{ height: TRACK_HEIGHT }}
    >
      <div
        className="absolute bottom-0 left-0 flex flex-row-reverse items-end will-change-transform"
        ref={packRef}
        style={{ gap: PACK_GAP, height: TRACK_HEIGHT, transform: 'translateX(-100%)' }}
      >
        {SCALED_MEMBERS.map((member) => (
          <div
            className="relative shrink-0"
            data-family-member={member.id}
            key={member.id}
            style={{
              width: member.width,
              height: member.height,
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
