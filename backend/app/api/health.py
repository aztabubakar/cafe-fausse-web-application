from flask import Blueprint, jsonify
from sqlalchemy import text

from app.extensions import db

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def get_health():
    try:
        db.session.execute(text("SELECT 1"))
        database_status = "connected"
    except Exception:
        database_status = "unreachable"

    return jsonify({"status": "ok", "database": database_status})
