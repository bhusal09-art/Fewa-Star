# Fewa Star — Travel & Ticketing Prototype

A responsive travel website built with **React + Vite + Tailwind CSS** and a small **Express API**. It includes route search, illustrative fares, destination and tour cards, and a demo booking request flow persisted to a local JSON file.

> **Important:** This is a working development prototype, not a live ticketing business. Routes, fares, tour packages, and schedules are sample data. Booking requests do not reserve real seats or collect payments. Do not use it to accept real customer bookings until authentication, inventory locking, payment verification, privacy controls, and operational processes have been implemented.

## Requirements

- Node.js 20+ recommended
- npm

## Run locally

1. Extract the ZIP file and open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend and API together:

   ```bash
   npm run dev
   ```

4. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The Express API runs on `http://localhost:4000`. Vite forwards `/api` requests to the API server.

## Production build

```bash
npm run build
npm start
```

Then open `http://localhost:4000`. The Express server serves the built frontend from `dist`.

## API endpoints

- `GET /api/health` — server health
- `GET /api/routes` — all demo routes
- `GET /api/routes?from=Kathmandu&to=Pokhara` — filter demo routes
- `GET /api/tours` — sample tour packages
- `POST /api/bookings` — validate and save a demo booking request
- `GET /api/bookings/:id` — retrieve a booking by reference (prototype only; add authentication/authorization before production)

Example request:

```json
{
  "routeId": "ktm-pkr",
  "departure": "07:00 AM",
  "date": "2026-12-01",
  "passengers": 2,
  "fullName": "Sample Traveller",
  "email": "traveller@example.com",
  "phone": "+977 9800000000"
}
```

Bookings are written to `server/data/bookings.json`, created automatically at runtime. This JSON store is for local demos only; use a transactional database such as PostgreSQL for a real service.

## Customize the project

- **Brand colors and fonts:** `tailwind.config.js`
- **Homepage and booking modal:** `src/App.jsx`
- **Global styles:** `src/styles.css`
- **Demo route and tour data / API validation:** `server/index.js`
- **SEO title and description:** `index.html`

Replace the placeholder contact address `hello@fewastar.example` with an official email address before publishing.

## Before launching publicly

1. Use a transactional database (PostgreSQL) and migrations.
2. Add authentication and authorization, especially for customer booking details and admin access.
3. Connect verified bus operators and real-time schedules, fares, and seat inventory.
4. Implement atomic seat holds / booking confirmation to prevent double booking.
5. Integrate a supported payment provider (for example, eSewa or Khalti) and verify payment callbacks server-side.
6. Add email/SMS notifications, cancellation/refund rules, and customer support workflows.
7. Add rate limiting, CSRF/security headers where applicable, request logging, input sanitization, backups, and privacy/retention policies.
8. Replace all sample destinations, reviews, prices, and packages with verified business information.
9. Add tests for search, booking validation, concurrency, payment verification, and authorization.
10. Configure HTTPS, environment variables, deployment, monitoring, and backups.
