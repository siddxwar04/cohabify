import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, getTheme, toggleTheme } from '../../lib/theme'

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )

  useEffect(() => {
    const current = getTheme()
    setTheme(current)
    applyTheme(current)
  }, [])

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      onClick={() => setTheme(toggleTheme())}
      className={`theme-toggle w-10 h-10 rounded-2xl border border-linen bg-cream flex items-center justify-center text-bark hover:border-mist transition ${className}`}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
