function env(name: string) {
  const netlify = (
    globalThis as {
      Netlify?: { env: { get: (key: string) => string | undefined } }
    }
  ).Netlify
  return netlify?.env.get(name) || process.env[name]
}

const PROTECTED_ACTIONS = new Set(['create', 'update', 'delete', 'setStatus', 'setFavorite'])

export function requiresJobsPassword(action: string) {
  return PROTECTED_ACTIONS.has(action)
}

export function rejectIfInvalidPassword(password: unknown) {
  const expected = env('JOBS_PASSWORD')
  if (!expected) {
    return Response.json({ error: 'Jobs password is not configured' }, { status: 500 })
  }
  if (typeof password !== 'string' || password !== expected) {
    return Response.json({ error: 'Incorrect password' }, { status: 401 })
  }
  return null
}
