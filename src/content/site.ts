// The canonical origin for this site. Every absolute URL in the app -- canonical
// tags, Open Graph, sitemap.xml, JSON-LD @id values -- is derived from this one
// constant, so pointing the site at a real domain is a single-line change.
// TODO: replace with the real production domain before deploying.
export const SITE_URL = 'https://romulosandri.com'

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

// `role` is the canonical job title. It is repeated in the home <h1>, the footer
// prose, resume.ts, and the JSON-LD Person entity; they must agree or entity
// extraction resolves them as different people.
// TODO: confirm this is the title you want to be found under. The site previously
// disagreed with itself: site.ts said "Product Designer" while the footer said
// "Senior Product Designer and Design Engineer".
export const site = {
  name: 'Rômulo Sandri',
  role: 'Product Designer',
  headline: 'Product designer and design engineer building AI-native products end to end.',
  blurb:
    'Hi, I am Rômulo Sandri, Product Designer based in Palmas, Brazil. I design, write code, and ship products people actually use, from the first conversation to the last pixel.',
  email: 'contact@romulosandri.com',
  whatsapp: '+5563984602704',
  whatsappHref: 'https://wa.me/5563984602704',
  location: {
    city: 'Palmas',
    region: 'Tocantins',
    country: 'Brazil',
    countryCode: 'BR',
    timezone: 'America/Araguaina',
  },
  // Feeds JSON-LD `sameAs`, the strongest signal search engines and LLMs use to
  // resolve this site to a real person. Placeholder URLs are worse than none,
  // so this ships empty until real profiles are filled in.
  // TODO: add real profile URLs (LinkedIn, GitHub, X, Dribbble, Read.cv).
  // The same placeholders still exist in FooterSection.tsx and ContactPage.tsx.
  sameAs: [] as string[],
}
