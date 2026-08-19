import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  PALETTE,
  DEFAULT_MEMBERS,
  DEFAULT_EXPENSES,
  DEFAULT_CHORES,
  DEFAULT_ACTIVITY,
  DEFAULT_PRESENCE,
  DEFAULT_VIBES,
  DEFAULT_GUESTS,
  DEFAULT_PANTRY,
  DEFAULT_RECURRING,
  DEFAULT_QUIET,
  DEFAULT_DINNER,
  PRESENCE_CYCLE,
} from '../data/seed'
import { initialsFrom } from '../lib/format'

export const useStore = create(
  persist(
    (set, get) => ({
      members: DEFAULT_MEMBERS,
      expenses: DEFAULT_EXPENSES,
      chores: DEFAULT_CHORES,
      payments: [],
      activity: DEFAULT_ACTIVITY,
      currentUser: 'm1',
      presence: DEFAULT_PRESENCE,
      vibes: DEFAULT_VIBES,
      guests: DEFAULT_GUESTS,
      pantry: DEFAULT_PANTRY,
      recurring: DEFAULT_RECURRING,
      quietHours: DEFAULT_QUIET,
      dinner: DEFAULT_DINNER,
      toast: null,
      notifications: [
        { id: 'n1', title: 'Rent is due', body: 'August rent was logged. Settle leftover shares this week.', unread: true },
        { id: 'n2', title: 'Bathroom chore', body: 'Aman still has bathrooms pending for Wednesday.', unread: true },
        { id: 'n3', title: 'You are owed ₹3,210', body: 'Rahul and Aman have open balances with you.', unread: false },
      ],

      setCurrentUser: (id) => set({ currentUser: id }),

      showToast: (message) => set({ toast: message }),
      clearToast: () => set({ toast: null }),

      cyclePresence: (id) =>
        set((s) => {
          const cur = s.presence?.[id] || 'home'
          const next = PRESENCE_CYCLE[(PRESENCE_CYCLE.indexOf(cur) + 1) % PRESENCE_CYCLE.length]
          return { presence: { ...s.presence, [id]: next } }
        }),

      setVibe: (id, vibe) => set((s) => ({ vibes: { ...s.vibes, [id]: vibe } })),

      setDinner: (dinner) => set({ dinner }),

      setQuietHours: (quietHours) => set({ quietHours }),

      addGuest: ({ who, note, by }) => {
        if (!who?.trim()) return
        set((s) => ({
          guests: [{ id: `g${Date.now()}`, who: who.trim(), note: (note || '').trim(), by, night: 'Tonight' }, ...(s.guests || [])],
        }))
        const host = get().members.find((m) => m.id === by)
        get().pushActivity(`${host?.name || 'Someone'} logged guests: ${who.trim()}`, 'clay')
      },

      removeGuest: (id) => set((s) => ({ guests: (s.guests || []).filter((g) => g.id !== id) })),

      addPantryItem: ({ name, qty, addedBy }) => {
        if (!name?.trim()) return
        set((s) => ({
          pantry: [{ id: `pan${Date.now()}`, name: name.trim(), qty: (qty || '').trim() || '1', addedBy, bought: false }, ...(s.pantry || [])],
        }))
      },

      togglePantryItem: (id) =>
        set((s) => ({
          pantry: (s.pantry || []).map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)),
        })),

      deletePantryItem: (id) => set((s) => ({ pantry: (s.pantry || []).filter((i) => i.id !== id) })),

      checkoutPantry: ({ paidBy, amount }) => {
        const open = (get().pantry || []).filter((i) => !i.bought)
        if (!open.length || !Number(amount) || Number(amount) <= 0) return false
        get().addExpense({
          title: `Pantry run · ${open.map((i) => i.name).slice(0, 3).join(', ')}${open.length > 3 ? '…' : ''}`,
          amount,
          paidBy,
          splitWith: get().members.map((m) => m.id),
          category: 'Groceries',
          emoji: '🛒',
        })
        set((s) => ({ pantry: (s.pantry || []).map((i) => ({ ...i, bought: true })) }))
        get().showToast('Pantry run landed in the ledger.')
        return true
      },

      sendNudge: (fromId, toId, amount) => {
        const members = get().members
        const from = members.find((m) => m.id === fromId)?.name
        const to = members.find((m) => m.id === toId)?.name
        const body = `${from} sent a kind nudge — ₹${Math.round(amount).toLocaleString('en-IN')} would close the loop. No rush.`
        set((s) => ({
          notifications: [
            { id: `n${Date.now()}`, title: `Nudge for ${to}`, body, unread: true },
            ...s.notifications,
          ],
        }))
        get().pushActivity(`${from} nudged ${to} about ${Math.round(amount)} rupees`, 'clay')
        get().showToast(`Nudge sent to ${to}. Soft, not shouty.`)
      },

      markNotificationsRead: () =>
        set((s) => ({
          notifications: (s.notifications || []).map((n) => ({ ...n, unread: false })),
        })),

      pushActivity: (text, tone = 'forest') =>
        set((s) => ({
          activity: [{ id: `a${Date.now()}`, text, time: 'Just now', tone }, ...(s.activity || [])].slice(0, 12),
        })),

      addMember: (name) => {
        if (!name?.trim()) return false
        const { members } = get()
        const cleanName = name.trim()
        if (members.some((m) => m.name.toLowerCase() === cleanName.toLowerCase())) return false

        const used = members.map((m) => m.color)
        const palette = PALETTE.find((p) => !used.includes(p.color)) || PALETTE[members.length % PALETTE.length]
        const newMember = {
          id: `m${Date.now()}`,
          name: cleanName,
          role: 'Flatmate',
          initials: initialsFrom(cleanName),
          color: palette.color,
          bg: palette.bg,
          vibe: 'New to the house',
        }
        set((s) => ({
          members: [...s.members, newMember],
          presence: { ...s.presence, [newMember.id]: 'home' },
          vibes: { ...s.vibes, [newMember.id]: 'good' },
        }))
        get().pushActivity(`${cleanName} joined Casa Verde`)
        return true
      },

      deleteMember: (id) =>
        set((s) => {
          if (s.members.length <= 1) return s
          const remaining = s.members.filter((m) => m.id !== id)
          return {
            members: remaining,
            currentUser: s.currentUser === id ? remaining[0].id : s.currentUser,
            expenses: s.expenses
              .filter((e) => e.paidBy !== id)
              .map((e) => ({ ...e, splitWith: e.splitWith.filter((mid) => mid !== id) }))
              .filter((e) => e.splitWith.length > 0),
            chores: s.chores.map((c) =>
              c.assignedTo === id
                ? { ...c, assignedTo: remaining[Math.floor(Math.random() * remaining.length)].id }
                : c
            ),
            payments: s.payments.filter((p) => p.from !== id && p.to !== id),
            guests: (s.guests || []).filter((g) => g.by !== id),
            pantry: (s.pantry || []).filter((p) => p.addedBy !== id),
          }
        }),

      addExpense: ({ title, amount, paidBy, splitWith, category, emoji, date }) => {
        const exp = {
          id: `e${Date.now()}`,
          title: title.trim(),
          amount: Number(amount),
          paidBy,
          splitWith: splitWith.length ? splitWith : [paidBy],
          category,
          emoji,
          date: date || new Date().toISOString(),
        }
        set((s) => ({ expenses: [exp, ...s.expenses] }))
        const payer = get().members.find((m) => m.id === paidBy)
        get().pushActivity(`${payer?.name || 'Someone'} added ${exp.title}`)
      },

      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      toggleChore: (id) => {
        const chore = get().chores.find((c) => c.id === id)
        set((s) => ({
          chores: s.chores.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
        }))
        if (chore && !chore.done) {
          const m = get().members.find((x) => x.id === chore.assignedTo)
          get().pushActivity(`${m?.name || 'Someone'} finished ${chore.title}`, 'clay')
        }
      },

      addChore: ({ title, assignedTo, dueDay }) =>
        set((s) => ({
          chores: [
            ...s.chores,
            { id: `c${Date.now()}`, title: title.trim(), assignedTo, dueDay, done: false },
          ],
        })),

      deleteChore: (id) => set((s) => ({ chores: s.chores.filter((c) => c.id !== id) })),

      rotateChores: () =>
        set((s) => {
          const ids = s.members.map((m) => m.id)
          if (!ids.length) return s
          return {
            chores: s.chores.map((c) => {
              const i = ids.indexOf(c.assignedTo)
              const next = ids[(i + 1) % ids.length]
              return { ...c, assignedTo: next, done: false }
            }),
          }
        }),

      recordPayment: (from, to, amount) => {
        const payment = { id: `p${Date.now()}`, from, to, amount, date: new Date().toISOString() }
        set((s) => ({ payments: [payment, ...s.payments] }))
        const members = get().members
        const a = members.find((m) => m.id === from)?.name
        const b = members.find((m) => m.id === to)?.name
        get().pushActivity(`${a} settled ₹${Math.round(amount)} with ${b}`)
      },

      getBalances: () => {
        const { members, expenses, payments } = get()
        const balances = {}
        members.forEach((m) => { balances[m.id] = 0 })

        ;(expenses || []).forEach((exp) => {
          if (!exp.splitWith?.length) return
          const share = exp.amount / exp.splitWith.length
          exp.splitWith.forEach((mid) => {
            if (mid !== exp.paidBy) {
              balances[exp.paidBy] = (balances[exp.paidBy] || 0) + share
              balances[mid] = (balances[mid] || 0) - share
            }
          })
        })

        ;(payments || []).forEach((p) => {
          balances[p.from] = (balances[p.from] || 0) + p.amount
          balances[p.to] = (balances[p.to] || 0) - p.amount
        })

        return balances
      },

      getSettlements: () => {
        const { members } = get()
        const balances = { ...get().getBalances() }
        const debtors = members
          .map((m) => ({ ...m, bal: balances[m.id] || 0 }))
          .filter((m) => m.bal < -1)
          .sort((a, b) => a.bal - b.bal)
        const creditors = members
          .map((m) => ({ ...m, bal: balances[m.id] || 0 }))
          .filter((m) => m.bal > 1)
          .sort((a, b) => b.bal - a.bal)

        const result = []
        let i = 0
        let j = 0
        while (i < debtors.length && j < creditors.length) {
          const d = debtors[i]
          const c = creditors[j]
          const pay = Math.min(-d.bal, c.bal)
          if (pay > 0.5) {
            result.push({
              from: d,
              to: c,
              amount: Math.round(pay),
            })
            d.bal += pay
            c.bal -= pay
          }
          if (Math.abs(d.bal) < 1) i += 1
          if (Math.abs(c.bal) < 1) j += 1
        }
        return result
      },

      getTotalThisMonth: () => {
        const now = new Date()
        return get().expenses
          .filter((e) => {
            const d = new Date(e.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          })
          .reduce((sum, e) => sum + e.amount, 0)
      },

      getSpendingByCategory: () => {
        const map = {}
        get().expenses.forEach((e) => {
          map[e.category] = (map[e.category] || 0) + e.amount
        })
        return Object.entries(map)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
      },

      getFairness: () => {
        const { members, expenses = [], chores = [], vibes } = get()
        const paid = {}
        members.forEach((m) => { paid[m.id] = 0 })
        expenses.forEach((e) => { paid[e.paidBy] = (paid[e.paidBy] || 0) + e.amount })
        const totalPaid = Object.values(paid).reduce((a, b) => a + b, 0) || 1
        const rows = members.map((m) => {
          const assigned = chores.filter((c) => c.assignedTo === m.id)
          const done = assigned.filter((c) => c.done).length
          const labor = assigned.length ? Math.round((done / assigned.length) * 100) : 100
          const money = Math.round((paid[m.id] / totalPaid) * 100)
          return {
            id: m.id,
            name: m.name,
            member: m,
            money,
            labor,
            paid: paid[m.id],
            done,
            assigned: assigned.length,
          }
        })
        const chorePct = chores.length ? (chores.filter((c) => c.done).length / chores.length) * 100 : 100
        const vibeVals = members.map((m) => (vibes?.[m.id] === 'off' ? 40 : vibes?.[m.id] === 'meh' ? 70 : 100))
        const vibeAvg = vibeVals.length ? vibeVals.reduce((a, b) => a + b, 0) / vibeVals.length : 100
        const laborAvg = rows.length ? rows.reduce((a, r) => a + r.labor, 0) / rows.length : 100
        const harmony = Math.round(chorePct * 0.35 + laborAvg * 0.35 + vibeAvg * 0.3)
        return { rows, harmony: Math.min(100, Math.max(0, harmony)) }
      },
    }),
    {
      name: 'cohabify-v2',
      version: 3,
      migrate: (persisted) => ({
        ...persisted,
        presence: persisted.presence || DEFAULT_PRESENCE,
        vibes: persisted.vibes || DEFAULT_VIBES,
        guests: persisted.guests || DEFAULT_GUESTS,
        pantry: persisted.pantry || DEFAULT_PANTRY,
        recurring: persisted.recurring || DEFAULT_RECURRING,
        quietHours: persisted.quietHours || DEFAULT_QUIET,
        dinner: persisted.dinner || DEFAULT_DINNER,
        toast: null,
      }),
      merge: (persisted, current) => {
        const p = persisted || {}
        const arr = (value, fallback) => (Array.isArray(value) ? value : fallback)
        return {
          ...current,
          ...p,
          members: arr(p.members, current.members),
          expenses: arr(p.expenses, current.expenses),
          chores: arr(p.chores, current.chores),
          payments: arr(p.payments, current.payments),
          activity: arr(p.activity, current.activity),
          notifications: arr(p.notifications, current.notifications),
          presence: p.presence || current.presence,
          vibes: p.vibes || current.vibes,
          guests: arr(p.guests, current.guests),
          pantry: arr(p.pantry, current.pantry),
          recurring: arr(p.recurring, current.recurring),
          quietHours: p.quietHours || current.quietHours,
          dinner: p.dinner || current.dinner,
          toast: null,
        }
      },
    }
  )
)
