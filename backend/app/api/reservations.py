from flask import Blueprint, jsonify, request

from app.services.reservations import create_reservation, get_availability

reservations_bp = Blueprint("reservations", __name__)


@reservations_bp.get("/availability")
def get_availability_route():
    time_slot = request.args.get("time_slot", "")
    result = get_availability(time_slot)
    return jsonify(result), 200


@reservations_bp.post("/reservations")
def post_reservation():
    payload = request.get_json(silent=True) or {}
    reservation, customer = create_reservation(payload)

    return (
        jsonify(
            {
                "message": "Your reservation has been confirmed.",
                "reservation_id": reservation.reservation_id,
                "customer_id": customer.customer_id,
                "table_number": reservation.table_number,
                "number_of_guests": reservation.number_of_guests,
                "time_slot": reservation.time_slot.isoformat(),
            }
        ),
        201,
    )
