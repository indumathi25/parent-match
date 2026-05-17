import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from core.database import init_db, check_db_connection
from core.config import config
from core.exceptions import ApplicationError
from domains.posts.router import router as posts_router

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
    title="Parent Match API",
    version="1.0.0",
    lifespan=lifespan,
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, ApplicationError):
        return exc.to_response(debug=config.DEBUG)

    logger.exception("An unexpected error occurred.")
    return ApplicationError(
        message="An unexpected server error occurred.",
        status_code=500,
        code="INTERNAL_SERVER_ERROR",
        details={"error": str(exc)}
    ).to_response(debug=config.DEBUG)


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

app.include_router(posts_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
