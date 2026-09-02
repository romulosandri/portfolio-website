import type { PostHogConfig } from 'posthog-js'

export const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
export const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

export const posthogOptions = {
  api_host: posthogHost,
  defaults: '2026-01-30',
  capture_pageview: 'history_change',
  capture_exceptions: true,
  person_profiles: 'identified_only',
  loaded(posthog) {
    if (navigator.webdriver) posthog.opt_out_capturing()
  },
} satisfies Partial<PostHogConfig>

export function shouldInitPostHog() {
  return Boolean(posthogToken) && typeof window !== 'undefined' && !navigator.webdriver
}
