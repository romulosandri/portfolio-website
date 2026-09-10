import type { Job } from './types'

const JOB_BOARD_HOSTS = new Set([
  '4dayweek.io',
  'himalayas.app',
  'job-boards.greenhouse.io',
  'jobs.ashbyhq.com',
  'jobs.lever.co',
  'jobs.smartrecruiters.com',
  'jobs.workable.com',
  'recruiting.breezy.hr',
  'uiuxjobsboard.com',
  'wellfound.com',
  'www.builtincolorado.com',
  'www.builtinsf.com',
  'www.indeed.com',
  'www.remoterocketship.com',
])

function parseUrl(value?: string | null) {
  if (!value) return null
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function normalizeHost(value?: string | null) {
  if (!value) return null
  return value.replace(/^www\./, '').toLowerCase()
}

function isJobBoardHost(host: string) {
  const bare = normalizeHost(host) ?? host
  return JOB_BOARD_HOSTS.has(host) || JOB_BOARD_HOSTS.has(bare) || JOB_BOARD_HOSTS.has(`www.${bare}`)
}

function slugToDomain(slug?: string | null) {
  if (!slug) return null
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '')
  return clean ? `${clean}.com` : null
}

function titleCaseSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function displayCompany(job: Job) {
  if (job.company?.trim()) return job.company.trim()

  const url = parseUrl(job.apply_url || job.url)
  if (!url) return 'Unknown'

  const parts = url.pathname.split('/').filter(Boolean)
  const host = url.hostname.replace(/^www\./, '')

  if (host.includes('himalayas') && parts[0] === 'companies' && parts[1]) {
    return titleCaseSlug(parts[1])
  }
  if ((host.includes('greenhouse') || host.includes('ashby') || host.includes('lever.co')) && parts[0]) {
    return titleCaseSlug(parts[0])
  }
  if (host.endsWith('.breezy.hr') || host.endsWith('.teamtailor.com') || host.endsWith('.getro.com')) {
    return titleCaseSlug(host.split('.')[0] ?? 'Unknown')
  }

  return titleCaseSlug(host.split('.')[0] ?? 'Unknown')
}

export function resolveCompanyDomain(urlValue?: string | null, company?: string | null) {
  const url = parseUrl(urlValue)
  if (url) {
    const host = normalizeHost(url.hostname) ?? url.hostname
    const parts = url.pathname.split('/').filter(Boolean)

    if (host.endsWith('.breezy.hr') && host !== 'recruiting.breezy.hr') {
      return slugToDomain(host.split('.')[0])
    }
    if (host.endsWith('.teamtailor.com') || host.endsWith('.getro.com')) {
      return slugToDomain(host.split('.')[0])
    }
    if (host.includes('greenhouse') || host.includes('ashby') || host.includes('lever.co')) {
      return slugToDomain(parts[0])
    }
    if (host.includes('himalayas') && parts[0] === 'companies') {
      return slugToDomain(parts[1])
    }
    if (!isJobBoardHost(url.hostname) && !isJobBoardHost(host)) {
      return host
    }
  }

  return slugToDomain(company)
}

export function companyLogoDomain(job: Job) {
  const stored = normalizeHost(job.company_domain)
  if (stored && !isJobBoardHost(stored)) return stored
  return resolveCompanyDomain(job.apply_url || job.url, job.company)
}

const LOGO_DEV_TOKEN =
  import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY || 'pk_D9nSZaDCS1eMyOpdLJw9UQ'

function logoDevImageUrl(path: string) {
  const params = new URLSearchParams({
    token: LOGO_DEV_TOKEN,
    size: '64',
    format: 'webp',
    theme: 'light',
    retina: 'true',
    fallback: '404',
  })
  return `https://img.logo.dev/${path}?${params}`
}

export function companyLogoUrl(input: { domain?: string | null; name?: string | null }) {
  const domain = input.domain?.trim()
  if (domain) return logoDevImageUrl(encodeURIComponent(domain))

  const name = input.name?.trim()
  if (name) return logoDevImageUrl(`name/${encodeURIComponent(name)}`)

  return null
}

export function formatLocation(job: Job) {
  return job.location?.trim() || job.remote_string?.trim() || '—'
}

const addedDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
})

export function formatAddedDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return addedDateFormatter.format(date)
}

export function applyUrl(job: Job) {
  return job.apply_url || job.url
}

export function isJobFavorite(job: Job) {
  return Number(job.is_favorite) === 1
}

export function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}
