import { useState } from 'react'
import { Bell, ChevronDown } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Avatar from '../ui/Avatar'
import { MenuButton } from './Sidebar'
import BrandLink from './BrandLink'
import ThemeToggle from '../ui/ThemeToggle'

export default function Topbar({ title, kicker, action, onMenu }) {
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const setCurrentUser = useStore((s) => s.setCurrentUser)
  const notifications = useStore((s) => s.notifications)
  const markNotificationsRead = useStore((s) => s.markNotificationsRead)
  const me = members.find((m) => m.id === currentUser)
  const unread = notifications.filter((n) => n.unread).length

  const [notes, setNotes] = useState(false)
  const [switcher, setSwitcher] = useState(false)

  return (
    <header className="sticky top-0 z-20 px-4 md:px-8 py-5 flex items-center justify-between gap-4 bg-paper/80 backdrop-blur-xl border-b border-linen/70">
      <div className="flex items-center gap-3 min-w-0">
        <MenuButton onClick={onMenu} />
        <BrandLink markOnly className="lg:hidden" />
        <div className="min-w-0">
          {kicker && (
            <p className="text-[11px] uppercase tracking-[0.18em] text-mist mb-1">{kicker}</p>
          )}
          <h1 className="font-display text-2xl md:text-[32px] leading-none text-espresso truncate">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {action}

        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => { setNotes((v) => !v); setSwitcher(false); if (!notes) markNotificationsRead() }}
            className="relative w-10 h-10 rounded-2xl border border-linen bg-cream flex items-center justify-center text-bark hover:border-mist"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-clay text-day text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {notes && (
            <div className="absolute right-0 mt-2 w-80 card p-3 z-30">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mist px-2 mb-2">House notes</p>
              {notifications.map((n) => (
                <div key={n.id} className="px-3 py-2.5 rounded-2xl hover:bg-paper">
                  <p className="text-sm font-semibold text-espresso">{n.title}</p>
                  <p className="text-xs text-stone mt-0.5">{n.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setSwitcher((v) => !v); setNotes(false) }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-linen bg-cream hover:border-mist"
          >
            <Avatar member={me} size={32} />
            <span className="hidden sm:block text-sm font-medium pr-1">{me?.name}</span>
            <ChevronDown size={14} className="text-mist" />
          </button>
          {switcher && (
            <div className="absolute right-0 mt-2 w-56 card p-2 z-30">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mist px-2 py-1">View as</p>
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setCurrentUser(m.id); setSwitcher(false) }}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left ${m.id === currentUser ? 'bg-forest-soft' : 'hover:bg-paper'}`}
                >
                  <Avatar member={m} size={28} />
                  <span className="text-sm font-medium">{m.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
