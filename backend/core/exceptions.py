from typing import Any, Dict, Optional


class ApplicationError(Exception):
    status_code: int = 500
    code: str = "INTERNAL_SERVER_ERROR"

    def __init__(
        self,
        message: str,
        status_code: Optional[int] = None,
        code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        if status_code:
            self.status_code = status_code
        if code:
            self.code = code
        self.details = details or {}


class ValidationError(ApplicationError):
    status_code: int = 400
    code: str = "VALIDATION_ERROR"


class AuthenticationError(ApplicationError):
    status_code: int = 401
    code: str = "UNAUTHENTICATED"


class DatabaseError(ApplicationError):
    status_code: int = 500
    code: str = "DATABASE_ERROR"


class ExternalServiceError(ApplicationError):
    status_code: int = 502
    code: str = "BAD_GATEWAY"


class ResourceNotFoundError(ApplicationError):
    status_code: int = 404
    code: str = "NOT_FOUND"
