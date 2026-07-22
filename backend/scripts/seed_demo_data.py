"""Seed a small set of clearly-identified demo customers and reservations.

Safe to run repeatedly: existing demo customers/reservations are reused
rather than duplicated. Demo customers use the
"@demo.cafefausse.test" email domain so clear_demo_data.py can remove
exactly these rows and nothing else.

Usage (from backend/, with the virtualenv active):
    python scripts/seed_demo_data.py
"""
import os
import sys
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models import Customer, Reservation  # noqa: E402

DEMO_EMAIL_DOMAIN = "demo.cafefausse.test"

# 6:00 PM / 6:30 PM fall inside both the Monday-Saturday and Sunday service
# windows, so these stay valid regardless of which weekday "days_ahead" lands
# on when the script is run.
DEMO_CUSTOMERS = [
    {
        "name": "Demo Customer One",
        "email": f"demo.customer.one@{DEMO_EMAIL_DOMAIN}",
        "phone": "202-555-0101",
        "guests": 2,
        "days_ahead": 3,
        "hour": 18,
        "minute": 0,
    },
    {
        "name": "Demo Customer Two",
        "email": f"demo.customer.two@{DEMO_EMAIL_DOMAIN}",
        "phone": "202-555-0102",
        "guests": 4,
        "days_ahead": 4,
        "hour": 19,
        "minute": 0,
    },
    {
        "name": "Demo Customer Three",
        "email": f"demo.customer.three@{DEMO_EMAIL_DOMAIN}",
        "phone": "",
        "guests": 6,
        "days_ahead": 5,
        "hour": 18,
        "minute": 30,
    },
]


def run():
    app = create_app()
    with app.app_context():
        created_customers = 0
        created_reservations = 0

        for entry in DEMO_CUSTOMERS:
            customer = db.session.query(Customer).filter_by(email_address=entry["email"]).one_or_none()
            if customer is None:
                customer = Customer(
                    customer_name=entry["name"],
                    email_address=entry["email"],
                    phone_number=entry["phone"] or None,
                    newsletter_signup=False,
                )
                db.session.add(customer)
                db.session.flush()
                created_customers += 1
                print(f"Created demo customer: {customer.email_address} (id={customer.customer_id})")
            else:
                print(f"Demo customer already exists: {customer.email_address} (id={customer.customer_id})")

            time_slot = (datetime.now() + timedelta(days=entry["days_ahead"])).replace(
                hour=entry["hour"], minute=entry["minute"], second=0, microsecond=0
            )

            existing_reservation = (
                db.session.query(Reservation)
                .filter_by(customer_id=customer.customer_id, time_slot=time_slot)
                .one_or_none()
            )
            if existing_reservation is None:
                occupied = {
                    row[0]
                    for row in db.session.query(Reservation.table_number)
                    .filter(Reservation.time_slot == time_slot)
                    .all()
                }
                table_number = next(table for table in range(1, 31) if table not in occupied)
                reservation = Reservation(
                    customer_id=customer.customer_id,
                    time_slot=time_slot,
                    table_number=table_number,
                    number_of_guests=entry["guests"],
                )
                db.session.add(reservation)
                db.session.flush()
                created_reservations += 1
                print(
                    f"Created demo reservation: table {table_number} at {time_slot.isoformat()} "
                    f"for {customer.customer_name}"
                )
            else:
                print(
                    f"Demo reservation already exists for {customer.customer_name} at "
                    f"{time_slot.isoformat()} (table {existing_reservation.table_number})"
                )

        db.session.commit()
        print(f"\nDone. Created {created_customers} customer(s) and {created_reservations} reservation(s).")


if __name__ == "__main__":
    run()
