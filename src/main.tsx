import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const rootElement = document.getElementById('root')!

async function bootstrap() {
  try {
    const { default: App } = await import('./App.tsx')
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (err) {
    console.error('Falha ao iniciar o app:', err)
    rootElement.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100vh;padding:24px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1a1d23;">Não foi possível carregar o app. Tente novamente em alguns minutos.</div>'
  }
}

bootstrap()
