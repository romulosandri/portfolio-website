import { useRef } from 'react'
import { gsap, useGSAP } from './gsap'

type RollingTextProps = {
  text: string
  className?: string
}

export function RollingText({ text, className }: RollingTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      if (!root) return

      const stacks = gsap.utils.toArray<HTMLElement>('[data-roll]', root)
      if (stacks.length === 0) return

      const trigger = root.closest('a, button') ?? root
      const mm = gsap.matchMedia()

      mm.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(stacks, { yPercent: 0 })

          const tl = gsap.timeline({ paused: true })
          tl.to(stacks, {
            yPercent: -50,
            duration: 0.45,
            ease: 'power3.inOut',
            stagger: 0.02,
          })

          const play = contextSafe(() => {
            tl.timeScale(1).play()
          })
          const reverse = contextSafe(() => {
            tl.timeScale(1.15).reverse()
          })

          trigger.addEventListener('pointerenter', play)
          trigger.addEventListener('pointerleave', reverse)
          trigger.addEventListener('focus', play)
          trigger.addEventListener('blur', reverse)

          return () => {
            trigger.removeEventListener('pointerenter', play)
            trigger.removeEventListener('pointerleave', reverse)
            trigger.removeEventListener('focus', play)
            trigger.removeEventListener('blur', reverse)
          }
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [text], revertOnUpdate: true },
  )

  const chars = Array.from(text)

  return (
    <span
      className={['inline-flex overflow-hidden whitespace-nowrap', className]
        .filter(Boolean)
        .join(' ')}
      ref={rootRef}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex [font-kerning:none]">
        {chars.map((char, index) => {
          const glyph = char === ' ' ? '\u00A0' : char
          const spaceClass = char === ' ' ? 'w-[0.3em]' : undefined

          return (
            <span className="inline-flex h-[1lh] overflow-hidden" key={index}>
              <span
                className="flex h-[2lh] shrink-0 flex-col will-change-transform"
                data-roll=""
              >
                <span
                  className={['flex h-[1lh] shrink-0 items-center', spaceClass]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {glyph}
                </span>
                <span
                  className={['flex h-[1lh] shrink-0 items-center', spaceClass]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {glyph}
                </span>
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
