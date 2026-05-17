import logging
from sqlmodel import Session, create_engine, text
from core.config import config

logger = logging.getLogger(__name__)

engine = create_engine(
    config.DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)


def check_db_connection() -> None:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            logger.info("Database connection successful.")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise e


def init_db() -> None:

    logger.info(
        "Database initialization complete (Migrations handle schema)."
    )


def get_session():
    with Session(engine) as session:
        yield session
