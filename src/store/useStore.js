import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── DEFAULT MEMBERS ─────────────────────────────
const MEMBERS = [
  {
    id: 'm1',
    name: 'Siddeshwar',
    initials: 'SI',
    color: '#1D9E75',
    bg: 'rgba(29,158,117,0.15)'
  },
  {
    id: 'm2',
    name: 'Rahul',
    initials: 'RA',
    color: '#7F77DD',
    bg: 'rgba(127,119,221,0.15)'
  },
  {
    id: 'm3',
    name: 'Aman',
    initials: 'AM',
    color: '#EF9F27',
    bg: 'rgba(239,159,39,0.15)'
  }
]

// ── STORE ──────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      members: MEMBERS,
      expenses: [],
      chores: [],
      currentUser: 'm1',

      // ── DERIVED STATE ─────────────────────────

      // Returns { [memberId]: netBalance } — positive = gets back, negative = owes
      getBalances: () => {
        const { members, expenses } = get()
        const balances = {}
        members.forEach((m) => { balances[m.id] = 0 })
        expenses.forEach((exp) => {
          const share = exp.amount / exp.splitWith.length
          balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount
          exp.splitWith.forEach((mid) => {
            balances[mid] = (balances[mid] || 0) - share
          })
        })
        return balances
      },

      // Returns minimum transactions to clear all dues.
      // Each entry: { from: memberObj, to: memberObj, amount: number }
      getSettlements: () => {
        const { members } = get()
        const balances = get().getBalances()
        const getMember = (id) => members.find((m) => m.id === id)

        const creditors = []
        const debtors   = []
        Object.entries(balances).forEach(([id, bal]) => {
          if (bal > 0.5)  creditors.push({ id, amount:  bal })
          else if (bal < -0.5) debtors.push({ id, amount: -bal })
        })
        creditors.sort((a, b) => b.amount - a.amount)
        debtors.sort((a, b) => b.amount - a.amount)

        const settlements = []
        let ci = 0, di = 0
        while (ci < creditors.length && di < debtors.length) {
          const credit = creditors[ci]
          const debt   = debtors[di]
          const amount = Math.min(credit.amount, debt.amount)
          if (amount > 0.5) {
            settlements.push({
              from:   getMember(debt.id),
              to:     getMember(credit.id),
              amount: Math.round(amount),
            })
          }
          credit.amount -= amount
          debt.amount   -= amount
          if (credit.amount < 0.5) ci++
          if (debt.amount  < 0.5) di++
        }
        return settlements
      },

      // Sum of all expenses in the current calendar month
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

      // Returns [{ name, value }] sorted by value descending
      getSpendingByCategory: () => {
        const { expenses } = get()
        const map = {}
        expenses.forEach((e) => {
          map[e.category] = (map[e.category] || 0) + e.amount
        })
        return Object.entries(map)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
      },

      // ── EXPENSES ──────────────────────────────

      addExpense: (data) =>
        set((s) => ({
          expenses: [{ id: `e${Date.now()}`, ...data }, ...s.expenses],
        })),

      deleteExpense: (id) =>
        set((s) => ({
          expenses: s.expenses.filter((e) => e.id !== id),
        })),

      // ── CHORES ────────────────────────────────

      addChore: (data) =>
        set((s) => ({
          chores: [...s.chores, { id: `c${Date.now()}`, done: false, ...data }],
        })),

      toggleChore: (id) =>
        set((s) => ({
          chores: s.chores.map((c) => c.id === id ? { ...c, done: !c.done } : c),
        })),

      // Rotates each chore to the next member in order; resets done state
      rotateChores: () =>
        set((s) => {
          if (s.members.length < 2) return s
          const ids = s.members.map((m) => m.id)
          return {
            chores: s.chores.map((c) => {
              const idx     = ids.indexOf(c.assignedTo)
              const nextIdx = idx === -1 ? 0 : (idx + 1) % ids.length
              return { ...c, assignedTo: ids[nextIdx], done: false }
            }),
          }
        }),

      // ── MEMBERS ───────────────────────────────

      addMember: (name) => {
        if (!name || !name.trim()) return

        const { members } = get()
        const cleanName = name.trim()

        // prevent duplicate names
        if (members.some(m => m.name.toLowerCase() === cleanName.toLowerCase())) return

        const parts = cleanName.split(' ').filter(Boolean)

        const initials = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : (parts[0]?.slice(0, 2) || '').toUpperCase()

        const COLOR_PALETTE = [
          { color: '#1D9E75', bg: 'rgba(29,158,117,0.15)' },
          { color: '#7F77DD', bg: 'rgba(127,119,221,0.15)' },
          { color: '#EF9F27', bg: 'rgba(239,159,39,0.15)' },
          { color: '#378ADD', bg: 'rgba(55,138,221,0.15)' },
          { color: '#E24B4A', bg: 'rgba(226,75,74,0.15)' },
          { color: '#E879A0', bg: 'rgba(232,121,160,0.15)' },
        ]

        const usedColors = members.map((m) => m.color)

        const palette =
          COLOR_PALETTE.find((p) => !usedColors.includes(p.color)) ||
          COLOR_PALETTE[members.length % COLOR_PALETTE.length]

        const newMember = {
          id: `m${Date.now()}`,
          name: cleanName,
          initials,
          color: palette.color,
          bg: palette.bg,
        }

        set((s) => ({
          members: [...s.members, newMember],
        }))
      },

      deleteMember: (id) =>
        set((s) => {
          // prevent deleting last member
          if (s.members.length <= 1) return s

          const remainingMembers = s.members.filter((m) => m.id !== id)

          return {
            members: remainingMembers,

            expenses: s.expenses
              .filter((e) => e.paidBy !== id)
              .map((e) => ({
                ...e,
                splitWith: e.splitWith.filter((mid) => mid !== id),
              }))
              .filter((e) => e.splitWith.length > 0),

            chores: s.chores.map((c) => {
              if (c.assignedTo === id) {
                return {
                  ...c,
                  assignedTo:
                    remainingMembers.length > 0
                      ? remainingMembers[
                          Math.floor(Math.random() * remainingMembers.length)
                        ].id
                      : null,
                }
              }
              return c
            }),
          }
        }),
    }),
    {
      name: 'cohabify-storage',
      version: 1,
    }
  )
)