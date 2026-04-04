from typing import Any, Dict, Optional
from fastapi.responses import JSONResponse


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
        self.code = code
        self.details = details or {}

    def to_response(self, debug: bool = False) -> JSONResponse:
        message = self.message if debug else "An error occurred"
        return JSONResponse(
            status_code=self.status_code,
            content={
                "error_code": self.code,
                "message": message,
                "details": self.details if debug else {},
            },
        )


class ValidationError(ApplicationError):
    status_code: int = 400
    code: str = "VALIDATION_ERROR"


class DatabaseError(ApplicationError):
    status_code: int = 500
    code: str = "DATABASE_ERROR"


class ExternalServiceError(ApplicationError):
    status_code: int = 502
    code: str = "BAD_GATEWAY"
