import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import './motion-system/gsap'
import './index.css'
import { SnackbarProvider } from './design-system'
import { LenisProvider } from './motion-system/LenisProvider'
import { posthogOptions, posthogToken, shouldInitPostHog } from './lib/posthog'
import App from './App.tsx'

function Root() {
  const app = (
    <PostHogErrorBoundary
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background-primary px-gutter">
          <p className="text-body-default text-foreground-secondary">Something went wrong. Please refresh.</p>
        </div>
      }
    >
      <LenisProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </LenisProvider>
    </PostHogErrorBoundary>
  )

  if (!shouldInitPostHog() || !posthogToken) return app

  return (
    <PostHogProvider apiKey={posthogToken} options={posthogOptions}>
      {app}
    </PostHogProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
