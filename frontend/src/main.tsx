import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeProvider'

// Service Worker is registered by vite-plugin-pwa via useServiceWorker hook

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="wanttogo-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
