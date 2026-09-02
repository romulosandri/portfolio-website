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

export function collectionFromHref(href: string) {
  if (href.startsWith('/work')) return 'work'
  if (href.startsWith('/projects')) return 'projects'
  return 'other'
}
