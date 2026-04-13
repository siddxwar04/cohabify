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