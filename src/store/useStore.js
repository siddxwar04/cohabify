import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── COLOR PALETTE ─────────────────────────────
const COLOR_PALETTE = [
  { color: '#1D9E75', bg: 'rgba(29,158,117,0.15)' },
  { color: '#7F77DD', bg: 'rgba(127,119,221,0.15)' },
  { color: '#EF9F27', bg: 'rgba(239,159,39,0.15)' },
  { color: '#378ADD', bg: 'rgba(55,138,221,0.15)' },
  { color: '#E24B4A', bg: 'rgba(226,75,74,0.15)' },
  { color: '#E879A0', bg: 'rgba(232,121,160,0.15)' },
]

// ── DEFAULT MEMBERS ───────────────────────────
const DEFAULT_MEMBERS = [
  {
    id: 'm1',
    name: 'Siddeshwar',
    initials: 'SI',
    color: COLOR_PALETTE[0].color,
    bg: COLOR_PALETTE[0].bg,
  },
  {
    id: 'm2',
    name: 'Rahul',
    initials: 'RA',
    color: COLOR_PALETTE[1].color,
    bg: COLOR_PALETTE[1].bg,
  },
  {
    id: 'm3',
    name: 'Aman',
    initials: 'AM',
    color: COLOR_PALETTE[2].color,
    bg: COLOR_PALETTE[2].bg,
  },
]

// ── STORE ─────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      members: DEFAULT_MEMBERS,
      expenses: [],
      chores: [],
      currentUser: 'm1',

      // ── MEMBERS ─────────────────────────────
      addMember: (name) => {
        if (!name || !name.trim()) return

        const { members } = get()
        const cleanName = name.trim()

        if (members.some(m => m.name.toLowerCase() === cleanName.toLowerCase())) return

        const parts = cleanName.split(' ').filter(Boolean)

        const initials = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : (parts[0]?.slice(0, 2) || '').toUpperCase()

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

      // ── COMPUTED ─────────────────────────────

      getBalances: () => {
        const { members, expenses } = get()
        const balances = {}

        members.forEach((m) => {
          balances[m.id] = 0
        })

        expenses.forEach((exp) => {
          const share = exp.amount / exp.splitWith.length

          exp.splitWith.forEach((mid) => {
            if (mid !== exp.paidBy) {
              balances[exp.paidBy] += share
              balances[mid] -= share
            }
          })
        })

        return balances
      },

      getSettlements: () => {
        const { members } = get()
        const balances = get().getBalances()

        const debtors = members.filter(m => balances[m.id] < 0)
        const creditors = members.filter(m => balances[m.id] > 0)

        const result = []

        debtors.forEach(d => {
          let debt = -balances[d.id]

          creditors.forEach(c => {
            if (debt === 0) return

            const credit = balances[c.id]
            const pay = Math.min(debt, credit)

            if (pay > 0) {
              result.push({ from: d.id, to: c.id, amount: Math.round(pay) })
              balances[c.id] -= pay
              debt -= pay
            }
          })
        })

        return result
      },
    }),
    {
      name: 'cohabify-storage',
      version: 1,
    }
  )
)