# Demo Script

A 5-10 minute walkthrough covering navigation, the newsletter signup, a successful
reservation, and the fully-booked rejection — each backed by a direct PostgreSQL query so
the effect on the database is visible, not just the on-screen message.

## Setup (before recording)

```bash
# Terminal 1
sudo service postgresql start   # or: docker compose up -d
cd backend && source .venv/bin/activate
flask db upgrade                # if not already applied
flask run

# Terminal 2
cd frontend && npm run dev

# Terminal 3 — psql, kept open throughout the demo
psql -h localhost -U cafe_fausse -d cafe_fausse
```

Optional: run `python backend/scripts/clear_demo_data.py` first for a clean starting
point, since all demo rows are tagged with the `@demo.cafefausse.test` domain and safe to
remove without affecting anything else.

## 1. Identity introduction

State your name to camera per the assignment's identity-verification requirement before
continuing.

## 2. Tour the five pages

Navigate Home → Menu → Reservations → About Us → Gallery via the header nav. Call out:
the Reserve a Table CTA, the exact SRS menu content and prices, the founder bios, and the
gallery's category filters + lightbox (open an image, use arrow keys, close with Escape).

## 3. Newsletter signup

On the Home page, fill in the newsletter form (name, email, consent checkbox) and submit.
Point out the real success message rendered only after the API responds.

In the `psql` terminal:

```sql
SELECT customer_id, customer_name, email_address, newsletter_signup, created_at
FROM customers
ORDER BY customer_id DESC
LIMIT 3;
```

Show the new row with `newsletter_signup = t`.

## 4. Successful reservation

On the Reservations page, pick a future date, a timeslot, party size, name, and email.
Point out the availability check ("Tables available (N remaining)") that runs before
submission. Submit, and show the confirmation panel: reservation ID, assigned table,
date, time, and guest count.

In `psql`:

```sql
SELECT reservation_id, customer_id, table_number, number_of_guests, time_slot
FROM reservations
ORDER BY reservation_id DESC
LIMIT 3;
```

Show the new row, and note the table number matches what the UI displayed.

## 5. Fully-booked rejection

In a terminal, run:

```bash
cd backend && source .venv/bin/activate
python scripts/seed_full_timeslot.py
```

This prints the exact timeslot it just filled to 30/30. In the Reservations page, select
that same date/time and show the availability status change to "This time is fully
booked" with the submit button disabled — then, to demonstrate the server is the real
authority (not just the frontend), attempt the same request from a terminal:

```bash
curl -s -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Overflow Guest","email_address":"overflow@example.com","number_of_guests":2,"time_slot":"<the printed timeslot>"}'
```

Show the HTTP 409 and the friendly `"This time slot is fully booked. Please choose
another time."` message.

## 6. Database integrity check

In `psql`, run the query that must always return zero rows:

```sql
SELECT time_slot, table_number, COUNT(*)
FROM reservations
GROUP BY time_slot, table_number
HAVING COUNT(*) > 1;
```

Show the empty result — proof no table was ever double-booked.

## 7. Implementation decisions to mention

- PostgreSQL is mandatory throughout; no SQLite anywhere.
- Reservation times are naive local Washington, DC time end to end — no timezone
  conversion (see README "Timezone policy").
- Table assignment is random among currently open tables, with a bounded (3-attempt)
  retry on a simultaneous-booking collision at the database's unique-constraint level.
- Newsletter signup is one-directional: a reservation never resets `newsletter_signup`
  from `true` back to `false`.

## 8. AI tooling explanation

Summarize `ai-tooling.md`: Claude Code was used across all phases, working from precise
specifications, with every claim in this project backed by an actually-executed check
(migration applied, pytest run, curl'd endpoint, direct SQL query, or a live browser
session) rather than an assumption that the code "should work."

## Cleanup (after recording, optional)

```bash
python scripts/clear_demo_data.py
```
