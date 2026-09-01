import { useRef } from 'react'
import { gsap, useGSAP } from '../motion-system/gsap'
import { RollingText } from '../motion-system/RollingText'
import { Symbol } from './Symbol'

type NavItemProps = {
  label: string
  href?: string
  selected?: boolean
  className?: string
}

const SYMBOL_SIZE = 16
const SYMBOL_GAP = 4
const SLOT_WIDTH = SYMBOL_SIZE + SYMBOL_GAP

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href)
}

export function NavItem({
  label,
  href = '#',
  selected = false,
  className,
}: NavItemProps) {
  const rootRef = useRef<HTMLAnchorElement>(null)
  const slotRef = useRef<HTMLSpanElement>(null)
  const symbolRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      const slot = slotRef.current
      const symbol = symbolRef.current
      if (!root || !slot || !symbol) return

      if (selected) {
        gsap.set(slot, { width: SLOT_WIDTH })
        gsap.set(symbol, { yPercent: 0, rotation: 0 })
        return
      }

      gsap.set(slot, { width: 0 })
      gsap.set(symbol, { yPercent: 100, rotation: -360 })

      const mm = gsap.matchMedia()

      mm.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const tl = gsap.timeline({ paused: true })
          tl.fromTo(
            slot,
            { width: 0 },
            { width: SLOT_WIDTH, duration: 0.45, ease: 'power3.out', immediateRender: false },
            0,
          ).fromTo(
            symbol,
            { yPercent: 100, rotation: -360 },
            {
              yPercent: 0,
              rotation: 0,
              duration: 0.5,
              ease: 'power3.out',
              immediateRender: false,
            },
            0,
          )

          const play = contextSafe(() => {
            tl.timeScale(1).play()
          })
          const reverse = contextSafe(() => {
            tl.timeScale(1.2).reverse()
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
    { scope: rootRef, dependencies: [selected], revertOnUpdate: true },
  )

  const external = isExternalHref(href)

  return (
    <a
      aria-current={selected ? 'page' : undefined}
      aria-label={external ? `${label} (opens in a new tab)` : undefined}
      className={[
        'group inline-flex items-center text-h5 no-underline',
        selected ? 'text-foreground-primary' : 'text-foreground-tertiary hover:text-foreground-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      href={href}
      ref={rootRef}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span
        className={[
          'inline-flex h-xl shrink-0 overflow-clip',
          selected
            ? 'w-1xl'
            : 'w-0 motion-reduce:group-hover:w-1xl motion-reduce:group-focus-visible:w-1xl',
        ]
          .filter(Boolean)
          .join(' ')}
        ref={slotRef}
      >
        <span
          className="inline-flex size-xl shrink-0 items-center justify-center will-change-transform"
          ref={symbolRef}
        >
          <Symbol variant="19" />
        </span>
      </span>
      <RollingText className="text-center" text={label} />
    </a>
  )
}
