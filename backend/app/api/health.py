from flask import Blueprint, jsonify
from sqlalchemy import text

from app.extensions import db

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def get_health():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"status": "ok", "database": "connected"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"status": "error", "database": "unreachable"}), 503
