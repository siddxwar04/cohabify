import { Plus, TrendingUp, TrendingDown, IndianRupee, CheckCircle2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/layout/Navbar'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import SpendingChart from '../components/dashboard/SpendingChart'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import { useState } from 'react'
import { format } from 'date-fns'

const CATEGORY_COLORS = {
  Groceries: '#1D9E75',
  Utilities: '#378ADD',
  Food:      '#EF9F27',
  Others:    '#7F77DD',
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const members       = useStore((s) => s.members)
  const expenses      = useStore((s) => s.expenses)
  const chores        = useStore((s) => s.chores)
  const currentUser   = useStore((s) => s.currentUser)
  const getBalances   = useStore((s) => s.getBalances)
  const getSettlements= useStore((s) => s.getSettlements)
  const getTotalThisMonth = useStore((s) => s.getTotalThisMonth)
  const getSpendingByCategory = useStore((s) => s.getSpendingByCategory)

  const me         = members.find((m) => m.id === currentUser)
  const balances   = getBalances()
  const myBalance  = balances[currentUser] || 0
  const settlements= getSettlements()
  const total      = getTotalThisMonth()
  const myShare    = Math.round(total / members.length)
  const doneChores = chores.filter((c) => c.done).length
  const categories = getSpendingByCategory()
  const maxCat     = categories[0]?.value || 1
  const recentExp  = expenses.slice(0, 4)

  const getMember  = (id) => members.find((m) => m.id === id)

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar
        title={`Good morning, ${me?.name.split(' ')[0]} 👋`}
        subtitle={`CoHabify · ${format(new Date(), 'MMMM yyyy')}`}
        action={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Add Expense
          </button>
        }
      />

      <div style={{ padding: '24px 28px', maxWidth: 1100 }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          <StatCard
            label="Total this month"
            value={`₹${total.toLocaleString('en-IN')}`}
            sub={<span style={{ color: 'var(--warning)' }}>↑ 12% from March</span>}
            accent="#EF9F27"
          />
          <StatCard
            label="Your share"
            value={`₹${myShare.toLocaleString('en-IN')}`}
            sub={`of ${members.length} members`}
            accent="var(--blue)"
          />
          <StatCard
            label={myBalance >= 0 ? 'You are owed' : 'You owe'}
            value={`₹${Math.abs(Math.round(myBalance)).toLocaleString('en-IN')}`}
            sub={myBalance >= 0
              ? <span style={{ color: 'var(--accent)' }}>Net positive</span>
              : <span style={{ color: 'var(--danger)' }}>Net negative</span>}
            accent={myBalance >= 0 ? 'var(--accent)' : 'var(--danger)'}
          />
          <StatCard
            label="Chores done"
            value={`${doneChores}/${chores.length}`}
            sub={`${chores.length - doneChores} pending this week`}
            accent="var(--purple)"
          />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Recent expenses */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Expenses</h3>
              <button onClick={() => navigate('/expenses')} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600, fontFamily: 'var(--font)' }}>
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentExp.map((exp) => {
                const payer   = getMember(exp.paidBy)
                const isMe    = exp.paidBy === currentUser
                const share   = Math.round(exp.amount / exp.splitWith.length)
                return (
                  <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {exp.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                        Paid by {isMe ? 'you' : payer?.name.split(' ')[0]} · {format(new Date(exp.date), 'dd MMM')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>₹{exp.amount.toLocaleString('en-IN')}</p>
                      <p style={{ fontSize: 11, marginTop: 2, color: isMe ? 'var(--accent)' : 'var(--danger)' }}>
                        {isMe ? 'You paid' : `You owe ₹${share}`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chores */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Chores This Week</h3>
              <button onClick={() => navigate('/chores')} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600, fontFamily: 'var(--font)' }}>
                Manage <ArrowRight size={12} />
              </button>
            </div>
            <ChorePreview chores={chores} members={members} />
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progress</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 100, height: 5, background: 'var(--border)', borderRadius: 99 }}>
                  <div style={{ width: `${(doneChores / chores.length) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 99, transition: 'width 0.4s' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{doneChores}/{chores.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Spending by category */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Spending by Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categories.map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 72, textAlign: 'right', flexShrink: 0 }}>{cat.name}</span>
                  <div style={{ flex: 1, height: 8, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      width: `${(cat.value / maxCat) * 100}%`,
                      height: '100%',
                      background: CATEGORY_COLORS[cat.name] || 'var(--accent)',
                      borderRadius: 99,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', width: 64, textAlign: 'right', flexShrink: 0 }}>₹{cat.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settle up */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Settle Up</h3>
              <button onClick={() => navigate('/settlement')} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600, fontFamily: 'var(--font)' }}>
                Full view <ArrowRight size={12} />
              </button>
            </div>
            {settlements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={28} style={{ margin: '0 auto 8px', color: 'var(--accent)' }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>All settled up!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {settlements.slice(0, 3).map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 9 }}>
                    <div className="avatar" style={{ width: 28, height: 28, background: s.from.bg, color: s.from.color, fontSize: 10 }}>{s.from.initials}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.from.name.split(' ')[0]}</span> owes <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.to.name.split(' ')[0]}</span>
                      </p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: s.from.id === currentUser ? 'var(--danger)' : 'var(--accent)' }}>₹{s.amount}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 14, padding: '12px', background: myBalance >= 0 ? 'rgba(29,158,117,0.08)' : 'rgba(226,75,74,0.08)', borderRadius: 9, border: `1px solid ${myBalance >= 0 ? 'rgba(29,158,117,0.2)' : 'rgba(226,75,74,0.2)'}`, textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Your net balance</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: myBalance >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                {myBalance >= 0 ? '+' : ''}₹{Math.abs(Math.round(myBalance)).toLocaleString('en-IN')}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{myBalance >= 0 ? "You're in the clear 🎉" : "You have pending dues"}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card animate-fade-in">
      <p className="label">{label}</p>
      <p className="value" style={{ color: accent || 'var(--text-primary)' }}>{value}</p>
      <p className="sub">{sub}</p>
    </div>
  )
}

function ChorePreview({ chores, members }) {
  const toggleChore = useStore((s) => s.toggleChore)
  const getMember   = (id) => members.find((m) => m.id === id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {chores.slice(0, 5).map((chore) => {
        const m = getMember(chore.assignedTo)
        return (
          <div key={chore.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <button
              onClick={() => toggleChore(chore.id)}
              style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                border: `1.5px solid ${chore.done ? 'var(--accent)' : 'var(--border-light)'}`,
                background: chore.done ? 'var(--accent)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {chore.done && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
            <span style={{ flex: 1, fontSize: 13, color: chore.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: chore.done ? 'line-through' : 'none', fontWeight: 500 }}>{chore.title}</span>
            <div className="avatar tooltip" data-tip={m?.name} style={{ width: 24, height: 24, background: m?.bg, color: m?.color, fontSize: 9, flexShrink: 0 }}>{m?.initials}</div>
          </div>
        )
      })}
    </div>
  )
}
