# Café Fausse

A responsive full-stack web application for Café Fausse, a fictional Italian fine-dining
restaurant, built to the requirements in `docs/Cafe_Fausse_SRS.pdf`.

## Project status

The application is feature-complete end to end: a responsive React frontend covering all
five required pages plus an accessible gallery lightbox, and a Flask + PostgreSQL backend
implementing the newsletter signup and table-reservation system, wired together over a
RESTful JSON API. See `docs/SRS_TRACEABILITY.md` for the full requirement-by-requirement
status and `docs/TEST_PLAN.md` / `docs/DEMO_SCRIPT.md` for verification detail.

## Tech stack

- **Frontend**: React (JSX) + Vite, React Router, plain CSS (Grid/Flexbox)
- **Backend**: Flask (application factory + blueprints), Flask-SQLAlchemy, Flask-Migrate,
  Flask-CORS, Psycopg 3
- **Database**: PostgreSQL (mandatory — this project does not use SQLite)
- **API**: RESTful JSON over HTTP, prefixed `/api`

## Architecture

```
frontend/   Vite + React SPA. Talks to the backend only through
            src/services/api.js (VITE_API_BASE_URL), never hardcoded URLs.
backend/    Flask app factory (app/__init__.py:create_app) registering
            blueprints for health, newsletter, and reservations.
            SQLAlchemy models + Flask-Migrate own the schema.
            services/ holds the business logic (customer upsert rules,
            reservation transaction, availability).
            validation.py is the single source of server-side validation
            and business-hour rules, shared by the reservation and
            availability endpoints.
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 16 (a local install, or the provided `docker-compose.yml`)

## PostgreSQL setup

**Option A — local PostgreSQL install:**

```bash
sudo -u postgres psql -c "CREATE USER cafe_fausse WITH PASSWORD 'cafe_fausse';"
sudo -u postgres psql -c "CREATE DATABASE cafe_fausse OWNER cafe_fausse;"
# A second database is used only by the automated test suite:
sudo -u postgres psql -c "CREATE DATABASE cafe_fausse_test OWNER cafe_fausse;"
```

**Option B — Docker Compose (optional, PostgreSQL only):**

```bash
docker compose up -d
```

This starts PostgreSQL 16 with database/user `cafe_fausse`, a persistent named volume, and
a health check on port 5432. Create the `cafe_fausse_test` database the same way as above
once the container is healthy. Docker is optional — the app works identically against any
local PostgreSQL 16 server.

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
```

### Environment variables (`backend/.env`)

```env
FLASK_APP=wsgi.py
FLASK_DEBUG=1
DATABASE_URL=postgresql+psycopg://cafe_fausse:cafe_fausse@localhost:5432/cafe_fausse
FRONTEND_ORIGIN=http://localhost:5173
```

Never commit a real `.env` file — both `backend/.env` and `frontend/.env` are git-ignored.
`FRONTEND_ORIGIN` is the **only** origin Flask-CORS allows in `/api/*` responses; there is
no wildcard CORS origin anywhere in this codebase.

### Migrations

The schema is owned by Flask-Migrate, not `db.create_all`. `backend/migrations/` is already
initialized and contains the migration that creates `customers` and `reservations`. To
apply it to a fresh database:

```bash
flask db upgrade
```

If you ever need to generate a new migration after changing `app/models.py`:

```bash
flask db migrate -m "describe the change"
flask db upgrade
```

### Run the backend

```bash
flask run
```

Serves the API at `http://localhost:5000`. Confirm it's healthy:

```bash
curl http://localhost:5000/api/health
```

### Backend tests

Tests run against a **separate** database (`cafe_fausse_test` by default, or set
`TEST_DATABASE_URL`) — they never touch the development database. Apply migrations to the
test database once:

```bash
TEST_DATABASE_URL=postgresql+psycopg://cafe_fausse:cafe_fausse@localhost:5432/cafe_fausse_test \
  FLASK_APP=wsgi.py flask db upgrade
```

Then run the suite:

```bash
pytest
```

### Demo / seed scripts

All demo data uses the `@demo.cafefausse.test` email domain so it can be identified and
removed without touching real records.

```bash
python scripts/seed_demo_data.py       # a handful of demo customers/reservations
python scripts/seed_full_timeslot.py   # fills one future timeslot to 30/30, to demo the 409
python scripts/clear_demo_data.py      # deletes only the @demo.cafefausse.test rows
```

### Direct SQL verification

```sql
SELECT * FROM customers ORDER BY customer_id DESC LIMIT 10;

SELECT * FROM reservations ORDER BY reservation_id DESC LIMIT 10;

SELECT time_slot, COUNT(*) AS reservation_count
FROM reservations
GROUP BY time_slot
ORDER BY time_slot;

-- Must always return zero rows:
SELECT time_slot, table_number, COUNT(*)
FROM reservations
GROUP BY time_slot, table_number
HAVING COUNT(*) > 1;
```

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development

```bash
npm run dev
```

Starts the Vite dev server (default `http://localhost:5173`).

### Production build / lint

```bash
npm run build
npm run lint
```

## Deployment

The frontend deploys to **GitHub Pages** (static hosting) and the backend deploys to
**[Render](https://render.com)** (Flask web service + managed PostgreSQL), since GitHub
Pages cannot run a Flask process or a database. This is a one-time manual setup;
after that, pushes to `main` redeploy the frontend automatically.

### 1. Backend (Render)

1. Create a free Render account and connect your GitHub account.
2. In the Render dashboard: **New > Blueprint**, select this repository. Render reads
   `render.yaml` at the repo root and provisions:
   - `cafe-fausse-backend` — a Python web service running
     `flask db upgrade && gunicorn wsgi:app` (applies migrations, then serves)
   - `cafe-fausse-db` — a managed PostgreSQL database, wired to the web service via
     the `DATABASE_URL` environment variable
3. Once deployed, copy the backend's public URL (e.g.
   `https://cafe-fausse-backend.onrender.com`).
4. In the Render service's **Environment** tab, set `FRONTEND_ORIGIN` to your GitHub
   Pages origin — scheme + host only, no path, e.g. `https://<your-username>.github.io`.
   (`render.yaml` sets a placeholder value; update it to match your actual username.)

Notes:
- Render's free web service spins down after inactivity; the first request after idle
  takes a few extra seconds to wake it up.
- Render's free PostgreSQL plan expires after a limited period (check Render's current
  terms) — fine for a coursework demo, not for long-term hosting.

### 2. Frontend (GitHub Pages)

1. In the GitHub repo: **Settings > Pages > Build and deployment > Source**, choose
   **GitHub Actions**.
2. In **Settings > Secrets and variables > Actions > Variables**, add a repository
   variable `VITE_API_BASE_URL` set to `<your-render-backend-url>/api` (e.g.
   `https://cafe-fausse-backend.onrender.com/api`).
3. Push to `main` (or run the workflow manually from the Actions tab). The
   `.github/workflows/deploy-pages.yml` workflow builds the Vite app and publishes it
   to GitHub Pages.
4. The site will be live at `https://<your-username>.github.io/cafe-fausse-web-application/`.

If the repo is ever renamed, or forked under a different name, update `base` in
`frontend/vite.config.js` (and the URL above) to match the new path.

**Before making this public**: revisit the licensing reminder below — confirm the
supplied photos are cleared for public (not just coursework-internal) use.

## Pages

| Route | Page | Status |
|---|---|---|
| `/` | Home | Complete — hero, intro, featured menu, dining experience, awards, reviews, hours, newsletter |
| `/menu` | Menu | Complete — exact SRS menu content, images, reservation CTA |
| `/reservations` | Reservations | Complete — real availability check and reservation submission against the Flask API |
| `/about` | About Us | Complete — required history, founder bios, commitments |
| `/gallery` | Gallery | Complete — category filters, accessible lightbox, awards, reviews |
| `*` | Not Found | Complete |

## Images

- Source images: `frontend/src/assets/images/` (original, untouched, full resolution)
- Optimized derivatives used by the site: `frontend/src/assets/images/optimized/`
  (resized/re-encoded for web delivery — see that folder's README for why and how to
  regenerate them)
- Central manifest: `frontend/src/data/images.js` — every image is imported once here and
  referenced elsewhere by name

**Licensing reminder**: confirm the supplied photos are properly licensed or
Quantic-provided before any public deployment. Do not add further images without
verifying royalty-free status or AI-generation provenance.

**Image provenance**: most photos were Quantic-provided. Three beverage photos —
`white-wine.jpg`, `craft-beer.jpg`, `espresso.jpg` — were separately sourced from
[Wikimedia Commons](https://commons.wikimedia.org) (openly licensed media) to fill in
menu items the original photo set didn't cover. Verify their license pages if
redistributing this project beyond coursework.

## Timezone policy

Reservation `time_slot` values are treated as **naive local Washington, DC time** end to
end — no timezone conversion happens anywhere in the stack:

- The frontend builds `time_slot` as `YYYY-MM-DDTHH:MM:SS` (no `Z`, no UTC offset) from the
  date/timeslot the guest picked.
- The backend rejects any `time_slot` string that *does* include timezone information,
  rather than silently converting it, so local and UTC values are never mixed.
- PostgreSQL stores it as `timestamp without time zone`.
- `created_at`/`updated_at` audit timestamps are separate, server-generated bookkeeping
  fields (`datetime.utcnow()`) and are never used in reservation business logic.

This is a deliberate simplification appropriate for a single-location restaurant; a
multi-timezone deployment would need a timezone-aware column and explicit conversion at
the API boundary instead.

## Reservation business rules

Enforced server-side (the frontend also validates locally for immediate feedback, but the
server is the source of truth):

- Exactly 30 tables, numbered 1–30.
- 30-minute timeslots only.
- Monday–Saturday: 5:00 PM–9:30 PM (last seating).
- Sunday: 5:00 PM–7:30 PM (last seating).
- Reservation must be in the future.
- Party size: 1–12 guests.
- Name and a valid email are required; phone is optional.
- A table is chosen at random from the tables still open for that exact timeslot.
- On a simultaneous-booking collision (unique `(time_slot, table_number)` constraint),
  the transaction rolls back and retries with a freshly computed available-table set, up
  to 3 attempts, before returning HTTP 409.
- Newsletter signup is a one-way flag: a reservation never resets `newsletter_signup` from
  `true` back to `false`.

## Known limitations

- Cross-browser testing was performed only in Chromium (no local access to Safari/Firefox/
  Edge in this environment) — see `docs/TEST_PLAN.md` for what still needs manual
  confirmation.
- No authentication/authorization layer exists; all API endpoints are public, matching the
  SRS scope (a single-location restaurant site with no admin backend).
- Email delivery (e.g. a real confirmation email) is out of scope — the API returns a
  confirmation payload, but no email is sent.

## Troubleshooting

**`GET /api/health` returns 503 / "database": "unreachable"**
PostgreSQL isn't running or the credentials in `backend/.env` don't match. Check
`pg_isready -h localhost -p 5432` and that `DATABASE_URL` matches the role/database you
created above.

**Browser console shows a CORS error**
`FRONTEND_ORIGIN` in `backend/.env` must exactly match the origin the frontend is served
from (protocol + host + port), e.g. `http://localhost:5173`. Restart Flask after changing
it — CORS is configured once at app-factory time.

**`flask db upgrade` fails with "relation already exists"**
The target database already has these tables from a previous run outside of Alembic.
Either drop and recreate the database, or stamp it at the current revision with
`flask db stamp head` if the schema already matches.

## Next steps

With backend integration complete, remaining work is final QA: cross-browser testing,
a final accessibility pass, and presentation/demo preparation — see the recommended next
prompt at the end of this phase's report.
