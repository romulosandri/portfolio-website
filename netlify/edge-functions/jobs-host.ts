import type { Config, Context } from '@netlify/edge-functions'

const JOBS_HOSTS = new Set(['jobs.romulosandri.com'])

export default async (request: Request, context: Context) => {
  const url = new URL(request.url)
  if (!JOBS_HOSTS.has(url.hostname)) return

  if (url.pathname === '/' || url.pathname === '/index.html') {
    return context.rewrite('/jobs/index.html')
  }
}

export const config: Config = {
  path: ['/', '/index.html'],
}
