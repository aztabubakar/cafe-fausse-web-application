from app.models import Customer


def find_or_create_customer(session, *, name, email, phone, newsletter_signup_for_new, force_newsletter_true):
    """Find a customer by normalized email, or create one. Encodes the
    shared business rules for both the newsletter and reservation flows:
    the name is kept current, a blank incoming phone never overwrites an
    existing phone, and newsletter_signup is only ever forced to True
    (never reset to False) once already true."""
    customer = session.query(Customer).filter_by(email_address=email).one_or_none()

    if customer is None:
        customer = Customer(
            customer_name=name,
            email_address=email,
            phone_number=phone,
            newsletter_signup=newsletter_signup_for_new,
        )
        session.add(customer)
        return customer, True

    customer.customer_name = name
    if phone:
        customer.phone_number = phone
    if force_newsletter_true:
        customer.newsletter_signup = True

    return customer, False
