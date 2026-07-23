import os


def _normalize_database_url(url):
    """Rewrite the scheme managed Postgres hosts hand out (postgres:// or
    plain postgresql://) to the psycopg3 driver URL SQLAlchemy needs here."""
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = "postgresql+psycopg://" + url[len("postgresql://"):]
    return url


class Config:
    SQLALCHEMY_DATABASE_URI = _normalize_database_url(
        os.environ.get(
            "DATABASE_URL",
            "postgresql+psycopg://cafe_fausse:cafe_fausse@localhost:5432/cafe_fausse",
        )
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
    TESTING = False
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "TEST_DATABASE_URL",
        "postgresql+psycopg://cafe_fausse:cafe_fausse@localhost:5432/cafe_fausse_test",
    )


class ProductionConfig(Config):
    pass


CONFIG_BY_NAME = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config(env_name=None):
    env_name = env_name or os.environ.get("FLASK_ENV", "development")
    return CONFIG_BY_NAME.get(env_name, DevelopmentConfig)
