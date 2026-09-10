import { useEffect, useState } from 'react'
import { companyLogoUrl, initials } from './display'

type CompanyLogoProps = {
  name: string
}

export function CompanyLogo({ name }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false)
  const src = failed ? null : companyLogoUrl(name)

  useEffect(() => {
    setFailed(false)
  }, [name])

  return (
    <span
      className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden border border-solid border-stroke-secondary bg-background-secondary text-[10px] leading-none text-foreground-tertiary"
      title={name}
    >
      {src ? (
        <img
          alt=""
          className="size-full object-contain"
          decoding="async"
          key={src}
          loading="lazy"
          onError={() => setFailed(true)}
          src={src}
        />
      ) : (
        initials(name || '?')
      )}
    </span>
  )
}
