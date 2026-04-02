import logging
import httpx
from functools import wraps
from typing import Any, Callable, Iterable
from sqlalchemy.exc import SQLAlchemyError

from core.exceptions import (
    DatabaseError,
    ExternalServiceError,
    ApplicationError,
)

logger = logging.getLogger(__name__)


def chunk_list(items: list[Any], size: int) -> Iterable[list[Any]]:
    for i in range(0, len(items), size):
        yield items[i:i + size]


def handle_service_exceptions(
    logger: logging.Logger, default_message: str
) -> Callable:
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            try:
                return func(*args, **kwargs)
            except ApplicationError:
                raise
            except SQLAlchemyError as e:
                logger.error("Database error in %s: %s", func.__name__, e)
                raise DatabaseError(
                    f"{default_message}: database operation failed"
                ) from e
            except httpx.HTTPStatusError as e:
                logger.error(
                    "ECB API returned %s in %s: %s",
                    e.response.status_code, func.__name__, e,
                )
                raise ExternalServiceError(
                    f"{default_message}: ECB API returned "
                    f"{e.response.status_code}"
                ) from e
            except httpx.HTTPError as e:
                logger.error("Network error in %s: %s", func.__name__, e)
                raise ExternalServiceError(
                    f"{default_message}: could not reach ECB API"
                ) from e
            except Exception as e:
                logger.error("Unexpected error in %s: %s", func.__name__, e)
                raise ApplicationError(
                    f"{default_message}: an unexpected error occurred"
                ) from e
        return wrapper
    return decorator
