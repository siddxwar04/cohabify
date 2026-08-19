import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import Topbar from '../components/layout/Topbar'
import Modal from '../components/ui/Modal'
import Avatar from '../components/ui/Avatar'
import { firstName } from '../lib/format'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Chores() {
  const { onMenu } = useOutletContext() || {}
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [day, setDay] = useState('Mon')

  const chores = useStore((s) => s.chores)
  const members = useStore((s) => s.members)
  const toggleChore = useStore((s) => s.toggleChore)
  const addChore = useStore((s) => s.addChore)
  const rotateChores = useStore((s) => s.rotateChores)
  const deleteChore = useStore((s) => s.deleteChore)
  const done = chores.filter((c) => c.done).length

  const handleAdd = () => {
    if (!title.trim()) return
    addChore({ title, assignedTo: assignee || members[0]?.id, dueDay: day })
    setTitle('')
    setShowAdd(false)
  }

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        kicker="This week"
        title="Housework"
        action={
          <div className="flex gap-2">
            <button className="btn-ghost !py-2" onClick={rotateChores}>
              <RotateCcw size={14} /> Rotate
            </button>
            <button className="btn-primary !py-2" onClick={() => setShowAdd(true)}>
              <Plus size={15} /> Add chore
            </button>
          </div>
        }
      />

      <div className="px-4 md:px-8 py-8 max-w-[1180px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {members.map((m) => {
            const mine = chores.filter((c) => c.assignedTo === m.id)
            const mineDone = mine.filter((c) => c.done).length
            const pct = mine.length ? Math.round((mineDone / mine.length) * 100) : 0
            return (
              <div key={m.id} className="card p-4 flex items-center gap-3">
                <Avatar member={m} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{firstName(m.name)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full bg-linen overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: m.color }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: m.color }}>{mineDone}/{mine.length}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="font-display text-3xl">Weekly board</h3>
            <p className="text-sm text-stone mt-1">{chores.length - done} still open · tap a card to complete</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS.map((d) => {
            const items = chores.filter((c) => c.dueDay === d)
            return (
              <div key={d} className="rounded-3xl bg-linen/40 border border-linen p-3 min-h-[180px]">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist font-semibold mb-3">{d}</p>
                <div className="space-y-2">
                  {items.map((chore) => {
                    const m = members.find((x) => x.id === chore.assignedTo)
                    return (
                      <div
                        key={chore.id}
                        className={`rounded-2xl p-3 bg-cream border shadow-sm ${chore.done ? 'border-forest/30 opacity-70' : 'border-linen'}`}
                      >
                        <button onClick={() => toggleChore(chore.id)} className="text-left w-full">
                          <p className={`text-sm font-semibold leading-snug ${chore.done ? 'line-through text-mist' : ''}`}>{chore.title}</p>
                        </button>
                        <div className="flex items-center justify-between mt-3">
                          <Avatar member={m} size={22} />
                          <button onClick={() => deleteChore(chore.id)} className="text-mist hover:text-red-700">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showAdd && (
        <Modal title="New chore" subtitle="Assign it to a day and a person." onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Chore</label>
              <input className="input mt-1.5" placeholder="Clean the balcony…" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Assign to</label>
              <select className="input mt-1.5" value={assignee || members[0]?.id} onChange={(e) => setAssignee(e.target.value)}>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">Due day</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${day === d ? 'bg-night text-day border-night' : 'bg-paper border-linen text-stone'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="btn-ghost flex-1" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary flex-[2]" onClick={handleAdd}><Plus size={15} /> Add to board</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
