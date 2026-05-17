import os
import logging
from logging.config import dictConfig
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


def validate_required_env_vars() -> None:
    required_vars = ["DB_URL"]
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing and os.getenv("ENVIRONMENT", "default").lower() != "testing":
        logger.error(f"Missing required environment variables: {missing}")
        raise RuntimeError(
            f"Missing required environment variables: {', '.join(missing)}"
        )


class DefaultConfig(object):
    PROJECT = "Parent Match API"
    PROJECT_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    TESTING = False
    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    DATABASE_URL = os.getenv("DB_URL")

    DB_CHUNK_SIZE = 100
    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000"
    ).split(",")
    AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "YOUR_AUTH0_DOMAIN")
    AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "YOUR_AUTH0_AUDIENCE")
    API_TITLE = "Parent Match API"
    API_VERSION = "1.0.0"

    dictConfig(
        {
            "version": 1,
            "formatters": {
                "json": {
                    "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
                    "format": (
                        "%(asctime)s %(levelname)s %(name)s "
                        "%(funcName)s %(message)s"
                    ),
                }
            },
            "handlers": {
                "app": {
                    "class": "logging.StreamHandler",
                    "formatter": "json",
                }
            },
            "root": {"level": "INFO", "handlers": ["app"]},
        }
    )


class TestingConfig(DefaultConfig):
    TESTING = True
    DEBUG = True
    DATABASE_URL = "sqlite:///:memory:"

    def __init__(self, database_url=None):
        if database_url:
            self.DATABASE_URL = database_url


env = os.getenv("ENVIRONMENT", "default").lower()
if env == "testing":
    config = TestingConfig()
else:
    config = DefaultConfig()
    validate_required_env_vars()
