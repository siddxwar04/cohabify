import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, CheckSquare, ArrowLeftRight, Users, Wallet } from 'lucide-react'
import { useStore } from '../../store/useStore'

const NAV = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/expenses',   icon: Receipt,         label: 'Expenses'   },
  { to: '/chores',     icon: CheckSquare,     label: 'Chores'     },
  { to: '/settlement', icon: ArrowLeftRight,  label: 'Settle Up'  },
  { to: '/members',    icon: Users,           label: 'Members'    },
]

export default function Sidebar() {
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const me = members.find((m) => m.id === currentUser)

  return (
    <aside style={{
      width: 230,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Wallet size={16} color="#fff" />
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          CoHab<span style={{ color: 'var(--accent)' }}>ify</span>
        </span>
      </div>

      {/* Flat info */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: 'var(--accent-glow)',
          border: '1px solid rgba(29,158,117,0.2)',
          borderRadius: 10,
          padding: '10px 14px',
        }}>
          <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Your Home</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Flat 4B, Koramangala</p>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Powered by CoHabify</p>
        </div>
      </div>

      <div style={{ padding: '0 12px 8px' }}>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 8px' }}>Menu</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s',
              })}
              onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
              onMouseLeave={(e) => { if (e.currentTarget.getAttribute('aria-current') !== 'page') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Members */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Flatmates</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {members.map((m) => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar" style={{ width: 28, height: 28, background: m.bg, color: m.color, fontSize: 10 }}>{m.initials}</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: m.id === currentUser ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{m.name.split(' ')[0]}</p>
                {m.id === currentUser && <p style={{ fontSize: 10, color: 'var(--accent)' }}>You</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
