from flask import Flask

from app.api import health_bp, newsletter_bp, reservations_bp
from app.config import get_config
from app.errors import register_error_handlers
from app.extensions import cors, db, migrate


def create_app(config_class=None):
    app = Flask(__name__)
    app.config.from_object(config_class or get_config())

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(newsletter_bp, url_prefix="/api")
    app.register_blueprint(reservations_bp, url_prefix="/api")
    register_error_handlers(app)

    # Ensure models are registered with SQLAlchemy's metadata for Flask-Migrate.
    from app import models  # noqa: F401,E402

    return app
