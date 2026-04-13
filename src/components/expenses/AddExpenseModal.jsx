import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { format } from 'date-fns'

const CATEGORIES = ['Groceries','Utilities','Food','Transport','Entertainment','Others']
const EMOJIS     = { Groceries:'🛒', Utilities:'💡', Food:'🍕', Transport:'🚗', Entertainment:'🎬', Others:'📦' }

export default function AddExpenseModal({ onClose }) {
  const members    = useStore((s) => s.members)
  const currentUser= useStore((s) => s.currentUser)
  const addExpense = useStore((s) => s.addExpense)

  const [form, setForm] = useState({
    title: '', amount: '', category: 'Groceries',
    paidBy: currentUser, splitWith: members.map((m) => m.id),
    date: format(new Date(), 'yyyy-MM-dd'),
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const toggleSplit = (id) => {
    const s = form.splitWith.includes(id)
      ? form.splitWith.filter((x) => x !== id)
      : [...form.splitWith, id]
    if (s.length > 0) set('splitWith', s)
  }

  const perPerson = form.amount && form.splitWith.length
    ? Math.round(Number(form.amount) / form.splitWith.length)
    : 0

  const handleSubmit = () => {
    if (!form.title.trim() || !form.amount) return
    addExpense({ ...form, amount: Number(form.amount), emoji: EMOJIS[form.category] || '📦' })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Add Expense</h2>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Description</label>
            <input className="input" placeholder="e.g. Grocery run at BigBazaar" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>

          {/* Amount + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Amount (₹)</label>
              <input className="input" type="number" placeholder="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Paid by */}
          <div>
            <label style={labelStyle}>Paid by</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {members.map((m) => (
                <button key={m.id} onClick={() => set('paidBy', m.id)} style={{
                  flex: 1, padding: '8px 6px', borderRadius: 9, cursor: 'pointer', fontFamily: 'var(--font)',
                  border: `1.5px solid ${form.paidBy === m.id ? m.color : 'var(--border-light)'}`,
                  background: form.paidBy === m.id ? m.bg : 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s',
                }}>
                  <div className="avatar" style={{ width: 28, height: 28, background: m.bg, color: m.color, fontSize: 10 }}>{m.initials}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: form.paidBy === m.id ? m.color : 'var(--text-secondary)' }}>{m.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Split with */}
          <div>
            <label style={labelStyle}>Split with</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {members.map((m) => {
                const active = form.splitWith.includes(m.id)
                return (
                  <button key={m.id} onClick={() => toggleSplit(m.id)} style={{
                    flex: 1, padding: '8px 6px', borderRadius: 9, cursor: 'pointer', fontFamily: 'var(--font)',
                    border: `1.5px solid ${active ? m.color : 'var(--border-light)'}`,
                    background: active ? m.bg : 'transparent',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s',
                  }}>
                    <div className="avatar" style={{ width: 28, height: 28, background: m.bg, color: m.color, fontSize: 10, opacity: active ? 1 : 0.4 }}>{m.initials}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: active ? m.color : 'var(--text-muted)' }}>{m.name.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Date</label>
            <input className="input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>

          {/* Per person preview */}
          {perPerson > 0 && (
            <div style={{ padding: '12px 14px', background: 'var(--accent-glow)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Per person</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>₹{perPerson.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleSubmit}>
            <Plus size={15} /> Add Expense
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }
