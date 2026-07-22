# Claude Code Master Build Prompt: Café Fausse

Paste everything below into Claude Code from the root of the `cafe-fausse` repository.

---

You are the lead full-stack engineer for a graded academic project called **Café Fausse**.

Inspect the repository, read `CLAUDE.md`, and read `docs/Cafe_Fausse_SRS.pdf` if present. Build a complete working development version of the application. AI-assisted coding is permitted, but the final code must be understandable, modular, tested, and documented.

## Working method

1. Inspect the repository and existing files first.
2. Give me a concise implementation plan before editing.
3. Do not delete or overwrite existing user work without explaining why.
4. Work in clear phases and run relevant checks after each phase.
5. Fix errors rather than leaving broken code.
6. Do not leave TODOs, placeholder functions, fake API responses, or unimplemented requirements.
7. Do not use SQLite. PostgreSQL is mandatory.
8. Keep credentials and real `.env` files out of Git.
9. At the end, audit FR-1 through FR-18 and NFR-1 through NFR-9.
10. Report exact commands to run the finished project.
11. If an installed package API differs from your initial assumption, inspect the installed version or official documentation and implement the compatible approach.

## Required stack

### Frontend

- React with JSX
- Vite
- Browser routing using the installed React Router browser package
- Plain CSS organized into reusable styles
- CSS Grid and Flexbox
- Native Fetch API for HTTP requests
- No TypeScript unless the existing repo is already TypeScript
- No heavyweight UI framework

### Backend

- Python and Flask
- Application factory named `create_app`
- Flask blueprints
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS restricted to the configured frontend origin
- PostgreSQL through Psycopg 3
- Environment variables from `.env`
- JSON API responses
- Central error handling
- Pytest for focused backend tests

## Required design

Use a modern Italian fine-dining style.

### Colors

- Charcoal: `#171717`
- Warm ivory: `#F7F2E8`
- Burgundy: `#762A36`
- Muted gold: `#B08D57`
- Soft gray: `#6B6B6B`

### Typography

- Headings: Georgia, "Times New Roman", serif
- Body: Inter, Arial, Helvetica, sans-serif
- Keep system fallbacks.

### Accessibility and responsiveness

- Support widths from 320px upward.
- Include mobile, tablet, and desktop layouts.
- Use semantic HTML.
- Include a skip-to-content link.
- Give every form field a visible label.
- Provide keyboard-visible focus states.
- Give images descriptive alt text.
- Lazy-load non-hero images.
- Maintain sufficient contrast.
- Make mobile navigation keyboard usable.
- Respect `prefers-reduced-motion`.

## Required routes

Create:

- `/`
- `/menu`
- `/reservations`
- `/about`
- `/gallery`
- A useful not-found route

## Home page

Prominently display `Café Fausse`.

Show exactly:

- Address: `1234 Culinary Ave, Suite 100, Washington, DC 20002`
- Phone: `(202) 555-4567`
- Monday-Saturday: `5:00 PM-11:00 PM`
- Sunday: `5:00 PM-9:00 PM`

Include:

- Hero section
- Reserve a Table call to action
- Short introduction
- Featured menu items
- Awards or reviews preview
- Newsletter form
- Shared header and footer

## Menu page

Use a reusable data module and display these exact items.

### Starters

- Bruschetta — Fresh tomatoes, basil, olive oil, and toasted baguette slices — $8.50
- Caesar Salad — Crisp romaine with homemade Caesar dressing — $9.00

### Main Courses

- Grilled Salmon — Served with lemon butter sauce and seasonal vegetables — $22.00
- Ribeye Steak — 12 oz prime cut with garlic mashed potatoes — $28.00
- Vegetable Risotto — Creamy Arborio rice with wild mushrooms — $18.00

### Desserts

- Tiramisu — Classic Italian dessert with mascarpone — $7.50
- Cheesecake — Creamy cheesecake with berry compote — $7.00

### Beverages

- Red Wine (Glass) — A selection of Italian reds — $10.00
- White Wine (Glass) — Crisp and refreshing — $9.00
- Craft Beer — Local artisan brews — $6.00
- Espresso — Strong and aromatic — $3.00

## About page

Include this history accurately:

Café Fausse was founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez. It blends traditional Italian flavors with modern culinary innovation. Its mission is to provide an unforgettable dining experience that reflects quality and creativity.

Write polished, plausible biographies for both founders without contradicting the required history.

Include commitments to:

- Unforgettable dining
- Excellent food
- Locally sourced ingredients

## Gallery page

Display image cards representing:

- Interior ambiance
- Menu dishes
- Special events
- Behind-the-scenes activity

Implement an accessible lightbox that:

- Opens when an image is selected
- Enlarges the image
- Displays caption and category
- Has a visible close button
- Closes with Escape
- Closes by clicking the backdrop
- Does not close when clicking the image
- Maintains sensible focus behavior
- Prevents background scrolling while open

Use images in `frontend/src/assets/images` when present. If images are missing, create a documented manifest of expected filenames and elegant CSS fallback panels so there are no broken image icons. Do not automatically download copyrighted images.

Show these exact awards:

- Culinary Excellence Award — 2022
- Restaurant of the Year — 2023
- Best Fine Dining Experience — Foodie Magazine, 2023

Show these exact reviews:

- “Exceptional ambiance and unforgettable flavors.” — Gourmet Review
- “A must-visit restaurant for food enthusiasts.” — The Daily Bite

## Reservations page

Create a working form with:

- Date
- Timeslot
- Number of guests
- Customer name
- Required email
- Optional phone

Use these policies:

- Exactly 30 tables numbered 1 through 30
- 30-minute timeslots
- Monday-Saturday service: 5:00 PM-11:00 PM
- Sunday service: 5:00 PM-9:00 PM
- Last seating is 90 minutes before close:
  - Monday-Saturday: 9:30 PM
  - Sunday: 7:30 PM
- Party size: 1 to 12
- Reservation must be in the future
- Email normalized to lowercase
- Phone optional

The available-time dropdown must update when the date changes so Sunday uses the shorter schedule.

On submit:

- Validate client-side
- Disable submit while processing
- Display loading feedback
- Send the request to Flask
- Display confirmation with reservation ID, table number, date, and time
- Display friendly validation, availability, server, and network errors
- Never expose stack traces

## Newsletter form

Include:

- Customer name
- Email
- Consent checkbox

Behavior:

- Validate email client-side and server-side
- Require consent
- Disable while submitting
- Persist to PostgreSQL
- If customer email exists, update newsletter signup to true
- Otherwise create the customer
- Display friendly success or error feedback

## Database models

Create `Customer` with:

- `customer_id`: primary key
- `customer_name`: required
- `email_address`: required, unique, indexed, lowercase
- `phone_number`: nullable
- `newsletter_signup`: non-null boolean, default false
- `created_at`
- `updated_at`

Create `Reservation` with:

- `reservation_id`: primary key
- `customer_id`: required foreign key
- `time_slot`: required timestamp
- `table_number`: required integer
- `number_of_guests`: required integer
- `created_at`

Constraints:

- Unique customer email
- Table number between 1 and 30
- Number of guests between 1 and 12
- Unique `(time_slot, table_number)`
- Useful indexes for availability lookup

Use a consistent timezone policy and document it. A timezone-aware design is preferred if it remains understandable. If using local restaurant time, clearly document that Washington, DC local time is stored and handled consistently.

Generate and commit a migration.

## Reservation service logic

Implement the booking operation in a transaction:

1. Validate the payload.
2. Validate date, time, and operating hours.
3. Normalize email and optional phone.
4. Find or create the customer by email.
5. Query table numbers already booked for the exact timeslot.
6. Compute available tables from 1 through 30.
7. If none remain, return HTTP 409.
8. Randomly choose only from the available set.
9. Insert the reservation.
10. Commit and return confirmation.
11. Protect against simultaneous requests using the database unique constraint.
12. On collision, roll back and retry with a newly computed table a small bounded number of times.
13. If the slot becomes full, return the normal 409 response.
14. Never silently swallow database errors.

The SRS does not define table capacities. Store `number_of_guests`, but do not infer table sizes or combine tables.

## API endpoints

### `GET /api/health`

Return JSON health status and perform a lightweight database check.

### `POST /api/newsletter`

Example request:

```json
{
  "customer_name": "Jordan Lee",
  "email_address": "jordan@example.com",
  "newsletter_consent": true
}
```

Use:

- 200 when an existing customer is updated
- 201 when a new subscriber is created
- 400 for validation errors
- 500 for unexpected errors

### `GET /api/availability?time_slot=2026-07-25T19:00:00`

Example response:

```json
{
  "available": true,
  "tables_remaining": 17
}
```

Return 400 for invalid input.

### `POST /api/reservations`

Example request:

```json
{
  "customer_name": "Jordan Lee",
  "email_address": "jordan@example.com",
  "phone_number": "202-555-0199",
  "number_of_guests": 4,
  "time_slot": "2026-07-25T19:00:00"
}
```

Example success:

```json
{
  "message": "Your reservation has been confirmed.",
  "reservation_id": 42,
  "table_number": 16,
  "time_slot": "2026-07-25T19:00:00"
}
```

Use:

- 201 for success
- 400 for invalid input
- 409 for fully booked
- 500 for unexpected failures

## Project organization

Use this approximate structure:

```text
cafe-fausse/
├── CLAUDE.md
├── README.md
├── ai-tooling.md
├── staging.md
├── .gitignore
├── docker-compose.yml
├── docs/
│   ├── Cafe_Fausse_SRS.pdf
│   ├── SRS_TRACEABILITY.md
│   ├── TEST_PLAN.md
│   └── DEMO_SCRIPT.md
├── frontend/
│   ├── .env.example
│   └── src/
│       ├── assets/images/
│       ├── components/
│       ├── data/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
└── backend/
    ├── .env.example
    ├── requirements.txt
    ├── migrations/
    ├── scripts/
    ├── tests/
    ├── wsgi.py
    └── app/
        ├── __init__.py
        ├── config.py
        ├── extensions.py
        ├── models.py
        ├── errors.py
        ├── validation.py
        ├── api/
        └── services/
```

Adapt only when there is a clear reason.

## Configuration

Create `backend/.env.example`:

```env
FLASK_APP=wsgi.py
FLASK_DEBUG=1
DATABASE_URL=postgresql+psycopg://cafe_fausse:cafe_fausse@localhost:5432/cafe_fausse
FRONTEND_ORIGIN=http://localhost:5173
```

Create `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Ignore real `.env` files.

Create an optional `docker-compose.yml` that starts PostgreSQL for development, but do not require Docker when a local PostgreSQL server is available.

## Demo scripts

Create safe documented scripts or Flask CLI commands to:

- Seed normal demo data
- Fill one future timeslot with exactly 30 reservations
- Clear only seeded demo records

The full-slot script must make it easy to demonstrate rejection of the 31st reservation.

Document these presentation queries:

```sql
SELECT *
FROM customers
ORDER BY customer_id DESC
LIMIT 10;
```

```sql
SELECT *
FROM reservations
ORDER BY reservation_id DESC
LIMIT 10;
```

```sql
SELECT time_slot, COUNT(*) AS reservations
FROM reservations
GROUP BY time_slot
ORDER BY time_slot;
```

## Testing

Implement focused backend tests using a separate test database configuration or another safe PostgreSQL test setup.

At minimum test:

- Health endpoint
- Valid newsletter signup
- Invalid newsletter email
- Existing subscriber update without duplication
- Valid reservation
- Past reservation rejection
- Outside-hours rejection
- Invalid guest count
- Assigned table between 1 and 30
- No duplicate table at the same timeslot
- 31st booking rejected
- Same table can be reused at a different timeslot

For the frontend, run:

- Lint
- Production build
- Manual route and form checks

Do not claim automated browser coverage. Create a manual checklist for Chrome, Firefox, Safari, and Edge.

## Documentation

Create a thorough `README.md` containing:

- Overview
- Features
- Architecture
- Technology stack
- Prerequisites
- PostgreSQL setup
- Optional Docker setup
- Environment variables
- Migration commands
- Backend startup
- Frontend startup
- Test commands
- Seed commands
- Troubleshooting
- Demo workflow
- Group contribution section
- Known limitations
- Image licensing note

Create `ai-tooling.md` containing:

- Claude Code as an AI development tool
- Broad description of assistance provided
- Human review performed
- What worked well
- What did not work well
- Verification steps
- No false claims

Create `docs/SRS_TRACEABILITY.md` mapping every FR-1 through FR-18 and NFR-1 through NFR-9 to code files and demo evidence.

Create `docs/TEST_PLAN.md`.

Create `docs/DEMO_SCRIPT.md` for a 5-to-10-minute group presentation including:

- Identity introduction reminder
- All five pages
- Navigation
- Newsletter submission
- Direct PostgreSQL evidence
- Successful reservation
- Direct PostgreSQL evidence
- Fully booked rejection
- Implementation decisions
- AI tooling explanation

Create or update `CLAUDE.md` with persistent project rules, exact content, architecture, build commands, testing expectations, the PostgreSQL requirement, and the rule that no SRS requirement may be removed without explicit approval.

## Quality gates

Before declaring completion:

1. Install dependencies.
2. Run backend tests.
3. Run frontend lint.
4. Run frontend production build.
5. Run database migrations.
6. Start PostgreSQL, Flask, and React.
7. Test newsletter signup.
8. Test a successful reservation.
9. Seed a full timeslot.
10. Verify the 31st request returns 409.
11. Verify rows directly in PostgreSQL.
12. Check all five routes.
13. Check the lightbox.
14. Check mobile layout.
15. Audit FR-1 through FR-18.
16. Audit NFR-1 through NFR-9.
17. State any remaining limitation honestly.

## Final response format

When finished, provide:

- Files created or changed
- Commands to start PostgreSQL
- Commands to run migrations
- Commands to start Flask
- Commands to start React
- Commands to run tests and lint
- Demo seed instructions
- Any remaining environment-specific issue
- Requirement audit with pass/fail status
