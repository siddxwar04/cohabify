import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HOUSE } from '../data/seed'
import { useStore } from '../store/useStore'
import BrandLink from '../components/layout/BrandLink'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function Login() {
  const navigate = useNavigate()
  const members = useStore((s) => s.members)
  const setCurrentUser = useStore((s) => s.setCurrentUser)
  const [picked, setPicked] = useState('m1')

  const enter = () => {
    setCurrentUser(picked)
    navigate('/app')
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={HOUSE.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-night/45" />
        <div className="absolute bottom-10 left-10 right-10 text-day">
          <p className="text-[11px] uppercase tracking-[0.2em] text-day/70">Welcome back</p>
          <h2 className="font-display text-5xl mt-2 leading-tight">The keys to {HOUSE.name}.</h2>
        </div>
      </div>

      <div className="flex flex-col justify-center px-8 py-16 bg-paper">
        <div className="flex items-center justify-between max-w-md mb-12">
          <BrandLink />
          <ThemeToggle />
        </div>

        <h1 className="font-display text-4xl md:text-5xl leading-tight">Step inside.</h1>
        <p className="text-stone mt-3 max-w-sm">
          This is a working frontend. Pick a flatmate to view the house as them — balances, chores, and the ledger all follow.
        </p>

        <div className="mt-8 space-y-2 max-w-md">
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setPicked(m.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                picked === m.id ? 'border-forest bg-forest-soft' : 'border-linen bg-cream hover:border-mist'
              }`}
            >
              <span
                className="avatar w-11 h-11 text-sm"
                style={{ background: m.bg, color: m.color }}
              >
                {m.initials}
              </span>
              <span>
                <span className="block font-semibold">{m.name}</span>
                <span className="text-xs text-stone">{m.role} · {m.vibe}</span>
              </span>
            </button>
          ))}
        </div>

        <button className="btn-dark mt-8 max-w-md" onClick={enter}>
          Enter the house <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
