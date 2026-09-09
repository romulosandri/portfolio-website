import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../motion-system/gsap'
import '../index.css'
import { SnackbarProvider } from '../design-system'
import { JobsApp } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <JobsApp />
    </SnackbarProvider>
  </StrictMode>,
)
