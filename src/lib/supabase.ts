import { createClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    __APP_CONFIG__?: {
      supabaseUrl?: string
      supabaseAnonKey?: string
    }
  }
}

// window.__APP_CONFIG__: injetado em runtime pelo entrypoint do container
// Docker (IAC/), pra imagem publicada no GHCR nao carregar segredo nenhum.
// import.meta.env: usado no deploy direto via Cloudflare Workers, que serve
// os arquivos estaticos sem rodar nenhum entrypoint - la a config precisa
// vir do build (ja configurado como build variable no Cloudflare).
const supabaseUrl = window.__APP_CONFIG__?.supabaseUrl || import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = window.__APP_CONFIG__?.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Configuração ausente: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no build ou ao iniciar o container.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
