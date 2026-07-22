from app.extensions import db
from app.services.customers import find_or_create_customer
from app.validation import (
    normalize_email,
    normalize_phone,
    validate_customer_name,
    validate_newsletter_consent,
)


def subscribe(payload):
    """Validate and persist a newsletter signup. Returns (customer, created)."""
    name = validate_customer_name(payload.get("customer_name"))
    email = normalize_email(payload.get("email_address"))
    phone = normalize_phone(payload.get("phone_number"))
    validate_newsletter_consent(payload.get("newsletter_consent"))

    customer, created = find_or_create_customer(
        db.session,
        name=name,
        email=email,
        phone=phone,
        newsletter_signup_for_new=True,
        force_newsletter_true=True,
    )
    db.session.commit()
    return customer, created
