# Test Plan

## 1. Backend automated tests (pytest)

Run from `backend/` with the virtualenv active, against the dedicated `cafe_fausse_test`
database (never the development database):

```bash
pytest
```

**Result at time of writing: 29 passed, 0 failed, 0 warnings.**

| File | Covers |
|---|---|
| `tests/test_health.py` | Healthy DB response (200); DB-unavailable response (503, via a deliberately broken connection string — no real outage required) |
| `tests/test_newsletter.py` | New subscriber (201); existing subscriber update (200); email normalized to lowercase; no duplicate customer row; invalid email / blank name / missing consent (400); a reservation-only customer can later subscribe; `newsletter_signup` stays `true` after a later reservation |
| `tests/test_reservations.py` | Valid reservation (201, table 1-30); customer created; existing customer reused; past date / malformed date / invalid email / guest count <1 or >12 / outside business hours / off-30-minute-boundary / Sunday-after-7:30-PM all rejected (400); distinct tables assigned for concurrent bookings at one timeslot; DB unique constraint enforced (same table + same timeslot raises `IntegrityError`); a table can be reused at a different timeslot; the 31st booking at a full timeslot returns 409 with zero duplicate `(time_slot, table_number)` rows afterward; `GET /api/availability` returns `available: false` / `tables_remaining: 0` when full and the correct remaining count otherwise; invalid `time_slot` query param returns 400 |

All of the above assert against actual database state (via direct SQLAlchemy queries), not
only HTTP response bodies.

## 2. Integration tests (manual, this session)

Performed against a running `flask run` + PostgreSQL, using `curl` and direct `psql`
queries:

- `GET /api/health` → 200, `{"status":"ok","database":"connected"}`.
- `POST /api/newsletter` (new email) → 201, then the same email again → 200 with the same
  `customer_id`; confirmed a single row in `customers` via `psql`.
- `POST /api/newsletter` with an invalid email → 400 with `details.email_address`.
- `GET /api/availability` for a fresh future slot → `available: true, tables_remaining: 30`.
- `POST /api/reservations` with a valid payload → 201; row confirmed in `reservations` via
  `psql`, `customer_id` matching the customer row.
- `POST /api/reservations` with a past `time_slot` → 400.
- `seed_full_timeslot.py` run against the dev database → fills one timeslot to 30/30.
- `GET /api/availability` on that full slot → `available: false, tables_remaining: 0`.
- A 31st `POST /api/reservations` on that same slot → 409 with the documented message.
- `SELECT time_slot, table_number, COUNT(*) ... HAVING COUNT(*) > 1` → **zero rows.**
- `SELECT COUNT(*) FROM reservations WHERE time_slot = '<the full slot>'` → **30**, confirming
  the 31st request was not inserted.

## 3. Browser-driven end-to-end test (Playwright, Chromium)

Performed against the real `npm run dev` frontend talking to the real `flask run` backend
(not mocked):

1. Filled and submitted the Home page's newsletter form → real success message
   ("Thank you for subscribing…"), form fields cleared, row confirmed in `customers` via
   `psql`.
2. Filled and submitted the reservation form for a fresh future slot → availability
   status showed "Tables available (30 remaining)" before submit; after submit, a
   confirmation panel rendered with confirmation number, table, date, time, and guest
   count; the row was confirmed in `reservations` via `psql`; form fields cleared only
   after this success.
3. Selected the pre-filled full timeslot (`2026-08-05T18:00:00`) → availability status
   showed "This time is fully booked," and the submit button was disabled without a
   server round-trip, matching the 409 behavior confirmed via `curl` in step 2 above.
4. Console/page errors were captured throughout: **zero** errors across all of the above.

## 4. Manual frontend checks

No automated browser test suite is claimed beyond the Playwright sessions described
above, which were used as a verification tool during development, not as a committed CI
test suite.

- `npm run lint` — clean.
- `npm run build` — succeeds, reasonable bundle size.
- Direct URL navigation to all 5 routes + a 404 route — correct page/title each time.
- Mobile nav (375px viewport): opens, closes on link selection, closes on Escape.
- Gallery category filters (All/Interior/Cuisine/Events/Behind the Scenes) — correct
  counts per category.
- Lightbox: opens with focus on the close button, Left/Right arrow keys and the
  prev/next buttons navigate, clicking the image itself does not close it, Escape and
  backdrop click both close it, focus returns to the thumbnail that opened it, background
  scroll is locked while open.
- No horizontal scroll at 320/375/768/1024/1440px on all 5 routes.

**Not performed / needs manual follow-up:** cross-browser testing in Safari, Firefox, or
Edge (only Chromium was available in this environment); a screen-reader pass (NVDA/
VoiceOver); a stopwatch-timed measurement of NFR-2 (2-second form-submission budget) —
submissions were observably fast but not instrumented with precise timing.

## 5. PostgreSQL verification queries

See `README.md`'s "Direct SQL verification" section for the exact queries used above.

## 6. Full-timeslot test (repeatable)

```bash
cd backend
source .venv/bin/activate
python scripts/seed_full_timeslot.py   # prints the target timeslot; safe to re-run
# then attempt one more reservation at that exact timeslot via the UI or curl — expect 409
python scripts/clear_demo_data.py      # cleans up afterward
```

## Expected results summary

| Check | Expected | Observed |
|---|---|---|
| pytest suite | all pass | 29/29 passed |
| Duplicate `(time_slot, table_number)` rows | 0 | 0 |
| 31st booking at a full slot | HTTP 409 | HTTP 409 |
| Availability on a full slot | `available: false`, `tables_remaining: 0` | matched |
| Newsletter double-submit same email | no duplicate customer row | matched |
| Frontend console errors during E2E flow | 0 | 0 |
| `npm run lint` / `npm run build` | pass | pass |
