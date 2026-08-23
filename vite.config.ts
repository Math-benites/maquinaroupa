import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
  },
  test: {
    environment: 'jsdom',
  },
})
