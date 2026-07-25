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

## Deployment
This is two separate deployments — a static frontend and a persistent Node API — plus the Supabase database, which is already hosted.

**Frontend (Vercel or Netlify):**
1. Push this repo to GitHub.
2. Import it on vercel.com (or netlify.com). Framework preset: Vite. Build command `npm run build`, output directory `dist`.
3. Set an environment variable or rewrite so `/api/*` requests reach your deployed backend (see below) — the local dev proxy in `vite.config.js` only works locally.

**Backend (Render, Railway, Fly.io, or any Node host):**
1. Deploy the `server/` directory (or the whole repo with start command `node server/index.js`).
2. Set the same environment variables as `.env` (`DATABASE_URL`, etc.) in that host's dashboard — never commit `.env`.
3. Note the deployed API's URL and point the frontend's `/api` requests at it.

## Notes
- Cart and wishlist are stored client-side (`localStorage`) — everything else (products, categories, orders, customers, site content, settings) lives in the database.
- Customer/admin auth is a custom session-token system (scrypt-hashed passwords) — solid for a small store, but review it before scaling to a larger customer base.
