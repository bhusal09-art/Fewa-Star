import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownUp, ArrowRight, ArrowUpRight, Bus, CalendarDays, Check, ChevronDown,
  Clock3, Compass, Headphones, HeartHandshake, MapPin, Menu, Mountain, Search,
  ShieldCheck, Sparkles, Star, Ticket, Users, X, Mail, Phone, CircleCheck, LoaderCircle
} from 'lucide-react'

const cities = ['Kathmandu', 'Pokhara', 'Chitwan', 'Butwal', 'Lumbini', 'Bandipur', 'Mustang']
const money = value => `रु ${Number(value).toLocaleString('en-IN')}`
const today = new Date().toISOString().slice(0, 10)

function Brand({ light = false }) {
  return <a href="#home" className={`flex items-center gap-2.5 ${light ? 'text-white' : 'text-deep'}`}>
    <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-sun text-deep shadow-sm">
      <Mountain size={23} strokeWidth={2.5} />
      <span className="absolute right-1 top-1 text-[10px]"><Star size={9} fill="currentColor" /></span>
    </span>
    <span className="leading-tight"><span className="block font-display text-xl font-extrabold tracking-tight">fewa<span className="text-teal">star</span></span><span className={`block text-[9px] font-bold uppercase tracking-[.2em] ${light ? 'text-white/65' : 'text-slate-500'}`}>Your journey, our priority</span></span>
  </a>
}

function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-teal">{eyebrow}</p><h2 className="font-display text-3xl font-extrabold tracking-tight text-deep sm:text-4xl">{title}</h2>{description && <p className="mt-3 max-w-xl text-slate-500">{description}</p>}</div>
    {action}
  </div>
}

function App() {
  const [tab, setTab] = useState('Bus')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [from, setFrom] = useState('Kathmandu')
  const [to, setTo] = useState('Pokhara')
  const [date, setDate] = useState(today)
  const [passengers, setPassengers] = useState('1')
  const [routes, setRoutes] = useState([])
  const [tours, setTours] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [resultsVisible, setResultsVisible] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [departure, setDeparture] = useState('')
  const [booking, setBooking] = useState(null)
  const [bookingError, setBookingError] = useState('')
  const [bookingBusy, setBookingBusy] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' })
  const [toast, setToast] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/routes').then(r => r.ok ? r.json() : []),
      fetch('/api/tours').then(r => r.ok ? r.json() : [])
    ]).then(([routeData, tourData]) => { setRoutes(routeData); setTours(tourData) })
      .catch(() => { setSearchError('Could not connect to the booking API. Start the server with npm run dev.') })
  }, [])

  const popularRoutes = useMemo(() => routes.slice(0, 4), [routes])
  const visibleRoutes = useMemo(() => routes.filter(r =>
    (!from || r.from.toLowerCase().includes(from.toLowerCase())) &&
    (!to || r.to.toLowerCase().includes(to.toLowerCase()))
  ), [routes, from, to])

  function swapCities() { setFrom(to); setTo(from); setResultsVisible(false) }
  function searchTrips(e) {
    e?.preventDefault()
    if (tab !== 'Bus') {
      setToast(`${tab} booking is coming soon. Bus booking is available in this demo.`)
      window.setTimeout(() => setToast(''), 3500)
      return
    }
    if (from === to) { setSearchError('Choose two different cities to search.'); return }
    setSearchError('')
    setSearching(true)
    fetch(`/api/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(r => r.json()).then(data => { setRoutes(all => {
        const ids = new Set(data.map(x => x.id))
        return [...data, ...all.filter(x => !ids.has(x.id))]
      }); setResultsVisible(true); document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) })
      .catch(() => setSearchError('Unable to search right now. Please try again.'))
      .finally(() => setSearching(false))
  }
  function openBooking(route) {
    setSelectedRoute(route)
    setDeparture(route.departures[0])
    setBooking(null)
    setBookingError('')
    setForm({ fullName: '', email: '', phone: '' })
  }
  async function submitBooking(e) {
    e.preventDefault()
    setBookingBusy(true); setBookingError('')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeId: selectedRoute.id, departure, date, passengers: Number(passengers), ...form })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not create booking.')
      setBooking(data)
    } catch (error) { setBookingError(error.message || 'Something went wrong. Please try again.') }
    finally { setBookingBusy(false) }
  }

  const nav = [['Bus Tickets', '#routes'], ['Destinations', '#destinations'], ['Tour Packages', '#tours'], ['Why Fewa Star', '#why']]
  return <div className="min-h-screen overflow-hidden">
    <div className="bg-deep px-4 py-2 text-center text-xs font-medium text-white/85"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-sun" />Find your next Nepal adventure with Fewa Star <span className="hidden sm:inline">— easy planning starts here.</span></div>
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex">{nav.map(([label, href]) => <a key={label} href={href} className="text-sm font-semibold text-slate-600 transition hover:text-teal">{label}</a>)}</nav>
        <div className="hidden items-center gap-3 lg:flex"><a href="#contact" className="px-3 py-2 text-sm font-bold text-deep">Contact</a><a href="#booking" className="rounded-full bg-deep px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal">Plan a trip <ArrowRight className="ml-2 inline" size={15}/></a></div>
        <button aria-label="Toggle navigation" onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 text-deep hover:bg-mist lg:hidden">{mobileOpen ? <X/> : <Menu/>}</button>
      </div>
      {mobileOpen && <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">{nav.map(([label, href]) => <a onClick={() => setMobileOpen(false)} key={label} href={href} className="block border-b border-slate-100 py-3 text-sm font-semibold">{label}</a>)}<a href="#booking" onClick={() => setMobileOpen(false)} className="mt-3 block rounded-xl bg-deep p-3 text-center font-bold text-white">Plan a trip</a></div>}
    </header>

    <main>
      <section id="home" className="hero-image relative">
        <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
          <div className="relative z-10 max-w-2xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide backdrop-blur-sm"><Sparkles size={14} className="text-sun"/> A better way to see Nepal</div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4.5rem]">The journey is<br/>part of the <span className="text-sun">magic.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/80 sm:text-lg">From mountain mornings to lakeside evenings, get there with a little more ease. Your next Nepal story starts here.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm font-semibold text-white/85"><span className="flex items-center gap-2"><Check size={17} className="text-sun"/> Easy trip planning</span><span className="flex items-center gap-2"><Check size={17} className="text-sun"/> Local route options</span></div>
          </div>
          <div id="booking" className="relative z-10 mx-auto w-full max-w-xl rounded-[28px] bg-white p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal">Start exploring</p><h2 className="mt-1 font-display text-2xl font-extrabold text-deep">Where to next?</h2></div><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint text-teal"><Compass size={22}/></span></div>
            <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl bg-mist p-1.5">{['Bus', 'Flight', 'Tours'].map(item => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-2 py-3 text-sm font-bold transition ${tab === item ? 'bg-white text-deep shadow-sm' : 'text-slate-500 hover:text-deep'}`}>{item === 'Bus' ? <Bus size={16} className="mr-1.5 inline"/> : item === 'Flight' ? <ArrowUpRight size={16} className="mr-1.5 inline"/> : <Mountain size={16} className="mr-1.5 inline"/>}{item}</button>)}</div>
            <form onSubmit={searchTrips} className="space-y-4">
              {tab !== 'Tours' ? <div className="relative grid grid-cols-[1fr_42px_1fr] items-end gap-2">
                <label className="min-w-0"><span className="mb-2 block text-xs font-bold text-slate-500">FROM</span><span className="relative block"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal"/><select className="input-field appearance-none pl-9 pr-1 text-sm font-semibold" value={from} onChange={e => setFrom(e.target.value)}>{cities.map(city => <option key={city}>{city}</option>)}</select></span></label>
                <button type="button" aria-label="Swap origin and destination" onClick={swapCities} className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-teal transition hover:bg-mint"><ArrowDownUp size={17}/></button>

<label className="min-w-0">
  <span className="mb-2 block text-xs font-bold text-slate-500">
    TO
  </span>
  <span className="relative block">
    <MapPin
      size={16}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-teal"
    />
    <select
      className="input-field w-full appearance-none pl-11 pr-3 text-sm font-semibold"
      value={to}
      onChange={e => setTo(e.target.value)}
    >
      {cities.map(city => (
        <option key={city}>{city}</option>
      ))}
    </select>
  </span>
</label>
              </div> : <label className="block"><span className="mb-2 block text-xs font-bold text-slate-500">DESTINATION</span><select className="input-field" value={to} onChange={e => setTo(e.target.value)}>{cities.map(city => <option key={city}>{city}</option>)}</select></label>}
              <div className="grid grid-cols-2 gap-3">
                <label><span className="mb-2 block text-xs font-bold text-slate-500">TRAVEL DATE</span><span className="relative block"><CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal"/><input required min={today} type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field pl-9 text-sm font-semibold"/></span></label>
                <label><span className="mb-2 block text-xs font-bold text-slate-500">TRAVELLERS</span><span className="relative block"><Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal"/><select className="input-field pl-9 text-sm font-semibold" value={passengers} onChange={e => setPassengers(e.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'traveller':'travellers'}</option>)}</select></span></label>
              </div>
              {searchError && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{searchError}</p>}
              <button disabled={searching} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-5 py-4 font-bold text-white shadow-lg shadow-teal/20 transition hover:bg-deep disabled:opacity-60">{searching ? <LoaderCircle className="animate-spin" size={18}/> : <Search size={18}/>} {searching ? 'Searching...' : `Search ${tab === 'Tours' ? 'Tours' : `${tab}es`}`} <ArrowRight size={17}/></button>
              <p className="text-center text-[11px] text-slate-400">Demo routes and prices shown. Live inventory is not connected.</p>
            </form>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/10 to-transparent"/>
      </section>

      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft sm:grid-cols-4">
          {[['01', 'Simple booking', 'Less fuss, more adventure'], ['02', 'Local know-how', 'Routes across Nepal'], ['03', 'Clear pricing', 'Know the demo fare upfront'], ['04', 'Here to help', 'Friendly support mindset']].map(([n, title, desc]) => <div key={n} className="flex gap-3 border-b border-r border-slate-100 p-4 last:border-r-0 sm:border-b-0 sm:p-5"><span className="font-display text-sm font-extrabold text-teal/50">{n}</span><div><p className="text-sm font-extrabold text-deep">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p></div></div>)}
        </div>
      </section>

      {resultsVisible && <section id="search-results" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Your search" title={`${from} to ${to}`} description={`Options for ${date}. Prices are illustrative demo fares.`} action={<button onClick={() => setResultsVisible(false)} className="self-start text-sm font-bold text-teal">Hide results <X size={15} className="ml-1 inline"/></button>}/>
        {visibleRoutes.length ? <div className="grid gap-4">{visibleRoutes.map(route => <RouteCard key={route.id} route={route} onBook={openBooking}/>)}</div> : <div className="rounded-2xl bg-white p-8 text-center"><Bus className="mx-auto mb-3 text-teal" size={28}/><h3 className="font-display text-xl font-extrabold">No demo routes found</h3><p className="mt-2 text-sm text-slate-500">Try Kathmandu → Pokhara or choose another route.</p></div>}
      </section>}

      <section id="routes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Made for the way you travel" title="Routes worth taking" description="Start with popular connections and find a trip that fits your plans." action={<a href="#booking" className="text-sm font-extrabold text-teal hover:text-deep">Search all routes <ArrowRight size={16} className="ml-1 inline"/></a>}/>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{popularRoutes.map(route => <RouteCard key={route.id} route={route} compact onBook={openBooking}/>)}</div>
      </section>

      <section id="destinations" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="A little inspiration" title="Places that stay with you" description="Find your own kind of wonder, from quiet lakesides to centuries-old streets."/>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DestinationCard title="Pokhara" subtitle="Lakeside calm & mountain views" image="photo-1605649487212-47bdab064df7" tag="Nature's playground" large/>
            <DestinationCard title="Kathmandu" subtitle="Living history at every turn" image="photo-1544735716-392fe2489ffa" tag="Culture & heritage"/>
            <DestinationCard title="Chitwan" subtitle="Wild landscapes and local life" image="photo-1516426122078-c23e76319801" tag="Into the wild"/>
            <DestinationCard title="Mustang" subtitle="A different side of the Himalayas" image="photo-1544735716-392fe2489ffa" tag="Mountain escape"/>
            <DestinationCard title="Lumbini" subtitle="A peaceful cultural journey" image="photo-1561361513-2d000a50f0dc" tag="Meaningful moments"/>
            <DestinationCard title="Bandipur" subtitle="Slow down in a hilltop town" image="photo-1519681393784-d120267933ba" tag="Hidden gem"/>
          </div>
        </div>
      </section>

      <section id="tours" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Go a little further" title="Curated escapes" description="A few ideas to turn a simple trip into a whole experience."/>
        <div className="grid gap-6 md:grid-cols-3">{tours.map(tour => <article key={tour.id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"><div className="relative h-52 overflow-hidden"><img src={tour.image} alt={tour.location} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-deep">{tour.category}</span></div><div className="p-5"><div className="flex items-center gap-1.5 text-xs font-bold text-teal"><MapPin size={13}/>{tour.location}<span className="mx-1 text-slate-300">•</span><Clock3 size={13}/>{tour.duration}</div><h3 className="mt-3 font-display text-xl font-extrabold text-deep">{tour.name}</h3><p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">{tour.description}</p><div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sample price / person</p><p className="mt-1 text-xl font-extrabold text-deep">{money(tour.price)}</p></div><button onClick={() => { setToast('Tour enquiries are coming soon. Contact us to discuss this package.'); window.setTimeout(() => setToast(''), 3500) }} className="rounded-xl bg-mint px-4 py-3 text-sm font-extrabold text-teal transition hover:bg-teal hover:text-white">Explore <ArrowUpRight size={15} className="ml-1 inline"/></button></div></div></article>)}</div>
        <p className="mt-4 text-xs text-slate-400">Tour prices and package details are sample content for this prototype.</p>
      </section>

      <section id="why" className="bg-deep py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-sun">Why travel with us</p><h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">Good trips begin<br/>with <span className="text-sun">good planning.</span></h2><p className="mt-5 max-w-md leading-7 text-white/65">Travel should feel exciting, not complicated. Fewa Star is designed to help you discover options and plan your next step with confidence.</p><a href="#booking" className="mt-8 inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3.5 font-extrabold text-deep transition hover:bg-white">Find your route <ArrowRight size={17}/></a></div>
            <div className="grid gap-4 sm:grid-cols-2">{[[ShieldCheck,'Clear information','Understand routes and sample fares before you decide.'],[HeartHandshake,'Human-first service','Helpful guidance for your plans and questions.'],[Ticket,'A simpler process','Search, choose, and start your booking in a few steps.'],[Headphones,'Support that listens','A dedicated support experience as the service grows.']].map(([Icon,title,desc])=><div key={title} className="rounded-2xl border border-white/10 bg-white/[.05] p-6 transition hover:bg-white/[.08]"><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sun"><Icon size={22}/></span><h3 className="font-display text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{desc}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] bg-mint p-8 sm:p-12 lg:p-14"><div className="relative z-10 max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-bold text-teal"><Sparkles size={14}/> Your next chapter awaits</span><h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-deep sm:text-4xl">More than a destination.<br/>A story you’ll bring home.</h2><p className="mt-4 max-w-lg leading-7 text-slate-600">Whether you’re heading across the country or exploring somewhere new, make room for the journey.</p><a href="#booking" className="mt-7 inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3.5 font-bold text-white transition hover:bg-teal">Plan your journey <ArrowRight size={17}/></a></div><div className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 rounded-full border-[38px] border-white/35 sm:right-4 sm:top-[-90px] sm:h-96 sm:w-96 sm:border-[55px]"/><div className="pointer-events-none absolute bottom-[-70px] right-28 h-48 w-48 rounded-full bg-sun/35 blur-2xl"/></div>
      </section>

      <section id="contact" className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1.2fr_.8fr] lg:px-8">
          <div><Brand/><p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">A fresh way to plan your journeys around Nepal. Thoughtful trips start with a simple first step.</p></div>
          <div className="md:justify-self-end"><p className="font-display text-lg font-extrabold text-deep">Need a hand planning?</p><p className="mt-2 text-sm text-slate-500">Add your official contact details before launch.</p><div className="mt-4 flex flex-wrap gap-3"><a href="mailto:hello@fewastar.example" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-deep hover:border-teal"><Mail size={16} className="text-teal"/> Email us</a><a href="#booking" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-deep hover:border-teal"><Phone size={16} className="text-teal"/> Plan a trip</a></div></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-slate-100 px-4 pt-6 text-xs text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><p>© {new Date().getFullYear()} Fewa Star. Built for journeys ahead.</p><p>Prototype notice: sample routes, fares, tours, and bookings are not live travel inventory.</p></div>
      </section>
    </main>

    {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl bg-deep px-5 py-4 text-sm font-semibold text-white shadow-2xl">{toast}</div>}

    {selectedRoute && <div className="fixed inset-0 z-50 flex items-end justify-center bg-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedRoute(null) }}>
      <div role="dialog" aria-modal="true" aria-labelledby="booking-title" className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal">Trip reservation</p><h2 id="booking-title" className="mt-1 font-display text-2xl font-extrabold text-deep">{booking ? 'Booking request received' : 'Almost on your way'}</h2></div><button onClick={() => setSelectedRoute(null)} aria-label="Close booking" className="rounded-xl p-2 hover:bg-mist"><X size={20}/></button></div>
        {booking ? <div className="py-5"><span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-teal"><CircleCheck size={30}/></span><p className="text-sm text-slate-500">Your demo reference is</p><p className="mt-1 font-display text-2xl font-extrabold text-deep">{booking.id}</p><div className="mt-5 space-y-3 rounded-2xl bg-mist p-4 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-500">Route</span><b>{booking.route}</b></div><div className="flex justify-between gap-4"><span className="text-slate-500">Date & departure</span><b>{booking.date} · {booking.departure}</b></div><div className="flex justify-between gap-4"><span className="text-slate-500">Passengers</span><b>{booking.passengers}</b></div><div className="flex justify-between gap-4 border-t border-slate-200 pt-3"><span className="text-slate-500">Demo total</span><b className="text-lg text-deep">{money(booking.total)}</b></div></div><p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">{booking.note}</p><button onClick={() => setSelectedRoute(null)} className="mt-5 w-full rounded-xl bg-deep px-4 py-3.5 font-bold text-white hover:bg-teal">Done</button></div> : <>
          <div className="mt-5 rounded-2xl bg-mint/70 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold text-teal">{selectedRoute.type}</p><p className="mt-1 font-display text-lg font-extrabold text-deep">{selectedRoute.from} <ArrowRight size={15} className="mx-1 inline"/> {selectedRoute.to}</p><p className="mt-1 text-xs text-slate-500"><Clock3 size={13} className="mr-1 inline"/>{selectedRoute.duration}</p></div><div className="text-right"><p className="text-xs text-slate-500">Per passenger</p><p className="text-xl font-extrabold text-deep">{money(selectedRoute.fare)}</p></div></div></div>
          <form onSubmit={submitBooking} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-bold text-slate-600">Travel date</span><input required min={today} type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)}/></label><label><span className="mb-1.5 block text-xs font-bold text-slate-600">Departure time</span><select className="input-field" value={departure} onChange={e => setDeparture(e.target.value)}>{selectedRoute.departures.map(d => <option key={d}>{d}</option>)}</select></label></div>
            <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Full name</span><input required autoComplete="name" className="input-field" placeholder="Your full name" value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})}/></label>
            <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-bold text-slate-600">Email address</span><input required type="email" autoComplete="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/></label><label><span className="mb-1.5 block text-xs font-bold text-slate-600">Phone number</span><input required type="tel" autoComplete="tel" className="input-field" placeholder="+977 ..." value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/></label></div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"><div><p className="text-sm font-bold text-deep">Passengers</p><p className="text-xs text-slate-500">Up to 10 per request</p></div><select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold" value={passengers} onChange={e => setPassengers(e.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-sm text-slate-500">Estimated total</span><span className="font-display text-2xl font-extrabold text-deep">{money(selectedRoute.fare * Number(passengers))}</span></div>
            {bookingError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{bookingError}</p>}
            <p className="text-xs leading-5 text-slate-400">Demo only: submitting saves a request to the local server. It does not charge payment or reserve a real seat.</p>
            <button disabled={bookingBusy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-5 py-4 font-bold text-white transition hover:bg-deep disabled:opacity-60">{bookingBusy && <LoaderCircle size={17} className="animate-spin"/>}{bookingBusy ? 'Submitting...' : 'Submit booking request'} <ArrowRight size={17}/></button>
          </form>
        </>}
      </div>
    </div>}
  </div>
}

function RouteCard({ route, compact = false, onBook }) {
  return <article className={`rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-0.5 hover:shadow-soft ${compact ? 'p-5' : 'p-4 sm:p-5'}`}>
    <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-mint px-3 py-1 text-[11px] font-extrabold text-teal">{route.tag}</span><Bus size={18} className="text-teal"/></div>
    <div className="my-5 flex items-center gap-2"><div className="min-w-0 flex-1"><p className="truncate font-display text-lg font-extrabold text-deep">{route.from}</p><p className="mt-1 text-xs text-slate-400">Origin</p></div><div className="flex flex-col items-center px-1 text-teal"><span className="mb-1 h-px w-9 bg-teal/30"/><ArrowRight size={16}/><span className="mt-1 h-px w-9 bg-teal/30"/></div><div className="min-w-0 flex-1 text-right"><p className="truncate font-display text-lg font-extrabold text-deep">{route.to}</p><p className="mt-1 text-xs text-slate-400">Destination</p></div></div>
    <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><Clock3 size={14} className="text-teal"/>{route.duration}<span className="mx-1 text-slate-300">•</span>{route.type}</div>
    <div className="mt-4 flex items-end justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">From / person</p><p className="mt-1 font-display text-xl font-extrabold text-deep">{money(route.fare)}</p></div><button onClick={() => onBook(route)} className="rounded-xl bg-deep px-4 py-3 text-xs font-extrabold text-white transition hover:bg-teal">Book now <ArrowRight size={14} className="ml-1 inline"/></button></div>
  </article>
}

function DestinationCard({ title, subtitle, image, tag, large = false }) {
  return <a href="#tours" className={`group relative isolate min-h-[245px] overflow-hidden rounded-3xl bg-deep ${large ? 'sm:row-span-2 sm:min-h-[510px]' : ''}`}>
    <img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=1000&q=85`} alt={`${title}, Nepal`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"/>
    <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/15 to-deep/5 transition group-hover:from-deep/95"/>
    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6"><span className="inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{tag}</span><div className="mt-3 flex items-end justify-between gap-3"><div><h3 className="font-display text-2xl font-extrabold text-white">{title}</h3><p className="mt-1 text-sm text-white/75">{subtitle}</p></div><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-deep transition group-hover:bg-sun"><ArrowUpRight size={19}/></span></div></div>
  </a>
}

export default App
