import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './motion-system/gsap'
import './index.css'
import { SnackbarProvider } from './design-system'
import { LenisProvider } from './motion-system/LenisProvider'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LenisProvider>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </LenisProvider>
  </StrictMode>,
)
