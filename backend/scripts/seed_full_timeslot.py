"""Fill one future timeslot with 30 reservations (tables 1-30) so the 31st
booking attempt can be demonstrated returning HTTP 409.

Safe to run repeatedly: any tables already booked for the target timeslot
are left alone and only the remaining open tables are filled. Demo
customers use the "@demo.cafefausse.test" email domain so
clear_demo_data.py can remove exactly these rows.

Usage (from backend/, with the virtualenv active):
    python scripts/seed_full_timeslot.py
"""
import os
import sys
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models import Customer, Reservation  # noqa: E402

DEMO_EMAIL_DOMAIN = "demo.cafefausse.test"

# 14 days out at 6:00 PM: comfortably in the future, and 6:00 PM falls
# inside both the Monday-Saturday and Sunday service windows no matter which
# weekday this lands on.
DAYS_AHEAD = 14
HOUR = 18
MINUTE = 0


def get_target_time_slot():
    return (datetime.now() + timedelta(days=DAYS_AHEAD)).replace(
        hour=HOUR, minute=MINUTE, second=0, microsecond=0
    )


def run():
    app = create_app()
    with app.app_context():
        time_slot = get_target_time_slot()
        print(f"Target full timeslot: {time_slot.isoformat()}")

        occupied = {
            row[0]
            for row in db.session.query(Reservation.table_number)
            .filter(Reservation.time_slot == time_slot)
            .all()
        }
        tables_to_fill = [table for table in range(1, 31) if table not in occupied]

        if not tables_to_fill:
            print("This timeslot is already fully booked (30/30 tables).")
            return

        created = 0
        for table_number in tables_to_fill:
            email = f"demo.fullslot.{table_number:02d}@{DEMO_EMAIL_DOMAIN}"
            customer = db.session.query(Customer).filter_by(email_address=email).one_or_none()
            if customer is None:
                customer = Customer(
                    customer_name=f"Demo Full-Slot Party {table_number:02d}",
                    email_address=email,
                    phone_number=None,
                    newsletter_signup=False,
                )
                db.session.add(customer)
                db.session.flush()

            reservation = Reservation(
                customer_id=customer.customer_id,
                time_slot=time_slot,
                table_number=table_number,
                number_of_guests=2,
            )
            db.session.add(reservation)
            created += 1

        db.session.commit()
        print(f"Filled {created} table(s). Timeslot {time_slot.isoformat()} is now 30/30 booked.")
        print("A 31st reservation request at this exact timeslot should now return HTTP 409.")


if __name__ == "__main__":
    run()
