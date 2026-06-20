import { QRCodeSVG } from 'qrcode.react'
import BarChart from './BarChart'
import DonutChart from './DonutChart'
import { t, dirOf } from '../i18n'

function localize(nl, translated) {
  return { ...nl, ...(translated || {}) }
}

function Section({ title, children }) {
  return (
    <section className="border-t border-slate-100 px-6 py-6 sm:px-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

function instaUrl(handle) {
  if (!handle) return ''
  return `https://instagram.com/${handle.replace(/^@/, '')}`
}

export default function NewsletterView({ newsletter, translated, lang }) {
  const nl = localize(newsletter, translated)
  const dir = dirOf(lang)

  return (
    <article
      dir={dir}
      className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white text-start shadow-sm ring-1 ring-slate-200"
    >
      {/* 헤더 */}
      <header className="bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-8 text-white sm:px-10">
        <p className="text-sm/6 opacity-80">
          {t(lang, 'vol', { n: nl.vol })} · {nl.published_date}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{t(lang, 'title')}</h1>
      </header>

      {/* 커버 인사말 */}
      {nl.cover_message && (
        <p className="whitespace-pre-line border-s-4 border-violet-300 bg-violet-50/60 px-6 py-4 text-sm leading-relaxed text-slate-600 sm:px-10">
          {nl.cover_message}
        </p>
      )}

      {/* 상단 2단: 인터뷰 + SNS */}
      <div className="grid gap-0 sm:grid-cols-3">
        {/* 졸업생 인터뷰 */}
        <section className="border-t border-slate-100 px-6 py-6 sm:col-span-2 sm:px-10">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">🌸 {t(lang, 'interview')}</h2>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">{nl.interview_name}</span>
            {nl.interview_gender && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {t(lang, 'sex')[nl.interview_gender] ?? nl.interview_gender}
              </span>
            )}
            {nl.interview_weeks ? (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                {t(lang, 'weeks', { n: nl.interview_weeks })}
              </span>
            ) : null}
          </div>

          {nl.interview_quote && (
            <blockquote className="mb-3 border-s-4 border-violet-400 ps-4 text-base font-medium text-slate-800">
              “{nl.interview_quote}”
            </blockquote>
          )}
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{nl.interview_body}</p>

          {nl.interview_photo_url && (
            <img
              src={nl.interview_photo_url}
              alt={nl.interview_name}
              className="mt-4 w-full rounded-lg object-cover"
            />
          )}

          {/* 인스타 QR + 핸들 */}
          {nl.instagram_handle && (
            <div className="mt-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <QRCodeSVG value={instaUrl(nl.instagram_handle)} size={72} className="shrink-0 rounded" />
              <div>
                <p className="text-xs text-slate-500">Instagram</p>
                <a
                  href={instaUrl(nl.instagram_handle)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-violet-700 underline"
                >
                  {nl.instagram_handle}
                </a>
                <p className="mt-2">
                  <a
                    href={instaUrl(nl.instagram_handle)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    {t(lang, 'followUs')}
                  </a>
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 毎日バギオ情報 (X/SNS) */}
        {nl.sns_x_url && (
          <section className="border-t border-slate-100 bg-slate-50/50 px-6 py-6 sm:px-10">
            <h2 className="mb-3 text-base font-semibold text-slate-900">{t(lang, 'dailyBaguio')}</h2>
            <a
              href={nl.sns_x_url}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm text-blue-600 underline"
            >
              {nl.sns_x_url}
            </a>
          </section>
        )}
      </div>

      {/* 입학 가능 안내 */}
      {nl.availability_text && (
        <Section title={t(lang, 'availability')}>
          <p className="whitespace-pre-line rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
            {nl.availability_text}
          </p>
        </Section>
      )}

      {/* 통계: 국적/성비 도넛 + 연령 막대 */}
      <Section title={`${t(lang, 'nationality')} · ${t(lang, 'gender')} · ${t(lang, 'age')}`}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">{t(lang, 'nationality')}</p>
            <DonutChart data={nl.nationality_data} labelFor={(k) => t(lang, 'nat')[k] ?? k} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">{t(lang, 'gender')}</p>
            <DonutChart data={nl.gender_data} labelFor={(k) => t(lang, 'sex')[k] ?? k} />
          </div>
        </div>
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-slate-500">{t(lang, 'age')}</p>
          <BarChart data={nl.age_data} unit="%" showShare={false} labelFor={(k) => t(lang, 'ageBand')[k] ?? k} />
        </div>
      </Section>

      {/* 스태프 칼럼 */}
      {nl.staff_column && (
        <Section title={t(lang, 'staffColumn')}>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{nl.staff_column}</p>
        </Section>
      )}

      <footer className="bg-slate-50 px-6 py-5 text-center text-xs text-slate-400 sm:px-10">
        © {new Date(nl.published_date).getFullYear()} WALES Academy · walesportal.com
      </footer>
    </article>
  )
}
