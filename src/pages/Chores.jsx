import { useState } from 'react'
import { Plus, RotateCcw, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import Navbar from '../components/layout/Navbar'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function Chores() {
  const [showAdd, setShowAdd]   = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [newDay, setNewDay]     = useState('Mon')

  const chores      = useStore((s) => s.chores)
  const members     = useStore((s) => s.members)
  const toggleChore = useStore((s) => s.toggleChore)
  const addChore    = useStore((s) => s.addChore)
  const rotateChores= useStore((s) => s.rotateChores)

  const getMember = (id) => members.find((m) => m.id === id)
  const doneCount = chores.filter((c) => c.done).length

  const handleAdd = () => {
    if (!newTitle.trim()) return
    addChore({ title: newTitle, assignedTo: newAssignee || members[0].id, dueDay: newDay })
    setNewTitle(''); setShowAdd(false)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar
        title="Chores"
        subtitle={`${doneCount}/${chores.length} completed this week`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={rotateChores} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <RotateCcw size={14} /> Rotate
            </button>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={15} /> Add Chore
            </button>
          </div>
        }
      />

      <div style={{ padding: '24px 28px' }}>
        {/* Progress overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {members.map((m) => {
            const myChores  = chores.filter((c) => c.assignedTo === m.id)
            const myDone    = myChores.filter((c) => c.done).length
            const pct       = myChores.length ? Math.round((myDone / myChores.length) * 100) : 0
            return (
              <div key={m.id} className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="avatar" style={{ width: 44, height: 44, background: m.bg, color: m.color, fontSize: 14 }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{m.name.split(' ')[0]}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: m.color, borderRadius: 99, transition: 'width 0.4s' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{myDone}/{myChores.length}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Chore board */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>This Week's Chores</h3>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{chores.length - doneCount} remaining</span>
          </div>

          {chores.map((chore, idx) => {
            const m = getMember(chore.assignedTo)
            return (
              <div key={chore.id} className="animate-fade-in" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: idx < chores.length - 1 ? '1px solid var(--border)' : 'none',
                background: chore.done ? 'rgba(29,158,117,0.03)' : 'transparent',
                animationDelay: `${idx * 0.05}s`,
                transition: 'background 0.2s',
              }}>
                <button
                  onClick={() => toggleChore(chore.id)}
                  style={{
                    width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                    border: `1.5px solid ${chore.done ? 'var(--accent)' : 'var(--border-light)'}`,
                    background: chore.done ? 'var(--accent)' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {chore.done && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: chore.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: chore.done ? 'line-through' : 'none', transition: 'all 0.2s' }}>{chore.title}</p>
                </div>

                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '3px 9px', borderRadius: 99, flexShrink: 0 }}>{chore.dueDay}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div className="avatar" style={{ width: 28, height: 28, background: m?.bg, color: m?.color, fontSize: 10 }}>{m?.initials}</div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{m?.name.split(' ')[0]}</span>
                </div>

                {chore.done && <span className="badge badge-green">Done</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add chore modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>New Chore</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Chore Name</label>
                <input className="input" placeholder="e.g. Clean bathroom" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Assign to</label>
                <select className="input" value={newAssignee || members[0].id} onChange={(e) => setNewAssignee(e.target.value)}>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Due Day</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {DAYS.map((d) => (
                    <button key={d} onClick={() => setNewDay(d)} style={{
                      padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'var(--font)',
                      fontSize: 12, fontWeight: 700,
                      background: newDay === d ? 'var(--accent)' : 'var(--bg-elevated)',
                      color: newDay === d ? '#fff' : 'var(--text-secondary)',
                      border: `1px solid ${newDay === d ? 'var(--accent)' : 'var(--border-light)'}`,
                      transition: 'all 0.15s',
                    }}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleAdd}><Plus size={15} /> Add Chore</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }
