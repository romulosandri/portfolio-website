type FooterButtonProps = {
  label: string
  href?: string
  className?: string
}

export function FooterButton({
  label,
  href = '#',
  className,
}: FooterButtonProps) {
  return (
    <a
      className={[
        'inline-flex items-center px-none py-xsm text-body-default text-foreground-secondary no-underline hover:text-foreground-primary hover:underline focus-visible:text-foreground-primary focus-visible:underline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      href={href}
    >
      <span className="whitespace-nowrap">{label}</span>
    </a>
  )
}
