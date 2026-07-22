from flask import Blueprint, jsonify, request

from app.services.newsletter import subscribe

newsletter_bp = Blueprint("newsletter", __name__)


@newsletter_bp.post("/newsletter")
def post_newsletter():
    payload = request.get_json(silent=True) or {}
    customer, created = subscribe(payload)

    if created:
        return (
            jsonify(
                {
                    "message": "Thank you for subscribing to the Café Fausse newsletter.",
                    "customer_id": customer.customer_id,
                    "status": "created",
                }
            ),
            201,
        )

    return (
        jsonify(
            {
                "message": "Your newsletter subscription has been updated.",
                "customer_id": customer.customer_id,
                "status": "updated",
            }
        ),
        200,
    )
