import random

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Reservation
from app.services.customers import find_or_create_customer
from app.validation import (
    MAX_TABLE,
    MIN_TABLE,
    TimeslotFullError,
    normalize_email,
    normalize_phone,
    parse_time_slot,
    validate_customer_name,
    validate_guest_count,
    validate_time_slot_business_rules,
)

MAX_ASSIGNMENT_ATTEMPTS = 3


def get_occupied_tables(session, time_slot):
    rows = session.query(Reservation.table_number).filter(Reservation.time_slot == time_slot).all()
    return {row[0] for row in rows}


def get_available_tables(session, time_slot):
    occupied = get_occupied_tables(session, time_slot)
    return [table for table in range(MIN_TABLE, MAX_TABLE + 1) if table not in occupied]


def get_availability(time_slot_text):
    """Used by GET /api/availability. Applies the same business-hour and
    future-dated rules as reservation creation."""
    parsed = validate_time_slot_business_rules(parse_time_slot(time_slot_text))
    available_tables = get_available_tables(db.session, parsed)
    return {
        "available": len(available_tables) > 0,
        "tables_remaining": len(available_tables),
        "time_slot": parsed.isoformat(),
    }


def create_reservation(payload):
    """Validate and persist a reservation inside a bounded-retry transaction.
    Returns (reservation, customer). Raises ValidationError or
    TimeslotFullError; any other exception is an unexpected failure and is
    left to propagate to the generic 500 handler."""
    name = validate_customer_name(payload.get("customer_name"))
    email = normalize_email(payload.get("email_address"))
    phone = normalize_phone(payload.get("phone_number"))
    guests = validate_guest_count(payload.get("number_of_guests"))
    time_slot = validate_time_slot_business_rules(parse_time_slot(payload.get("time_slot")))

    last_error = None
    for _attempt in range(MAX_ASSIGNMENT_ATTEMPTS):
        # Re-fetch/recreate the customer at the top of every attempt: a
        # failed commit below rolls back the whole transaction, including
        # any customer row inserted in a prior attempt.
        customer, _ = find_or_create_customer(
            db.session,
            name=name,
            email=email,
            phone=phone,
            newsletter_signup_for_new=False,
            force_newsletter_true=False,
        )
        db.session.flush()

        available_tables = get_available_tables(db.session, time_slot)
        if not available_tables:
            db.session.rollback()
            raise TimeslotFullError()

        table_number = random.choice(available_tables)
        reservation = Reservation(
            customer_id=customer.customer_id,
            time_slot=time_slot,
            table_number=table_number,
            number_of_guests=guests,
        )
        db.session.add(reservation)

        try:
            db.session.commit()
            return reservation, customer
        except IntegrityError as error:
            # Simultaneous request took the same table first; roll back and
            # retry with a freshly computed set of available tables.
            db.session.rollback()
            last_error = error
            continue

    raise TimeslotFullError() from last_error
