import { ArrowButton } from './ArrowButton'
import { SocialIcon, type SocialIconType } from './SocialIcon'

const socials: SocialIconType[] = ['email', 'github', 'x', 'linkedin', 'instagram']

type TalkButtonProps = {
  href?: string
  forceHover?: boolean
  className?: string
}

export function TalkButton({
  href = '/contact',
  forceHover = false,
  className,
}: TalkButtonProps) {
  return (
    <a
      className={[
        'group flex w-full items-center border-y border-solid p-xl no-underline',
        forceHover
          ? 'justify-between gap-none border-foreground-quaternary bg-foreground-primary'
          : 'gap-3xl border-stroke-secondary bg-background-primary hover:justify-between hover:gap-none hover:border-foreground-quaternary hover:bg-foreground-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-hover={forceHover ? 'true' : undefined}
      href={href}
    >
      <span className="flex items-center gap-xl group-hover:hidden group-data-[hover=true]:hidden">
        {socials.map((type) => (
          <SocialIcon key={type} type={type} />
        ))}
      </span>
      <span
        className={[
          'min-w-px flex-1 text-h3 group-hover:flex-none group-hover:text-center group-hover:text-background-primary group-data-[hover=true]:flex-none group-data-[hover=true]:text-center group-data-[hover=true]:text-background-primary',
          forceHover ? 'flex-none text-center text-background-primary' : 'text-foreground-primary',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        Let’s Talk
      </span>
      <span className="flex min-w-px flex-1 items-center justify-end gap-2xl group-hover:flex-none group-data-[hover=true]:flex-none">
        <span className="group-hover:hidden group-data-[hover=true]:hidden">
          <ArrowButton variant="default" />
        </span>
        <span className="hidden group-hover:inline-flex group-data-[hover=true]:inline-flex">
          <ArrowButton variant="dark" />
        </span>
      </span>
    </a>
  )
}
