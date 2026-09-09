import { useState } from 'react'
import { faviconUrl, initials } from './display'

type CompanyLogoProps = {
  domain?: string | null
  name: string
}

export function CompanyLogo({ domain, name }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(domain) && !failed

  return (
    <span
      className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden border border-solid border-stroke-secondary bg-background-secondary text-body-small text-foreground-tertiary"
      title={name}
    >
      {showImage ? (
        <img
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
          src={faviconUrl(domain!)}
        />
      ) : (
        initials(name)
      )}
    </span>
  )
}
