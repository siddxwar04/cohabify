import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── seed data ──────────────────────────────────────────────
const MEMBERS = [
  { id: 'm1', name: 'Arjun Kumar',  initials: 'AK', color: '#1D9E75', bg: 'rgba(29,158,117,0.15)' },
  { id: 'm2', name: 'Priya Rajan',  initials: 'PR', color: '#7F77DD', bg: 'rgba(127,119,221,0.15)' },
  { id: 'm3', name: 'Vikram Shah',  initials: 'VS', color: '#EF9F27', bg: 'rgba(239,159,39,0.15)' },
]

const EXPENSES = [
  { id: 'e1', title: 'Grocery — BigBazaar', category: 'Groceries', amount: 1240, paidBy: 'm1', splitWith: ['m1','m2','m3'], date: '2025-04-03', emoji: '🛒' },
  { id: 'e2', title: 'Electricity Bill',    category: 'Utilities',  amount: 2100, paidBy: 'm2', splitWith: ['m1','m2','m3'], date: '2025-04-01', emoji: '💡' },
  { id: 'e3', title: 'Swiggy — Group Order',category: 'Food',       amount: 980,  paidBy: 'm3', splitWith: ['m1','m2','m3'], date: '2025-03-31', emoji: '🍕' },
  { id: 'e4', title: 'WiFi Bill',           category: 'Utilities',  amount: 699,  paidBy: 'm1', splitWith: ['m1','m2','m3'], date: '2025-03-28', emoji: '📶' },
  { id: 'e5', title: 'Cleaning Supplies',   category: 'Groceries',  amount: 420,  paidBy: 'm2', splitWith: ['m1','m2','m3'], date: '2025-03-25', emoji: '🧹' },
]

const CHORES = [
  { id: 'c1', title: 'Sweep living room',    assignedTo: 'm1', done: true,  dueDay: 'Mon' },
  { id: 'c2', title: 'Take out trash',       assignedTo: 'm2', done: true,  dueDay: 'Tue' },
  { id: 'c3', title: 'Clean bathroom',       assignedTo: 'm3', done: false, dueDay: 'Wed' },
  { id: 'c4', title: 'Wash common utensils', assignedTo: 'm1', done: false, dueDay: 'Thu' },
  { id: 'c5', title: 'Refill water cans',    assignedTo: 'm2', done: false, dueDay: 'Fri' },
  { id: 'c6', title: 'Mop kitchen floor',    assignedTo: 'm3', done: false, dueDay: 'Sat' },
]

// ── store ──────────────────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      members:  MEMBERS,
      expenses: EXPENSES,
      chores:   CHORES,
      currentUser: 'm1',

      // EXPENSES
      addExpense: (exp) =>
        set((s) => ({ expenses: [{ ...exp, id: `e${Date.now()}` }, ...s.expenses] })),

      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      // CHORES
      toggleChore: (id) =>
        set((s) => ({
          chores: s.chores.map((c) => c.id === id ? { ...c, done: !c.done } : c),
        })),

      addChore: (chore) =>
        set((s) => ({ chores: [...s.chores, { ...chore, id: `c${Date.now()}`, done: false }] })),

      rotateChores: () =>
        set((s) => {
          const members = s.members
          const chores  = s.chores.map((c, i) => ({
            ...c,
            done: false,
            assignedTo: members[(members.findIndex((m) => m.id === c.assignedTo) + 1) % members.length].id,
          }))
          return { chores }
        }),

      // COMPUTED
      getBalances: () => {
        const { members, expenses } = get()
        const balances = {}
        members.forEach((m) => (balances[m.id] = 0))

        expenses.forEach((exp) => {
          const share = exp.amount / exp.splitWith.length
          exp.splitWith.forEach((mid) => {
            if (mid !== exp.paidBy) {
              balances[exp.paidBy] += share
              balances[mid]        -= share
            }
          })
        })
        return balances
      },

      getSettlements: () => {
        const { members } = get()
        const bal = get().getBalances()
        const debtors   = members.filter((m) => bal[m.id] < -0.01).map((m) => ({ ...m, amount: bal[m.id] }))
        const creditors = members.filter((m) => bal[m.id] >  0.01).map((m) => ({ ...m, amount: bal[m.id] }))
        const settlements = []

        debtors.forEach((d) => {
          let owed = Math.abs(d.amount)
          creditors.forEach((c) => {
            if (owed < 0.01 || c.amount < 0.01) return
            const pay = Math.min(owed, c.amount)
            settlements.push({ from: d, to: c, amount: Math.round(pay) })
            owed     -= pay
            c.amount -= pay
          })
        })
        return settlements
      },

      getSpendingByCategory: () => {
        const { expenses } = get()
        const map = {}
        expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount })
        return Object.entries(map)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
      },

      getTotalThisMonth: () => {
        const { expenses } = get()
        const now = new Date()
        return expenses
          .filter((e) => {
            const d = new Date(e.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          })
          .reduce((sum, e) => sum + e.amount, 0)
      },
    }),
    { name: 'cohabify-storage', version: 1 }
  )
)
