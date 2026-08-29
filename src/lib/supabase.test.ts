import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url: string, key: string) => ({ url, key })),
}))

async function importCreateClientMock() {
  const { createClient } = await import('@supabase/supabase-js')
  return vi.mocked(createClient)
}

describe('supabase client bootstrap', () => {
  afterEach(() => {
    delete window.__APP_CONFIG__
    vi.unstubAllEnvs()
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('lança um erro claro quando não há config nem em runtime nem no build', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    await expect(import('./supabase')).rejects.toThrow(/VITE_SUPABASE_URL/)
  })

  it('usa window.__APP_CONFIG__ quando a config runtime está presente (deploy via Docker)', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    window.__APP_CONFIG__ = {
      supabaseUrl: 'https://runtime.supabase.co',
      supabaseAnonKey: 'runtime-anon-key',
    }
    await import('./supabase')
    const createClient = await importCreateClientMock()
    expect(createClient).toHaveBeenCalledWith('https://runtime.supabase.co', 'runtime-anon-key')
  })

  it('cai pro import.meta.env quando window.__APP_CONFIG__ não existe (deploy via Cloudflare Workers)', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://buildtime.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'buildtime-anon-key')
    await import('./supabase')
    const createClient = await importCreateClientMock()
    expect(createClient).toHaveBeenCalledWith('https://buildtime.supabase.co', 'buildtime-anon-key')
  })

  it('window.__APP_CONFIG__ tem prioridade sobre import.meta.env quando os dois existem', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://buildtime.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'buildtime-anon-key')
    window.__APP_CONFIG__ = {
      supabaseUrl: 'https://runtime.supabase.co',
      supabaseAnonKey: 'runtime-anon-key',
    }
    await import('./supabase')
    const createClient = await importCreateClientMock()
    expect(createClient).toHaveBeenCalledWith('https://runtime.supabase.co', 'runtime-anon-key')
  })
})
