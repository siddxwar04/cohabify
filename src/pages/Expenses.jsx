import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { format } from 'date-fns'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import Topbar from '../components/layout/Topbar'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import Avatar from '../components/ui/Avatar'
import { CATEGORIES, categoryMeta } from '../data/seed'
import { firstName, inr } from '../lib/format'

const FILTERS = ['All', ...CATEGORIES.map((c) => c.name)]

export default function Expenses() {
  const { onMenu } = useOutletContext() || {}
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')

  const expenses = useStore((s) => s.expenses)
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const deleteExpense = useStore((s) => s.deleteExpense)

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const okCat = filter === 'All' || e.category === filter
      const okQ = !q.trim() || e.title.toLowerCase().includes(q.toLowerCase())
      return okCat && okQ
    })
  }, [expenses, filter, q])

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        kicker="Shared money"
        title="The ledger"
        action={
          <button className="btn-primary !py-2" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Log expense
          </button>
        }
      />

      <div className="px-4 md:px-8 py-8 max-w-[1180px]">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
            <input className="input pl-10" placeholder="Search the house bills…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <p className="text-sm text-stone md:ml-auto">
            {filtered.length} entries · <span className="font-semibold text-espresso">{inr(total)}</span>
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
          {FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                filter === c ? 'bg-espresso text-cream border-espresso' : 'bg-cream border-linen text-stone hover:border-mist'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-3xl">The ledger is quiet.</p>
              <p className="text-stone mt-2">Log the first shared bill and the house starts remembering.</p>
            </div>
          ) : (
            filtered.map((exp) => {
              const payer = members.find((m) => m.id === exp.paidBy)
              const isMe = exp.paidBy === currentUser
              const share = Math.round(exp.amount / exp.splitWith.length)
              const meta = categoryMeta(exp.category)
              return (
                <div key={exp.id} className="flex items-center gap-4 px-5 py-4 border-b border-linen last:border-0 hover:bg-paper/60">
                  <div className="w-1 self-stretch rounded-full" style={{ background: meta.color }} />
                  <div className="w-12 h-12 rounded-2xl bg-paper flex items-center justify-center text-xl shrink-0">{exp.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{exp.title}</p>
                    <p className="text-xs text-stone mt-1">
                      {format(new Date(exp.date), 'd MMM yyyy')} · {exp.category} · {exp.splitWith.length} people
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
                    <Avatar member={payer} size={28} />
                    <span className="text-sm text-stone">{isMe ? 'You' : firstName(payer?.name)}</span>
                  </div>
                  <div className="text-right min-w-[110px]">
                    <p className="font-bold">{inr(exp.amount)}</p>
                    <p className={`text-[11px] ${isMe ? 'text-forest' : 'text-clay'}`}>
                      {isMe ? `Back ${inr(share * (exp.splitWith.length - 1))}` : `You ${inr(share)}`}
                    </p>
                  </div>
                  <button className="btn-danger !px-3 !py-2" onClick={() => deleteExpense(exp.id)}>
                    <Trash2 size={14} />
                  </button>
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
