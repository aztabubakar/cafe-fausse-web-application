from app import create_app
from app.config import TestingConfig


def test_health_returns_ok_when_database_connected(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


def test_health_returns_503_when_database_unavailable():
    class BrokenConfig(TestingConfig):
        SQLALCHEMY_DATABASE_URI = "postgresql+psycopg://cafe_fausse:wrong@localhost:5432/does_not_exist"

    broken_app = create_app(BrokenConfig)
    with broken_app.app_context():
        response = broken_app.test_client().get("/api/health")

    assert response.status_code == 503
    data = response.get_json()
    assert data["status"] == "error"
    assert data["database"] == "unreachable"
