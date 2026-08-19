import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Chores from './pages/Chores'
import Settlement from './pages/Settlement'
import Members from './pages/Members'
import Pulse from './pages/Pulse'
import Pantry from './pages/Pantry'
import { useStore } from './store/useStore'

function HouseLayout() {
  const [open, setOpen] = useState(false)
  const toast = useStore((s) => s.toast)
  const clearToast = useStore((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 2800)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet context={{ onMenu: () => setOpen(true) }} />
      </main>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-espresso text-cream px-5 py-2.5 text-sm shadow-lift">
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<HouseLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="chores" element={<Chores />} />
          <Route path="pulse" element={<Pulse />} />
          <Route path="pantry" element={<Pantry />} />
          <Route path="settle" element={<Settlement />} />
          <Route path="members" element={<Members />} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
