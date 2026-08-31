import type { RefObject } from 'react'
import { gsap, useGSAP } from '../motion-system/gsap'
import { MOTION, prefersReducedMotion } from '../motion-system/tokens'

export const CTA_FILL = '#0e0907'
export const CTA_ARROW_HOVER = '#2c2321'
export const CTA_REST_BG = '#fbfbf8'
export const CTA_STROKE = '#e9e4e2'
export const CTA_STROKE_HOVER = '#807164'

export const CTA_HOVER = {
  fill: {
    duration: 0.55,
    ease: MOTION.ease.inOut,
  },
  icon: {
    duration: MOTION.duration.interactive,
    ease: MOTION.ease.inOut,
    stagger: MOTION.stagger.char,
  },
  arrowIn: {
    duration: MOTION.duration.interactive,
    ease: MOTION.ease.out,
  },
  spin: {
    duration: MOTION.duration.entrance,
    ease: 'power4.inOut',
  },
} as const

export function placeCurveFill(fill: HTMLElement, root: HTMLElement) {
  const rootRect = root.getBoundingClientRect()
  const ox = 0
  const oy = rootRect.height
  const size = Math.hypot(rootRect.width, rootRect.height) * 2.2

  gsap.set(fill, {
    width: size,
    height: size,
    x: ox - size / 2,
    y: oy - size / 2,
    borderRadius: '50%',
    transformOrigin: '50% 50%',
  })
}

export function ctaIcons(root: HTMLElement) {
  return gsap.utils.toArray<HTMLElement>('[data-cta-icon]', root)
}

export function bindCtaHover(
  root: HTMLElement,
  play: () => void,
  reverse: () => void,
) {
  root.addEventListener('pointerenter', play)
  root.addEventListener('pointerleave', reverse)
  root.addEventListener('focus', play)
  root.addEventListener('blur', reverse)

  return () => {
    root.removeEventListener('pointerenter', play)
    root.removeEventListener('pointerleave', reverse)
    root.removeEventListener('focus', play)
    root.removeEventListener('blur', reverse)
  }
}

export function useCtaBarHover(
  rootRef: RefObject<HTMLElement | null>,
  fillRef: RefObject<HTMLElement | null>,
  arrowRef: RefObject<HTMLElement | null>,
  forceHover = false,
) {
  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      const fill = fillRef.current
      const arrow = arrowRef.current
      if (!root || !fill || !arrow) return

      const icons = ctaIcons(root)
      const restIcon = arrow.querySelector<HTMLElement>('[data-arrow-rest]')
      const hoverIcon = arrow.querySelector<HTMLElement>('[data-arrow-hover]')
      if (!restIcon || !hoverIcon) return

      const reduced = prefersReducedMotion()
      const layoutFill = () => placeCurveFill(fill, root)

      layoutFill()
      gsap.set(fill, { scale: forceHover ? 1 : 0 })
      gsap.set(icons, { yPercent: forceHover ? 110 : 0 })
      gsap.set(arrow, {
        transformOrigin: '50% 50%',
        borderRadius: forceHover ? 40 : 0,
        backgroundColor: forceHover ? CTA_ARROW_HOVER : CTA_REST_BG,
        borderColor: forceHover ? 'rgba(233, 228, 226, 0)' : CTA_STROKE,
        rotation: forceHover ? 360 : 0,
      })
      gsap.set(restIcon, { autoAlpha: forceHover ? 0 : 1 })
      gsap.set(hoverIcon, { autoAlpha: forceHover ? 1 : 0 })
      gsap.set(root, {
        borderColor: forceHover ? CTA_STROKE_HOVER : CTA_STROKE,
      })

      if (forceHover) return

      const mm = gsap.matchMedia()

      mm.add(
        {
          canHover:
            '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
          instant: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: reduce)',
        },
        (media) => {
          const motion = media.conditions?.canHover && !reduced
          const durationScale = motion ? 1 : 0
          const tl = gsap.timeline({ paused: true })

          tl.to(
            fill,
            {
              scale: 1,
              duration: CTA_HOVER.fill.duration * durationScale,
              ease: CTA_HOVER.fill.ease,
            },
            0,
          )
            .to(
              icons,
              {
                yPercent: 110,
                duration: CTA_HOVER.icon.duration * durationScale,
                ease: CTA_HOVER.icon.ease,
                stagger: durationScale ? CTA_HOVER.icon.stagger : 0,
              },
              0,
            )
            .to(
              arrow,
              {
                rotation: 360,
                borderRadius: 40,
                backgroundColor: CTA_ARROW_HOVER,
                borderColor: 'rgba(233, 228, 226, 0)',
                duration: CTA_HOVER.spin.duration * durationScale,
                ease: CTA_HOVER.spin.ease,
              },
              0,
            )
            .to(
              restIcon,
              { autoAlpha: 0, duration: motion ? 0.18 : 0, ease: 'none' },
              motion ? 0.34 : 0,
            )
            .to(
              hoverIcon,
              { autoAlpha: 1, duration: motion ? 0.18 : 0, ease: 'none' },
              motion ? 0.34 : 0,
            )
            .to(
              root,
              {
                borderColor: CTA_STROKE_HOVER,
                duration: 0.28 * durationScale,
                ease: 'power2.out',
              },
              0.12,
            )

          const play = contextSafe(() => {
            if (tl.progress() === 0) layoutFill()
            tl.timeScale(1).play()
          })
          const reverse = contextSafe(() => {
            tl.timeScale(1.15).reverse()
          })

          return bindCtaHover(root, play, reverse)
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [forceHover], revertOnUpdate: true },
  )
}
