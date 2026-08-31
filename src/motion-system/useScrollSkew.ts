import { type RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

const SCROLL_SKEW = {
  max: 1.5,
  velocity: -1800,
  duration: 1.4,
  ease: 'power3',
  transformOrigin: 'right center',
} as const

export function useScrollSkew(
  scopeRef: RefObject<HTMLElement | null>,
  itemSelector: string,
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      const root = scopeRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>(itemSelector)
        if (items.length === 0) return

        const proxy = { skew: 0 }
        const skewSetter = gsap.quickSetter(items, 'skewY', 'deg')
        const clamp = gsap.utils.clamp(-SCROLL_SKEW.max, SCROLL_SKEW.max)

        gsap.set(items, { transformOrigin: SCROLL_SKEW.transformOrigin, force3D: true })

        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / SCROLL_SKEW.velocity)
            if (Math.abs(skew) <= Math.abs(proxy.skew)) return
            proxy.skew = skew
            gsap.to(proxy, {
              skew: 0,
              duration: SCROLL_SKEW.duration,
              ease: SCROLL_SKEW.ease,
              overwrite: true,
              onUpdate: () => {
                skewSetter(proxy.skew)
              },
            })
          },
        })
      })

      return () => mm.revert()
    },
    { scope: scopeRef, dependencies, revertOnUpdate: true },
  )
}
