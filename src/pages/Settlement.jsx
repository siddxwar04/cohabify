import { useOutletContext } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MessageCircleHeart } from 'lucide-react'
import { useStore } from '../store/useStore'
import Topbar from '../components/layout/Topbar'
import Avatar from '../components/ui/Avatar'
import { firstName, inr, signedInr } from '../lib/format'

export default function Settlement() {
  const { onMenu } = useOutletContext() || {}
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const getBalances = useStore((s) => s.getBalances)
  const getSettlements = useStore((s) => s.getSettlements)
  const recordPayment = useStore((s) => s.recordPayment)
  const sendNudge = useStore((s) => s.sendNudge)

  const balances = getBalances()
  const settlements = getSettlements()

  return (
    <div>
      <Topbar onMenu={onMenu} kicker="Minimum payments" title="Settle up" />

      <div className="px-4 md:px-8 py-8 max-w-[880px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {members.map((m) => {
            const bal = balances[m.id] || 0
            const isMe = m.id === currentUser
            return (
              <div key={m.id} className={`card p-5 ${isMe ? 'ring-1 ring-forest/30' : ''}`}>
                <div className="flex items-center gap-2.5 mb-4">
                  <Avatar member={m} size={40} />
                  <div>
                    <p className="text-sm font-semibold">{firstName(m.name)}</p>
                    {isMe && <p className="text-[10px] text-forest font-bold uppercase tracking-wider">You</p>}
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-mist">{bal >= 0 ? 'Gets back' : 'Owes'}</p>
                <p className={`font-display text-3xl mt-1 ${bal >= 0 ? 'text-forest' : 'text-clay'}`}>
                  {inr(bal)}
                </p>
              </div>
            )
          })}
        </div>

        <div className="card p-6 md:p-8">
          <h3 className="font-display text-3xl mb-2">
            {settlements.length === 0 ? 'The house is even.' : `${settlements.length} quiet payment${settlements.length > 1 ? 's' : ''}`}
          </h3>
          <p className="text-stone mb-6">
            CoHabify collapses every IOU into the fewest transfers. Record a payment and balances update instantly.
          </p>

          {settlements.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 size={40} className="mx-auto text-forest mb-3" />
              <p className="font-semibold text-forest">All settled up</p>
              <p className="text-sm text-stone mt-1">Nobody owes anybody. For now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((s) => {
                const minePay = s.from.id === currentUser
                const mineGet = s.to.id === currentUser
                return (
                  <div
                    key={`${s.from.id}-${s.to.id}`}
                    className="flex flex-wrap items-center gap-3 p-4 rounded-3xl bg-paper border border-linen"
                  >
                    <Avatar member={s.from} size={40} />
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-sm font-semibold">
                        {minePay ? 'You' : firstName(s.from.name)}
                        <span className="text-mist font-normal"> pays </span>
                        {mineGet ? 'you' : firstName(s.to.name)}
                      </p>
                      <p className="text-xs text-stone mt-0.5">
                        {minePay ? 'Your turn to close this' : mineGet ? 'Waiting on them' : 'House transfer'}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-mist hidden sm:block" />
                    <Avatar member={s.to} size={40} />
                    <p className={`font-display text-2xl min-w-[90px] text-right ${minePay ? 'text-clay' : 'text-forest'}`}>
                      {inr(s.amount)}
                    </p>
                    <div className="flex gap-2">
                      {mineGet && (
                        <button
                          className="btn-ghost !py-2"
                          onClick={() => sendNudge(currentUser, s.from.id, s.amount)}
                        >
                          <MessageCircleHeart size={14} /> Nudge
                        </button>
                      )}
                      <button
                        className={minePay ? 'btn-dark !py-2' : 'btn-ghost !py-2'}
                        onClick={() => recordPayment(s.from.id, s.to.id, s.amount)}
                      >
                        {minePay ? 'Mark paid' : 'Record'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-stone leading-relaxed px-1">
          Smart settlements — instead of everyone paying everyone, we reduce the graph to the smallest set of UPI-sized transfers.
          Your net is {signedInr(balances[currentUser] || 0)}.
        </p>
      </div>
    </div>
  )
}
