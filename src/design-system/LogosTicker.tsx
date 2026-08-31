import { useRef } from 'react'
import { Logo, type LogoName } from './Logo'
import { gsap, useGSAP } from '../lib/gsap'

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
        <Logo key={`${name}-${index}`} name={name} />
      ))}
    </div>
  )
}

export function LogosTicker({ className }: LogosTickerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.to(track, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: rootRef },
  )

  return (
    <div
      className={[
        'flex w-full items-center overflow-clip py-2xl',
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
