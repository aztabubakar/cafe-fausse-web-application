from app.extensions import db
from app.models import Customer


def newsletter_payload(**overrides):
    payload = {
        "customer_name": "Jordan Lee",
        "email_address": "Jordan.Lee@Example.com",
        "phone_number": "",
        "newsletter_consent": True,
    }
    payload.update(overrides)
    return payload


def test_new_subscriber_returns_201(client):
    response = client.post("/api/newsletter", json=newsletter_payload())

    assert response.status_code == 201
    data = response.get_json()
    assert data["status"] == "created"

    customer = db.session.get(Customer, data["customer_id"])
    assert customer is not None
    assert customer.newsletter_signup is True


def test_existing_subscriber_returns_200(client):
    client.post("/api/newsletter", json=newsletter_payload())
    response = client.post("/api/newsletter", json=newsletter_payload(customer_name="Jordan L."))

    assert response.status_code == 200
    assert response.get_json()["status"] == "updated"


def test_email_normalized_to_lowercase(client):
    client.post("/api/newsletter", json=newsletter_payload(email_address="  Jordan.LEE@EXAMPLE.com  "))

    customer = db.session.query(Customer).filter_by(email_address="jordan.lee@example.com").one_or_none()
    assert customer is not None


def test_duplicate_customer_is_not_created(client):
    client.post("/api/newsletter", json=newsletter_payload())
    client.post("/api/newsletter", json=newsletter_payload(customer_name="Jordan L."))

    count = db.session.query(Customer).filter_by(email_address="jordan.lee@example.com").count()
    assert count == 1


def test_invalid_email_returns_400(client):
    response = client.post("/api/newsletter", json=newsletter_payload(email_address="not-an-email"))

    assert response.status_code == 400
    assert "email_address" in response.get_json()["details"]


def test_blank_name_returns_400(client):
    response = client.post("/api/newsletter", json=newsletter_payload(customer_name="   "))

    assert response.status_code == 400
    assert "customer_name" in response.get_json()["details"]


def test_missing_consent_returns_400(client):
    response = client.post("/api/newsletter", json=newsletter_payload(newsletter_consent=False))

    assert response.status_code == 400
    assert "newsletter_consent" in response.get_json()["details"]


def test_existing_reservation_customer_can_later_subscribe(client, make_reservation_payload):
    email = "taylor@example.com"
    reservation_response = client.post(
        "/api/reservations", json=make_reservation_payload(email_address=email)
    )
    assert reservation_response.status_code == 201

    customer = db.session.query(Customer).filter_by(email_address=email).one()
    assert customer.newsletter_signup is False

    response = client.post(
        "/api/newsletter", json=newsletter_payload(email_address=email, customer_name="Taylor")
    )

    assert response.status_code == 200
    db.session.refresh(customer)
    assert customer.newsletter_signup is True


def test_newsletter_status_remains_true_after_later_reservation(client, make_reservation_payload):
    email = "morgan@example.com"
    client.post("/api/newsletter", json=newsletter_payload(email_address=email))

    customer = db.session.query(Customer).filter_by(email_address=email).one()
    assert customer.newsletter_signup is True

    response = client.post(
        "/api/reservations", json=make_reservation_payload(email_address=email)
    )

    assert response.status_code == 201
    db.session.refresh(customer)
    assert customer.newsletter_signup is True
