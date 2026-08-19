import { useStore } from '../../store/useStore'
import Avatar from '../ui/Avatar'
import { firstName } from '../../lib/format'

export default function FairnessCard() {
  const members = useStore((s) => s.members)
  const expenses = useStore((s) => s.expenses)
  const chores = useStore((s) => s.chores)
  const vibes = useStore((s) => s.vibes)
  const getFairness = useStore((s) => s.getFairness)
  const { rows, harmony } = getFairness()
  void members; void expenses; void chores; void vibes

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Harmony index</p>
          <p className="font-display text-4xl mt-1">{harmony}<span className="text-xl text-mist">/100</span></p>
        </div>
        <p className="text-xs text-stone max-w-[180px] text-right">
          Paid share vs housework finished — so money and labour stay in the same conversation.
        </p>
      </div>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.id}>
            <div className="flex items-center gap-2 mb-1.5">
              <Avatar member={r.member} size={22} />
              <span className="text-sm font-medium flex-1">{firstName(r.name)}</span>
              <span className="text-[11px] text-mist">{r.money}% paid · {r.labor}% chores</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Bar pct={r.money} color="#1F6B4A" />
              <Bar pct={r.labor} color="#C45D26" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 text-[11px] text-stone">
        <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-forest inline-block" /> Money in</span>
        <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-clay inline-block" /> Housework done</span>
      </div>
    </div>
  )
}

function Bar({ pct, color }) {
  return (
    <div className="h-1.5 rounded-full bg-linen overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  )
}
