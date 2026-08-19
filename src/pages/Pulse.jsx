import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Moon, Plus, Trash2, UtensilsCrossed, Users } from 'lucide-react'
import { useStore } from '../store/useStore'
import Topbar from '../components/layout/Topbar'
import Avatar from '../components/ui/Avatar'
import {
  PRESENCE_CYCLE,
  PRESENCE_META,
  VIBE_META,
  formatHour,
  isQuietNow,
} from '../data/seed'
import { firstName } from '../lib/format'

export default function Pulse() {
  const { onMenu } = useOutletContext() || {}
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const presence = useStore((s) => s.presence)
  const vibes = useStore((s) => s.vibes)
  const guests = useStore((s) => s.guests)
  const dinner = useStore((s) => s.dinner)
  const quietHours = useStore((s) => s.quietHours)
  const recurring = useStore((s) => s.recurring)
  const cyclePresence = useStore((s) => s.cyclePresence)
  const setVibe = useStore((s) => s.setVibe)
  const setDinner = useStore((s) => s.setDinner)
  const addGuest = useStore((s) => s.addGuest)
  const removeGuest = useStore((s) => s.removeGuest)

  const [who, setWho] = useState('')
  const [note, setNote] = useState('')
  const quiet = isQuietNow(quietHours)
  const today = new Date().getDate()

  const upcoming = useMemo(
    () =>
      [...recurring].sort((a, b) => {
        const da = a.dueDay >= today ? a.dueDay : a.dueDay + 31
        const db = b.dueDay >= today ? b.dueDay : b.dueDay + 31
        return da - db
      }),
    [recurring, today]
  )

  const homeCount = members.filter((m) => (presence?.[m.id] || 'home') === 'home').length

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        kicker="Tonight at Casa Verde"
        title="House pulse"
      />

      <div className="px-4 md:px-8 py-8 max-w-[1180px] space-y-5">
        {quiet && (
          <div className="rounded-3xl bg-espresso text-cream px-5 py-4 flex items-center gap-3">
            <Moon size={18} className="text-champagne" />
            <p className="text-sm">
              Quiet hours are on — {formatHour(quietHours.start)} to {formatHour(quietHours.end)}. Keep voices and speakers low.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
          <div className="card p-6">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h3 className="font-display text-3xl">Who’s around</h3>
                <p className="text-sm text-stone mt-1">{homeCount} home · tap your card to cycle status</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {members.map((m) => {
                const status = presence?.[m.id] || 'home'
                const meta = PRESENCE_META[status]
                const vibe = vibes?.[m.id] || 'good'
                const isMe = m.id === currentUser
                return (
                  <div key={m.id} className={`rounded-3xl border p-4 ${isMe ? 'border-forest bg-forest-soft/40' : 'border-linen bg-paper'}`}>
                    <button onClick={() => cyclePresence(m.id)} className="w-full text-left flex items-center gap-3">
                      <Avatar member={m} size={44} />
                      <div className="min-w-0">
                        <p className="font-semibold">{firstName(m.name)}{isMe ? ' · you' : ''}</p>
                        <p className="text-xs mt-0.5" style={{ color: meta.color }}>{meta.label} · {meta.hint}</p>
                      </div>
                    </button>
                    {isMe && (
                      <div className="flex gap-1.5 mt-3">
                        {Object.entries(VIBE_META).map(([key, v]) => (
                          <button
                            key={key}
                            onClick={() => setVibe(m.id, key)}
                            className={`flex-1 text-xs rounded-full py-1.5 border ${vibe === key ? 'bg-espresso text-cream border-espresso' : 'bg-cream border-linen text-stone'}`}
                          >
                            {v.emoji} {v.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {!isMe && (
                      <p className="text-[11px] text-mist mt-3">{VIBE_META[vibe]?.emoji} Mood: {VIBE_META[vibe]?.label}</p>
                    )}
                    {isMe && (
                      <p className="text-[10px] text-mist mt-2">Status cycles {PRESENCE_CYCLE.map((p) => PRESENCE_META[p].label).join(' → ')}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <UtensilsCrossed size={16} className="text-forest" />
                <h3 className="font-display text-2xl">Kitchen note</h3>
              </div>
              <textarea
                className="input min-h-[110px] resize-none"
                value={dinner}
                onChange={(e) => setDinner(e.target.value)}
              />
              <p className="text-[11px] text-mist mt-2">Visible to everyone. Update before you leave a pot on the stove.</p>
            </div>

            <div className="card p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Quiet hours</p>
              <p className="font-display text-3xl mt-1">
                {formatHour(quietHours.start)} – {formatHour(quietHours.end)}
              </p>
              <p className="text-xs text-stone mt-2">{quiet ? 'Active right now.' : 'Not active. House can be a little louder.'}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-clay" />
              <h3 className="font-display text-2xl">Guest log</h3>
            </div>
            <p className="text-sm text-stone mb-4">Flag people over so nobody walks into a living-room surprise.</p>
            <div className="flex gap-2 mb-4">
              <input className="input" placeholder="Who’s coming?" value={who} onChange={(e) => setWho(e.target.value)} />
              <input className="input" placeholder="Till when?" value={note} onChange={(e) => setNote(e.target.value)} />
              <button
                className="btn-primary !px-4 shrink-0"
                onClick={() => { addGuest({ who, note, by: currentUser }); setWho(''); setNote('') }}
              >
                <Plus size={15} />
              </button>
            </div>
            <div className="space-y-2">
              {guests.length === 0 && <p className="text-sm text-mist">No guests on the board.</p>}
              {guests.map((g) => {
                const host = members.find((m) => m.id === g.by)
                return (
                  <div key={g.id} className="flex items-center gap-3 rounded-2xl bg-paper border border-linen px-3 py-2.5">
                    <Avatar member={host} size={28} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{g.who}</p>
                      <p className="text-xs text-stone">{firstName(host?.name)} · {g.note || g.night}</p>
                    </div>
                    <button onClick={() => removeGuest(g.id)} className="text-mist hover:text-red-700"><Trash2 size={14} /></button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-2xl mb-1">Coming due</h3>
            <p className="text-sm text-stone mb-4">Recurring house bills so rent never ambushes the chat.</p>
            <div className="space-y-2">
              {upcoming.map((b) => {
                const soon = b.dueDay >= today && b.dueDay - today <= 5
                return (
                  <div key={b.id} className="flex items-center gap-3 py-2 border-b border-linen last:border-0">
                    <span className="w-10 h-10 rounded-2xl bg-paper flex items-center justify-center text-lg">{b.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{b.title}</p>
                      <p className="text-xs text-stone">Due on the {b.dueDay}{soon ? ' · this week' : ''}</p>
                    </div>
                    <p className="text-sm font-bold">₹{b.amount.toLocaleString('en-IN')}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
