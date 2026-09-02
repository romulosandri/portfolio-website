import { useRef } from 'react'
import { track } from '../lib/analytics'
import { RollingText } from '../motion-system/RollingText'
import { ArrowButton } from './ArrowButton'
import { useCtaBarHover } from './ctaHover'
import { SocialIcon, type SocialIconType } from './SocialIcon'

const socials: SocialIconType[] = ['email', 'github', 'x', 'linkedin', 'instagram']

type TalkButtonProps = {
  href?: string
  forceHover?: boolean
  className?: string
}

export function TalkButton({
  href = '/contact',
  forceHover = false,
  className,
}: TalkButtonProps) {
  const rootRef = useRef<HTMLAnchorElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)

  useCtaBarHover(rootRef, fillRef, arrowRef, forceHover)

  return (
    <a
      className={[
        'relative isolate flex w-full items-center gap-xl overflow-hidden border-y border-solid border-stroke-secondary bg-background-primary p-xl no-underline md:gap-3xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-hover={forceHover ? 'true' : undefined}
      href={href}
      onClick={() =>
        track('cta_clicked', {
          cta: 'lets_talk',
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
      <span className="relative hidden items-center gap-xl md:flex">
        {socials.map((type) => (
          <span className="inline-flex overflow-hidden" key={type}>
            <span className="inline-flex will-change-transform" data-cta-icon="">
              <SocialIcon type={type} />
            </span>
          </span>
        ))}
      </span>
      <span className="relative mix-blend-difference text-h3 text-background-primary max-md:shrink-0 md:min-w-px md:flex-1">
        <RollingText text="Let’s Talk" />
      </span>
      <span className="relative flex items-center justify-end max-md:ml-auto max-md:shrink-0 md:min-w-px md:flex-1">
        <ArrowButton ref={arrowRef} />
      </span>
    </a>
  )
}
