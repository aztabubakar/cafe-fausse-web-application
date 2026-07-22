from datetime import datetime, timedelta

import pytest
from sqlalchemy import text

from app import create_app
from app.config import TestingConfig
from app.extensions import db as _db


def get_future_datetime(days_ahead=3, hour=18, minute=0):
    """6:00 PM (the default) falls inside both the Monday-Saturday and
    Sunday service windows, so this is valid regardless of which weekday
    `days_ahead` lands on."""
    return (datetime.now() + timedelta(days=days_ahead)).replace(
        hour=hour, minute=minute, second=0, microsecond=0
    )


def get_next_weekday_datetime(target_weekday, hour=18, minute=0, search_days=14):
    """Next date matching `target_weekday` (Monday=0 ... Sunday=6)."""
    now = datetime.now()
    for offset in range(1, search_days):
        candidate = now + timedelta(days=offset)
        if candidate.weekday() == target_weekday:
            return candidate.replace(hour=hour, minute=minute, second=0, microsecond=0)
    raise ValueError("No matching weekday found in range")


def iso(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%S")


@pytest.fixture(scope="session")
def app():
    application = create_app(TestingConfig)
    ctx = application.app_context()
    ctx.push()
    yield application
    ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture(autouse=True)
def clean_database(app):
    yield
    _db.session.rollback()
    _db.session.execute(text("TRUNCATE TABLE reservations, customers RESTART IDENTITY CASCADE"))
    _db.session.commit()
    # Truncating resets the ID sequence, so without clearing the identity
    # map a later test's freshly-created row can collide in memory with a
    # stale cached object from an earlier test that reused the same id.
    _db.session.remove()


@pytest.fixture
def make_reservation_payload():
    def _make(**overrides):
        time_slot = overrides.pop("time_slot", None) or iso(get_future_datetime())
        payload = {
            "customer_name": "Test Customer",
            "email_address": "test.customer@example.com",
            "phone_number": "",
            "number_of_guests": 2,
            "time_slot": time_slot,
        }
        payload.update(overrides)
        return payload

    return _make
