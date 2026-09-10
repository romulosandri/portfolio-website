import posthog from 'posthog-js'

function canCapture() {
  return typeof window !== 'undefined' && !navigator.webdriver && posthog.__loaded
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!canCapture()) return
  posthog.capture(event, properties)
}

export function identifyVisitor(distinctId: string, properties?: Record<string, unknown>) {
  if (!canCapture()) return
  posthog.identify(distinctId, properties)
}

export function trackException(error: unknown, properties?: Record<string, unknown>) {
  if (!canCapture()) return
  posthog.captureException(error, properties)
}

export function analyticsHeaders(): Record<string, string> {
  if (typeof window === 'undefined' || !posthog.__loaded) return {}

  const headers: Record<string, string> = {}
  const distinctId = posthog.get_distinct_id()
  const sessionId = posthog.get_session_id()
  if (distinctId) headers['X-POSTHOG-DISTINCT-ID'] = distinctId
  if (sessionId) headers['X-POSTHOG-SESSION-ID'] = sessionId
  return headers
}

export function collectionFromHref(href: string) {
  if (href.startsWith('/work')) return 'work'
  if (href.startsWith('/projects')) return 'projects'
  return 'other'
}
