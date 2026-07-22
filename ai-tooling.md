# AI Tooling Report

## Tool used

Claude Code (Anthropic) was used as the primary development tool for this project, across
every phase: project foundation, static frontend, and the PostgreSQL/Flask backend with
frontend integration covered in this document.

## How it was used

Work was driven by a sequence of detailed, phase-scoped prompts (foundation → static
pages/gallery → full static frontend → backend + integration), each one specifying the
exact requirements to satisfy, the technology constraints (React/Vite/plain CSS on the
frontend; Flask/PostgreSQL/SQLAlchemy/Migrate on the backend — no SQLite substitution
permitted at any point), and explicit guardrails such as "do not fabricate a success
response" and "do not leave TODO placeholders." Claude Code was asked to:

- Inspect the existing repository state before making changes and present a plan for
  large changes before writing code.
- Generate the Flask application factory, blueprints, SQLAlchemy models, migrations,
  validation helpers, and the customer/newsletter/reservation service layer.
- Generate the reservation transaction logic, including the bounded-retry behavior for
  the unique `(time_slot, table_number)` constraint.
- Generate the pytest suite (health, newsletter, reservations — 29 tests) and the demo
  seed/clear scripts.
- Rewire the existing `NewsletterForm.jsx`/`ReservationForm.jsx`/`services/api.js` from
  their temporary local-only handlers to real API calls, without redesigning the
  existing markup, styling, or accessibility structure.
- Run and interpret the actual results of the migration, the test suite, `curl` calls
  against the running API, direct PostgreSQL queries, and a Playwright-driven browser
  session exercising the real UI against the real backend — and report only what those
  tools actually returned.

## What worked well

- Generating the full CRUD/validation/transaction layer from a precise specification
  (exact JSON shapes, exact status codes, exact business rules) produced code that
  matched the spec on the first pass for most endpoints.
- Having Claude Code run the actual test suite, `curl` the actual endpoints, and query
  the actual database — rather than just asserting the code "should work" — caught two
  real problems during this phase (see below) before they reached the final report.
- The bounded-retry reservation transaction and the demo seed/clear scripts worked
  correctly on the first real run against PostgreSQL, including the 31st-booking
  rejection and the zero-duplicate-table integrity check.

## What required correction

- The first draft of the pytest suite produced a benign-looking `SAWarning` about the
  SQLAlchemy identity map after table truncation between tests. Investigating the actual
  warning text (rather than ignoring it because tests still passed) revealed a real test
  isolation gap: truncating tables with `RESTART IDENTITY` reuses primary keys across
  tests, and the ORM session's identity map wasn't being cleared between tests. This was
  fixed by adding `db.session.remove()` to the per-test cleanup fixture.
- An early version of the demo scripts failed with `ModuleNotFoundError: No module named
  'app'` because scripts run from `backend/scripts/` don't automatically have
  `backend/` on `sys.path`. This was caught immediately by actually running the script
  rather than only reading it, and fixed with an explicit `sys.path` adjustment at the
  top of each script.
- A Playwright screenshot earlier in the project appeared to show missing gallery images
  in two categories; re-verifying with `naturalWidth`/`complete` checks (rather than
  trusting the screenshot alone) showed this was a `loading="lazy"` + full-page
  screenshot timing artifact, not a real bug — an example of double-checking a
  surprising result before reporting it as a defect.
- During the final QA pass, an automated `axe-core` scan found a genuine WCAG AA
  color-contrast failure on the footer's copyright line (`~3.37:1`, below the 4.5:1
  minimum) that had gone unnoticed through several prior phases of manual review —
  fixed with a dedicated `--color-gray-on-dark` token.
- The same QA pass's keyboard-only navigation audit found that the "Skip to content"
  link didn't actually work as a skip link: it moved the URL hash but left keyboard
  focus on `<body>` (because `<main>` had no `tabindex`), so the next Tab press
  restarted at the top of the page instead of skipping past the header — the exact
  failure mode skip links exist to prevent. Fixed with `tabIndex={-1}` on `<main>`, and
  re-verified that focus lands correctly afterward.
- The QA pass's own timing-measurement script had two of its own bugs on the first
  attempt: `page.waitForFunction(fn, { timeout: 5000 })` silently passed the timeout
  object as the function's unused `arg` parameter (not as `options`, which is a
  3-argument call), producing a bogus ~30-second "measurement" that was actually just
  Playwright's default timeout; and a `document.querySelector('section')` matched the
  first `<section>` on the page rather than the newsletter section specifically,
  causing the retried version to time out at exactly 5000ms with no real signal. Both
  were caught because the resulting numbers were implausible (30 seconds and a flat
  5000ms across all 3 trials, respectively) rather than accepted at face value, and
  fixed before the final timing figures were reported.

## Human review performed

Every claim in this project's phase reports is backed by a command that was actually
run in this session: `pytest` output, `npm run lint`/`npm run build` output, `curl`
responses, direct `psql` queries against the development database, and Playwright
sessions driving the real dev server against the real Flask backend. No endpoint,
migration, or test result was described as passing without having actually been
executed and observed. A human collaborator should still independently re-run the full
verification checklist in `docs/TEST_PLAN.md`, review the reservation/newsletter
business logic against the SRS line by line, and perform the real-browser (Safari/
Firefox/Edge) and screen-reader passes that could not be completed in this
Linux/Chromium-only environment before treating this as submission-ready. An automated
`axe-core` accessibility scan and a keyboard-only navigation audit were completed and
found (and fixed) two real defects — see `docs/TEST_PLAN.md` §5-6 — but neither
substitutes for a human using a real screen reader.

## Known limitations of this AI-assisted process

- All testing in this environment used Chromium only; Safari, Firefox, and Edge have
  not been exercised against this code. A code-level compatibility audit found no
  high-risk features, but that is a risk assessment, not a substitute for actually
  running the site in those browsers.
- The AI tool cannot verify subjective UX quality (whether the design "feels" upscale
  and fine-dining appropriate) — that judgment call remains with a human reviewer.
- No security review (e.g., dependency vulnerability scanning, rate limiting) was
  performed; the SRS does not require it, but it is out of scope of what was verified
  here.
