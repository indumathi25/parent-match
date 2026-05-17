# Parent Match

A simple, modern social feed application where parents can post their queries and the community can view and comment.

## Tech Stack

### Backend

- **FastAPI** — High-performance Python framework for building APIs
- **SQLModel** — Combines SQLAlchemy and Pydantic for database interactions and type safety
- **PostgreSQL** — Relational database for persistent storage
- **Auth0 (JWT)** — Token verification via RS256-signed JWTs
- **Docker** — Containerised environment for consistent deployment

### Frontend

- **React + TypeScript** — Type-safe, component-based UI
- **Vite** — Fast build tool and development server
- **Tailwind CSS** — Utility-first CSS framework
- **Framer Motion** — Micro-animations
- **Auth0 React SDK** — Authentication with PKCE flow
- **TanStack Query** — Server state management and data fetching

---

## What's Inside

Parent Match application is built with the following features:

### Backend

- `posts` domain with support for posts and nested comments
- `core/auth.py` — JWT verification using Auth0 JWKS endpoint
- `core/config.py` — `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` config values
- `POST /posts` and `POST /posts/{id}/comments` are protected with Auth0 JWT auth
- `GET /posts` is public so unauthenticated users can browse the feed

### Frontend

- Social feed UI with post creation and comment sections
- Auth0 React SDK (`@auth0/auth0-react`) for sign-in / sign-out
- `AuthProvider` component wrapping the app with Auth0 context
- `src/config/auth.ts` for centralised Auth0 configuration
- `src/core/api/client.ts` — Axios client that attaches the Auth0 bearer token to requests
- Navbar shows user avatar, name, and email when authenticated

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- An Auth0 account with a configured tenant

### Environment Variables

**`frontend/.env`**

```
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_AUTH0_AUDIENCE=parent-match-v1
VITE_API_BASE_URL=/api/v1
```

**`backend/.env`**

```
ENVIRONMENT=default
DB_URL=postgresql://parent_match:parent_match@db:5432/parent_match_data
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
DEBUG=False
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=parent-match-v1
```

### Running the Application

```bash
docker compose up -d
```

The application will be available at:

- **Frontend**: http://localhost:3001
- **Backend API docs**: http://localhost:8000/docs

---

## API Endpoints

| Method | Path                          | Auth Required | Description             |
| ------ | ----------------------------- | ------------- | ----------------------- |
| `GET`  | `/api/v1/posts`               | No            | List all posts          |
| `POST` | `/api/v1/posts`               | Yes           | Create a new post       |
| `POST` | `/api/v1/posts/{id}/comments` | Yes           | Add a comment to a post |

---

## Key Features

- **Public feed** — Anyone can browse posts without signing in
- **Authenticated posting** — Sign in with Auth0 to create posts and comments
- **Author attribution** — Post and comment author names are pulled from the Auth0 JWT
- **Polling** — Feed refreshes every 5 seconds for a real-time feel
- **Responsive design** — Works on mobile, tablet, and desktop
