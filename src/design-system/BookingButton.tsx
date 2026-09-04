import { site } from '../content/site'
import { track } from '../lib/analytics'

type BookingButtonProps = {
  className?: string
  href?: string
  label?: string
  cta?: string
  download?: string
}

export function BookingButton({
  className,
  href = site.booking.href,
  label = site.booking.label,
  cta = 'schedule_a_call',
  download,
}: BookingButtonProps) {
  const isDownload = Boolean(download)

  return (
    <a
      aria-label={isDownload ? label : `${label} (opens in a new tab)`}
      className={[
        'inline-flex items-center border border-solid border-stroke-secondary px-lg py-md text-body-small text-foreground-secondary no-underline hover:bg-background-secondary hover:text-foreground-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      download={download}
      href={href}
      onClick={() =>
        track('cta_clicked', {
          cta,
          href,
          pathname: window.location.pathname,
        })
      }
      rel={isDownload ? undefined : 'noopener noreferrer'}
      target={isDownload ? undefined : '_blank'}
    >
      {label}
    </a>
  )
}
