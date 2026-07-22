import re
from datetime import datetime

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

# Monday-Saturday: 5:00 PM-11:00 PM service, last seating 9:30 PM.
# Sunday: 5:00 PM-9:00 PM service, last seating 7:30 PM.
OPENING_HOUR = 17
LAST_SEATING_WEEKDAY = (21, 30)
LAST_SEATING_SUNDAY = (19, 30)

MIN_GUESTS = 1
MAX_GUESTS = 12
MIN_TABLE = 1
MAX_TABLE = 30


class ValidationError(Exception):
    """Raised for any request validation failure. `details` maps field name
    to a user-facing message, matching the API's structured error shape."""

    def __init__(self, details):
        super().__init__("Validation failed.")
        self.details = details


class TimeslotFullError(Exception):
    """Raised when no table is available for the requested timeslot."""


def require_json_object(payload):
    if not isinstance(payload, dict):
        raise ValidationError({"_": "A JSON request body is required."})
    return payload


def validate_customer_name(value):
    if not isinstance(value, str) or not value.strip():
        raise ValidationError({"customer_name": "Please enter a name."})
    return value.strip()


def normalize_email(value):
    if not isinstance(value, str) or not value.strip():
        raise ValidationError({"email_address": "Please enter an email address."})
    normalized = value.strip().lower()
    if not EMAIL_PATTERN.match(normalized):
        raise ValidationError({"email_address": "Enter a valid email address."})
    return normalized


def normalize_phone(value):
    if value is None:
        return None
    if not isinstance(value, str):
        raise ValidationError({"phone_number": "Enter a valid phone number."})
    stripped = value.strip()
    return stripped or None


def validate_guest_count(value):
    try:
        guests = int(value)
    except (TypeError, ValueError):
        raise ValidationError({"number_of_guests": "Number of guests must be a whole number."})
    if guests < MIN_GUESTS or guests > MAX_GUESTS:
        raise ValidationError(
            {"number_of_guests": f"Number of guests must be between {MIN_GUESTS} and {MAX_GUESTS}."}
        )
    return guests


def validate_newsletter_consent(value):
    if value is not True:
        raise ValidationError({"newsletter_consent": "Please confirm you would like to subscribe."})
    return True


def parse_time_slot(value):
    """Parse the ISO local datetime text the frontend sends (no timezone
    suffix — see README "Timezone policy"). Timezone-aware strings are
    rejected outright rather than silently converted, so local and UTC
    values are never mixed."""
    if not isinstance(value, str) or not value.strip():
        raise ValidationError({"time_slot": "Please choose a reservation date and time."})
    try:
        parsed = datetime.fromisoformat(value.strip())
    except ValueError:
        raise ValidationError({"time_slot": "Enter a valid date and time."})
    if parsed.tzinfo is not None:
        raise ValidationError({"time_slot": "Time must not include timezone information."})
    return parsed


def validate_time_slot_business_rules(parsed, *, reference_now=None):
    """Enforce future-dated, 30-minute-boundary, and operating-hours rules.
    `reference_now` is injectable for tests; defaults to the server clock."""
    reference_now = reference_now or datetime.now()

    if parsed <= reference_now:
        raise ValidationError({"time_slot": "Please choose a time in the future."})

    if parsed.second != 0 or parsed.microsecond != 0 or parsed.minute not in (0, 30):
        raise ValidationError({"time_slot": "Reservations are available in 30-minute increments."})

    is_sunday = parsed.weekday() == 6  # Monday=0 ... Sunday=6
    last_hour, last_minute = LAST_SEATING_SUNDAY if is_sunday else LAST_SEATING_WEEKDAY
    earliest = parsed.replace(hour=OPENING_HOUR, minute=0, second=0, microsecond=0)
    latest = parsed.replace(hour=last_hour, minute=last_minute, second=0, microsecond=0)

    if parsed < earliest or parsed > latest:
        day_label = "Sunday" if is_sunday else "Monday-Saturday"
        raise ValidationError(
            {
                "time_slot": (
                    f"{day_label} reservations are available between "
                    f"{earliest.strftime('%-I:%M %p')} and {latest.strftime('%-I:%M %p')}."
                )
            }
        )

    return parsed
