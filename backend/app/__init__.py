from flask import Flask

from app.api import health_bp
from app.config import Config
from app.errors import register_error_handlers
from app.extensions import cors, db, migrate


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})

    app.register_blueprint(health_bp, url_prefix="/api")
    register_error_handlers(app)

    return app
