import { createClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    __APP_CONFIG__?: {
      supabaseUrl?: string
      supabaseAnonKey?: string
    }
  }
}

const supabaseUrl = window.__APP_CONFIG__?.supabaseUrl
const supabaseAnonKey = window.__APP_CONFIG__?.supabaseAnonKey

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Configuração ausente: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ao iniciar o container.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
