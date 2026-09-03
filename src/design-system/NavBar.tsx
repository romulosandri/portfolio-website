import { useState } from 'react'
import { site } from '../content/site'
import { GameButton } from './GameButton'
import { NameLogo } from './NameLogo'
import { NavItem } from './NavItem'
import { NavMenu, NavMenuToggle, type NavMenuItem } from './NavMenu'

const items: NavMenuItem[] = [
  { href: '/work', label: 'Work', match: (path: string) => path === '/work' || path.startsWith('/work/') },
  // Life is deferred — do not ship a dead #life hash until the page exists.
  { href: '/projects', label: 'Projects', match: (path: string) => path === '/projects' || path.startsWith('/projects/') },
  { href: site.blog.href, label: site.blog.label, match: () => false },
  { href: '/contact', label: 'Contact Me', match: (path: string) => path === '/contact' },
]

type NavBarProps = {
  className?: string
  pathname?: string
}

export function NavBar({ className, pathname = '/' }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className={[
        'flex w-full flex-col items-center px-gutter',
        className ?? 'bg-background-primary',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/*
        Above NavMenu's overlay, which is a sibling: the overlay reserves
        --site-nav-height of top padding for this row, and that gap only reads
        as the header if the wordmark and toggle actually paint over the panel.
      */}
      <div className="relative z-60 flex w-full items-center justify-between py-md nav:py-2xl">
        {/* NameLogo drops to the first name below `nav:` on its own, in CSS. */}
        <NameLogo className="zoom-[0.855]" href="/" />
        <nav aria-label="Primary" className="hidden items-center gap-3xl nav:flex">
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
        <NavMenuToggle onToggle={() => setMenuOpen((prev) => !prev)} open={menuOpen} />
      </div>
      <NavMenu
        items={items}
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        pathname={pathname}
      />
    </header>
  )
}
