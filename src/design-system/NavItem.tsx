import { Symbol } from './Symbol'

type NavItemProps = {
  label: string
  href?: string
  selected?: boolean
  className?: string
}

export function NavItem({
  label,
  href = '#',
  selected = false,
  className,
}: NavItemProps) {
  return (
    <a
      aria-current={selected ? 'page' : undefined}
      className={[
        'group inline-flex items-start gap-xsm text-h5 no-underline',
        selected ? 'text-foreground-primary' : 'text-foreground-tertiary hover:text-foreground-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      href={href}
    >
      <span
        className={[
          'size-xl shrink-0 overflow-clip',
          selected
            ? 'inline-flex'
            : 'hidden group-hover:inline-flex group-focus-visible:inline-flex',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Symbol variant="19" />
      </span>
      <span className="whitespace-nowrap text-center">{label}</span>
    </a>
  )
}
