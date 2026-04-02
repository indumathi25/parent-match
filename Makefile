up:
	docker-compose up

down:
	docker-compose down -v

build:
	docker-compose build

logs:
	docker-compose logs -f

test: test-backend

test-backend:
	docker exec backend uv run pytest

lint:
	docker exec backend uv run ruff check .

