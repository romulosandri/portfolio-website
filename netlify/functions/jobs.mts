import type { Config } from '@netlify/functions'
import { getDb } from './_shared/db.ts'

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
}

type Mutation =
  | { action: 'delete'; ids: string[] }
  | { action: 'setLive'; ids: string[]; is_live: number }

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

function asIds(value: unknown) {
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string' || !id)) {
    return null
  }
  return [...new Set(value as string[])]
}

export default async (req: Request) => {
  try {
    const db = getDb()

    if (req.method === 'GET') {
      const result = await db.execute(
        `SELECT
          id, source, external_id, company, company_domain, title, location,
          remote_string, salary_min, salary_max, salary_currency, seniority,
          url, apply_url, description_snippet, posted_at, selected_at,
          is_live, status, source_channel
        FROM jobs
        ORDER BY selected_at DESC, title ASC`,
      )
      return json(result.rows as unknown as JobRow[])
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = (await req.json()) as Mutation
    const ids = asIds(body.ids)
    if (!ids || ids.length === 0) {
      return json({ error: 'ids are required' }, 400)
    }

    const placeholders = ids.map(() => '?').join(', ')

    if (body.action === 'delete') {
      await db.execute({
        sql: `DELETE FROM jobs WHERE id IN (${placeholders})`,
        args: ids,
      })
      return json({ ok: true })
    }

    if (body.action === 'setLive') {
      const isLive = body.is_live === 1 ? 1 : 0
      await db.execute({
        sql: `UPDATE jobs SET is_live = ? WHERE id IN (${placeholders})`,
        args: [isLive, ...ids],
      })
      return json({ ok: true })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return json({ error: message }, 500)
  }
}

export const config: Config = {
  path: '/api/jobs',
  method: ['GET', 'POST'],
}
