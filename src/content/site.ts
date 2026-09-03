// The canonical origin for this site. Every absolute URL in the app -- canonical
// tags, Open Graph, sitemap.xml, JSON-LD @id values -- is derived from this one
// constant, so pointing the site at a real domain is a single-line change.
export const SITE_URL = 'https://romulosandri.com'

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

// Public address shown on the site. Clicking it copies this value. Form
// submissions are delivered to CONTACT_TO_EMAIL (Gmail), not this inbox.
const EMAIL = 'contact@romulosandri.com'
export const BLOG_URL = 'https://sandriromulo.substack.com/'

export type SocialLink = {
  type: 'email' | 'github' | 'x' | 'linkedin' | 'instagram'
  href: string
  label: string
  username?: string
}

export const socialLinks: SocialLink[] = [
  { type: 'email', href: `mailto:${EMAIL}`, label: 'Email' },
  { type: 'github', href: 'https://github.com/romulosandri', label: 'GitHub', username: 'romulosandri' },
  { type: 'x', href: 'https://x.com/sandri_romulo', label: 'X', username: 'sandri_romulo' },
  {
    type: 'linkedin',
    href: 'https://www.linkedin.com/in/romulo-sandri/',
    label: 'LinkedIn',
    username: 'romulo-sandri',
  },
  {
    type: 'instagram',
    href: 'https://www.instagram.com/rom_bunnyhop/',
    label: 'Instagram',
    username: 'rom_bunnyhop',
  },
]

const profileLinks = socialLinks.filter((link) => link.type !== 'email')

// `role` is the canonical job title (Senior Product Designer). It is repeated
// in the home <h1> sr-text, the footer prose, page titles, and the JSON-LD
// Person entity; they must agree or entity extraction resolves them as different
// people. `roles` is that title plus the fallbacks that are also accurate
// (Product Designer, Design Engineer) — JSON-LD `jobTitle` and agent docs
// publish all of them, with `role` first.
export const site = {
  name: 'Rômulo Sandri',
  role: 'Senior Product Designer',
  roles: ['Senior Product Designer', 'Product Designer', 'Design Engineer'] as const,
  headline: 'Senior product designer and design engineer building AI-native products end to end.',
  blurb:
    'Hi, I am Rômulo Sandri, Senior Product Designer based in Palmas, Brazil. I design, write code, and ship products people actually use, from the first conversation to the last pixel.',
  email: EMAIL,
  whatsapp: '+5563984602704',
  whatsappHref: 'https://wa.me/5563984602704',
  booking: {
    href: 'https://cal.com/romulo-sandri-rodrigues-pxfqen/meet-romulo',
    label: 'Schedule a Call',
  },
  location: {
    city: 'Palmas',
    region: 'Tocantins',
    country: 'Brazil',
    countryCode: 'BR',
    timezone: 'America/Araguaina',
  },
  socials: socialLinks,
  blog: {
    href: BLOG_URL,
    label: 'Blog',
    network: 'Substack',
    username: 'sandriromulo',
  },
  // Feeds JSON-LD `sameAs`, the strongest signal search engines and LLMs use to
  // resolve this site to a real person.
  sameAs: [...profileLinks.map((link) => link.href), BLOG_URL],
  // Square JPEG used as JSON-LD Person.image and JSON Resume basics.image.
  image: '/images/romulo-sandri.jpg',
}
