import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

/** Brand mark that always returns to the marketing landing page (`/`). */
export default function BrandLink({ onClick, className = '', markOnly = false, subtitle }) {
  return (
    <Link
      to="/"
      aria-label="CoHabify home"
      onClick={(e) => {
        onClick?.(e)
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }}
      className={`flex items-center gap-2.5 no-underline text-espresso shrink-0 ${className}`}
    >
      <span className="w-9 h-9 rounded-2xl bg-forest text-day flex items-center justify-center shadow-card">
        <Home size={16} />
      </span>
      {!markOnly && (
        <span>
          <span className="font-display text-[22px] leading-none block">
            CoHab<span className="italic text-forest">ify</span>
          </span>
          {subtitle && (
            <span className="block text-[10px] uppercase tracking-[0.18em] text-mist mt-1">{subtitle}</span>
          )}
        </span>
      )}
    </Link>
  )
}

