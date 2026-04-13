import { useStore } from '../store/useStore'
import Navbar from '../components/layout/Navbar'

export default function Members() {
  const members     = useStore((s) => s.members)
  const expenses    = useStore((s) => s.expenses)
  const chores      = useStore((s) => s.chores)
  const currentUser = useStore((s) => s.currentUser)
  const getBalances = useStore((s) => s.getBalances)
  const balances    = getBalances()

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar title="Members" subtitle="Your flatmates overview" />

      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {members.map((m, idx) => {
            const myExp   = expenses.filter((e) => e.paidBy === m.id)
            const total   = myExp.reduce((s, e) => s + e.amount, 0)
            const myChores= chores.filter((c) => c.assignedTo === m.id)
            const done    = myChores.filter((c) => c.done).length
            const bal     = balances[m.id] || 0
            const isMe    = m.id === currentUser

            return (
              <div key={m.id} className="card animate-fade-in" style={{
                animationDelay: `${idx * 0.1}s`,
                border: isMe ? `1.5px solid ${m.color}50` : '1px solid var(--border)',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                  <div className="avatar" style={{ width: 64, height: 64, background: m.bg, color: m.color, fontSize: 20, marginBottom: 12 }}>{m.initials}</div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{m.name}</p>
                  {isMe && <span className="badge badge-green" style={{ marginTop: 6 }}>You</span>}
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <StatRow label="Paid so far" value={`₹${total.toLocaleString('en-IN')}`} color="var(--text-primary)" />
                  <StatRow label="Chores done" value={`${done}/${myChores.length}`} color={m.color} />
                  <StatRow
                    label="Net balance"
                    value={`${bal >= 0 ? '+' : ''}₹${Math.abs(Math.round(bal)).toLocaleString('en-IN')}`}
                    color={bal >= 0 ? 'var(--accent)' : 'var(--danger)'}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}
