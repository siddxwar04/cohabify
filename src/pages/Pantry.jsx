import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import Topbar from '../components/layout/Topbar'
import Modal from '../components/ui/Modal'
import Avatar from '../components/ui/Avatar'
import { firstName } from '../lib/format'

export default function Pantry() {
  const { onMenu } = useOutletContext() || {}
  const pantry = useStore((s) => s.pantry)
  const members = useStore((s) => s.members)
  const currentUser = useStore((s) => s.currentUser)
  const addPantryItem = useStore((s) => s.addPantryItem)
  const togglePantryItem = useStore((s) => s.togglePantryItem)
  const deletePantryItem = useStore((s) => s.deletePantryItem)
  const checkoutPantry = useStore((s) => s.checkoutPantry)

  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [checkout, setCheckout] = useState(false)
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(currentUser)

  const open = pantry.filter((i) => !i.bought)
  const got = pantry.filter((i) => i.bought)

  const add = () => {
    addPantryItem({ name, qty, addedBy: currentUser })
    setName('')
    setQty('')
  }

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        kicker="Shared kitchen"
        title="Pantry list"
        action={
          <button className="btn-primary !py-2" disabled={!open.length} onClick={() => setCheckout(true)}>
            <ShoppingBag size={15} /> Checkout as bill
          </button>
        }
      />

      <div className="px-4 md:px-8 py-8 max-w-[880px]">
        <p className="text-stone mb-6 max-w-xl">
          Drop what the house is out of. Whoever shops can turn the open list into a grocery expense — Splitwise never sees the fridge.
        </p>

        <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-2">
          <input className="input" placeholder="Oat milk, sponges, eggs…" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <input className="input sm:w-28" placeholder="Qty" value={qty} onChange={(e) => setQty(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <button className="btn-dark" onClick={add}><Plus size={15} /> Add</button>
        </div>

        <div className="card overflow-hidden">
          {open.length === 0 && (
            <p className="px-5 py-10 text-center text-stone">The list is empty. The fridge is theoretically fine.</p>
          )}
          {open.map((item) => {
            const who = members.find((m) => m.id === item.addedBy)
            return (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-linen">
                <button onClick={() => togglePantryItem(item.id)} className="w-5 h-5 rounded-md border border-linen" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-stone">{item.qty} · added by {firstName(who?.name)}</p>
                </div>
                <Avatar member={who} size={24} />
                <button onClick={() => deletePantryItem(item.id)} className="text-mist hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            )
          })}
        </div>

        {got.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist mb-2">Already bought</p>
            <div className="card overflow-hidden opacity-70">
              {got.map((item) => (
                <button key={item.id} onClick={() => togglePantryItem(item.id)} className="w-full text-left px-5 py-3 border-b border-linen last:border-0 line-through text-stone text-sm">
                  {item.name} · {item.qty}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {checkout && (
        <Modal title="Turn list into a bill" subtitle={`${open.length} items · split across the house`} onClose={() => setCheckout(false)}>
          <p className="text-sm text-stone mb-3">{open.map((i) => i.name).join(', ')}</p>
          <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold">What did it cost?</label>
          <input className="input mt-1.5" type="number" placeholder="₹ amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <label className="text-[11px] uppercase tracking-[0.14em] text-mist font-semibold mt-4 block">Who paid</label>
          <select className="input mt-1.5" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <div className="flex gap-2 mt-6">
            <button className="btn-ghost flex-1" onClick={() => setCheckout(false)}>Cancel</button>
            <button
              className="btn-primary flex-[2]"
              onClick={() => {
                checkoutPantry({ paidBy, amount: Number(amount) })
                setCheckout(false)
                setAmount('')
              }}
            >
              Add to ledger
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
