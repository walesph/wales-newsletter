// SVG 도넛 차트 + 범례(%). PDF 의 Nationality/Gender Ratio 스타일.
const PALETTE = ['#1d9e75', '#378add', '#7c3aed', '#e24b4a', '#ef9f27', '#d4537e', '#5dcaa5', '#94a3b8']

export default function DonutChart({ data = [], labelFor, size = 132, thickness = 22 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = (size - thickness) / 2
  const C = 2 * Math.PI * r
  const cx = size / 2
  const cy = size / 2

  let acc = 0
  const arcs = data.map((d, i) => {
    const f = d.value / total
    const arc = (
      <circle
        key={d.key}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={PALETTE[i % PALETTE.length]}
        strokeWidth={thickness}
        strokeDasharray={`${f * C} ${C}`}
        strokeDashoffset={-acc * C}
      />
    )
    acc += f
    return arc
  })

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
          {arcs}
        </g>
      </svg>
      <ul className="space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.key} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-sm"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="w-10 shrink-0 font-medium tabular-nums text-slate-700">
              {Math.round((d.value / total) * 100)}%
            </span>
            <span className="text-slate-500">{labelFor(d.key)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
