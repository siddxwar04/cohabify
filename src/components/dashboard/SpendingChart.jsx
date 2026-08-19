import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useStore } from '../../store/useStore'
import { categoryMeta } from '../../data/seed'
import { inr } from '../../lib/format'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-2xl bg-night text-day px-3 py-2 shadow-lift">
      <p className="text-[11px] text-day/70">{payload[0].name}</p>
      <p className="font-semibold">{inr(payload[0].value)}</p>
    </div>
  )
}

export default function SpendingChart() {
  const expenses = useStore((s) => s.expenses)
  const getSpendingByCategory = useStore((s) => s.getSpendingByCategory)
  const data = getSpendingByCategory()
  const total = data.reduce((s, d) => s + d.value, 0)
  void expenses

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-40 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={categoryMeta(d.name).color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] uppercase tracking-widest text-mist">All time</p>
          <p className="font-display text-lg leading-none">{inr(total)}</p>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        {data.slice(0, 5).map((d) => {
          const meta = categoryMeta(d.name)
          return (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
              <span className="text-xs text-stone flex-1 truncate">{meta.emoji} {d.name}</span>
              <span className="text-xs font-semibold text-espresso">{inr(d.value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
