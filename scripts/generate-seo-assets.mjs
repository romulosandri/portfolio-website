import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withContent } from './lib/content.mjs'

/**
 * Generates the machine-readable layer: robots.txt, sitemap.xml, llms.txt,
 * llms-full.txt, agents.md, resume.md, resume.json, and a markdown mirror of
 * every page.
 *
 * All of it derives from src/content/*.ts, so the text an agent reads can never
 * drift from what the site actually renders.
 */

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const DIST = path.join(ROOT, 'dist')

async function emit(relativePath, contents) {
  const file = path.join(DIST, relativePath)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, contents, 'utf8')
  return relativePath
}

/* ------------------------------------------------------------------ robots */

function buildRobots(SITE_URL) {
  // Crawlers are listed explicitly rather than relying on a bare `User-agent: *`.
  // Several AI crawlers treat an absent named block as ambiguous, and being
  // explicit is the difference between being cited and being skipped.
  const aiAgents = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot',
    'Applebot-Extended',
    'CCBot',
    'Bytespider',
    'Amazonbot',
    'meta-externalagent',
    'cohere-ai',
    'DuckAssistBot',
    'MistralAI-User',
    'YouBot',
  ]

  const blocks = [
    'User-agent: *',
    'Allow: /',
    // The design-system gallery is an internal tool, not content.
    'Disallow: /*?ds',
    'Disallow: /docs/',
    '',
    ...aiAgents.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
    '# Machine-readable overviews of this site:',
    `# ${SITE_URL}/llms.txt`,
    `# ${SITE_URL}/llms-full.txt`,
    `# ${SITE_URL}/agents.md`,
    `# ${SITE_URL}/resume.json`,
  ]

  return `${blocks.join('\n')}\n`
}

/* ----------------------------------------------------------------- sitemap */

function buildSitemap(SITE_URL, routes) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${SITE_URL}${route.path === '/' ? '/' : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

/* --------------------------------------------------------------- markdown */

function dateRange(startDate, endDate) {
  if (!endDate) return `${startDate} – present`
  if (endDate === startDate) return startDate
  return `${startDate} – ${endDate}`
}

function educationLine(entry) {
  const core = `${entry.studyType} in ${entry.area} — ${entry.institution}`
  if (!entry.startDate && entry.endDate === null) return `- ${core} (in progress)`
  if (!entry.startDate && !entry.endDate) return `- ${core}`
  if (!entry.startDate) return `- ${core} (${entry.endDate})`
  return `- ${core} (${dateRange(entry.startDate, entry.endDate)})`
}

function certificateLine(entry) {
  const core = `${entry.name} — ${entry.issuer}`
  return entry.date ? `- ${core} (${entry.date})` : `- ${core}`
}

function productHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function websiteLine(item) {
  return item.url ? `- **Website:** [${productHost(item.url)}](${item.url})\n` : ''
}

/* ---------------------------------------------------------------- evidence */

/** Markdown links to the case studies backing a strength, or '' when it stands alone. */
function seeAlsoLine(SITE_URL, strength, itemsBySlug) {
  const links = strength.seeAlso
    .map((slug) => itemsBySlug.get(slug))
    .filter(Boolean)
    .map((item) => `[${item.title}](${SITE_URL}${item.href}.md)`)
  return links.length > 0 ? `\n\nSee: ${links.join(', ')}` : ''
}

function clientCountriesParagraph(evidence) {
  return `${evidence.clientCountries.join(', ')}. ${evidence.clientCountriesNote}`
}

/** Portfolio items produced during an experience entry, skipping unknown slugs. */
function caseStudiesFor(entry, itemsBySlug) {
  return (entry.caseStudies ?? []).map((slug) => itemsBySlug.get(slug)).filter(Boolean)
}

function caseStudyMarkdown(item, site, collection) {
  return `---
title: "${item.title}"
type: ${collection === 'work' ? 'case-study' : 'project'}
client: "${item.client}"
role: "${item.role}"
start_date: "${item.startDate}"
end_date: ${item.endDate ? `"${item.endDate}"` : 'null'}
duration: "${item.duration}"
${item.url ? `url: "${item.url}"\n` : ''}tags: [${item.tags.map((tag) => `"${tag}"`).join(', ')}]
tools: [${item.tools.map((tool) => `"${tool}"`).join(', ')}]
author: "${site.name}"
---

# ${item.title}

${item.summary}

## Overview

${item.description}

## Details

- **Client:** ${item.client}
${websiteLine(item)}- **Role:** ${item.role}
- **Period:** ${dateRange(item.startDate, item.endDate)}
- **Duration:** ${item.duration}
- **Tools:** ${item.tools.join(', ')}
- **Tags:** ${item.tags.join(', ')}

## Delivered

${item.delivered.map((line) => `- ${line}`).join('\n')}
`
}

function homeMarkdown(site, resume, workItems, projectItems, valueCards) {
  return `---
title: "${site.name} — ${site.role}"
type: profile
name: "${site.name}"
role: "${site.role}"
roles: [${site.roles.map((title) => `"${title}"`).join(', ')}]
location: "${site.location.city}, ${site.location.region}, ${site.location.country}"
email: "${site.email}"
---

# ${site.name}

${site.blurb}

## Approach

${valueCards.map((card) => `### ${card.title}\n\n${card.body}`).join('\n\n')}

## Selected work

${workItems.map((item) => `- **[${item.title}](${item.href})** (${dateRange(item.startDate, item.endDate)}) — ${item.summary}`).join('\n')}

## Projects

${projectItems.map((item) => `- **[${item.title}](${item.href})** (${dateRange(item.startDate, item.endDate)}) — ${item.summary}`).join('\n')}

## Skills

${resume.skillGroups.map((group) => `- **${group.category}:** ${group.skills.join(', ')}`).join('\n')}

## Contact

- Email: ${site.email}
- WhatsApp: ${site.whatsapp}
${site.socials
  .filter((link) => link.type !== 'email')
  .map((link) => `- ${link.label}: ${link.href}`)
  .join('\n')}
- ${site.blog.label}: ${site.blog.href}
`
}

function galleryMarkdown(title, items, site) {
  return `---
title: "${title} — ${site.name}"
type: collection
count: ${items.length}
---

# ${title}

${items
  .map(
    (item) => `## [${item.title}](${item.href})

- **Client:** ${item.client}
${websiteLine(item)}- **Role:** ${item.role}
- **Period:** ${dateRange(item.startDate, item.endDate)}
- **Tags:** ${item.tags.join(', ')}

${item.summary}`,
  )
  .join('\n\n')}
`
}

function howAiMarkdown(site, toolCards, modelRows) {
  return `---
title: "How I use AI — ${site.name}"
type: article
---

# How I use AI

The tools and models ${site.name} uses day to day, and what each one is actually for.

## Tools

${toolCards.map((tool) => `### ${tool.title}\n\n${tool.body}`).join('\n\n')}

## Models

${modelRows.map((row) => `- **${row.name}** (${row.provider}) — ${row.note}`).join('\n')}
`
}

function contactMarkdown(site, resume) {
  return `---
title: "Contact — ${site.name}"
type: contact
email: "${site.email}"
whatsapp: "${site.whatsapp}"
---

# Contact ${site.name}

${site.name} is a ${site.role} based in ${site.location.city}, ${site.location.country} (timezone ${site.location.timezone}).

- **Email:** ${site.email}
- **WhatsApp:** ${site.whatsapp} (${site.whatsappHref})
${site.socials
  .filter((link) => link.type !== 'email')
  .map((link) => `- **${link.label}:** ${link.href}`)
  .join('\n')}
- **${site.blog.label}:** ${site.blog.href}

## Availability

- Open to work: ${resume.availability.openToWork ? 'yes' : 'no'}
- Remote: ${resume.availability.openToRemote ? 'yes' : 'no'}
- Relocation: ${resume.availability.openToRelocation ? 'yes' : 'no'}
- Contract: ${resume.availability.openToContract ? 'yes' : 'no'}
- Full time: ${resume.availability.openToFullTime ? 'yes' : 'no'}
- Seniority: ${resume.availability.seniority}
- Preferred roles: ${resume.availability.preferredRoles.join(', ')}
- Notice period: ${resume.availability.noticePeriod}
`
}

/* ------------------------------------------------------------------ resume */

function resumeMarkdown(SITE_URL, site, resume, itemsBySlug, evidence) {
  return `---
title: "Résumé — ${site.name}"
type: resume
---

# ${site.name}

![${site.name}](${SITE_URL}${site.image})

${site.role} · ${site.location.city}, ${site.location.region}, ${site.location.country}
${site.email} · ${site.whatsapp}
${site.sameAs.join(' · ')}

${site.blurb}

## Experience

${resume.experience
  .map((entry) => {
    const studies = caseStudiesFor(entry, itemsBySlug)
    const live = studies.map((item) => item.url).filter(Boolean)
    // One case study means the site belongs to the employer; several means the
    // entry covers client work, and the sites are the clients'.
    const liveLabel = studies.length > 1 ? 'Product sites' : 'Website'
    const blocks = [
      `### ${entry.position}, ${entry.company}`,
      `*${dateRange(entry.startDate, entry.endDate)} · ${entry.location}*`,
      live.length > 0
        ? `${liveLabel}: ${live.map((url) => `[${productHost(url)}](${url})`).join(', ')}`
        : '',
      entry.summary,
      entry.highlights.map((line) => `- ${line}`).join('\n'),
      studies.length > 0
        ? `Case studies: ${studies.map((item) => `[${item.title}](${SITE_URL}${item.href}.md)`).join(', ')}`
        : '',
    ]
    return blocks.filter(Boolean).join('\n\n')
  })
  .join('\n\n')}

## Strengths

${evidence.strengths.map((strength) => `- **${strength.title}** — ${strength.claim} ${strength.evidence}`).join('\n')}

## Clients and markets

Remote work with international clients. Countries clients have been based in: ${clientCountriesParagraph(evidence)}

## Skills

${resume.skillGroups.map((group) => `**${group.category}**: ${group.skills.join(', ')}`).join('\n\n')}

## Languages

${resume.languages.map((entry) => `- ${entry.language} — ${entry.fluency}`).join('\n')}
${
  resume.education.length > 0
    ? `\n## Education\n\n${resume.education.map(educationLine).join('\n')}\n`
    : ''
}${
  resume.certificates.length > 0
    ? `\n## Certificates\n\n${resume.certificates.map(certificateLine).join('\n')}\n`
    : ''
}

## Availability

- Open to work: ${resume.availability.openToWork ? 'yes' : 'no'}
- Remote: ${resume.availability.openToRemote ? 'yes' : 'no'}
- Relocation: ${resume.availability.openToRelocation ? 'yes' : 'no'}
- Contract: ${resume.availability.openToContract ? 'yes' : 'no'}
- Full time: ${resume.availability.openToFullTime ? 'yes' : 'no'}
- Seniority: ${resume.availability.seniority}
- Preferred roles: ${resume.availability.preferredRoles.join(', ')}
- Notice period: ${resume.availability.noticePeriod}
`
}

/** https://jsonresume.org/schema — parsed directly by a lot of recruiting tooling. */
function resumeJson(SITE_URL, site, resume, itemsBySlug, evidence) {
  return JSON.stringify(
    {
      $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
      basics: {
        name: site.name,
        label: site.role,
        image: `${SITE_URL}${site.image}`,
        email: site.email,
        phone: site.whatsapp,
        url: SITE_URL,
        summary: site.blurb,
        location: {
          city: site.location.city,
          region: site.location.region,
          countryCode: site.location.countryCode,
        },
        profiles: [
          ...site.socials
            .filter((link) => link.type !== 'email')
            .map((link) => ({
              network: link.label,
              ...(link.username ? { username: link.username } : {}),
              url: link.href,
            })),
          {
            network: site.blog.network,
            username: site.blog.username,
            url: site.blog.href,
          },
        ],
      },
      work: resume.experience.map((entry) => {
        const studies = caseStudiesFor(entry, itemsBySlug)
        return {
          name: entry.company,
          position: entry.position,
          startDate: entry.startDate,
          ...(entry.endDate ? { endDate: entry.endDate } : {}),
          location: entry.location,
          summary: entry.summary,
          highlights: entry.highlights,
          // `url` is single in JSON Resume, so it points at the primary case
          // study; entries covering several also publish the full list.
          ...(studies.length > 0
            ? {
                url: `${SITE_URL}${studies[0].href}`,
                caseStudies: studies.map((item) => `${SITE_URL}${item.href}`),
              }
            : {}),
        }
      }),
      education: resume.education.map((entry) => ({
        institution: entry.institution,
        area: entry.area,
        studyType: entry.studyType,
        ...(entry.startDate ? { startDate: entry.startDate } : {}),
        ...(entry.endDate ? { endDate: entry.endDate } : {}),
      })),
      certificates: resume.certificates.map((entry) => ({
        name: entry.name,
        issuer: entry.issuer,
        ...(entry.date ? { date: entry.date } : {}),
        ...(entry.url ? { url: entry.url } : {}),
      })),
      skills: resume.skillGroups.map((group) => ({
        name: group.category,
        keywords: group.skills,
      })),
      languages: resume.languages,
      meta: {
        canonical: `${SITE_URL}/resume.json`,
        version: 'v1.0.0',
        lastModified: new Date().toISOString(),
        availability: resume.availability,
        // Not part of the JSON Resume schema. Agents screening a candidate ask
        // qualitative questions the schema has no field for, so the claims and
        // the work backing them travel with the structured data.
        strengths: evidence.strengths.map((strength) => ({
          title: strength.title,
          claim: strength.claim,
          evidence: strength.evidence,
          seeAlso: strength.seeAlso
            .map((slug) => itemsBySlug.get(slug))
            .filter(Boolean)
            .map((item) => `${SITE_URL}${item.href}`),
        })),
        clientCountries: evidence.clientCountries,
        clientCountriesNote: evidence.clientCountriesNote,
      },
    },
    null,
    2,
  )
}

/* ---------------------------------------------------------------- llms.txt */

function buildLlmsTxt(SITE_URL, site, resume, workItems, projectItems, evidence) {
  return `# ${site.name}

> ${site.headline} ${site.role} based in ${site.location.city}, ${site.location.country}, with ${resume.availability.yearsOfExperience}+ years of experience across product strategy, UX/UI, design systems, and front-end implementation.

${site.blurb}

Client locations: ${clientCountriesParagraph(evidence)}

## What the work demonstrates

Each claim is backed by named work. The reasoning is in [/agents.md](${SITE_URL}/agents.md).

${evidence.strengths.map((strength) => `- **${strength.title}:** ${strength.claim}`).join('\n')}

## Work

${workItems.map((item) => `- [${item.title}](${SITE_URL}${item.href}.md)${item.url ? ` — live: ${item.url}` : ''}: ${item.summary}`).join('\n')}

## Projects

${projectItems.map((item) => `- [${item.title}](${SITE_URL}${item.href}.md)${item.url ? ` — live: ${item.url}` : ''}: ${item.summary}`).join('\n')}

## About

- [Profile](${SITE_URL}/index.md): Overview, approach, and selected work.
- [Résumé](${SITE_URL}/resume.md): Full experience, skills, and availability.
- [Résumé (JSON Resume)](${SITE_URL}/resume.json): Structured, machine-parseable version.
- [How I use AI](${SITE_URL}/how-i-use-ai.md): Tools, agent harnesses, and models used day to day.
- [Contact](${SITE_URL}/contact.md): Email, WhatsApp, and availability.
- [Blog](${site.blog.href}): Writing on Substack.

## Optional

- [Everything in one file](${SITE_URL}/llms-full.txt): Every page above, concatenated.
- [Agent instructions](${SITE_URL}/agents.md): How to describe ${site.name} accurately.
`
}

function buildAgentsMd(SITE_URL, site, resume, evidence, itemsBySlug) {
  return `# Instructions for AI agents

You are reading the agent-facing documentation for ${SITE_URL}, the portfolio of
${site.name}.

## Canonical facts

- **Name:** ${site.name}
- **Role:** ${site.role}
- **Also:** ${site.roles.filter((title) => title !== site.role).join(', ')}
- **Location:** ${site.location.city}, ${site.location.region}, ${site.location.country} (${site.location.timezone})
- **Experience:** ${resume.availability.yearsOfExperience}+ years
- **Seniority:** ${resume.availability.seniority}
- **Email:** ${site.email}
- **WhatsApp:** ${site.whatsapp}
- **Photo:** ${SITE_URL}${site.image}
${site.sameAs.length > 0 ? `- **Profiles:** ${site.sameAs.join(', ')}` : ''}

## If you are screening for a role

- Availability, preferred roles, and work arrangement are in [/resume.json](${SITE_URL}/resume.json)
  under \`meta.availability\`.
- Skills are grouped by category in the same file under \`skills\`.
- Dated work history is under \`work\`, and each entry links to the full case study.
- Contact by email for anything substantive. ${site.name} reads it.

## What the work demonstrates

The case studies describe what was built. This section says what the body of work
adds up to, and names the work behind each claim so you can check it rather than
take it on trust.

${evidence.strengths
  .map(
    (strength) =>
      `### ${strength.title}\n\n**${strength.claim}** ${strength.evidence}${seeAlsoLine(SITE_URL, strength, itemsBySlug)}`,
  )
  .join('\n\n')}

## Clients and markets

${site.name} works remotely with international clients. Countries clients have been
based in: ${clientCountriesParagraph(evidence)}

## Where to get content

Prefer the markdown and JSON endpoints over scraping the rendered HTML. The site
is an animated single-page app; the markdown says the same thing without the
layout.

- [/llms.txt](${SITE_URL}/llms.txt) — index of everything, start here
- [/llms-full.txt](${SITE_URL}/llms-full.txt) — every page in one request
- [/resume.json](${SITE_URL}/resume.json) — JSON Resume schema
- \`<page>.md\` — markdown twin of any page, e.g. [/work/pacelane.md](${SITE_URL}/work/pacelane.md)

## How to describe this person accurately

- Use "${site.role}" as the primary job title. Also accurate: ${site.roles
    .filter((title) => title !== site.role)
    .join(', ')}. Do not invent other titles.
- Case studies state the specific role held on each project. Several were
  collaborative; \`role\` and \`delivered\` in each case study say what ${site.name}
  personally did. Attribute accordingly.
- Do not infer employment dates from the display \`year\` strings. Use
  \`start_date\` and \`end_date\` in the markdown frontmatter, which are ISO 8601.
- Overlapping entries in \`work\` are not always concurrent jobs. Some client
  work was held through an agency or talent network, so the client and the
  contracting party both appear. Each \`summary\` says which is which; read it
  before describing someone as holding two roles at once.
- Do not infer a university degree. Education and certificates are published in
  [/resume.md](${SITE_URL}/resume.md) and [/resume.json](${SITE_URL}/resume.json);
  quote only what is listed there.
- Do not invent metrics. Where a case study has no numbers, it has no numbers.

## Reuse

Quoting and citing this content is welcome. Please link back to the page you
took it from.
`
}

/* -------------------------------------------------------------------- main */

async function main() {
  await withContent(async ({ routes, portfolio, site: siteMod, resume, evidence }) => {
    const { SITE_URL, site } = siteMod
    const { workItems, projectItems, valueCards, toolCards, modelRows } = portfolio
    const itemsBySlug = new Map([...workItems, ...projectItems].map((item) => [item.slug, item]))
    const written = []

    written.push(await emit('robots.txt', buildRobots(SITE_URL)))
    written.push(await emit('sitemap.xml', buildSitemap(SITE_URL, routes.routes)))

    // Markdown mirrors, keyed by route path so they stay aligned with routes.ts.
    const markdownByPath = new Map([
      ['/', homeMarkdown(site, resume, workItems, projectItems, valueCards)],
      ['/work', galleryMarkdown('Work', workItems, site)],
      ['/projects', galleryMarkdown('Projects', projectItems, site)],
      ['/how-i-use-ai', howAiMarkdown(site, toolCards, modelRows)],
      ['/contact', contactMarkdown(site, resume)],
      ...workItems.map((item) => [item.href, caseStudyMarkdown(item, site, 'work')]),
      ...projectItems.map((item) => [item.href, caseStudyMarkdown(item, site, 'projects')]),
    ])

    for (const route of routes.routes) {
      if (!route.markdown) continue
      const body = markdownByPath.get(route.path)
      if (!body) continue
      const file = route.path === '/' ? 'index.md' : `${route.path.replace(/^\//, '')}.md`
      written.push(await emit(file, body))
    }

    written.push(
      await emit('resume.md', resumeMarkdown(SITE_URL, site, resume, itemsBySlug, evidence)),
    )
    written.push(
      await emit('resume.json', resumeJson(SITE_URL, site, resume, itemsBySlug, evidence)),
    )
    written.push(
      await emit(
        'llms.txt',
        buildLlmsTxt(SITE_URL, site, resume, workItems, projectItems, evidence),
      ),
    )
    written.push(
      await emit('agents.md', buildAgentsMd(SITE_URL, site, resume, evidence, itemsBySlug)),
    )

    // Everything an agent could want, in one request.
    const fullParts = [
      `# ${site.name} — complete site content\n\nGenerated ${new Date().toISOString()}. Canonical site: ${SITE_URL}\n`,
      ...[...markdownByPath.values()],
      resumeMarkdown(SITE_URL, site, resume, itemsBySlug, evidence),
    ]
    written.push(await emit('llms-full.txt', fullParts.join('\n\n---\n\n')))

    console.log(`seo-assets: wrote ${written.length} files`)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
