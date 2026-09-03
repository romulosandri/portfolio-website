import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from './gsap'
import { setSmoothScroll } from './smoothScroll'

type LenisProviderProps = {
  children: ReactNode
}

/**
 * Touch devices already have momentum scrolling in the compositor. Lenis on top
 * of that means a rAF loop fighting a gesture the OS handles better, so it is
 * skipped entirely rather than tuned.
 *
 * Read during the first render rather than in an effect so smooth scrolling is
 * never briefly attached and then torn off. `root` mode targets html/body and
 * adds no wrapper element, so mounting or skipping ReactLenis changes no markup
 * and nothing about the prerendered output.
 */
const SMOOTH_SCROLL_QUERY = '(hover: hover) and (pointer: fine)'

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
  const [smooth] = useState(() => window.matchMedia(SMOOTH_SCROLL_QUERY).matches)

  if (!smooth) return children

  return (
    <ReactLenis
      options={{
        lerp: 0.1,
        wheelMultiplier: 0.9,
        anchors: true,
        // The chat panel has its own overflow. Without this, Lenis treats a
        // wheel over that panel as a request to scroll the page behind it.
        prevent: (node) => Boolean(node.closest('#site-chat-panel')),
      }}
      root
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}
