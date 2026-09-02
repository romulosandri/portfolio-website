import { projectBySlug, projectItems, workBySlug, workItems, type WorkItem } from '../content/portfolio'
import {
  allSkills,
  availability,
  certificates,
  education,
  experience,
  languages,
} from '../content/resume'
import type { PageMeta } from '../content/seo'
import { absoluteUrl, site, SITE_URL } from '../content/site'
import type { Route } from './router'

/**
 * Schema.org JSON-LD for every route.
 *
 * Everything points back to one stable Person @id so search engines and LLMs
 * resolve the whole site to a single entity rather than treating each page as
 * an unrelated document.
 */

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

type JsonLdNode = Record<string, unknown>

function personNode(): JsonLdNode {
  const currentRole = experience.find((entry) => entry.endDate === null)

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    url: SITE_URL,
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl(site.image),
      contentUrl: absoluteUrl(site.image),
      caption: `${site.name}, ${site.role}`,
      encodingFormat: 'image/jpeg',
    },
    jobTitle: [...site.roles],
    description: site.blurb,
    email: `mailto:${site.email}`,
    telephone: site.whatsapp,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.countryCode,
    },
    knowsAbout: allSkills,
    knowsLanguage: languages.map((entry) => entry.language),
    ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
    ...(currentRole ? { worksFor: { '@type': 'Organization', name: currentRole.company } } : {}),
    ...(education.some((entry) => entry.endDate === null)
      ? {
          affiliation: education
            .filter((entry) => entry.endDate === null)
            .map((entry) => ({
              '@type': 'EducationalOrganization',
              name: entry.institution,
            })),
        }
      : {}),
    ...(education.length > 0 || certificates.length > 0
      ? {
          hasCredential: [
            ...education.map((entry) => ({
              '@type': 'EducationalOccupationalCredential',
              name: `${entry.studyType} in ${entry.area}`,
              credentialCategory: entry.studyType,
              recognizedBy: {
                '@type': 'EducationalOrganization',
                name: entry.institution,
              },
              ...(entry.endDate === null ? { description: 'In progress' } : {}),
            })),
            ...certificates.map((entry) => ({
              '@type': 'EducationalOccupationalCredential',
              name: entry.name,
              credentialCategory: 'Certificate',
              recognizedBy: { '@type': 'Organization', name: entry.issuer },
            })),
          ],
        }
      : {}),
    hasOccupation: {
      '@type': 'Occupation',
      name: site.role,
      occupationalCategory: '27-1024.00', // O*NET: Graphic Designers / digital product design
      skills: allSkills.join(', '),
      experienceRequirements: `${availability.yearsOfExperience}+ years`,
    },
  }
}

function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: `${site.name} — ${site.role}`,
    description: site.blurb,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

function breadcrumbNode(meta: PageMeta): JsonLdNode | null {
  if (meta.breadcrumbs.length === 0) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: meta.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

function caseStudyNode(item: WorkItem, meta: PageMeta): JsonLdNode {
  return {
    '@type': 'CreativeWork',
    '@id': `${absoluteUrl(item.href)}#work`,
    name: item.title,
    headline: item.title,
    url: absoluteUrl(item.href),
    description: item.summary || item.description,
    abstract: item.summary,
    text: item.description,
    keywords: item.tags.join(', '),
    creator: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
    dateCreated: item.startDate,
    ...(item.endDate ? { datePublished: item.endDate } : {}),
    image: absoluteUrl(meta.ogImage),
    inLanguage: 'en',
    about: item.tags,
    ...(item.client && item.client !== 'Freelance'
      ? {
          sourceOrganization: {
            '@type': 'Organization',
            name: item.client,
            ...(item.url ? { url: item.url } : {}),
          },
        }
      : {}),
    ...(item.url
      ? {
          isBasedOn: {
            '@type': 'WebSite',
            name: item.title,
            url: item.url,
          },
        }
      : {}),
    // `delivered` carries the substance of the case study. Without it the only
    // machine-readable content here would be a single paragraph.
    mentions: item.delivered.map((entry) => ({
      '@type': 'Thing',
      name: entry,
    })),
  }
}

function collectionNode(
  name: string,
  path: string,
  items: WorkItem[],
): JsonLdNode {
  return {
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(path)}#collection`,
    name,
    url: absoluteUrl(path),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(item.href),
        name: item.title,
      })),
    },
  }
}

/** Builds the full `@graph` for a route. */
export function buildJsonLd(route: Route, meta: PageMeta): string {
  const graph: JsonLdNode[] = [personNode(), websiteNode()]

  const breadcrumbs = breadcrumbNode(meta)
  if (breadcrumbs) graph.push(breadcrumbs)

  switch (route.name) {
    case 'home':
      graph.push({
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: meta.title,
        description: meta.description,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
      })
      break

    case 'notFound':
      break

    case 'work':
      graph.push(collectionNode('Work', '/work', workItems))
      break

    case 'projects':
      graph.push(collectionNode('Projects', '/projects', projectItems))
      break

    case 'workDetail': {
      const item = workBySlug(route.slug)
      if (item) graph.push(caseStudyNode(item, meta))
      break
    }

    case 'projectDetail': {
      const item = projectBySlug(route.slug)
      if (item) graph.push(caseStudyNode(item, meta))
      break
    }

    case 'contact':
      graph.push({
        '@type': 'ContactPage',
        '@id': `${absoluteUrl('/contact')}#contactpage`,
        url: absoluteUrl('/contact'),
        name: meta.title,
        description: meta.description,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: {
          '@type': 'ContactPoint',
          contactType: 'Professional enquiries',
          email: site.email,
          telephone: site.whatsapp,
          availableLanguage: languages.map((entry) => entry.language),
        },
      })
      break

    case 'howAi':
      graph.push({
        '@type': 'Article',
        '@id': `${absoluteUrl('/how-i-use-ai')}#article`,
        url: absoluteUrl('/how-i-use-ai'),
        headline: 'How I use AI',
        description: meta.description,
        author: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en',
      })
      break

    default:
      break
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}
