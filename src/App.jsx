import { useEffect, useState } from 'react'
import { supabase, hasSupabase } from './lib/supabase'
import { DEFAULT_LANG } from './i18n'
import { sampleNewsletter, sampleTranslations } from './data/sampleNewsletter'
import NewsletterView from './components/NewsletterView'
import LanguageSwitcher from './components/LanguageSwitcher'

export default function App() {
  const [lang, setLang] = useState(DEFAULT_LANG)
  const [newsletter, setNewsletter] = useState(hasSupabase ? null : sampleNewsletter)
  const [translated, setTranslated] = useState(null)
  const [loading, setLoading] = useState(hasSupabase)

  // 최신 발행 뉴스레터 로드
  useEffect(() => {
    if (!hasSupabase) return
    let alive = true
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (!alive) return
      if (error) console.error('[newsletters]', error.message)
      setNewsletter(data ?? sampleNewsletter)
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [])

  // 선택 언어 번역 로드
  useEffect(() => {
    const nl = newsletter
    if (!nl) return
    if (!hasSupabase || nl.id === 'sample') {
      setTranslated(sampleTranslations[lang] ?? null)
      return
    }
    let alive = true
    ;(async () => {
      const { data } = await supabase
        .from('newsletter_translations')
        .select('translated_data')
        .eq('newsletter_id', nl.id)
        .eq('language', lang)
        .maybeSingle()
      if (alive) setTranslated(data?.translated_data ?? null)
    })()
    return () => {
      alive = false
    }
  }, [newsletter, lang])

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto mb-5 flex max-w-2xl items-center justify-between px-4">
        <span className="text-sm font-medium text-slate-500">
          {hasSupabase ? 'Supabase 연결됨' : '샘플 데이터 (.env 미설정)'}
        </span>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </div>

      <div className="px-4">
        {loading ? (
          <p className="text-center text-slate-400">불러오는 중…</p>
        ) : (
          <NewsletterView newsletter={newsletter} translated={translated} lang={lang} />
        )}
      </div>
    </div>
  )
}
