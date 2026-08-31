type WorkCardProps = {
  title: string
  year: string
  cover: string
  href: string
  className?: string
}

export function WorkCard({ title, year, cover, href, className }: WorkCardProps) {
  return (
    <a
      className={['flex w-full flex-col items-start gap-2xl no-underline', className]
        .filter(Boolean)
        .join(' ')}
      href={href}
    >
      <span className="relative block aspect-[2048/1536] w-full overflow-clip">
        <img alt="" className="absolute inset-0 size-full object-cover" src={cover} />
      </span>
      <span className="flex w-full items-center justify-between">
        <span className="whitespace-nowrap text-h4 text-foreground-primary">{title}</span>
        <span className="whitespace-nowrap text-body-large text-foreground-tertiary">{year}</span>
      </span>
    </a>
  )
}

type SectionHeaderProps = {
  title: string
  caption?: string
}

export function SectionHeader({ title, caption }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-center gap-[10px] border-t border-solid border-stroke-secondary pt-2xl">
      <h2 className="min-w-px flex-1 text-h2 text-foreground-primary">{title}</h2>
      {caption ? (
        <p className="whitespace-nowrap text-body-large text-foreground-tertiary">{caption}</p>
      ) : null}
    </div>
  )
}

type DisplayHeroProps = {
  children: string
}

export function DisplayHero({ children }: DisplayHeroProps) {
  return (
    <div className="flex h-[560px] w-full shrink-0 flex-col items-center justify-center bg-background-primary p-4xl">
      <h1 className="whitespace-nowrap text-center text-display text-foreground-primary">
        {children}
      </h1>
    </div>
  )
}
