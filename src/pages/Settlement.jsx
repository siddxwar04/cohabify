import { CheckCircle2, ArrowRight, IndianRupee } from 'lucide-react'
import { useStore } from '../store/useStore'
import Navbar from '../components/layout/Navbar'

export default function Settlement() {
  const members      = useStore((s) => s.members)
  const currentUser  = useStore((s) => s.currentUser)
  const getBalances  = useStore((s) => s.getBalances)
  const getSettlements = useStore((s) => s.getSettlements)

  const balances    = getBalances()
  const settlements = getSettlements()

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar title="Settle Up" subtitle="Minimum transactions to clear all dues" />

      <div style={{ padding: '24px 28px', maxWidth: 700 }}>

        {/* Balance cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {members.map((m) => {
            const bal = balances[m.id] || 0
            const isMe = m.id === currentUser
            return (
              <div key={m.id} className="card animate-fade-in" style={{ border: isMe ? `1.5px solid ${m.color}40` : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div className="avatar" style={{ width: 40, height: 40, background: m.bg, color: m.color, fontSize: 13 }}>{m.initials}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{m.name.split(' ')[0]}</p>
                    {isMe && <p style={{ fontSize: 10, color: m.color, fontWeight: 700 }}>You</p>}
                  </div>
                </div>
                <div className="divider" style={{ margin: '0 0 12px' }} />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                  {bal >= 0 ? 'Gets back' : 'Owes'}
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: bal >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                  ₹{Math.abs(Math.round(bal)).toLocaleString('en-IN')}
                </p>
              </div>
            )
          })}
        </div>

        {/* Settlements */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18 }}>
            {settlements.length === 0 ? '🎉 All Settled Up!' : `${settlements.length} Payment${settlements.length > 1 ? 's' : ''} to Clear Dues`}
          </h3>

          {settlements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>Everyone is settled!</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>No outstanding dues at the moment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {settlements.map((s, i) => {
                const isMyPayment   = s.from.id === currentUser
                const isMyReceipt   = s.to.id   === currentUser
                return (
                  <div key={i} className="animate-fade-in" style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 18px',
                    background: isMyPayment ? 'rgba(226,75,74,0.05)' : isMyReceipt ? 'rgba(29,158,117,0.05)' : 'var(--bg-elevated)',
                    border: `1px solid ${isMyPayment ? 'rgba(226,75,74,0.2)' : isMyReceipt ? 'rgba(29,158,117,0.2)' : 'var(--border)'}`,
                    borderRadius: 12,
                    animationDelay: `${i * 0.08}s`,
                  }}>
                    <div className="avatar" style={{ width: 38, height: 38, background: s.from.bg, color: s.from.color, fontSize: 12 }}>{s.from.initials}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {isMyPayment ? 'You' : s.from.name.split(' ')[0]}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> pays </span>
                        {isMyReceipt ? 'you' : s.to.name.split(' ')[0]}
                      </p>
                      {isMyPayment && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>You need to pay this</p>}
                      {isMyReceipt && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>You will receive this</p>}
                    </div>
                    <div className="avatar" style={{ width: 38, height: 38, background: s.to.bg, color: s.to.color, fontSize: 12 }}>{s.to.initials}</div>
                    <div style={{ width: 1, height: 32, background: 'var(--border)', margin: '0 4px' }} />
                    <div style={{ textAlign: 'right', minWidth: 80 }}>
                      <p style={{ fontSize: 20, fontWeight: 800, color: isMyPayment ? 'var(--danger)' : isMyReceipt ? 'var(--accent)' : 'var(--text-primary)' }}>
                        ₹{s.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    {(isMyPayment || isMyReceipt) && (
                      <button className={isMyPayment ? 'btn-danger' : 'btn-primary'} style={{ padding: '8px 16px', fontSize: 12 }}>
                        {isMyPayment ? 'Pay Now' : 'Remind'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Info note */}
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            💡 <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Smart settlements</span> — CoHabify calculates the minimum number of transactions needed to clear all dues. Instead of everyone paying each other, we group it to the fewest possible payments.
          </p>
        </div>
      </div>
    </div>
  )
}
