import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// Until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see .env.example),
// the app runs on local demo data (see src/lib/demoData.js) so it stays fully
// clickable during development. Once configured, every page automatically
// switches to reading/writing the real Supabase project.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Piri Coxinha] Supabase não configurado — rodando com dados de demonstração locais. ' +
      'Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para conectar de verdade.',
  )
}
