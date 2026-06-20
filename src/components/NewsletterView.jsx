import BarChart from './BarChart'
import { t } from '../i18n'

// 번역 오버라이드를 본문에 병합
function localize(nl, translated) {
  return { ...nl, ...(translated || {}) }
}

function Section({ title, children }) {
  return (
    <section className="border-t border-slate-100 px-6 py-7 sm:px-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

export default function NewsletterView({ newsletter, translated, lang }) {
  const nl = localize(newsletter, translated)

  return (
    <article className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* 헤더 */}
      <header className="bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-8 text-white sm:px-10">
        <p className="text-sm/6 opacity-80">
          {t(lang, 'vol', { n: nl.vol })} · {nl.published_date}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{t(lang, 'title')}</h1>
      </header>

      {/* 인터뷰 */}
      <Section title={t(lang, 'interview')}>
        <div className="flex gap-4">
          {nl.interview_photo_url ? (
            <img
              src={nl.interview_photo_url}
              alt={nl.interview_name}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">
              {nl.interview_name?.[0] ?? '?'}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900">{nl.interview_name}</p>
            <p className="text-sm text-slate-500">{nl.interview_role}</p>
          </div>
        </div>
        {nl.interview_quote && (
          <blockquote className="mt-4 border-l-4 border-violet-400 pl-4 text-lg font-medium text-slate-800">
            “{nl.interview_quote}”
          </blockquote>
        )}
        <p className="mt-3 whitespace-pre-line text-slate-600">{nl.interview_body}</p>
      </Section>

      {/* 통계 차트 */}
      <Section title={t(lang, 'nationality')}>
        <BarChart
          data={nl.nationality_data}
          unit={t(lang, 'students')}
          labelFor={(k) => t(lang, 'nat')[k] ?? k}
        />
      </Section>

      <Section title={t(lang, 'gender')}>
        <BarChart
          data={nl.gender_data}
          unit={t(lang, 'students')}
          labelFor={(k) => t(lang, 'sex')[k] ?? k}
        />
      </Section>

      <Section title={t(lang, 'age')}>
        <BarChart
          data={nl.age_data}
          unit={t(lang, 'students')}
          labelFor={(k) => t(lang, 'ageBand')[k] ?? k}
        />
      </Section>

      {/* 입학 가능 시기 */}
      {nl.availability_text && (
        <Section title={t(lang, 'availability')}>
          <p className="rounded-lg bg-amber-50 p-4 text-amber-900 ring-1 ring-amber-200">
            {nl.availability_text}
          </p>
        </Section>
      )}

      {/* 스태프 칼럼 */}
      {nl.staff_column && (
        <Section title={t(lang, 'staffColumn')}>
          <p className="whitespace-pre-line text-slate-600">{nl.staff_column}</p>
        </Section>
      )}

      <footer className="bg-slate-50 px-6 py-5 text-center text-xs text-slate-400 sm:px-10">
        © {new Date(nl.published_date).getFullYear()} WALES Academy · walesportal.com
      </footer>
    </article>
  )
}
