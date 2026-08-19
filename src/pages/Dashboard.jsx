import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowRight, Plus, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import Topbar from '../components/layout/Topbar'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import SpendingChart from '../components/dashboard/SpendingChart'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import FairnessCard from '../components/dashboard/FairnessCard'
import Avatar from '../components/ui/Avatar'
import { inr, firstName } from '../lib/format'
import { formatHour, isQuietNow } from '../data/seed'

export default function Dashboard() {
  const { onMenu } = useOutletContext() || {}
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const members = useStore((s) => s.members)
  const expenses = useStore((s) => s.expenses)
  const chores = useStore((s) => s.chores)
  const currentUser = useStore((s) => s.currentUser)
  const getBalances = useStore((s) => s.getBalances)
  const getTotalThisMonth = useStore((s) => s.getTotalThisMonth)
  const toggleChore = useStore((s) => s.toggleChore)
  const quietHours = useStore((s) => s.quietHours) || { start: 23, end: 7 }
  const presence = useStore((s) => s.presence)
  const getFairness = useStore((s) => s.getFairness)
  const vibes = useStore((s) => s.vibes)

  const me = members.find((m) => m.id === currentUser)
  const balances = getBalances()
  const myBalance = balances[currentUser] || 0
  const total = getTotalThisMonth()
  const myShare = members.length ? Math.round(total / members.length) : 0
  const doneChores = chores.filter((c) => c.done).length
  const hour = new Date().getHours()
  const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const quiet = isQuietNow(quietHours)
  const homeCount = members.filter((m) => (presence?.[m.id] || 'home') === 'home').length
  const { harmony } = getFairness()
  void vibes

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        kicker={format(new Date(), 'EEEE · d MMMM yyyy')}
        title={`${hello}, ${firstName(me?.name)}.`}
        action={
          <button className="btn-primary !py-2" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Log expense
          </button>
        }
      />

      <div className="px-4 md:px-8 py-8 max-w-[1180px] space-y-6">
        {quiet && (
          <button onClick={() => navigate('/app/pulse')} className="w-full text-left rounded-3xl bg-night text-day px-5 py-3.5 text-sm">
            Quiet hours · {formatHour(quietHours.start)}–{formatHour(quietHours.end)}. {homeCount} people home.
          </button>
        )}
        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-4">
          <div className="relative overflow-hidden rounded-[28px] bg-night text-day p-7 md:p-9">
            <Sparkles size={18} className="text-champagne mb-4" />
            <p className="text-[11px] uppercase tracking-[0.18em] text-day/50">Your position in the house</p>
            <p className="font-display text-5xl md:text-6xl mt-2">
              {myBalance >= 0 ? "You're owed" : 'You owe'}
            </p>
            <p className={`font-display text-5xl md:text-6xl mt-1 ${myBalance >= 0 ? 'text-champagne' : 'text-orange-300'}`}>
              {inr(myBalance)}
            </p>
            <p className="text-day/60 mt-4 max-w-md">
              {myBalance >= 0
                ? 'The house is in your debt this cycle. Settle-up will collect the fewest payments.'
                : 'A couple of taps on Settle up and you’re even again.'}
            </p>
            <button onClick={() => navigate('/app/settle')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-champagne hover:text-day">
              Open settle up <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Stat label="House spend" value={inr(total)} hint="This month" />
            <Stat label="Your share" value={inr(myShare)} hint={`${members.length} people`} />
            <Stat label="Chores" value={`${doneChores}/${chores.length}`} hint="This week" />
            <Stat label="Harmony" value={`${harmony}`} hint={`${homeCount} home now`} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl">Recent ledger</h3>
              <button onClick={() => navigate('/app/expenses')} className="text-sm font-semibold text-forest flex items-center gap-1">
                Full ledger <ArrowRight size={13} />
              </button>
            </div>
            <div className="space-y-1">
              {expenses.slice(0, 5).map((exp) => {
                const payer = members.find((m) => m.id === exp.paidBy)
                const isMe = exp.paidBy === currentUser
                const share = Math.round(exp.amount / exp.splitWith.length)
                return (
                  <div key={exp.id} className="flex items-center gap-3 py-3 border-b border-linen last:border-0">
                    <div className="w-11 h-11 rounded-2xl bg-paper flex items-center justify-center text-lg">{exp.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{exp.title}</p>
                      <p className="text-xs text-stone mt-0.5">
                        {isMe ? 'You' : firstName(payer?.name)} · {format(new Date(exp.date), 'd MMM')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{inr(exp.amount)}</p>
                      <p className={`text-[11px] ${isMe ? 'text-forest' : 'text-clay'}`}>
                        {isMe ? 'You paid' : `You owe ${inr(share)}`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl">Housework</h3>
              <button onClick={() => navigate('/app/chores')} className="text-sm font-semibold text-forest flex items-center gap-1">
                Board <ArrowRight size={13} />
              </button>
            </div>
            <div className="space-y-2">
              {chores.slice(0, 6).map((chore) => {
                const m = members.find((x) => x.id === chore.assignedTo)
                return (
                  <button
                    key={chore.id}
                    onClick={() => toggleChore(chore.id)}
                    className="w-full flex items-center gap-3 py-1.5 text-left"
                  >
                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${chore.done ? 'bg-forest border-forest' : 'border-linen'}`}>
                      {chore.done && (
                        <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#FBF7F0" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>
                      )}
                    </span>
                    <span className={`flex-1 text-sm ${chore.done ? 'text-mist line-through' : 'text-espresso'}`}>{chore.title}</span>
                    <span className="text-[10px] text-mist w-8">{chore.dueDay}</span>
                    <Avatar member={m} size={24} />
                  </button>
                )
              })}
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-linen overflow-hidden">
              <div className="h-full bg-forest rounded-full transition-all" style={{ width: `${chores.length ? (doneChores / chores.length) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="font-display text-2xl mb-4">Where the money went</h3>
            <SpendingChart />
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl">Fairness radar</h3>
              <button onClick={() => navigate('/app/pulse')} className="text-sm font-semibold text-forest flex items-center gap-1">
                Pulse <ArrowRight size={13} />
              </button>
            </div>
            <FairnessCard />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-2xl">House notes</h3>
            <button onClick={() => navigate('/app/pantry')} className="text-sm font-semibold text-forest flex items-center gap-1">
              Pantry <ArrowRight size={13} />
            </button>
          </div>
          <ActivityFeed />
        </div>
      </div>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function Stat({ label, value, hint }) {
  return (
    <div className="card p-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-mist">{label}</p>
      <p className="font-display text-3xl mt-2 leading-none">{value}</p>
      <p className="text-xs text-stone mt-2">{hint}</p>
    </div>
  )
}
