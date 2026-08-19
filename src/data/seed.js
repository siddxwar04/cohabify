export const PALETTE = [
  { color: '#1F6B4A', bg: '#E6F3EC' },
  { color: '#5B4B8A', bg: '#EEE9F7' },
  { color: '#C45D26', bg: '#F8E8DC' },
  { color: '#2F6F8F', bg: '#E4F1F6' },
  { color: '#B42318', bg: '#F8E4E2' },
  { color: '#9A4D73', bg: '#F6E6EE' },
]

export const CATEGORIES = [
  { name: 'Groceries', emoji: '🥬', color: '#1F6B4A' },
  { name: 'Utilities', emoji: '💡', color: '#2F6F8F' },
  { name: 'Food', emoji: '🍜', color: '#C45D26' },
  { name: 'Rent', emoji: '🏠', color: '#5B4B8A' },
  { name: 'Transport', emoji: '🛵', color: '#8A6A2F' },
  { name: 'Entertainment', emoji: '🎬', color: '#9A4D73' },
  { name: 'Household', emoji: '🧹', color: '#3F6B5A' },
  { name: 'Others', emoji: '✨', color: '#6F675E' },
]

export const categoryMeta = (name) =>
  CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1]

export const HOUSE = {
  name: 'Casa Verde',
  unit: 'Flat 4B',
  address: '12th Main, Koramangala',
  city: 'Bengaluru',
  since: 'Jan 2025',
  photo: '/images/casa-verde.png',
  hero: '/images/casa-hero.png',
}

export const DEFAULT_MEMBERS = [
  {
    id: 'm1',
    name: 'Siddeshwar',
    role: 'Admin',
    initials: 'SI',
    color: PALETTE[0].color,
    bg: PALETTE[0].bg,
    vibe: 'Night owl · tidy kitchen',
  },
  {
    id: 'm2',
    name: 'Rahul',
    role: 'Flatmate',
    initials: 'RA',
    color: PALETTE[1].color,
    bg: PALETTE[1].bg,
    vibe: 'Early riser · gym 6am',
  },
  {
    id: 'm3',
    name: 'Aman',
    role: 'Flatmate',
    initials: 'AM',
    color: PALETTE[2].color,
    bg: PALETTE[2].bg,
    vibe: 'Cooks on Sundays',
  },
  {
    id: 'm4',
    name: 'Priya',
    role: 'Flatmate',
    initials: 'PR',
    color: PALETTE[3].color,
    bg: PALETTE[3].bg,
    vibe: 'Plants + playlists',
  },
]

export const DEFAULT_EXPENSES = [
  { id: 'e1', title: 'BigBasket weekly haul', amount: 2840, paidBy: 'm1', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Groceries', emoji: '🥬', date: '2026-08-18T09:20:00.000Z' },
  { id: 'e2', title: 'BESCOM electricity', amount: 1860, paidBy: 'm2', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Utilities', emoji: '💡', date: '2026-08-16T11:00:00.000Z' },
  { id: 'e3', title: 'Friday night biryani', amount: 1280, paidBy: 'm3', splitWith: ['m1', 'm2', 'm3'], category: 'Food', emoji: '🍜', date: '2026-08-15T20:10:00.000Z' },
  { id: 'e4', title: 'Airtel fibre', amount: 999, paidBy: 'm4', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Utilities', emoji: '📡', date: '2026-08-12T08:00:00.000Z' },
  { id: 'e5', title: 'Housekeeping supplies', amount: 640, paidBy: 'm1', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Household', emoji: '🧹', date: '2026-08-11T16:40:00.000Z' },
  { id: 'e6', title: 'Uber to Kempegowda', amount: 540, paidBy: 'm2', splitWith: ['m2', 'm4'], category: 'Transport', emoji: '🚕', date: '2026-08-09T05:30:00.000Z' },
  { id: 'e7', title: 'PVR movie night', amount: 1120, paidBy: 'm4', splitWith: ['m1', 'm3', 'm4'], category: 'Entertainment', emoji: '🎬', date: '2026-08-08T19:00:00.000Z' },
  { id: 'e8', title: 'Gas cylinder', amount: 1100, paidBy: 'm3', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Utilities', emoji: '🔥', date: '2026-08-05T13:15:00.000Z' },
  { id: 'e9', title: 'Nature’s Basket restock', amount: 1960, paidBy: 'm1', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Groceries', emoji: '🧀', date: '2026-08-03T10:05:00.000Z' },
  { id: 'e10', title: 'August rent', amount: 48000, paidBy: 'm1', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Rent', emoji: '🏠', date: '2026-08-01T04:00:00.000Z' },
  { id: 'e11', title: 'Water cans (x8)', amount: 320, paidBy: 'm2', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Household', emoji: '💧', date: '2026-07-28T07:20:00.000Z' },
  { id: 'e12', title: 'July electricity', amount: 1720, paidBy: 'm4', splitWith: ['m1', 'm2', 'm3', 'm4'], category: 'Utilities', emoji: '💡', date: '2026-07-16T11:00:00.000Z' },
]

export const DEFAULT_CHORES = [
  { id: 'c1', title: 'Kitchen deep clean', assignedTo: 'm1', dueDay: 'Mon', done: true },
  { id: 'c2', title: 'Trash & recycling', assignedTo: 'm2', dueDay: 'Tue', done: true },
  { id: 'c3', title: 'Bathrooms', assignedTo: 'm3', dueDay: 'Wed', done: false },
  { id: 'c4', title: 'Living room + plants', assignedTo: 'm4', dueDay: 'Thu', done: false },
  { id: 'c5', title: 'Grocery run', assignedTo: 'm1', dueDay: 'Fri', done: false },
  { id: 'c6', title: 'Dish duty', assignedTo: 'm2', dueDay: 'Sat', done: false },
  { id: 'c7', title: 'Common area vacuum', assignedTo: 'm3', dueDay: 'Sun', done: false },
]

export const DEFAULT_ACTIVITY = [
  { id: 'a1', text: 'Siddeshwar added BigBasket weekly haul', time: '2h ago', tone: 'forest' },
  { id: 'a2', text: 'Rahul marked Trash & recycling as done', time: '5h ago', tone: 'clay' },
  { id: 'a3', text: 'Priya paid Airtel fibre', time: 'Yesterday', tone: 'forest' },
  { id: 'a4', text: 'Aman cooked Friday night biryani', time: '3d ago', tone: 'clay' },
]

export const PRESENCE_CYCLE = ['home', 'out', 'wfh', 'guests']

export const PRESENCE_META = {
  home: { label: 'Home', hint: 'In the house', color: '#1F6B4A' },
  out: { label: 'Out', hint: 'Back later', color: '#6F675E' },
  wfh: { label: 'At desk', hint: 'Headphones on', color: '#2F6F8F' },
  guests: { label: 'Has people over', hint: 'Living room in use', color: '#C45D26' },
}

export const VIBE_META = {
  good: { label: 'Light', emoji: '🌿' },
  meh: { label: 'Okay', emoji: '🌤' },
  off: { label: 'Off', emoji: '🌙' },
}

export const DEFAULT_PRESENCE = { m1: 'home', m2: 'out', m3: 'home', m4: 'wfh' }
export const DEFAULT_VIBES = { m1: 'good', m2: 'meh', m3: 'good', m4: 'good' }

export const DEFAULT_GUESTS = [
  { id: 'g1', by: 'm4', who: 'College friends', note: 'Two people, till 10pm', night: 'Tonight' },
]

export const DEFAULT_PANTRY = [
  { id: 'p1', name: 'Oat milk', qty: '2', addedBy: 'm4', bought: false },
  { id: 'p2', name: 'Dishwash liquid', qty: '1', addedBy: 'm1', bought: false },
  { id: 'p3', name: 'Eggs', qty: '12', addedBy: 'm3', bought: false },
  { id: 'p4', name: 'Filter coffee', qty: '1 pack', addedBy: 'm2', bought: true },
]

export const DEFAULT_RECURRING = [
  { id: 'r1', title: 'Rent', amount: 48000, dueDay: 1, emoji: '🏠' },
  { id: 'r2', title: 'Airtel fibre', amount: 999, dueDay: 12, emoji: '📡' },
  { id: 'r3', title: 'BESCOM', amount: 1800, dueDay: 16, emoji: '💡' },
  { id: 'r4', title: 'Gas refill', amount: 1100, dueDay: 28, emoji: '🔥' },
]

export const DEFAULT_QUIET = { start: 23, end: 7 }
export const DEFAULT_DINNER = 'Leftover lemon rice + salad. Claim a plate or cook after 8.'

export const isQuietNow = (quiet = DEFAULT_QUIET) => {
  const h = new Date().getHours()
  const { start, end } = quiet
  if (start === end) return false
  if (start > end) return h >= start || h < end
  return h >= start && h < end
}

export const formatHour = (h) => {
  const ampm = h >= 12 ? 'pm' : 'am'
  const hr = h % 12 || 12
  return `${hr}${ampm}`
}
