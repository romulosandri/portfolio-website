import { motion } from 'motion/react'
import { site } from '../content/site'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: `mailto:${site.email}`, label: 'Contact' },
]

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <a className="no-underline" href="#top">
        {site.name}
      </a>
      <nav className="flex items-center gap-4" aria-label="Primary">
        {links.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {link.label}
          </motion.a>
        ))}
      </nav>
    </header>
  )
}
