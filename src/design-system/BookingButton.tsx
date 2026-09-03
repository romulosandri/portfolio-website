import { site } from '../content/site'
import { track } from '../lib/analytics'

type BookingButtonProps = {
  className?: string
  href?: string
  label?: string
}

export function BookingButton({
  className,
  href = site.booking.href,
  label = site.booking.label,
}: BookingButtonProps) {
  return (
    <a
      aria-label={`${label} (opens in a new tab)`}
      className={[
        'inline-flex items-center border border-solid border-stroke-secondary px-lg py-md text-body-small text-foreground-secondary no-underline hover:bg-background-secondary hover:text-foreground-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      href={href}
      onClick={() =>
        track('cta_clicked', {
          cta: 'schedule_a_call',
          href,
          pathname: window.location.pathname,
        })
      }
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  )
}
