import { useRef } from 'react'
import { track } from '../lib/analytics'
import { RollingText } from '../motion-system/RollingText'
import { gsap, useGSAP } from '../motion-system/gsap'
import { prefersReducedMotion } from '../motion-system/tokens'
import { AppLogo, type AppLogoName } from './AppLogo'
import {
  bindCtaHover,
  CTA_HOVER,
  CTA_STROKE,
  ctaIcons,
  placeCurveFill,
} from './ctaHover'
import { DsImage } from './DsImage'

const logos: AppLogoName[] = [
  'hermes',
  'cursor',
  'fal',
  'granola',
  'agent-mail',
  'openai',
  'composio',
  'firecrawl',
  'manus',
  'zernio',
  'apify',
  'tavily',
  'openrouter',
]

type HowAiProps = {
  href?: string
  forceHover?: boolean
  className?: string
}

export function HowAi({ href = '/how-i-use-ai', forceHover = false, className }: HowAiProps) {
  const rootRef = useRef<HTMLAnchorElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      const fill = fillRef.current
      const arrow = arrowRef.current
      if (!root || !fill || !arrow) return

      const icons = ctaIcons(root)
      const reduced = prefersReducedMotion()
      const layoutFill = () => placeCurveFill(fill, root)

      layoutFill()
      gsap.set(fill, { scale: forceHover ? 1 : 0 })
      gsap.set(icons, { yPercent: forceHover ? 110 : 0 })
      gsap.set(arrow, { yPercent: forceHover ? 0 : 110 })
      gsap.set(root, {
        borderColor: forceHover ? 'transparent' : CTA_STROKE,
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
          const durationScale = media.conditions?.canHover && !reduced ? 1 : 0
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
                yPercent: 0,
                duration: CTA_HOVER.arrowIn.duration * durationScale,
                ease: CTA_HOVER.arrowIn.ease,
              },
              durationScale ? 0.08 : 0,
            )
            .to(
              root,
              {
                borderColor: 'transparent',
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

  return (
    <a
      className={[
        'relative isolate flex h-[52px] w-full items-center justify-between gap-xl overflow-hidden border-b border-l border-r border-solid border-stroke-secondary bg-background-primary p-xl no-underline md:justify-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-hover={forceHover ? 'true' : undefined}
      href={href}
      onClick={() =>
        track('cta_clicked', {
          cta: 'how_i_use_ai',
          href,
          pathname: window.location.pathname,
        })
      }
      ref={rootRef}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 bg-foreground-primary will-change-transform"
        ref={fillRef}
      />
      <span className="relative mix-blend-difference text-body-default text-background-primary max-md:shrink-0 md:min-w-px md:flex-1">
        <RollingText text="See how I use AI" />
      </span>
      <span className="relative hidden items-center gap-xl md:flex">
        {logos.map((name) => (
          <span className="inline-flex overflow-hidden" key={name}>
            <span className="inline-flex will-change-transform" data-cta-icon="">
              <AppLogo name={name} />
            </span>
          </span>
        ))}
        <span className="pointer-events-none absolute top-0 right-0 bottom-0 flex items-center overflow-hidden">
          <span className="inline-flex size-[24px] will-change-transform" ref={arrowRef}>
            <DsImage
              alt=""
              height={24}
              src="/design-system/icons/arrow-up-right-light.svg"
              width={24}
            />
          </span>
        </span>
      </span>
      <span aria-hidden className="relative inline-flex size-[24px] shrink-0 md:hidden">
        <DsImage
          alt=""
          height={24}
          src="/design-system/icons/arrow-up-right-dark.svg"
          width={24}
        />
      </span>
    </a>
  )
}
