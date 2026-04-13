import { useState } from 'react'
import { Plus, Trash2, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { useStore } from '../store/useStore'
import Navbar from '../components/layout/Navbar'
import AddExpenseModal from '../components/expenses/AddExpenseModal'

const CATEGORIES = ['All','Groceries','Utilities','Food','Transport','Entertainment','Others']

export default function Expenses() {
  const [showModal, setShowModal]   = useState(false)
  const [filter, setFilter]         = useState('All')
  const expenses    = useStore((s) => s.expenses)
  const members     = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const deleteExpense = useStore((s) => s.deleteExpense)

  const getMember = (id) => members.find((m) => m.id === id)
  const filtered  = filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)
  const total     = filtered.reduce((s, e) => s + e.amount, 0)

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar
        title="Expenses"
        subtitle={`${filtered.length} entries · ₹${total.toLocaleString('en-IN')} total`}
        action={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Add Expense
          </button>
        }
      />

      <div style={{ padding: '24px 28px' }}>
        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '7px 16px', borderRadius: 99,
              background: filter === c ? 'var(--accent)' : 'var(--bg-surface)',
              border: `1px solid ${filter === c ? 'var(--accent)' : 'var(--border)'}`,
              color: filter === c ? '#fff' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s',
            }}>
              {c}
            </button>
          ))}
        </div>

        {/* Expense list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            {['Description','Category','Paid By','Amount',''].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: i >= 3 ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🧾</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>No expenses yet</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Add your first expense to get started</p>
            </div>
          ) : (
            filtered.map((exp, idx) => {
              const payer   = getMember(exp.paidBy)
              const isMe    = exp.paidBy === currentUser
              const share   = Math.round(exp.amount / exp.splitWith.length)
              return (
                <div key={exp.id} className="animate-fade-in" style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                  gap: 12, padding: '14px 20px',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center',
                  animationDelay: `${idx * 0.04}s`,
                }}>
                  {/* Description */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{exp.emoji}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{exp.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{format(new Date(exp.date), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  {/* Category */}
                  <div><span className="badge badge-blue">{exp.category}</span></div>
                  {/* Paid by */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div className="avatar" style={{ width: 24, height: 24, background: payer?.bg, color: payer?.color, fontSize: 9 }}>{payer?.initials}</div>
                    <span style={{ fontSize: 13, color: isMe ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isMe ? 700 : 400 }}>
                      {isMe ? 'You' : payer?.name.split(' ')[0]}
                    </span>
                  </div>
                  {/* Amount */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>₹{exp.amount.toLocaleString('en-IN')}</p>
                    <p style={{ fontSize: 11, color: isMe ? 'var(--accent)' : 'var(--danger)', marginTop: 2 }}>
                      {isMe ? `You get back ₹${share * (exp.splitWith.length - 1)}` : `You owe ₹${share}`}
                    </p>
                  </div>
                  {/* Delete */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-danger" onClick={() => deleteExpense(exp.id)} style={{ padding: '6px 10px' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
