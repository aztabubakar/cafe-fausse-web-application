from datetime import datetime, timedelta

import pytest
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Customer, Reservation
from conftest import get_future_datetime, get_next_weekday_datetime, iso


def test_valid_reservation_returns_201(client, make_reservation_payload):
    response = client.post("/api/reservations", json=make_reservation_payload())

    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Your reservation has been confirmed."
    assert 1 <= data["table_number"] <= 30


def test_customer_record_is_created(client, make_reservation_payload):
    response = client.post(
        "/api/reservations", json=make_reservation_payload(email_address="new.guest@example.com")
    )

    assert response.status_code == 201
    customer = db.session.query(Customer).filter_by(email_address="new.guest@example.com").one_or_none()
    assert customer is not None
    assert customer.newsletter_signup is False


def test_existing_customer_is_reused(client, make_reservation_payload):
    email = "repeat.guest@example.com"
    client.post(
        "/api/reservations",
        json=make_reservation_payload(email_address=email, time_slot=iso(get_future_datetime(days_ahead=3))),
    )
    client.post(
        "/api/reservations",
        json=make_reservation_payload(email_address=email, time_slot=iso(get_future_datetime(days_ahead=4))),
    )

    assert db.session.query(Customer).filter_by(email_address=email).count() == 1


def test_past_reservation_is_rejected(client, make_reservation_payload):
    past = datetime.now() - timedelta(days=1)
    response = client.post("/api/reservations", json=make_reservation_payload(time_slot=iso(past)))

    assert response.status_code == 400
    assert "time_slot" in response.get_json()["details"]


def test_invalid_date_is_rejected(client, make_reservation_payload):
    response = client.post("/api/reservations", json=make_reservation_payload(time_slot="not-a-date"))

    assert response.status_code == 400
    assert "time_slot" in response.get_json()["details"]


def test_invalid_email_is_rejected(client, make_reservation_payload):
    response = client.post("/api/reservations", json=make_reservation_payload(email_address="nope"))

    assert response.status_code == 400
    assert "email_address" in response.get_json()["details"]


def test_guest_count_below_minimum_is_rejected(client, make_reservation_payload):
    response = client.post("/api/reservations", json=make_reservation_payload(number_of_guests=0))

    assert response.status_code == 400
    assert "number_of_guests" in response.get_json()["details"]


def test_guest_count_above_maximum_is_rejected(client, make_reservation_payload):
    response = client.post("/api/reservations", json=make_reservation_payload(number_of_guests=13))

    assert response.status_code == 400
    assert "number_of_guests" in response.get_json()["details"]


def test_outside_hours_reservation_is_rejected(client, make_reservation_payload):
    # Wednesday 4:00 PM is before the 5:00 PM opening.
    too_early = get_next_weekday_datetime(2, hour=16, minute=0)
    response = client.post("/api/reservations", json=make_reservation_payload(time_slot=iso(too_early)))

    assert response.status_code == 400
    assert "time_slot" in response.get_json()["details"]


def test_invalid_30_minute_interval_is_rejected(client, make_reservation_payload):
    off_interval = get_next_weekday_datetime(2, hour=18, minute=15)
    response = client.post("/api/reservations", json=make_reservation_payload(time_slot=iso(off_interval)))

    assert response.status_code == 400
    assert "time_slot" in response.get_json()["details"]


def test_sunday_late_reservation_is_rejected(client, make_reservation_payload):
    # Sunday last seating is 7:30 PM; 8:00 PM must be rejected.
    sunday_late = get_next_weekday_datetime(6, hour=20, minute=0)
    response = client.post("/api/reservations", json=make_reservation_payload(time_slot=iso(sunday_late)))

    assert response.status_code == 400
    assert "time_slot" in response.get_json()["details"]


def test_different_available_tables_assigned_at_same_timeslot(client, make_reservation_payload):
    time_slot = iso(get_future_datetime(days_ahead=5))
    assigned_tables = set()
    for index in range(5):
        response = client.post(
            "/api/reservations",
            json=make_reservation_payload(email_address=f"party{index}@example.com", time_slot=time_slot),
        )
        assert response.status_code == 201
        assigned_tables.add(response.get_json()["table_number"])

    assert len(assigned_tables) == 5


def test_same_table_cannot_be_duplicated_at_same_timeslot():
    time_slot = get_future_datetime(days_ahead=8)
    customer_a = Customer(customer_name="A", email_address="dup.a@example.com", newsletter_signup=False)
    customer_b = Customer(customer_name="B", email_address="dup.b@example.com", newsletter_signup=False)
    db.session.add_all([customer_a, customer_b])
    db.session.flush()

    db.session.add(
        Reservation(customer_id=customer_a.customer_id, time_slot=time_slot, table_number=3, number_of_guests=2)
    )
    db.session.commit()

    db.session.add(
        Reservation(customer_id=customer_b.customer_id, time_slot=time_slot, table_number=3, number_of_guests=2)
    )
    with pytest.raises(IntegrityError):
        db.session.commit()
    db.session.rollback()


def test_table_can_be_reused_at_different_timeslot():
    time_slot_a = get_future_datetime(days_ahead=6)
    time_slot_b = get_future_datetime(days_ahead=7)
    customer_a = Customer(customer_name="A", email_address="reuse.a@example.com", newsletter_signup=False)
    customer_b = Customer(customer_name="B", email_address="reuse.b@example.com", newsletter_signup=False)
    db.session.add_all([customer_a, customer_b])
    db.session.flush()

    db.session.add(
        Reservation(customer_id=customer_a.customer_id, time_slot=time_slot_a, table_number=7, number_of_guests=2)
    )
    db.session.add(
        Reservation(customer_id=customer_b.customer_id, time_slot=time_slot_b, table_number=7, number_of_guests=2)
    )
    db.session.commit()  # must not raise: same table, different timeslot

    assert db.session.query(Reservation).filter_by(table_number=7).count() == 2


def test_31st_reservation_returns_409_and_no_duplicate_tables(client, make_reservation_payload):
    time_slot = iso(get_future_datetime(days_ahead=9))
    for index in range(30):
        response = client.post(
            "/api/reservations",
            json=make_reservation_payload(email_address=f"full{index}@example.com", time_slot=time_slot),
        )
        assert response.status_code == 201

    response_31 = client.post(
        "/api/reservations",
        json=make_reservation_payload(email_address="party31@example.com", time_slot=time_slot),
    )

    assert response_31.status_code == 409
    assert "error" in response_31.get_json()

    duplicates = (
        db.session.query(Reservation.time_slot, Reservation.table_number, func.count())
        .group_by(Reservation.time_slot, Reservation.table_number)
        .having(func.count() > 1)
        .all()
    )
    assert duplicates == []


def test_full_slot_availability_returns_false(client, make_reservation_payload):
    time_slot = iso(get_future_datetime(days_ahead=9))
    for index in range(30):
        client.post(
            "/api/reservations",
            json=make_reservation_payload(email_address=f"fullb{index}@example.com", time_slot=time_slot),
        )

    response = client.get(f"/api/availability?time_slot={time_slot}")

    assert response.status_code == 200
    data = response.get_json()
    assert data["available"] is False
    assert data["tables_remaining"] == 0


def test_available_slot_returns_correct_tables_remaining(client, make_reservation_payload):
    time_slot = iso(get_future_datetime(days_ahead=10))
    for index in range(5):
        client.post(
            "/api/reservations",
            json=make_reservation_payload(email_address=f"partial{index}@example.com", time_slot=time_slot),
        )

    response = client.get(f"/api/availability?time_slot={time_slot}")

    assert response.status_code == 200
    data = response.get_json()
    assert data["available"] is True
    assert data["tables_remaining"] == 25


def test_availability_invalid_time_slot_returns_400(client):
    response = client.get("/api/availability?time_slot=not-a-date")

    assert response.status_code == 400
