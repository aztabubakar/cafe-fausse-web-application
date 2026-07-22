from flask import jsonify


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "Resource not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"message": "Method not allowed."}), 405

    @app.errorhandler(500)
    def internal_error(_error):
        return jsonify({"message": "An unexpected error occurred."}), 500
