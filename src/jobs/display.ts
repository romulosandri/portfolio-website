import type { Job } from './types'

function parseUrl(value?: string | null) {
  if (!value) return null
  try {
    return new URL(value)
  } catch {
    return null
  }
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

const LOGO_DEV_TOKEN =
  import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY || 'pk_D9nSZaDCS1eMyOpdLJw9UQ'

function logoDevImageUrl(name: string) {
  const params = new URLSearchParams({
    token: LOGO_DEV_TOKEN,
    size: '64',
    format: 'webp',
    theme: 'light',
    retina: 'true',
    fallback: '404',
  })
  return `https://img.logo.dev/name/${encodeURIComponent(name)}?${params}`
}

export function companyLogoUrl(name?: string | null) {
  const trimmed = name?.trim()
  return trimmed ? logoDevImageUrl(trimmed) : null
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
