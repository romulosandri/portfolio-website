import { GameButton } from './GameButton'
import { NameLogo } from './NameLogo'
import { NavItem } from './NavItem'

const items = [
  { href: '/work', label: 'Work', match: (path: string) => path === '/work' || path.startsWith('/work/') },
  { href: '#life', label: 'Life', match: () => false },
  { href: '/projects', label: 'Projects', match: (path: string) => path === '/projects' },
  { href: '/contact', label: 'Contact Me', match: (path: string) => path === '/contact' },
]

type NavBarProps = {
  className?: string
  pathname?: string
}

export function NavBar({ className, pathname = '/' }: NavBarProps) {
  return (
    <header
      className={[
        'flex w-full flex-col items-center px-4xl',
        className ?? 'bg-background-primary',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex w-full items-center justify-between py-2xl">
        <NameLogo className="[zoom:0.855]" href="/" />
        <nav aria-label="Primary" className="flex items-center gap-3xl">
          <GameButton href="/game" />
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.label}
              label={item.label}
              selected={item.match(pathname)}
            />
          ))}
        </nav>
      </div>
    </header>
  )
}
