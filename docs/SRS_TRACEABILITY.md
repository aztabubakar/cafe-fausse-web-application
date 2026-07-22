# SRS Requirement Traceability

Status as of the backend + integration phase. Every requirement below is marked only
where there is code and an actual executed check backing it (migration applied, test
passed, endpoint curled, or browser session observed) — see `docs/TEST_PLAN.md` for the
evidence log.

## Functional Requirements

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| FR-1 | Display Café Fausse's name prominently | **Implemented** | `Header.jsx` wordmark; `Home.jsx` hero `<h1>` |
| FR-2 | Show address, phone, hours | **Implemented** | `data/contact.js`, rendered in `Home.jsx` and `Footer.jsx` |
| FR-3 | High-quality images, consistent theme | **Implemented** | `data/images.js` manifest; `styles/tokens.css` design system |
| FR-4 | Navigation to Menu, Reservations, About Us, Gallery | **Implemented** | `data/navigation.js`, `Header.jsx`, `Footer.jsx` |
| FR-5 | Exact menu content, categories, prices | **Implemented** | `data/menu.js`; `Menu.jsx` |
| FR-6 | Reservation form (time slot, guests, name, email, phone) | **Implemented** | `ReservationForm.jsx` calls `POST /api/reservations`; verified via Playwright session against the live Flask API and confirmed in PostgreSQL |
| FR-7 | Validate time slot is available and valid | **Implemented** | Server-side: `app/validation.py` (`validate_time_slot_business_rules`) enforces hours/30-min boundary/future-dated on both `POST /api/reservations` and `GET /api/availability`; frontend also soft-validates for UX. Tests: `test_reservations.py` (past/invalid-date/outside-hours/invalid-interval/Sunday-late) |
| FR-8 | Backend assigns a random table from 30 | **Implemented** | `services/reservations.py::create_reservation` (`random.choice` over open tables); `test_different_available_tables_assigned_at_same_timeslot` |
| FR-9 | Success/error messaging for booking | **Implemented** | `ReservationForm.jsx` renders a real confirmation panel (reservation id/table/date/time/guests) only after a 201, and field/network/409/500 errors otherwise; verified via Playwright |
| FR-10 | Detailed history of Café Fausse | **Implemented** | `data/founders.js` (`history`), `About.jsx` |
| FR-11 | Founder biographies, commitments | **Implemented** | `data/founders.js` (`founders`, `commitments`), `About.jsx` |
| FR-12 | Gallery images: interior, dishes, events, behind-the-scenes | **Implemented** | `data/images.js` (`galleryImages`), `Gallery.jsx` with category filters |
| FR-13 | Lightbox for enlarged image viewing | **Implemented** | `Lightbox.jsx` — focus management, Escape/backdrop close, prev/next, keyboard arrows |
| FR-14 | Awards and reviews, exact content | **Implemented** | `data/awards.js`, `data/reviews.js`, rendered on `Home.jsx` and `Gallery.jsx` |
| FR-15 | Newsletter signup with email validation | **Implemented** | `NewsletterForm.jsx` calls `POST /api/newsletter`; server validates in `app/validation.py`; `test_newsletter.py` |
| FR-16 | Newsletter emails stored in backend database | **Implemented** | `services/newsletter.py` persists via `Customer`; verified with a direct `psql` query after a live signup |
| FR-17 | PostgreSQL Customers/Reservations tables | **Implemented** | `app/models.py`; migration `migrations/versions/2886d72156f0_*.py`; schema confirmed with `\d customers` / `\d reservations` |
| FR-18 | Flask logic for insert/availability/assignment/response | **Implemented** | `app/api/{newsletter,reservations}.py`, `app/services/{customers,newsletter,reservations}.py` |

## Non-Functional Requirements

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| NFR-1 | Load within 3 seconds on broadband | **Supported** | Production build produces small gzip bundles (~84KB JS, ~3KB CSS); images capped at 1920px/quality 78 |
| NFR-2 | Form submissions processed within 2 seconds | **Supported, not precisely timed** | Newsletter/reservation submissions against the local Flask API were observed to resolve near-instantly in manual and Playwright testing (single-row inserts against a local PostgreSQL instance, no external calls, no artificial delay in the code path), but no stopwatch/instrumented timing measurement was taken — a human reviewer should confirm with browser dev tools' Network tab |
| NFR-3 | Intuitive, easy-to-navigate interface | **Implemented** | Shared header/footer nav, active-page styling, clear CTAs |
| NFR-4 | Consistent, appealing branding | **Implemented** | `styles/tokens.css` design tokens applied site-wide |
| NFR-5 | Prevent double/overbooking | **Implemented** | DB-level `UNIQUE(time_slot, table_number)` + bounded-retry transaction in `services/reservations.py`; proven with `seed_full_timeslot.py` + a live 31st-booking attempt returning 409, and a duplicate-table SQL check returning zero rows |
| NFR-6 | User-friendly failure handling | **Implemented** | Structured `{"error": ..., "details": {...}}` JSON errors, never exposing tracebacks/SQL/credentials (`app/errors.py`); frontend renders friendly field/network/server messages |
| NFR-7 | Major browser compatibility | **Not yet verified** | Only Chromium was available in this environment; manual Safari/Firefox/Edge checklist still needed (see `docs/TEST_PLAN.md`) |
| NFR-8 | Responsive design (desktop/tablet/mobile) | **Implemented and verified** | Automated checks confirm no horizontal scroll at 320/375/768/1024/1440px |
| NFR-9 | Modular, maintainable, documented code | **Implemented** | Component/service-per-concern structure, centralized data modules, this document, `README.md`, `ai-tooling.md` |

## Notes

- FR-6 through FR-9 and FR-15 through FR-18 moved from "pending backend" to
  "Implemented" only after: the migration was applied and schema confirmed in
  PostgreSQL, the pytest suite (29 tests) passed, the four endpoints were exercised
  directly with `curl`, and a Playwright browser session drove the real React UI
  against the real Flask API with the resulting rows confirmed in PostgreSQL.
- NFR-7 (browser compatibility) and full manual accessibility/UX review remain the
  honest gaps — nothing here claims they passed when they were not actually tested.
