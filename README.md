# CoHabify — Co-living, Simplified

A modern dark-themed React app for managing shared living expenses, chores, and settlements between flatmates.

> **Tagline:** Co-living, simplified.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## Tech Stack
- **React 18** + Vite
- **Zustand** — state management (with localStorage persistence)
- **React Router v6** — page routing
- **Recharts** — spending charts
- **Lucide React** — icons
- **date-fns** — date formatting
- **Tailwind CSS** — utility classes
- **Plus Jakarta Sans** — font (Google Fonts)

## Features
- Dashboard with stats, recent expenses, chore preview, settle-up summary
- Expenses page with category filter, add/delete, smart per-person split
- Chores page with toggle done, rotation, per-member progress
- Settlement page using minimum-transaction algorithm
- Members page with individual balances and stats
- All data persists in localStorage

## Project Structure
```
src/
  components/
    layout/       Sidebar, Navbar
    expenses/     AddExpenseModal
    dashboard/    SpendingChart, ActivityFeed
  pages/          Dashboard, Expenses, Chores, Settlement, Members
  store/          useStore.js (Zustand)
```

## Team Split
- **Person 1** → Expenses: AddExpenseModal, Expenses page, store expense logic
- **Person 2** → Chores: Chores page, rotation algorithm, chore store logic
- **Person 3** → Dashboard + Layout: Sidebar, Navbar, Dashboard page, SpendingChart
