import { createClient } from '@libsql/client/web'

function env(name: string) {
  const netlify = (
    globalThis as {
      Netlify?: { env: { get: (key: string) => string | undefined } }
    }
  ).Netlify
  return netlify?.env.get(name) || process.env[name]
}

export function getDb() {
  const url = env('TURSO_DATABASE_URL')
  const authToken = env('TURSO_AUTH_TOKEN')

  if (!url || !authToken) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  }

  return createClient({
    url: url.replace(/^libsql:\/\//i, 'https://'),
    authToken,
  })
}
