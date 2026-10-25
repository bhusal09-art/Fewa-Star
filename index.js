import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 4000
const dataDir = path.join(__dirname, 'data')
const bookingsFile = path.join(dataDir, 'bookings.json')

fs.mkdirSync(dataDir, { recursive: true })
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, '[]', 'utf8')

app.use(cors())
app.use(express.json({ limit: '100kb' }))

const routes = [
  { id: 'ktm-pkr', from: 'Kathmandu', to: 'Pokhara', duration: '7–8 hrs', fare: 1200, type: 'Tourist bus', departures: ['07:00 AM', '08:00 AM', '07:00 PM'], tag: 'Popular route' },
  { id: 'pkr-ktm', from: 'Pokhara', to: 'Kathmandu', duration: '7–8 hrs', fare: 1200, type: 'Tourist bus', departures: ['07:30 AM', '08:30 AM', '07:30 PM'], tag: 'Mountain views' },
  { id: 'ktm-chi', from: 'Kathmandu', to: 'Chitwan', duration: '5–6 hrs', fare: 850, type: 'Deluxe bus', departures: ['06:30 AM', '07:00 AM', '08:00 AM'], tag: 'Nature escape' },
  { id: 'pkr-chi', from: 'Pokhara', to: 'Chitwan', duration: '4–5 hrs', fare: 950, type: 'Tourist bus', departures: ['07:00 AM', '08:00 AM'], tag: 'Easy connection' },
  { id: 'ktm-but', from: 'Kathmandu', to: 'Butwal', duration: '7–9 hrs', fare: 1100, type: 'Deluxe bus', departures: ['06:00 AM', '06:30 PM'], tag: 'Comfort pick' },
  { id: 'ktm-lum', from: 'Kathmandu', to: 'Lumbini', duration: '8–9 hrs', fare: 1350, type: 'Tourist bus', departures: ['06:30 AM', '07:00 PM'], tag: 'Cultural journey' },
]

const tours = [
  { id: 'pokhara-escape', name: 'Pokhara Lakeside Escape', location: 'Pokhara', duration: '2 days / 1 night', price: 6500, category: 'Nature', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=85', description: 'Lakeside strolls, sunrise views, and relaxed time by Fewa Lake.' },
  { id: 'chitwan-wild', name: 'Chitwan Wildlife Getaway', location: 'Chitwan', duration: '3 days / 2 nights', price: 12500, category: 'Wildlife', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85', description: 'Discover the jungle, local culture, and the beauty of the Terai.' },
  { id: 'kathmandu-heritage', name: 'Kathmandu Heritage Trail', location: 'Kathmandu', duration: '1 day', price: 3200, category: 'Culture', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85', description: 'Explore timeless courtyards, temples, and the valley’s living history.' },
]

function readBookings() {
  try { return JSON.parse(fs.readFileSync(bookingsFile, 'utf8')) } catch { return [] }
}
function writeBookings(bookings) {
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2), 'utf8')
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'Fewa Star API' }))
app.get('/api/routes', (req, res) => {
  const from = String(req.query.from || '').trim().toLowerCase()
  const to = String(req.query.to || '').trim().toLowerCase()
  const found = routes.filter(route =>
    (!from || route.from.toLowerCase().includes(from)) &&
    (!to || route.to.toLowerCase().includes(to))
  )
  res.json(found)
})
app.get('/api/tours', (_req, res) => res.json(tours))

app.post('/api/bookings', (req, res) => {
  const { routeId, departure, date, passengers, fullName, email, phone } = req.body || {}
  const route = routes.find(item => item.id === routeId)
  if (!route) return res.status(400).json({ error: 'Please choose a valid route.' })
  if (!departure || !date || !fullName?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Please complete all required booking fields.' })
  }
  const count = Number(passengers)
  if (!Number.isInteger(count) || count < 1 || count > 10) {
    return res.status(400).json({ error: 'Passenger count must be between 1 and 10.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }
  const booking = {
    id: `FS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    routeId, route: `${route.from} → ${route.to}`, departure, date,
    passengers: count, fullName: fullName.trim(), email: email.trim(),
    phone: phone.trim(), total: route.fare * count,
    status: 'Pending confirmation', createdAt: new Date().toISOString(),
    note: 'Demo booking: no payment has been collected and seats are not reserved.'
  }
  const bookings = readBookings()
  bookings.unshift(booking)
  writeBookings(bookings)
  res.status(201).json(booking)
})

app.get('/api/bookings/:id', (req, res) => {
  const booking = readBookings().find(item => item.id === req.params.id)
  if (!booking) return res.status(404).json({ error: 'Booking not found.' })
  res.json(booking)
})

app.use(express.static(path.join(__dirname, '../dist')))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  const indexPath = path.join(__dirname, '../dist/index.html')
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath)
  res.status(404).send('Frontend is not built yet. Run npm run dev for development.')
})

app.listen(PORT, () => console.log(`Fewa Star API running on http://localhost:${PORT}`))
