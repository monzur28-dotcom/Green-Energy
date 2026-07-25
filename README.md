# Green Energy Store

A full-stack beauty & personal-care e-commerce store: React (Vite) frontend, Express API, Postgres (Supabase) or local SQLite database.

## Stack
- **Frontend**: React + React Router, `src/`
- **Backend**: Express API, `server/`
- **Database**: Postgres via Supabase (default when `DATABASE_URL` is set) or local SQLite file (fallback) — see `server/db.js`

## Run locally
1. Copy `.env.example` to `.env` and fill in your Supabase connection details (or leave `DATABASE_URL` unset to use local SQLite instead).
2. Install and run:
   ```bash
   npm install
   npm run dev:all
   ```
   This starts the frontend (http://localhost:5173) and the API (http://localhost:4000) together. `npm run dev` / `npm run server` run them separately.
3. Admin dashboard: `/admin/login`, default PIN `1234` (change it under Admin → Settings once you're in).

## Environment variables
See `.env.example`. Key ones:
- `DATABASE_URL` — Postgres connection string (Supabase transaction-pooler URL). Omit to use local SQLite.
- `DB_DRIVER` — force `sqlite` or `postgres`; otherwise inferred from `DATABASE_URL`.

## Deployment (single Vercel project)
The frontend (static Vite build) and backend (Express app) deploy together from one repo:
- `api/index.js` wraps the Express app (`server/app.js`) as a Vercel serverless function — this is what actually runs the API in production, not `server/index.js` (that's the local-dev-only entrypoint that calls `.listen()`).
- `vercel.json` routes `/api/*` to that function and everything else to `index.html` (so client-side routes like `/shop` or `/admin` work on refresh).
- Using Supabase's transaction-pooler `DATABASE_URL` (rather than a direct connection) matters here — serverless functions open many short-lived connections, which is exactly what the pooler is designed for.

Steps:
1. Push this repo to GitHub.
2. Import it on vercel.com. Framework preset: Vite (auto-detected) — no build command changes needed.
3. In the Vercel project's Settings → Environment Variables, add `DATABASE_URL` (and `DIRECT_URL` if you'll run migrations) from your `.env` — **never commit `.env` itself**.
4. Deploy. Every push to the connected branch redeploys automatically.

## Notes
- Cart and wishlist are stored client-side (`localStorage`) — everything else (products, categories, orders, customers, site content, settings) lives in the database.
- Customer/admin auth is a custom session-token system (scrypt-hashed passwords) — solid for a small store, but review it before scaling to a larger customer base.
