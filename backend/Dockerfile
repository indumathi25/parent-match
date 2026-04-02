FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1

COPY pyproject.toml .

RUN uv sync --no-install-project

COPY . .

RUN uv sync

CMD ["sh", "-c", "cd migrations && uv run alembic upgrade head && cd .. && uv run uvicorn main:app --host 0.0.0.0 --port 8000"]
