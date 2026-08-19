import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Trash2, UserPlus } from 'lucide-react'
import { useStore } from '../store/useStore'
import Topbar from '../components/layout/Topbar'
import Modal from '../components/ui/Modal'
import Avatar from '../components/ui/Avatar'
import { inr, signedInr } from '../lib/format'

export default function Members() {
  const { onMenu } = useOutletContext() || {}
  const members = useStore((s) => s.members)
  const expenses = useStore((s) => s.expenses)
  const chores = useStore((s) => s.chores)
  const currentUser = useStore((s) => s.currentUser)
  const getBalances = useStore((s) => s.getBalances)
  const addMember = useStore((s) => s.addMember)
  const deleteMember = useStore((s) => s.deleteMember)
  const balances = getBalances()

  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)

  const submit = () => {
    if (!name.trim() || name.trim().length < 2) return setError('Give them a real name.')
    const ok = addMember(name)
    if (!ok) return setError('That name is already in the house.')
    setName('')
    setError('')
    setShowAdd(false)
  }

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        kicker="Casa Verde"
        title="The household"
        action={
          <button className="btn-primary !py-2" onClick={() => setShowAdd(true)}>
            <UserPlus size={15} /> Add flatmate
          </button>
        }
      />

      <div className="px-4 md:px-8 py-8 max-w-[1180px]">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {members.map((m) => {
            const paid = expenses.filter((e) => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0)
            const mine = chores.filter((c) => c.assignedTo === m.id)
            const done = mine.filter((c) => c.done).length
            const bal = balances[m.id] || 0
            const isMe = m.id === currentUser
            return (
              <article key={m.id} className={`card p-6 relative ${isMe ? 'ring-1 ring-forest/25' : ''}`}>
                {!isMe && (
                  <button
                    onClick={() => setRemoving(m)}
                    className="absolute top-4 right-4 text-mist hover:text-red-700"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="flex flex-col items-center text-center pb-5 border-b border-linen mb-5">
                  <Avatar member={m} size={72} />
                  <h3 className="font-display text-2xl mt-4">{m.name}</h3>
                  <p className="text-xs text-stone mt-1">{m.vibe}</p>
                  {isMe && <span className="badge bg-forest-soft text-forest mt-3">You · {m.role}</span>}
                  {!isMe && <span className="badge bg-paper text-stone mt-3">{m.role}</span>}
                </div>
                <Row label="Paid so far" value={inr(paid)} />
                <Row label="Chores this week" value={`${done}/${mine.length}`} />
                <Row label="Net balance" value={signedInr(bal)} color={bal >= 0 ? 'var(--forest)' : 'var(--clay)'} />
              </article>
            )
          })}
        </div>
      </div>

      {showAdd && (
        <Modal title="Add a flatmate" subtitle="They’ll join future splits automatically." onClose={() => setShowAdd(false)}>
          <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Full name</label>
          <input
            className="input mt-1.5"
            placeholder="Sneha Kapoor"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
          />
          {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
          <div className="flex gap-2 mt-6">
            <button className="btn-ghost flex-1" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary flex-[2]" onClick={submit}><UserPlus size={15} /> Add to house</button>
          </div>
        </Modal>
      )}

      {removing && (
        <Modal title="Remove flatmate" subtitle="This also drops them from open bills." onClose={() => setRemoving(null)}>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-paper border border-linen mb-5">
            <Avatar member={removing} size={48} />
            <div>
              <p className="font-semibold">{removing.name}</p>
              <p className="text-xs text-stone">Will leave Casa Verde</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={() => setRemoving(null)}>Keep them</button>
            <button
              className="btn-danger flex-[2]"
              onClick={() => { deleteMember(removing.id); setRemoving(null) }}
            >
              Yes, remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Row({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-stone">{label}</span>
      <span className="text-sm font-semibold" style={{ color: color || 'var(--espresso)' }}>{value}</span>
    </div>
  )
}
