import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from './gsap'
import { setSmoothScroll } from './smoothScroll'

type LenisProviderProps = {
  children: ReactNode
}

function LenisBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    setSmoothScroll(lenis)
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      setSmoothScroll(null)
    }
  }, [lenis])

  return null
}

export function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      options={{
        lerp: 0.1,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
        anchors: true,
      }}
      root
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}
