import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from core.database import init_db, check_db_connection
from core.config import config
from core.exceptions import ApplicationError
from domains.borrowing_rates.router import router as borrowing_rates_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up...")
    try:
        check_db_connection()
        init_db()
    except Exception as e:
        logger.critical(f"Startup failed: {e}")
    yield
    logger.info("Shutting down...")

app = FastAPI(
    title="Cost of Borrowing API",
    version="1.0.0",
    lifespan=lifespan,
)


@app.exception_handler(ApplicationError)
async def application_error_handler(request: Request, exc: ApplicationError):
    message = exc.message if config.DEBUG else "An error occurred"
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": exc.code,
            "message": message,
            "details": exc.details if config.DEBUG else {},
        },
    )


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": config.API_VERSION}


app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(borrowing_rates_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
