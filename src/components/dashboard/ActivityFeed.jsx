import { formatDistanceToNow } from 'date-fns'
import { useStore } from '../../store/useStore'

export default function ActivityFeed() {
  const expenses = useStore((s) => s.expenses)
  const members  = useStore((s) => s.members)
  const getMember = (id) => members.find((m) => m.id === id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {expenses.slice(0, 5).map((exp) => {
        const m = getMember(exp.paidBy)
        return (
          <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{exp.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{exp.title}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {m?.name.split(' ')[0]} · {formatDistanceToNow(new Date(exp.date), { addSuffix: true })}
              </p>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>₹{exp.amount.toLocaleString('en-IN')}</span>
          </div>
        )
      })}
    </div>
  )
}
