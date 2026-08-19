import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Radio,
  Receipt,
  Scale,
  ShoppingBag,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { HOUSE } from '../data/seed'

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const FEATURES = [
  { icon: Wallet, title: 'A living ledger', copy: 'Every grocery run, bill, and late-night biryani — split cleanly, remembered beautifully.' },
  { icon: CheckCircle2, title: 'Chores that rotate', copy: 'A weekly house board so bathrooms, trash, and dishes never silently become one person’s job.' },
  { icon: Radio, title: 'House pulse', copy: 'Who’s home, quiet hours, guests, kitchen notes — the apartment tells you how tonight feels.' },
  { icon: Scale, title: 'Fairness radar', copy: 'Money in vs housework done. A harmony score so labour doesn’t hide behind UPI.' },
  { icon: ShoppingBag, title: 'Pantry → bill', copy: 'A shared shopping list that checks out as a grocery expense. The fridge talks to the ledger.' },
  { icon: Sparkles, title: 'Kind nudges', copy: 'Ask to be paid without the group-chat tension. Soft copy, not a dunning letter.' },
]

const STEPS = [
  { n: '01', t: 'Create the house', d: 'Add your flatmates. Casa Verde starts with four — swap, add, or remove anyone.' },
  { n: '02', t: 'Log what you share', d: 'Tap a bill in seconds. Equal splits, category tags, and a running ledger.' },
  { n: '03', t: 'Settle without awkwardness', d: 'See exact dues, pay in one tap, and watch the house go quiet again.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-espresso">
      <nav className="sticky top-0 z-30 border-b border-linen/70 bg-paper/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline text-espresso">
            <span className="w-8 h-8 rounded-xl bg-forest text-cream flex items-center justify-center">
              <Home size={15} />
            </span>
            <span className="font-display text-2xl">
              CoHab<span className="italic text-forest">ify</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone">
            <a href="#features" className="hover:text-espresso">Product</a>
            <a href="#ritual" className="hover:text-espresso">The ritual</a>
            <a href="#stories" className="hover:text-espresso">Houses</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost !py-2 !px-4">Sign in</Link>
            <Link to="/app" className="btn-primary !py-2">Enter the house</Link>
          </div>
        </div>
      </nav>

      <section className="grain-panel relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <motion.div variants={fade} initial="hidden" animate="show">
            <p className="text-[11px] uppercase tracking-[0.22em] text-forest font-semibold mb-5">
              For flats that actually live together
            </p>
            <h1 className="font-display text-[52px] md:text-[76px] leading-[0.92] text-espresso">
              Shared living,<br />
              <span className="italic text-forest">without the spreadsheet.</span>
            </h1>
            <p className="mt-6 text-lg text-stone max-w-md leading-relaxed">
              CoHabify is the quiet operating system for your home — expenses, chores, and settlements, designed like a hospitality brand, not a finance tool.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/app" className="btn-dark">
                Open Casa Verde <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn-ghost">See how it feels</a>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['SI', 'RA', 'AM', 'PR'].map((i, n) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-paper bg-linen flex items-center justify-center text-[10px] font-bold" style={{ zIndex: 4 - n }}>
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-stone">
                Trusted by houses in <span className="text-espresso font-medium">Koramangala, Indiranagar, HSR</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-lift border border-white/50">
              <img src={HOUSE.hero} alt="A well-kept shared home" className="w-full h-[420px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-cream">
                <p className="font-display text-3xl">{HOUSE.name}</p>
                <p className="text-sm text-cream/80 mt-1">{HOUSE.unit} · {HOUSE.address}</p>
              </div>
            </div>

            <div className="absolute -left-6 top-10 card p-4 w-48 hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-mist">You are owed</p>
              <p className="font-display text-3xl text-forest mt-1">₹3,210</p>
              <p className="text-xs text-stone mt-1">Net positive this month</p>
            </div>
            <div className="absolute -right-4 bottom-16 card p-4 w-52 hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-mist">This week</p>
              <p className="text-sm font-semibold mt-1">2 / 7 chores done</p>
              <div className="mt-2 h-1.5 rounded-full bg-linen">
                <div className="h-full w-[28%] rounded-full bg-clay" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-5 py-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-mist">The product</p>
        <h2 className="font-display text-4xl md:text-5xl mt-2 max-w-xl leading-tight">
          Built like SpareRoom met Splitwise in a design studio.
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-7 hover:shadow-lift transition">
              <div className="w-11 h-11 rounded-2xl bg-forest-soft text-forest flex items-center justify-center mb-5">
                <f.icon size={18} />
              </div>
              <h3 className="font-display text-2xl">{f.title}</h3>
              <p className="text-stone mt-2 leading-relaxed">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ritual" className="bg-espresso text-cream py-20">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">The ritual</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">Three quiet steps. Then the house runs itself.</h2>
            <div className="mt-10 space-y-8">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-5">
                  <span className="font-display text-2xl text-champagne w-10">{s.n}</span>
                  <div>
                    <p className="text-lg font-semibold">{s.t}</p>
                    <p className="text-cream/70 mt-1">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] bg-bark/50 border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Receipt size={16} className="text-champagne" />
              <span className="text-sm text-cream/70">Live ledger · August</span>
            </div>
            {[
              ['🥬', 'BigBasket weekly haul', '₹2,840', 'Sid'],
              ['🏠', 'August rent', '₹48,000', 'Sid'],
              ['💡', 'BESCOM electricity', '₹1,860', 'Rahul'],
              ['🍜', 'Friday night biryani', '₹1,280', 'Aman'],
            ].map(([e, t, a, p]) => (
              <div key={t} className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0">
                <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg">{e}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t}</p>
                  <p className="text-xs text-cream/50">Paid by {p}</p>
                </div>
                <p className="font-semibold">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="font-display text-4xl md:text-5xl max-w-lg">What the house sounds like when money is settled.</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {[
            { q: 'We used to have a Google Sheet nobody opened. CoHabify feels like the apartment itself got a concierge.', n: 'Ananya · HSR Layout' },
            { q: 'The settle-up view ended the “I’ll Paytm you later” loop. Two taps. Done.', n: 'Karthik · Koramangala' },
            { q: 'Chore rotation is the feature I didn’t know we needed. Bathrooms are finally fair.', n: 'Meera · Indiranagar' },
          ].map((t) => (
            <blockquote key={t.n} className="card p-7">
              <p className="font-display text-2xl leading-snug">“{t.q}”</p>
              <footer className="mt-6 text-sm text-stone">{t.n}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="max-w-6xl mx-auto rounded-[36px] overflow-hidden relative min-h-[320px] flex items-center">
          <img src={HOUSE.photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-espresso/65" />
          <div className="relative px-8 md:px-16 py-16 text-cream max-w-2xl">
            <h2 className="font-display text-4xl md:text-6xl leading-tight">Come home to a house that’s already sorted.</h2>
            <Link to="/app" className="btn-primary mt-8 inline-flex">
              Enter Casa Verde <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-linen py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-stone">
          <p className="font-display text-xl text-espresso">CoHabify</p>
          <p>Frontend studio piece · local data · Bengaluru</p>
        </div>
      </footer>
    </div>
  )
}
