import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // .env 가 없어도 앱이 죽지 않도록 경고만 — 샘플 데이터로 동작
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 설정되지 않았습니다. ' +
      '샘플 데이터로 렌더링합니다.',
  )
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const hasSupabase = Boolean(supabase)
