import type { MouseEvent, ReactNode } from 'react'
import { site } from '../content/site'
import { copyToClipboard } from '../lib/copyToClipboard'
import { useSnackbar } from './Snackbar'

const COPIED_MESSAGE = 'Email copied'

type CopyEmailProps = {
  className?: string
  children?: ReactNode
  'aria-label'?: string
}

export function CopyEmail({ className, children, 'aria-label': ariaLabel }: CopyEmailProps) {
  const { show } = useSnackbar()
  const href = `mailto:${site.email}`

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    event.stopPropagation()
    show(COPIED_MESSAGE)
    void copyToClipboard(site.email).then((ok) => {
      if (!ok) show('Could not copy the email.')
    })
  }

  return (
    <a
      aria-label={ariaLabel}
      className={['cursor-pointer', className].filter(Boolean).join(' ')}
      href={href}
      onClick={onClick}
    >
      {children ?? site.email}
    </a>
  )
}
