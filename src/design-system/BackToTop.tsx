import { useRef } from 'react'
import { DsImage } from './DsImage'
import { gsap, useGSAP } from '../motion-system/gsap'
import { animateScrollTo, getScrollY } from '../motion-system/smoothScroll'

const SHOW_AFTER_PX = 240
const FILL_REST = '#fbfbf8'
const FILL_HOVER = '#2c2321'
const STROKE_REST = '#e9e4e2'
const STROKE_HOVER = 'rgba(233, 228, 226, 0)'

export function BackToTop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const darkIconRef = useRef<HTMLSpanElement>(null)
  const lightIconRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      const button = buttonRef.current
      const ring = ringRef.current
      const darkIcon = darkIconRef.current
      const lightIcon = lightIconRef.current
      if (!root || !button || !ring || !darkIcon || !lightIcon) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.set(root, { autoAlpha: 0, y: reduced ? 0 : 16, transformOrigin: '50% 50%' })
      gsap.set(button, {
        transformOrigin: '50% 50%',
        borderRadius: 0,
        backgroundColor: FILL_REST,
        borderColor: STROKE_REST,
        rotation: 0,
        boxShadow: '0 0 0 rgba(14, 9, 7, 0)',
      })
      gsap.set(darkIcon, { autoAlpha: 1 })
      gsap.set(lightIcon, { autoAlpha: 0 })
      gsap.set(ring, { autoAlpha: 0, scale: 1, borderRadius: 0 })

      let visible = false
      const showDuration = reduced ? 0 : 0.4

      const update = () => {
        const show = getScrollY() > SHOW_AFTER_PX
        if (show === visible) return
        visible = show
        gsap.to(root, {
          autoAlpha: show ? 1 : 0,
          y: show ? 0 : reduced ? 0 : 16,
          duration: showDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      update()
      window.addEventListener('scroll', update, { passive: true })

      const hoverTl = gsap.timeline({ paused: true })

      if (reduced) {
        hoverTl
          .to(
            button,
            {
              borderRadius: 40,
              backgroundColor: FILL_HOVER,
              borderColor: STROKE_HOVER,
              duration: 0.18,
            },
            0,
          )
          .to(darkIcon, { autoAlpha: 0, duration: 0.12 }, 0)
          .to(lightIcon, { autoAlpha: 1, duration: 0.12 }, 0)
      } else {
        hoverTl
          .to(
            button,
            {
              rotation: 360,
              borderRadius: 40,
              backgroundColor: FILL_HOVER,
              borderColor: STROKE_HOVER,
              boxShadow: '0 18px 40px rgba(14, 9, 7, 0.28)',
              duration: 0.85,
              ease: 'power4.inOut',
            },
            0,
          )
          .to(darkIcon, { autoAlpha: 0, duration: 0.18, ease: 'none' }, 0.34)
          .to(lightIcon, { autoAlpha: 1, duration: 0.18, ease: 'none' }, 0.34)
      }

      const playHover = contextSafe(() => {
        hoverTl.timeScale(1).play()
        if (reduced) return

        gsap.fromTo(
          root,
          { scale: 1 },
          {
            keyframes: [
              { scale: 0.86, duration: 0.18, ease: 'power2.in' },
              { scale: 1.12, duration: 0.38, ease: 'back.out(2.4)' },
              { scale: 1, duration: 0.22, ease: 'power2.out' },
            ],
            overwrite: 'auto',
          },
        )

        gsap.fromTo(
          ring,
          { scale: 0.9, autoAlpha: 0.55, borderRadius: 6 },
          {
            scale: 1.62,
            autoAlpha: 0,
            borderRadius: 52,
            duration: 0.72,
            ease: 'power3.out',
            overwrite: true,
          },
        )
      })

      const reverseHover = contextSafe(() => {
        hoverTl.timeScale(1.2).reverse()
      })

      const onClickPulse = contextSafe(() => {
        if (reduced) return
        gsap.fromTo(
          root,
          { scale: 1 },
          {
            keyframes: [
              { scale: 0.9, duration: 0.08, ease: 'power2.in' },
              { scale: 1, duration: 0.32, ease: 'back.out(2.6)' },
            ],
            overwrite: 'auto',
          },
        )
      })

      button.addEventListener('pointerenter', playHover)
      button.addEventListener('pointerleave', reverseHover)
      button.addEventListener('focus', playHover)
      button.addEventListener('blur', reverseHover)
      button.addEventListener('click', onClickPulse)

      return () => {
        window.removeEventListener('scroll', update)
        button.removeEventListener('pointerenter', playHover)
        button.removeEventListener('pointerleave', reverseHover)
        button.removeEventListener('focus', playHover)
        button.removeEventListener('blur', reverseHover)
        button.removeEventListener('click', onClickPulse)
      }
    },
    { scope: rootRef },
  )

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    animateScrollTo(0, reduced ? 0 : 0.85)
  }

  return (
    <div
      className="pointer-events-none fixed right-gutter bottom-gutter z-50 size-14 md:right-4xl md:bottom-4xl md:size-20"
      ref={rootRef}
    >
      <span
        className="pointer-events-none absolute inset-0 border border-solid border-foreground-secondary"
        ref={ringRef}
      />
      <button
        aria-label="Back to top"
        className="pointer-events-auto relative inline-flex size-full cursor-pointer items-center justify-center border border-solid bg-background-primary p-none"
        onClick={scrollToTop}
        ref={buttonRef}
        type="button"
      >
        <span className="relative size-8 shrink-0">
          <span className="absolute inset-0" ref={darkIconRef}>
            <DsImage
              alt=""
              height={32}
              src="/design-system/icons/arrow-up-dark.svg"
              width={32}
            />
          </span>
          <span className="absolute inset-0" ref={lightIconRef}>
            <DsImage
              alt=""
              height={32}
              src="/design-system/icons/arrow-up-light.svg"
              width={32}
            />
          </span>
        </span>
      </button>
    </div>
  )
}
