import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Dashboard  from './pages/Dashboard'
import Expenses   from './pages/Expenses'
import Chores     from './pages/Chores'
import Settlement from './pages/Settlement'
import Members    from './pages/Members'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/"           element={<Dashboard />}  />
            <Route path="/expenses"   element={<Expenses />}   />
            <Route path="/chores"     element={<Chores />}     />
            <Route path="/settlement" element={<Settlement />} />
            <Route path="/members"    element={<Members />}    />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
