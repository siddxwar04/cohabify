import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useStore } from '../../store/useStore'

const COLORS = ['#1D9E75','#378ADD','#EF9F27','#7F77DD','#E24B4A']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a2133', border: '1px solid #253047', borderRadius: 9, padding: '10px 14px' }}>
      <p style={{ fontSize: 12, color: '#8b95a8', marginBottom: 4 }}>{payload[0].payload.name}</p>
      <p style={{ fontSize: 16, fontWeight: 800, color: '#e8edf5' }}>₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  )
}

export default function SpendingChart() {
  const getSpendingByCategory = useStore((s) => s.getSpendingByCategory)
  const data = getSpendingByCategory()

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8b95a8', fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#8b95a8', fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
