up:
	docker-compose up

down:
	docker-compose down -v

build:
	docker-compose build

logs:
	docker-compose logs -f

test: test-backend test-frontend

test-backend:
	docker exec backend uv run pytest

test-frontend:
	docker exec frontend npm test

lint:
	docker exec backend uv run ruff check .
	docker exec frontend npm run lint