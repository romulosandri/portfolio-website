import { PostHog } from 'posthog-node'

type AnalyticsProduct = 'portfolio' | 'jobs'

function env(name: string) {
  const netlify = (
    globalThis as {
      Netlify?: { env: { get: (key: string) => string | undefined } }
    }
  ).Netlify
  return netlify?.env.get(name) || process.env[name]
}

function distinctIdFrom(request: Request) {
  return request.headers.get('x-posthog-distinct-id') || 'anonymous'
}

function sessionProperties(request: Request, properties?: Record<string, unknown>) {
  const sessionId = request.headers.get('x-posthog-session-id')
  return sessionId ? { ...properties, $session_id: sessionId } : properties
}

function createClient() {
  const token = env('POSTHOG_PROJECT_TOKEN') || env('VITE_POSTHOG_PROJECT_TOKEN')
  if (!token) return null

  return new PostHog(token, {
    host: env('POSTHOG_HOST') || env('VITE_POSTHOG_HOST') || 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  })
}

export async function captureServerEvent(
  request: Request,
  event: string,
  properties?: Record<string, unknown>,
  product: AnalyticsProduct = 'portfolio',
) {
  const client = createClient()
  if (!client) return

  try {
    client.capture({
      distinctId: distinctIdFrom(request),
      event,
      properties: sessionProperties(request, { product, ...properties }),
    })
  } finally {
    await client.shutdown()
  }
}

export async function captureServerException(
  request: Request,
  error: unknown,
  properties?: Record<string, unknown>,
  product: AnalyticsProduct = 'portfolio',
) {
  const client = createClient()
  if (!client) return

  try {
    client.captureException(
      error instanceof Error ? error : new Error(String(error)),
      distinctIdFrom(request),
      sessionProperties(request, { product, ...properties }),
    )
  } finally {
    await client.shutdown()
  }
}

export function captureJobsEvent(
  request: Request,
  event: string,
  properties?: Record<string, unknown>,
) {
  return captureServerEvent(request, event, properties, 'jobs')
}

export function captureJobsException(
  request: Request,
  error: unknown,
  properties?: Record<string, unknown>,
) {
  return captureServerException(request, error, properties, 'jobs')
}
