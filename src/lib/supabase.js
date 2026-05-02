import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const SUPABASE_CONFIGURED = Boolean(url && anonKey)

if (!SUPABASE_CONFIGURED) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 未配置。' +
      ' 登录功能不可用，应用将以离线（localStorage）模式运行。' +
      ' 参考 SUPABASE_SETUP.md。'
  )
}

export const supabase = SUPABASE_CONFIGURED
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null
