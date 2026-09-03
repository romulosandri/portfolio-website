import { useRef } from 'react'
import { track } from '../lib/analytics'
import { gsap, useGSAP } from '../motion-system/gsap'
import { RollingText } from '../motion-system/RollingText'

type FooterButtonProps = {
  label: string
  href?: string
  className?: string
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href)
}

export function FooterButton({
  label,
  href = '#',
  className,
}: FooterButtonProps) {
  const external = isExternalHref(href)
  const rootRef = useRef<HTMLAnchorElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      const line = lineRef.current
      if (!root || !line) return

      gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })

      const mm = gsap.matchMedia()

      mm.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const tl = gsap.timeline({ paused: true })
          tl.fromTo(
            line,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.45, ease: 'power3.out', immediateRender: false },
          )

          const play = contextSafe(() => {
            tl.timeScale(1).play()
          })
          const reverse = contextSafe(() => {
            tl.timeScale(1.15).reverse()
          })

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
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <a
      aria-label={external ? `${label} (opens in a new tab)` : undefined}
      className={[
        'group inline-flex items-center px-none py-xsm text-body-default text-foreground-secondary no-underline hover:text-foreground-primary focus-visible:text-foreground-primary motion-reduce:hover:underline motion-reduce:focus-visible:underline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      href={href}
      onClick={() =>
        track('footer_link_clicked', {
          label,
          href,
          pathname: window.location.pathname,
        })
      }
      ref={rootRef}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span className="relative inline-flex">
        <RollingText text={label} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-current will-change-transform"
          ref={lineRef}
        />
      </span>
    </a>
  )
}
