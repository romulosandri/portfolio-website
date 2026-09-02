import { site, socialLinks } from '../content/site'
import { CopyEmail } from './CopyEmail'
import { SocialIcon } from './SocialIcon'

export function SocialLinks() {
  return (
    <div className="flex items-center gap-xl">
      {socialLinks.map((item) =>
        item.type === 'email' ? (
          <CopyEmail aria-label={`Copy ${site.email}`} className="inline-flex" key={item.type}>
            <SocialIcon type={item.type} />
          </CopyEmail>
        ) : (
          <a aria-label={item.label} href={item.href} key={item.type}>
            <SocialIcon type={item.type} />
          </a>
        ),
      )}
    </div>
  )
}
