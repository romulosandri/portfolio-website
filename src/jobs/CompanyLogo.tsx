import { useEffect, useState } from 'react'
import { companyLogoUrl, initials } from './display'

type CompanyLogoProps = {
  domain?: string | null
  name: string
}

export function CompanyLogo({ domain, name }: CompanyLogoProps) {
  const [useNameLookup, setUseNameLookup] = useState(!domain)
  const [failed, setFailed] = useState(false)
  const src = failed ? null : companyLogoUrl(useNameLookup ? { name } : { domain })

  useEffect(() => {
    setUseNameLookup(!domain)
    setFailed(false)
  }, [domain, name])

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
          onError={() => {
            if (!useNameLookup && name.trim()) {
              setUseNameLookup(true)
              return
            }
            setFailed(true)
          }}
          src={src}
        />
      ) : (
        initials(name)
      )}
    </span>
  )
}
