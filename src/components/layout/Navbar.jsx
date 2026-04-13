import { Bell } from 'lucide-react'
import { useStore } from "../../store/useStore";

export default function Navbar({ title, subtitle, action }) {
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const me = members.find((m) => m.id === currentUser)

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 28px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-base)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12 }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {action}

        <button style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Bell size={15} />
        </button>

        <div
          className="avatar"
          style={{
            width: 36,
            height: 36,
            background: me?.bg,
            color: me?.color,
          }}
        >
          {me?.initials}
        </div>
      </div>
    </header>
  )
}