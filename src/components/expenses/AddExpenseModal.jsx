import { useState } from 'react'
import { useStore } from '../store/useStore'
import Navbar from '../components/layout/Navbar'
import { UserPlus, Trash2, X, User } from 'lucide-react'

// ── Add Member Modal ───────────────────────────────────────
function AddMemberModal({ onClose }) {
  const addMember = useStore((s) => s.addMember)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return setError('Please enter a name.')
    if (trimmed.length < 2) return setError('Name must be at least 2 characters.')
    addMember(trimmed)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Add Flatmate</h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>They'll be added to all future expense splits</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={15} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Avatar preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div className="avatar" style={{ width: 64, height: 64, background: 'var(--bg-elevated)', border: '2px dashed var(--border-light)', color: 'var(--text-muted)', fontSize: 22 }}>
            {name.trim()
              ? (() => {
                  const parts = name.trim().split(' ').filter(Boolean)
                  return parts.length >= 2
                    ? (parts[0][0] + parts[1][0]).toUpperCase()
                    : parts[0].slice(0, 2).toUpperCase()
                })()
              : <User size={24} />
            }
          </div>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label>
          <input
            className="input"
            placeholder="e.g. Sneha Kapoor"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          {error && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6 }}>{error}</p>}
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>
          Initials and colour will be assigned automatically.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleSubmit}>
            <UserPlus size={15} />
            Add Flatmate
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ───────────────────────────────────
function DeleteConfirmModal({ member, onClose }) {
  const deleteMember  = useStore((s) => s.deleteMember)
  const expenses      = useStore((s) => s.expenses)
  const chores        = useStore((s) => s.chores)

  const expCount  = expenses.filter((e) => e.paidBy === member.id || e.splitWith.includes(member.id)).length
  const choreCount= chores.filter((c) => c.assignedTo === member.id).length

  const handleDelete = () => {
    deleteMember(member.id)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Remove Flatmate</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex' }}>
            <X size={15} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Member preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
          <div className="avatar" style={{ width: 48, height: 48, background: member.bg, color: member.color, fontSize: 16 }}>{member.initials}</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Will be permanently removed</p>
          </div>
        </div>

        {/* Impact warning */}
        {(expCount > 0 || choreCount > 0) && (
          <div style={{ background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 6 }}>⚠️ This will also:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {expCount > 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  • Remove them from <strong style={{ color: 'var(--text-primary)' }}>{expCount} expense(s)</strong> (expenses they paid will be deleted)
                </p>
              )}
              {choreCount > 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  • Reassign their <strong style={{ color: 'var(--text-primary)' }}>{choreCount} chore(s)</strong> to another member
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-danger" style={{ flex: 2, padding: '9px 18px', fontSize: 13 }} onClick={handleDelete}>
            <Trash2 size={14} style={{ marginRight: 6 }} />
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Members Page ───────────────────────────────────────────
export default function Members() {
  const members     = useStore((s) => s.members)
  const expenses    = useStore((s) => s.expenses)
  const chores      = useStore((s) => s.chores)
  const currentUser = useStore((s) => s.currentUser)
  const getBalances = useStore((s) => s.getBalances)
  const balances    = getBalances()

  const [showAddModal,    setShowAddModal]    = useState(false)
  const [memberToDelete,  setMemberToDelete]  = useState(null)

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar
        title="Members"
        subtitle="Your flatmates overview"
        action={
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={15} />
            Add Flatmate
          </button>
        }
      />

      <div style={{ padding: '24px 28px' }}>
        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <UserPlus size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>No flatmates yet</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Add your first flatmate to get started</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {members.map((m, idx) => {
              const myExp    = expenses.filter((e) => e.paidBy === m.id)
              const total    = myExp.reduce((s, e) => s + e.amount, 0)
              const myChores = chores.filter((c) => c.assignedTo === m.id)
              const done     = myChores.filter((c) => c.done).length
              const bal      = balances[m.id] || 0
              const isMe     = m.id === currentUser

              return (
                <div key={m.id} className="card animate-fade-in" style={{
                  animationDelay: `${idx * 0.1}s`,
                  border: isMe ? `1.5px solid ${m.color}50` : '1px solid var(--border)',
                  position: 'relative',
                }}>
                  {/* Delete button — hidden for current user */}
                  {!isMe && (
                    <button
                      onClick={() => setMemberToDelete(m)}
                      title="Remove flatmate"
                      style={{
                        position: 'absolute', top: 12, right: 12,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 6,
                        borderRadius: 7,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-muted)',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(226,75,74,0.1)'; e.currentTarget.style.color = 'var(--danger)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  {/* Header */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                    <div className="avatar" style={{ width: 64, height: 64, background: m.bg, color: m.color, fontSize: 20, marginBottom: 12 }}>{m.initials}</div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{m.name}</p>
                    {isMe && <span className="badge badge-green" style={{ marginTop: 6 }}>You</span>}
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <StatRow label="Paid so far"  value={`₹${total.toLocaleString('en-IN')}`} color="var(--text-primary)" />
                    <StatRow label="Chores done"  value={`${done}/${myChores.length}`}         color={m.color} />
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
        )}
      </div>

      {/* Modals */}
      {showAddModal   && <AddMemberModal onClose={() => setShowAddModal(false)} />}
      {memberToDelete && <DeleteConfirmModal member={memberToDelete} onClose={() => setMemberToDelete(null)} />}
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
