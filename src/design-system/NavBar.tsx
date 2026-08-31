import { GameButton } from './GameButton'
import { NameLogo } from './NameLogo'
import { NavItem } from './NavItem'

const items = [
  { href: '#work', label: 'Work' },
  { href: '#life', label: 'Life' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact Me' },
]

type NavBarProps = {
  className?: string
}

export function NavBar({ className }: NavBarProps) {
  return (
    <header
      className={[
        'flex w-full flex-col items-center bg-background-primary px-4xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex w-full items-center justify-between py-2xl">
        <NameLogo className="[zoom:0.855]" />
        <nav aria-label="Primary" className="flex items-center gap-3xl">
          <GameButton href="#game" />
          {items.map((item) => (
            <NavItem href={item.href} key={item.label} label={item.label} />
          ))}
        </nav>
      </div>
    </header>
  )
}
