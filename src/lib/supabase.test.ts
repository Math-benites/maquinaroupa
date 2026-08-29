import { afterEach, describe, expect, it, vi } from 'vitest'

describe('supabase client bootstrap', () => {
  afterEach(() => {
    delete window.__APP_CONFIG__
    vi.resetModules()
  })

  it('lança um erro claro quando a configuração runtime está ausente', async () => {
    await expect(import('./supabase')).rejects.toThrow(/VITE_SUPABASE_URL/)
  })

  it('cria o client normalmente quando a configuração runtime está presente', async () => {
    window.__APP_CONFIG__ = {
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
    }
    const { supabase } = await import('./supabase')
    expect(supabase).toBeTruthy()
  })
})
