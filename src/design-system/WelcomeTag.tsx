import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { Symbol } from './Symbol'
import { Tag, type TagType } from './Tag'

type WelcomeTagProps = {
  className?: string
}

export function WelcomeTag({ className }: WelcomeTagProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const symbolRef = useRef<HTMLSpanElement>(null)
  const aiTagRef = useRef<HTMLSpanElement>(null)
  const humanTagRef = useRef<HTMLSpanElement>(null)
  const showingRef = useRef<TagType>('ai-agents')

  useGSAP(
    (_, contextSafe) => {
      const aiTag = aiTagRef.current
      const humanTag = humanTagRef.current
      if (aiTag && humanTag) {
        gsap.set(aiTag, { autoAlpha: 1, filter: 'blur(0px)', scale: 1 })
        gsap.set(humanTag, { autoAlpha: 0, filter: 'blur(28px)', scale: 1.08 })
      }

      const tick = contextSafe(() => {
        const next: TagType = showingRef.current === 'ai-agents' ? 'humans' : 'ai-agents'
        const outgoing = showingRef.current === 'ai-agents' ? aiTagRef.current : humanTagRef.current
        const incoming = next === 'ai-agents' ? aiTagRef.current : humanTagRef.current
        const symbol = symbolRef.current
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reduce) {
          if (outgoing) gsap.set(outgoing, { autoAlpha: 0, filter: 'blur(0px)', scale: 1 })
          if (incoming) gsap.set(incoming, { autoAlpha: 1, filter: 'blur(0px)', scale: 1 })
          showingRef.current = next
          return
        }

        if (symbol) {
          gsap.to(symbol, {
            rotation: '+=360',
            duration: 0.7,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        if (!outgoing || !incoming) {
          showingRef.current = next
          return
        }

        gsap.killTweensOf([outgoing, incoming])

        const tl = gsap.timeline({
          onComplete: () => {
            showingRef.current = next
          },
        })

        tl.to(
          outgoing,
          {
            filter: 'blur(28px) brightness(1.45) saturate(1.6)',
            scale: 1.12,
            autoAlpha: 0,
            duration: 0.28,
            ease: 'power3.in',
          },
          0,
        ).fromTo(
          incoming,
          {
            filter: 'blur(28px) brightness(1.45) saturate(1.6)',
            scale: 1.12,
            autoAlpha: 0,
          },
          {
            filter: 'blur(0px) brightness(1) saturate(1)',
            scale: 1,
            autoAlpha: 1,
            duration: 0.48,
            ease: 'power3.out',
          },
          0.12,
        )
      })

      const id = window.setInterval(tick, 3000)
      return () => window.clearInterval(id)
    },
    { scope: rootRef },
  )

  return (
    <span
      className={[
        'inline-flex items-center justify-center gap-[10px] rounded-sm px-xl py-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={rootRef}
    >
      <span className="whitespace-nowrap text-center text-body-default text-foreground-secondary">
        Welcome to my portfolio
      </span>
      <span className="inline-flex" ref={symbolRef}>
        <Symbol variant="7" />
      </span>
      <span className="relative inline-flex">
        <span className="invisible pointer-events-none" aria-hidden>
          <Tag type="ai-agents" />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center will-change-[filter,transform,opacity]"
          ref={aiTagRef}
        >
          <Tag type="ai-agents" />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center will-change-[filter,transform,opacity]"
          ref={humanTagRef}
        >
          <Tag type="humans" />
        </span>
      </span>
    </span>
  )
}
