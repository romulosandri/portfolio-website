import { useRef } from 'react'
import { RollingText } from '../motion-system/RollingText'
import { ArrowButton } from './ArrowButton'
import { useCtaBarHover } from './ctaHover'

type SendButtonProps = {
  className?: string
  disabled?: boolean
  label?: string
}

export function SendButton({ className, disabled, label = 'Send' }: SendButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)

  useCtaBarHover(rootRef, fillRef, arrowRef)

  return (
    <button
      className={[
        'relative isolate flex w-full cursor-pointer items-center justify-between overflow-hidden border-y border-solid border-stroke-secondary bg-background-primary p-xl text-left disabled:cursor-default disabled:opacity-60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      ref={rootRef}
      type="submit"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 bg-foreground-primary will-change-transform"
        ref={fillRef}
      />
      <span className="relative mix-blend-difference text-h3 text-background-primary">
        <RollingText text={label} />
      </span>
      <span className="relative flex items-center justify-end">
        <ArrowButton ref={arrowRef} />
      </span>
    </button>
  )
}
