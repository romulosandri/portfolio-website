import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { withContent } from './lib/content.mjs'

/**
 * Prints a simple two-page CV from src/content/*.ts.
 *
 * The PDF is a recruiter-facing cut of the same facts that ship as /resume.md
 * and /resume.json: recent roles with highlights, a short earlier-career line,
 * condensed skills, education, languages, and availability.
 */

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const OUT = path.join(ROOT, 'public', 'romulo-sandri-cv.pdf')

/** Andela freelance is the Meltwater contract wrapper — skip the duplicate. */
const SKIP = new Set(['Andela::Senior Product Designer (Freelance)'])
const FEATURED_FROM = 2022

const SKILL_CUT = {
  'Product Design': [
    'Product Strategy',
    'UX Design',
    'UI Design',
    'Interaction Design',
    '0 to 1 Product Design',
    'Mobile Design (iOS and Android)',
    'Web App Design',
    'Prototyping',
    'Design Systems',
  ],
  Engineering: ['React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Flutter', 'Supabase'],
  AI: ['AI-Native Product Design', 'AI Product Features', 'Prompt and Meta-Prompt Engineering'],
  Tools: ['Figma', 'Cursor', 'Framer', 'Claude'],
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function yearOf(iso) {
  return Number.parseInt(String(iso).slice(0, 4), 10)
}

function dateRange(start, end) {
  if (!end) return `${start} – Present`
  if (start === end) return start
  return `${start} – ${end}`
}

function keyOf(entry) {
  return `${entry.company}::${entry.position}`
}

function pickSkills(skillGroups) {
  return Object.entries(SKILL_CUT).map(([category, preferred]) => {
    const group = skillGroups.find((item) => item.category === category)
    const available = new Set(group?.skills ?? preferred)
    return { category, skills: preferred.filter((skill) => available.has(skill)) }
  })
}

function buildHtml({ site, resume }) {
  const featured = resume.experience.filter(
    (entry) => !SKIP.has(keyOf(entry)) && yearOf(entry.startDate) >= FEATURED_FROM,
  )
  const earlier = resume.experience.filter(
    (entry) => !SKIP.has(keyOf(entry)) && yearOf(entry.startDate) < FEATURED_FROM,
  )
  const linkedin = site.socials.find((link) => link.type === 'linkedin')
  const website = (site.url ?? 'https://romulosandri.com').replace(/\/$/, '')
  const skills = pickSkills(resume.skillGroups)

  const experienceHtml = featured
    .map((entry) => {
      const points = entry.highlights.slice(0, 2)
      const body =
        points.length > 0
          ? `<ul>${points.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
          : `<p class="summary">${escapeHtml(entry.summary)}</p>`
      return `
        <article class="job">
          <header>
            <h3>${escapeHtml(entry.position)} <span>${escapeHtml(entry.company)}</span></h3>
            <p class="meta">${escapeHtml(dateRange(entry.startDate, entry.endDate))} · ${escapeHtml(entry.location)}</p>
          </header>
          ${body}
        </article>`
    })
    .join('')

  const earlierHtml =
    earlier.length > 0
      ? `<p class="earlier">${earlier
          .map(
            (entry) =>
              `${escapeHtml(entry.position)}, ${escapeHtml(entry.company)} (${escapeHtml(dateRange(entry.startDate, entry.endDate))})`,
          )
          .join(' · ')}</p>`
      : ''

  const educationHtml = [
    ...resume.education.map((entry) => {
      const when = entry.endDate ? ` · ${entry.endDate}` : ''
      return `${escapeHtml(entry.studyType)} in ${escapeHtml(entry.area)}, ${escapeHtml(entry.institution)}${escapeHtml(when)}`
    }),
    ...resume.certificates.map((entry) => `${escapeHtml(entry.name)}, ${escapeHtml(entry.issuer)}`),
  ]

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(site.name)} — CV</title>
    <style>
      :root {
        --ink: #0e0907;
        --muted: #5d5548;
        --rule: #d9d2ce;
        --paper: #fbfbf8;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      @page { size: A4; margin: 0; }

      html, body {
        background: var(--paper);
        color: var(--ink);
        font: 9pt/1.35 "Helvetica Neue", Helvetica, Arial, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 13mm 14mm 12mm;
      }

      header.masthead {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--ink);
      }

      h1 {
        font-size: 22pt;
        font-weight: 600;
        letter-spacing: -0.03em;
        line-height: 1;
      }

      .role {
        margin-top: 6px;
        font-size: 11pt;
        color: var(--muted);
      }

      .contact {
        text-align: right;
        font-size: 8.6pt;
        line-height: 1.55;
        color: var(--muted);
      }

      .contact a { color: inherit; text-decoration: none; }

      section { margin-top: 11px; }

      h2 {
        margin-bottom: 5px;
        font-size: 8pt;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted);
      }

      .profile { max-width: 92%; }

      .job { break-inside: avoid; page-break-inside: avoid; }
      .job + .job { margin-top: 8px; }

      .job header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 16px;
      }

      .job h3 {
        font-size: 10pt;
        font-weight: 600;
        letter-spacing: -0.01em;
      }

      .job h3 span { font-weight: 500; color: var(--muted); }

      .meta {
        flex-shrink: 0;
        text-align: right;
        font-size: 8.4pt;
        color: var(--muted);
      }

      .summary { margin-top: 4px; }

      ul {
        margin: 3px 0 0 15px;
      }

      li + li { margin-top: 1px; }

      .earlier { color: var(--ink); }

      .skills {
        display: grid;
        gap: 4px 20px;
      }

      .skills p span {
        display: inline-block;
        min-width: 7.4em;
        margin-right: 0.6em;
        font-weight: 600;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1.3fr 0.9fr 1.2fr;
        gap: 16px;
      }

      .footer-grid p + p { margin-top: 3px; }
    </style>
  </head>
  <body>
    <div class="page">
      <header class="masthead">
        <div>
          <h1>${escapeHtml(site.name)}</h1>
          <p class="role">${escapeHtml(site.role)}</p>
        </div>
        <p class="contact">
          ${escapeHtml(site.location.city)}, ${escapeHtml(site.location.country)}<br />
          <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a><br />
          <a href="${escapeHtml(website)}">${escapeHtml(website.replace(/^https:\/\//, ''))}</a><br />
          ${linkedin ? `<a href="${escapeHtml(linkedin.href)}">linkedin.com/in/${escapeHtml(linkedin.username ?? 'romulo-sandri')}</a>` : ''}
        </p>
      </header>

      <section>
        <h2>Profile</h2>
        <p class="profile">${escapeHtml(site.blurb)} ${escapeHtml(String(resume.availability.yearsOfExperience))}+ years across product design, design systems, and front-end.</p>
      </section>

      <section>
        <h2>Experience</h2>
        ${experienceHtml}
      </section>

      ${
        earlierHtml
          ? `<section>
        <h2>Earlier</h2>
        ${earlierHtml}
      </section>`
          : ''
      }

      <section>
        <h2>Skills</h2>
        <div class="skills">
          ${skills
            .map(
              (group) =>
                `<p><span>${escapeHtml(group.category)}</span> ${escapeHtml(group.skills.join(', '))}</p>`,
            )
            .join('')}
        </div>
      </section>

      <section class="footer-grid">
        <div>
          <h2>Education</h2>
          ${educationHtml.map((line) => `<p>${line}</p>`).join('')}
        </div>
        <div>
          <h2>Languages</h2>
          ${resume.languages.map((entry) => `<p>${escapeHtml(entry.language)} — ${escapeHtml(entry.fluency)}</p>`).join('')}
        </div>
        <div>
          <h2>Availability</h2>
          <p>Open to remote contract and full-time.</p>
          <p>${escapeHtml(resume.availability.noticePeriod)}.</p>
        </div>
      </section>
    </div>
  </body>
</html>`
}

await withContent(async ({ site: siteMod, resume }) => {
  const site = { ...siteMod.site, url: siteMod.SITE_URL }
  const html = buildHtml({ site, resume })
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    await mkdir(path.dirname(OUT), { recursive: true })
    await page.pdf({
      path: OUT,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    })
  } finally {
    await browser.close()
  }

  console.log(`Wrote ${path.relative(ROOT, OUT)}`)
})
