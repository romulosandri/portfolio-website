import { socialLinks } from '../content/site'
import { track } from '../lib/analytics'
import { SocialIcon } from './SocialIcon'

export function SocialLinks() {
  return (
    <div className="flex items-center gap-xl">
      {socialLinks
        .filter((item) => item.type !== 'email')
        .map((item) => (
          <a
            aria-label={item.label}
            href={item.href}
            key={item.type}
            onClick={() =>
              track('social_link_clicked', {
                network: item.type,
                href: item.href,
                pathname: window.location.pathname,
              })
            }
          >
            <SocialIcon type={item.type} />
          </a>
        ))}
    </div>
  )
}
