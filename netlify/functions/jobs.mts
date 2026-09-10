import type { Config } from '@netlify/functions'
import { getDb } from './_shared/db.ts'
import { rejectIfInvalidPassword, requiresJobsPassword } from './_shared/jobs-auth.ts'
import { captureServerEvent, captureServerException } from './_shared/posthog.ts'
import {
  firstVisibleColumnId,
  listKanbanColumns,
  parseColumns,
  replaceKanbanColumns,
} from './_shared/kanban.ts'

type JobRow = {
  id: string
  source: string
  external_id: string
  company: string | null
  company_domain: string | null
  title: string
  location: string | null
  remote_string: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  seniority: string | null
  url: string
  apply_url: string | null
  description_snippet: string | null
  posted_at: string | null
  selected_at: string
  is_live: number
  status: string
  source_channel: string | null
  is_favorite: number
}

function asStatus(value: unknown) {
  if (typeof value !== 'string') return null
  const status = value.trim().toLowerCase()
  if (!status || status.length > 64) return null
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(status)) return null
  return status
}

type Mutation =
  | { action: 'delete'; ids: string[] }
  | { action: 'setStatus'; ids: string[]; status: string }
  | { action: 'setFavorite'; ids: string[]; favorite?: unknown }
  | { action: 'setColumns'; columns?: unknown }
  | { action: 'create'; title?: unknown; company?: unknown; url?: unknown; location?: unknown }
  | { action: 'update'; id?: unknown; title?: unknown; company?: unknown; url?: unknown; location?: unknown }

const JOB_COLUMNS = `id, source, external_id, company, company_domain, title, location,
  remote_string, salary_min, salary_max, salary_currency, seniority,
  url, apply_url, description_snippet, posted_at, selected_at,
  is_live, status, source_channel, is_favorite`

function asFavorite(value: unknown) {
  if (typeof value === 'boolean') return value
  if (value === 1 || value === '1') return true
  if (value === 0 || value === '0') return false
  return null
}

function favoriteFlag(value: unknown) {
  return value === 1 || value === true || value === '1' ? 1 : 0
}

async function ensureFavoriteColumn(db: ReturnType<typeof getDb>) {
  const info = await db.execute('PRAGMA table_info(jobs)')
  const exists = info.rows.some((row) => String(row.name) === 'is_favorite')
  if (exists) return

  try {
    await db.execute('ALTER TABLE jobs ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0')
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (!/duplicate column/i.test(message)) throw error
  }
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

function asIds(value: unknown) {
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string' || !id)) {
    return null
  }
  return [...new Set(value as string[])]
}

function asTrimmed(value: unknown, max: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

function asUrl(value: unknown) {
  const trimmed = asTrimmed(value, 2000)
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

function slugToDomain(slug?: string | null) {
  if (!slug) return null
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '')
  return clean ? `${clean}.com` : null
}

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

function normalizeHost(value?: string | null) {
  if (!value) return null
  return value.replace(/^www\./, '').toLowerCase()
}

function isJobBoardHost(host: string) {
  const bare = normalizeHost(host) ?? host
  return JOB_BOARD_HOSTS.has(host) || JOB_BOARD_HOSTS.has(bare) || JOB_BOARD_HOSTS.has(`www.${bare}`)
}

function domainFromUrl(value: string) {
  try {
    const url = new URL(value)
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
  } catch {
    return null
  }

  return null
}

async function lookupCompanyDomain(company: string) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const response = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(company)}`,
      { headers: { Accept: 'application/json' }, signal: controller.signal },
    )
    clearTimeout(timer)
    if (!response.ok) return null

    const suggestions = (await response.json()) as Array<{ name?: string; domain?: string }>
    const needle = company.toLowerCase()
    const exact = suggestions.find((item) => item.name?.toLowerCase() === needle)
    const domain = exact?.domain || suggestions[0]?.domain
    return domain ? normalizeHost(domain) : null
  } catch {
    return null
  }
}

async function resolveStoredDomain(url: string, company: string) {
  return domainFromUrl(url) || (await lookupCompanyDomain(company)) || slugToDomain(company)
}

function mapJob(job: JobRow) {
  return {
    ...job,
    is_favorite: favoriteFlag(job.is_favorite),
  }
}

function asLocation(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 200) || null : null
}

function jobFromCreate(input: {
  title: string
  company: string
  url: string
  location: string | null
  companyDomain: string | null
  status: string
}): JobRow {
  const id = `manual:${crypto.randomUUID()}`
  const selectedAt = new Date().toISOString()
  const remote = input.location?.toLowerCase().includes('remote') ? input.location : null

  return {
    id,
    source: 'manual',
    external_id: id,
    company: input.company,
    company_domain: input.companyDomain,
    title: input.title,
    location: input.location,
    remote_string: remote,
    salary_min: null,
    salary_max: null,
    salary_currency: null,
    seniority: null,
    url: input.url,
    apply_url: input.url,
    description_snippet: null,
    posted_at: null,
    selected_at: selectedAt,
    is_live: 1,
    status: input.status,
    source_channel: 'manual',
    is_favorite: 0,
  }
}

export default async (req: Request) => {
  try {
    const db = getDb()
    await ensureFavoriteColumn(db)

    if (req.method === 'GET') {
      const result = await db.execute(
        `SELECT ${JOB_COLUMNS}
        FROM jobs
        ORDER BY selected_at DESC, title ASC`,
      )
      const columns = await listKanbanColumns(db)
      const jobs = (result.rows as unknown as JobRow[]).map(mapJob)
      return json({ jobs, columns })
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = (await req.json()) as Mutation & { password?: unknown }

    if (requiresJobsPassword(body.action)) {
      const denied = rejectIfInvalidPassword(body.password)
      if (denied) {
        await captureServerEvent(req, 'jobs_auth_failed', { action: body.action, status: denied.status })
        return denied
      }
    }

    if (body.action === 'create') {
      const title = asTrimmed(body.title, 200)
      const company = asTrimmed(body.company, 200)
      const url = asUrl(body.url)
      const location = asLocation(body.location)

      if (!title) return json({ error: 'Title is required' }, 400)
      if (!company) return json({ error: 'Company is required' }, 400)
      if (!url) return json({ error: 'A valid application URL is required' }, 400)

      const existing = await db.execute({
        sql: 'SELECT id FROM jobs WHERE url = ? OR apply_url = ? LIMIT 1',
        args: [url, url],
      })
      if (existing.rows.length > 0) {
        return json({ error: 'That job URL is already on the board' }, 409)
      }

      const [companyDomain, columns] = await Promise.all([
        resolveStoredDomain(url, company),
        listKanbanColumns(db),
      ])
      const job = jobFromCreate({
        title,
        company,
        url,
        location,
        companyDomain,
        status: firstVisibleColumnId(columns),
      })

      await db.execute({
        sql: `INSERT INTO jobs (
          id, source, external_id, company, company_domain, title, location,
          remote_string, salary_min, salary_max, salary_currency, seniority,
          url, apply_url, description_snippet, posted_at, selected_at,
          is_live, status, source_channel, is_favorite
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          job.id,
          job.source,
          job.external_id,
          job.company,
          job.company_domain,
          job.title,
          job.location,
          job.remote_string,
          job.salary_min,
          job.salary_max,
          job.salary_currency,
          job.seniority,
          job.url,
          job.apply_url,
          job.description_snippet,
          job.posted_at,
          job.selected_at,
          job.is_live,
          job.status,
          job.source_channel,
          job.is_favorite,
        ],
      })

      await captureServerEvent(req, 'jobs_job_created', { source: 'manual' })
      return json(job, 201)
    }

    if (body.action === 'update') {
      const id = asTrimmed(body.id, 200)
      const title = asTrimmed(body.title, 200)
      const company = asTrimmed(body.company, 200)
      const url = asUrl(body.url)
      const location = asLocation(body.location)

      if (!id) return json({ error: 'id is required' }, 400)
      if (!title) return json({ error: 'Title is required' }, 400)
      if (!company) return json({ error: 'Company is required' }, 400)
      if (!url) return json({ error: 'A valid application URL is required' }, 400)

      const currentResult = await db.execute({
        sql: `SELECT ${JOB_COLUMNS} FROM jobs WHERE id = ? LIMIT 1`,
        args: [id],
      })
      if (currentResult.rows.length === 0) {
        return json({ error: 'Job not found' }, 404)
      }

      const current = currentResult.rows[0] as unknown as JobRow
      const duplicate = await db.execute({
        sql: 'SELECT id FROM jobs WHERE (url = ? OR apply_url = ?) AND id != ? LIMIT 1',
        args: [url, url, id],
      })
      if (duplicate.rows.length > 0) {
        return json({ error: 'That job URL is already on the board' }, 409)
      }

      const companyChanged = (current.company ?? '') !== company
      const urlChanged = current.url !== url || (current.apply_url ?? current.url) !== url
      const companyDomain =
        companyChanged || urlChanged ? await resolveStoredDomain(url, company) : current.company_domain
      const remote = location?.toLowerCase().includes('remote') ? location : null

      await db.execute({
        sql: `UPDATE jobs SET
          title = ?, company = ?, company_domain = ?, location = ?, remote_string = ?,
          url = ?, apply_url = ?
        WHERE id = ?`,
        args: [title, company, companyDomain, location, remote, url, url, id],
      })

      const updated = await db.execute({
        sql: `SELECT ${JOB_COLUMNS} FROM jobs WHERE id = ? LIMIT 1`,
        args: [id],
      })
      await captureServerEvent(req, 'jobs_job_updated')
      return json(mapJob(updated.rows[0] as unknown as JobRow))
    }

    if (body.action === 'setColumns') {
      const columns = parseColumns(body.columns)
      if (!columns) {
        return json({ error: 'Keep at least one visible column with unique names' }, 400)
      }
      await replaceKanbanColumns(db, columns)
      await captureServerEvent(req, 'jobs_columns_saved', { column_count: columns.length })
      return json({ ok: true, columns })
    }

    const ids = asIds('ids' in body ? body.ids : null)
    if (!ids || ids.length === 0) {
      return json({ error: 'ids are required' }, 400)
    }

    const placeholders = ids.map(() => '?').join(', ')

    if (body.action === 'delete') {
      await db.execute({
        sql: `DELETE FROM jobs WHERE id IN (${placeholders})`,
        args: ids,
      })
      await captureServerEvent(req, 'jobs_job_deleted', { count: ids.length })
      return json({ ok: true })
    }

    if (body.action === 'setStatus') {
      const status = asStatus(body.status)
      if (!status) {
        return json({ error: 'Invalid status' }, 400)
      }
      await db.execute({
        sql: `UPDATE jobs SET status = ? WHERE id IN (${placeholders})`,
        args: [status, ...ids],
      })
      await captureServerEvent(req, 'jobs_status_changed', { status, count: ids.length })
      return json({ ok: true })
    }

    if (body.action === 'setFavorite') {
      const favorite = asFavorite(body.favorite)
      if (favorite === null) {
        return json({ error: 'favorite is required' }, 400)
      }
      await db.execute({
        sql: `UPDATE jobs SET is_favorite = ? WHERE id IN (${placeholders})`,
        args: [favorite ? 1 : 0, ...ids],
      })
      await captureServerEvent(req, 'jobs_favorite_toggled', { favorite, count: ids.length })
      return json({ ok: true })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    await captureServerEvent(req, 'jobs_server_error', { message })
    await captureServerException(req, error, { source: 'jobs_api' })
    return json({ error: message }, 500)
  }
}

export const config: Config = {
  path: '/api/jobs',
  method: ['GET', 'POST'],
}
