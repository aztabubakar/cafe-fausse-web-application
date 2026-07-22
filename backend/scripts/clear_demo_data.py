"""Delete only the records created by seed_demo_data.py and
seed_full_timeslot.py, identified by the "@demo.cafefausse.test" email
domain. Never deletes normal customer- or reservation-created data.

Usage (from backend/, with the virtualenv active):
    python scripts/clear_demo_data.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models import Customer, Reservation  # noqa: E402

DEMO_EMAIL_SUFFIX = "@demo.cafefausse.test"


def run():
    app = create_app()
    with app.app_context():
        demo_customers = (
            db.session.query(Customer)
            .filter(Customer.email_address.like(f"%{DEMO_EMAIL_SUFFIX}"))
            .all()
        )

        if not demo_customers:
            print(f"No demo data found (no customers matching '%{DEMO_EMAIL_SUFFIX}').")
            return

        customer_ids = [customer.customer_id for customer in demo_customers]
        print(f"Removing {len(demo_customers)} demo customer(s) and their reservations:")
        for customer in demo_customers:
            print(f"  - {customer.email_address} (id={customer.customer_id})")

        deleted_reservations = (
            db.session.query(Reservation)
            .filter(Reservation.customer_id.in_(customer_ids))
            .delete(synchronize_session=False)
        )
        deleted_customers = (
            db.session.query(Customer)
            .filter(Customer.customer_id.in_(customer_ids))
            .delete(synchronize_session=False)
        )
        db.session.commit()
        print(f"Deleted {deleted_reservations} reservation(s) and {deleted_customers} customer(s).")


if __name__ == "__main__":
    run()
