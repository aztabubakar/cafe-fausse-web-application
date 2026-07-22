from flask import current_app, jsonify

from app.validation import TimeslotFullError, ValidationError


def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return jsonify({"error": "Validation failed.", "details": error.details}), 400

    @app.errorhandler(TimeslotFullError)
    def handle_timeslot_full(_error):
        return (
            jsonify({"error": "This time slot is fully booked. Please choose another time."}),
            409,
        )

    @app.errorhandler(400)
    def bad_request(_error):
        return jsonify({"error": "The request could not be understood."}), 400

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Resource not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"error": "Method not allowed."}), 405

    @app.errorhandler(409)
    def conflict(_error):
        return jsonify({"error": "This request could not be completed. Please try again."}), 409

    @app.errorhandler(503)
    def service_unavailable(_error):
        return jsonify({"error": "Service temporarily unavailable. Please try again shortly."}), 503

    @app.errorhandler(500)
    def internal_error(error):
        current_app.logger.exception("Unhandled server error: %s", error)
        return jsonify({"error": "An unexpected error occurred. Please try again."}), 500
