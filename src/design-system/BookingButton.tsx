import { site } from '../content/site'
import { track } from '../lib/analytics'
import { Button } from './Button'

type BookingButtonProps = {
  className?: string
  href?: string
  label?: string
  cta?: string
  download?: string
  forceHover?: boolean
}

export function BookingButton({
  className,
  href = site.booking.href,
  label = site.booking.label,
  cta = 'schedule_a_call',
  download,
  forceHover = false,
}: BookingButtonProps) {
  const isDownload = Boolean(download)

  return (
    <Button
      aria-label={isDownload ? label : `${label} (opens in a new tab)`}
      className={className}
      download={download}
      forceHover={forceHover}
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
    </Button>
  )
}
