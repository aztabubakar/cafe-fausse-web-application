# Café Fausse

A responsive full-stack web application for Café Fausse, a fictional Italian fine-dining
restaurant, built to the requirements in `docs/Cafe_Fausse_SRS.pdf`.

## Project status

The frontend is a complete, responsive static React application covering all five required
pages, an accessible gallery lightbox, and interface-ready newsletter/reservation forms.
**Backend integration (Flask + PostgreSQL) has not started yet** — see
[Current phase](#current-phase-and-whats-next) below.

## Tech stack

- **Frontend**: React (JSX) + Vite, React Router, plain CSS (Grid/Flexbox)
- **Backend** (next phase): Flask, PostgreSQL, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS
- **API**: RESTful JSON over HTTP

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # sets VITE_API_BASE_URL; not required for the static phase
```

### Development

```bash
npm run dev
```

Starts the Vite dev server (default `http://localhost:5173`).

### Production build

```bash
npm run build
```

Outputs to `frontend/dist/`. Preview it locally with `npm run preview`.

### Lint

```bash
npm run lint
```

## Pages completed

| Route | Page | Status |
|---|---|---|
| `/` | Home | Complete — hero, intro, featured menu, dining experience, awards, reviews, hours, newsletter |
| `/menu` | Menu | Complete — exact SRS menu content, images, reservation CTA |
| `/reservations` | Reservations | Interface complete — form validates locally and is wired for backend integration; does not claim a reservation was saved |
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

## Current phase and what's next

This phase built the complete static frontend, including form *interfaces* for the
newsletter and reservations with local validation, loading-state structure, and
`aria-live` status regions. Their submit handlers are intentionally temporary — they
validate input and then display a neutral message (e.g. "The reservation form is ready
for backend connection") rather than a fabricated success message.

**Next phase**: build the Flask backend and PostgreSQL database (customers and
reservations tables, availability checks, random table assignment, newsletter signup
persistence), then connect `frontend/src/services/api.js` to the real endpoints and
replace the temporary form handlers with real API calls.

See `docs/SRS_TRACEABILITY.md` for the full requirement-by-requirement status.
