// 이메일 HTML 로도 옮기기 쉽도록 JS 없이 div 폭으로 그리는 단순 막대 차트
export default function BarChart({ data = [], labelFor, unit = '' }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <ul className="space-y-2">
      {data.map((d) => {
        const pct = Math.round((d.value / max) * 100)
        const share = total ? Math.round((d.value / total) * 100) : 0
        return (
          <li key={d.key} className="flex items-center gap-3 text-sm">
            <span className="w-20 shrink-0 text-slate-600">{labelFor(d.key)}</span>
            <span className="relative h-5 flex-1 overflow-hidden rounded bg-slate-100">
              <span
                className="absolute inset-y-0 left-0 rounded bg-violet-500"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="w-20 shrink-0 text-right tabular-nums text-slate-500">
              {d.value}
              {unit} <span className="text-slate-400">({share}%)</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
