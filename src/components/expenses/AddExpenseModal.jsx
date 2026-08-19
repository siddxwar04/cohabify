import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { CATEGORIES } from '../../data/seed'
import Modal from '../ui/Modal'
import Avatar from '../ui/Avatar'

export default function AddExpenseModal({ onClose }) {
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const addExpense = useStore((s) => s.addExpense)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(currentUser)
  const [category, setCategory] = useState(CATEGORIES[0].name)
  const [splitWith, setSplitWith] = useState(members.map((m) => m.id))
  const [error, setError] = useState('')

  const meta = CATEGORIES.find((c) => c.name === category)

  const toggleSplit = (id) => {
    setSplitWith((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev
        return prev.filter((x) => x !== id)
      }
      return [...prev, id]
    })
  }

  const submit = () => {
    if (!title.trim()) return setError('Give this bill a name.')
    if (!amount || Number(amount) <= 0) return setError('Enter a valid amount.')
    addExpense({
      title,
      amount,
      paidBy,
      splitWith,
      category,
      emoji: meta.emoji,
    })
    onClose()
  }

  const share = splitWith.length ? Math.round((Number(amount) || 0) / splitWith.length) : 0

  return (
    <Modal title="Log an expense" subtitle="Split evenly across whoever was in on it." onClose={onClose} wide>
      <div className="space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">What was it?</label>
          <input className="input mt-1.5" placeholder="Sunday groceries, Wi-Fi, Uber…" value={title} onChange={(e) => { setTitle(e.target.value); setError('') }} autoFocus />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Amount (₹)</label>
            <input className="input mt-1.5" type="number" min="1" placeholder="0" value={amount} onChange={(e) => { setAmount(e.target.value); setError('') }} />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Paid by</label>
            <select className="input mt-1.5" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Category</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  category === c.name
                    ? 'bg-night text-day border-night'
                    : 'bg-paper border-linen text-stone hover:border-mist'
                }`}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Split with</label>
            <span className="text-xs text-stone">{splitWith.length} people · ₹{share.toLocaleString('en-IN')} each</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {members.map((m) => {
              const on = splitWith.includes(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => toggleSplit(m.id)}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border text-sm transition ${
                    on ? 'border-forest bg-forest-soft' : 'border-linen bg-paper opacity-60'
                  }`}
                >
                  <Avatar member={m} size={24} />
                  {m.name.split(' ')[0]}
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button className="btn-ghost flex-1" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-[2]" onClick={submit}><Plus size={15} /> Add to ledger</button>
        </div>
      </div>
    </Modal>
  )
}
