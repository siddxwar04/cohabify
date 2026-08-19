import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  ArrowLeftRight,
  Users,
  Home,
  LogOut,
  Menu,
  X,
  Radio,
  ShoppingBag,
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { HOUSE } from '../../data/seed'
import Avatar from '../ui/Avatar'

const NAV = [
  { to: '/app', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/app/expenses', icon: Receipt, label: 'Ledger' },
  { to: '/app/chores', icon: CheckSquare, label: 'Housework' },
  { to: '/app/pulse', icon: Radio, label: 'Pulse' },
  { to: '/app/pantry', icon: ShoppingBag, label: 'Pantry' },
  { to: '/app/settle', icon: ArrowLeftRight, label: 'Settle up' },
  { to: '/app/members', icon: Users, label: 'Household' },
]

export default function Sidebar({ open, onClose }) {
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const me = members.find((m) => m.id === currentUser)
  const navigate = useNavigate()

  const body = (
    <>
      <div className="px-5 pt-6 pb-4">
        <NavLink to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-2xl bg-forest text-cream flex items-center justify-center shadow-card">
            <Home size={16} />
          </div>
          <div>
            <p className="font-display text-[22px] leading-none text-espresso">
              CoHab<span className="italic text-forest">ify</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-mist mt-1">Casa Verde</p>
          </div>
        </NavLink>
      </div>

      <div className="px-4 mb-5">
        <div className="relative overflow-hidden rounded-3xl border border-linen shadow-card">
          <img src={HOUSE.photo} alt={HOUSE.name} className="h-28 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-cream">
            <p className="text-[10px] uppercase tracking-[0.16em] text-cream/70">Your home</p>
            <p className="font-display text-xl leading-none mt-0.5">{HOUSE.name}</p>
            <p className="text-[11px] mt-1 text-cream/80">{HOUSE.unit} · {HOUSE.city}</p>
          </div>
        </div>
      </div>

      <nav className="px-3 flex flex-col gap-1">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium no-underline transition ${
                isActive
                  ? 'bg-espresso text-cream shadow-card'
                  : 'text-stone hover:bg-linen/70 hover:text-espresso'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-mist px-1 mb-3">In the house</p>
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2.5">
              <Avatar member={m} size={28} />
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${m.id === currentUser ? 'text-espresso' : 'text-stone'}`}>
                  {m.name}
                </p>
                {m.id === currentUser && <p className="text-[10px] text-forest">You</p>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-5 w-full flex items-center justify-center gap-2 text-xs font-medium text-stone hover:text-espresso py-2"
        >
          <LogOut size={13} /> Back to site
        </button>

        <div className="mt-2 flex items-center gap-2.5 rounded-2xl bg-paper border border-linen px-3 py-2.5">
          <Avatar member={me} size={32} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-espresso truncate">{me?.name}</p>
            <p className="text-[11px] text-mist">{me?.role}</p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden lg:flex w-[272px] shrink-0 flex-col bg-cream/80 border-r border-linen h-screen sticky top-0 overflow-y-auto">
        {body}
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-espresso/40" onClick={onClose} />
          <aside className="relative w-[280px] h-full bg-cream flex flex-col shadow-lift">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper border border-linen flex items-center justify-center">
              <X size={14} />
            </button>
            {body}
          </aside>
        </div>
      )}
    </>
  )
}

export function MenuButton({ onClick }) {
  return (
    <button onClick={onClick} className="lg:hidden w-10 h-10 rounded-2xl border border-linen bg-cream flex items-center justify-center">
      <Menu size={18} />
    </button>
  )
}
