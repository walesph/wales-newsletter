import { LANGUAGES } from '../i18n'

export default function LanguageSwitcher({ lang, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={
            'rounded-full px-3 py-1 text-sm font-medium transition ' +
            (lang === l.code
              ? 'bg-violet-600 text-white'
              : 'text-slate-600 hover:bg-slate-100')
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
