import { useRef } from 'react'
import { Logo, type LogoName } from '../design-system/Logo'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

const logos: LogoName[] = [
  'miro',
  'dell',
  'meltwater',
  'cinepolis',
  'air-force',
  'grepp',
  'talent-systems',
  'justos',
  'afrl',
  'numinos',
  'andela',
  'wandr',
  'asset-panda',
  'dev-signal',
  'suncity',
  'knownlenders',
  'dev-signal',
  'barspin-ventures',
  'arqu',
  'fotospin',
  'pacelane',
  'rsd',
  'os-nossos',
  'paragon',
]

type LogosTickerProps = {
  className?: string
}

function LogoTrack() {
  return (
    <div className="flex items-center gap-4xl px-4xl">
      {logos.map((name, index) => (
        <div data-ticker-logo key={`${name}-${index}`}>
          <Logo name={name} />
        </div>
      ))}
    </div>
  )
}

const MAX_SKEW = 10
const MAX_ARC = 42

export function LogosTicker({ className }: LogosTickerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(track, {
          xPercent: -50,
          duration: 40,
          ease: 'none',
          repeat: -1,
        })

        const items = gsap.utils.toArray<HTMLElement>('[data-ticker-logo]', root)
        gsap.set(items, { force3D: true, transformOrigin: 'center center' })

        const proxy = { amount: 0 }
        const clamp = gsap.utils.clamp(-1, 1)

        const flatten = () => {
          gsap.killTweensOf(proxy)
          proxy.amount = 0
          gsap.set(items, { skewY: 0, y: 0 })
        }

        const applyWarp = () => {
          const amount = proxy.amount
          if (amount === 0) return

          const viewport = window.innerWidth
          const center = viewport * 0.5
          const radius = Math.max(center, 1)

          for (const item of items) {
            const rect = item.getBoundingClientRect()
            const x = (rect.left + rect.width * 0.5 - center) / radius
            gsap.set(item, {
              skewY: x * MAX_SKEW * amount,
              y: x * x * MAX_ARC * amount,
            })
          }
        }

        const tick = () => {
          if (proxy.amount !== 0) applyWarp()
        }

        gsap.ticker.add(tick)

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const next = clamp(self.getVelocity() / -1100)
            if (Math.abs(next) <= Math.abs(proxy.amount)) return
            proxy.amount = next
            gsap.to(proxy, {
              amount: 0,
              duration: 1.15,
              ease: 'power3',
              overwrite: true,
              onComplete: flatten,
            })
          },
          onLeave: flatten,
          onLeaveBack: flatten,
        })

        return () => {
          gsap.ticker.remove(tick)
          trigger.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <div
      className={[
        'flex w-full items-center overflow-clip py-4xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={rootRef}
    >
      <div className="flex w-max items-center" ref={trackRef}>
        <LogoTrack />
        <LogoTrack />
      </div>
    </div>
  )
}
