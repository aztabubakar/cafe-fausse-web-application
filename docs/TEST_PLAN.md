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

**Not performed / needs manual follow-up:** real-browser testing in Safari, Firefox, or
Edge (only Chromium is installed in this environment, and installing additional browser
engines was intentionally avoided rather than working around that constraint); a
screen-reader pass (NVDA/VoiceOver). See sections 5-8 below for what *was* completed this
QA pass, including an automated accessibility scan, a keyboard-only navigation audit, a
computed color-contrast audit, a code-level cross-browser compatibility risk review, and
a precisely instrumented NFR-2 timing measurement (superseding the earlier "observed fast
but not instrumented" caveat).

## 5. Automated accessibility scan (axe-core, Chromium)

Ran `@axe-core/playwright` (WCAG 2.0/2.1 A/AA rule set) against all 5 routes plus 5
interactive states: mobile nav open, gallery lightbox open, reservation form with
validation errors shown, newsletter form with validation errors shown, and both forms'
success states (post-submission confirmation).

**First run found 1 real violation**, repeated across every route: `.footer-copyright`
(`color-contrast`, serious) — `var(--color-gray)` (`#6b6b6b`) on the charcoal footer
background computed to ~3.37:1, below the 4.5:1 AA threshold for normal text. Every other
use of `--color-gray` in the codebase is on a light (ivory/white) background where it
already passed. Fixed by adding a dedicated `--color-gray-on-dark` token (`#9a9a9a`,
~6.37:1 on charcoal) used only by `.footer-copyright` — see `styles/tokens.css` and
`styles/components.css`.

**Result after the fix: 0 violations across all 10 scanned states.**

## 6. Keyboard-only navigation audit (Playwright, simulated keyboard input)

- Tab order on the Home page is logical: skip link → wordmark → primary nav (in visual
  order) → header "Reserve a Table" → hero CTAs → featured-menu CTA → footer phone →
  footer newsletter fields. No element was skipped or unreachable.
- Tabbing all the way through the page (80 stops) reached the end of the document with
  no trap — focus never got stuck cycling within a widget.
- **Found and fixed a real bug**: activating the "Skip to content" link moved the URL
  hash but left DOM focus on `<body>`, because `<main id="main-content">` had no
  `tabindex`. The next Tab press therefore restarted from the top of the page instead of
  continuing past the header — defeating the skip link's entire purpose. Fixed by adding
  `tabIndex={-1}` to the `<main>` element in `App.jsx`. Verified after the fix: focus
  correctly lands on `<main>` (not `<body>`), confirmed via `document.activeElement`.
- Gallery lightbox, keyboard-only: Tab reaches a thumbnail button, Enter opens the
  lightbox with focus on the close button, ArrowRight/ArrowLeft change the image, Escape
  closes it and returns focus to the thumbnail that opened it.
- Mobile nav (375px), keyboard-only: Tab reaches the toggle button, Enter opens it
  (`aria-expanded="true"`), Tab moves into the now-visible nav links, Escape closes it.
- Reservation form is fully fillable via Tab + typing alone, in the expected field order.

## 7. Color contrast audit (computed WCAG ratios)

Exact contrast ratios computed for every color-token pairing used in the UI (formula per
WCAG 2.x relative luminance):

| Combination | Ratio | Result |
|---|---|---|
| Body text (charcoal) on page background (ivory) | 16.07:1 | Pass AA |
| Header/footer text (ivory) on charcoal | 16.07:1 | Pass AA |
| Gold accents on charcoal | 5.80:1 | Pass AA |
| Muted text (gray) on ivory cards | 4.78:1 | Pass AA |
| Muted text (gray) on white cards | 5.33:1 | Pass AA |
| Footer copyright (fixed: gray-on-dark) on charcoal | 6.37:1 | Pass AA |
| Prices/links (burgundy) on ivory | 8.73:1 | Pass AA |
| Prices/links (burgundy) on white cards | 9.75:1 | Pass AA |
| Primary button text (ivory) on burgundy | 8.73:1 | Pass AA |
| Form field error text on ivory | 6.67:1 | Pass AA |
| Success status text on ivory | 5.78:1 | Pass AA |

All 11 combinations meet or exceed the 4.5:1 WCAG AA threshold for normal text
(cross-checked against the axe-core scan in section 5, which independently confirmed
zero color-contrast violations after the footer fix).

## 8. Cross-browser compatibility code audit

Since only Chromium is available to actually run in this environment, real Safari/
Firefox/Edge sessions were not performed (see the caveat above). As a substitute risk
assessment, the codebase was audited for CSS/JS features that could behave differently or
be unsupported in other current major browsers:

- **No bleeding-edge features used**: no `:has()`, container queries, `subgrid`,
  `backdrop-filter`, or `dvh`/`svh` viewport units anywhere in `styles/`.
- **Used, broadly supported since ~2021 or earlier**: CSS Grid/Flexbox with `gap`
  (Safari 14.1+), `aspect-ratio` (Safari 15+), `clamp()` (Safari 13.1+), `:focus-visible`
  (Safari 15.4+), `position: sticky`, CSS custom properties — all well within any
  reasonable definition of "major browsers" in 2026; `:focus-visible`, the newest
  requirement here, has been shipping in Safari since March 2022.
- **Progressive enhancement, degrades safely**: `fetchPriority` on the hero `<img>`
  (`ResponsiveImage.jsx`) and native `loading="lazy"` are both ignored harmlessly by any
  browser that doesn't recognize them — no broken behavior, just a missed optimization
  hint.
- **No use of** `Intl`, `structuredClone`, or other newer JS APIs; only `?.`/`??`
  (Safari 13.1+, 2020) beyond baseline ES2015 syntax.
- **Expected cosmetic variance, not a bug**: `<input type="date">` (`ReservationForm.jsx`)
  renders each browser's native date-picker UI, which looks different across Chrome,
  Firefox, and Safari by design. This should be visually confirmed in each real browser
  but is not something to "fix."
- Vite's default build target tracks browsers with native ES module support (Chrome 64+,
  Firefox 67+, Safari 12+, Edge 79+), consistent with the SRS's "major browsers"
  requirement.

**Assessed risk: low.** Nothing identified requires a real Safari/Firefox/Edge session to
rule out a functional break; the residual gap is purely "confirm it still looks right,"
which remains an honest manual to-do, not a code risk.

## 9. NFR-2 timing measurement (instrumented, Playwright)

Superseding the earlier "observed fast, not instrumented" note: timestamps were captured
around the actual submit click and around the network response / UI update, for 3 trials
each, against the real local Flask + PostgreSQL backend:

| Form | Network round-trip | Full UI update (click → message/confirmation rendered) |
|---|---|---|
| Newsletter | 51-84ms | 62-66ms |
| Reservation | 50-77ms | 70-121ms |

Both forms complete in well under 200ms end-to-end against a local database — roughly
15-30x inside the 2-second budget. (An earlier version of this timing script had its own
bug — a `page.waitForFunction` call with a malformed argument list that silently fell
back to a 30-second default timeout — caught by the results looking implausible and
fixed before being reported here.)

## 10. PostgreSQL verification queries

See `README.md`'s "Direct SQL verification" section for the exact queries used above.

## 11. Full-timeslot test (repeatable)

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
