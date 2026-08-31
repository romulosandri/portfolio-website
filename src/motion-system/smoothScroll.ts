import type Lenis from 'lenis'
import { gsap } from './gsap'

let lenis: Lenis | null = null
let locks = 0

export function setSmoothScroll(instance: Lenis | null) {
  lenis = instance
  if (!lenis) return
  if (locks > 0) lenis.stop()
}

export function getScrollY() {
  return lenis?.scroll ?? window.scrollY
}

export function jumpToScrollY(y: number) {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true, force: true })
    return
  }
  window.scrollTo(0, y)
}

export function animateScrollTo(y: number, duration = 0.85) {
  if (lenis) {
    lenis.scrollTo(y, {
      duration,
      easing: (time) => 1 - (1 - time) ** 3,
      force: true,
    })
    return
  }

  gsap.to(window, {
    duration,
    ease: 'power3.inOut',
    overwrite: 'auto',
    scrollTo: { y },
  })
}

export function pauseSmoothScroll() {
  locks += 1
  if (locks === 1) lenis?.stop()
}

export function resumeSmoothScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) lenis?.start()
}
