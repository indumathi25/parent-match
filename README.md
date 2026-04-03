# ECB Borrowing Dashboard

A simple, modern dashboard to track and visualize borrowing rates from the European Central Bank (ECB) for businesses across the Euro Area.

### Future Growth (Scaling Up)
As the project grows, we have a clear plan for making it more powerful:
- **More Frequent Updates**: If we ever need to update data every day instead of once a month, we can easily plug in a more powerful background system (called **Redis & Celery**).
- **Handling More Work**: If the data starts to get too heavy for one computer to process, we can add more "digital workers" (**Celery workers**) to share the work and keep things fast.
- **Better Tracking**: We can add a simple dashboard (like **Flower**) that shows us exactly when tasks run and alerts us if something goes wrong.

---

## Tech Stack

### Backend
- **FastAPI**: High-performance Python framework for building APIs.
- **SQLModel**: A modern library that combines SQLAlchemy and Pydantic for seamless database interactions and type safety.
- **PostgreSQL**: Robust, scalable relational database for persistent storage.
- **Docker**: Containerized environment for consistent deployment.

### Frontend
- **React + TypeScript**: Type-safe, component-based UI development.
- **Vite**: Ultra-fast build tool and development server.
- **Chart.js**: Flexible and responsive data visualization.
- **Tailwind CSS**: Utility-first CSS framework for a premium design feel.

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)
- Python 3.10+ (for local development)

### Running the Application
The easiest way to get started is using the provided `Makefile`:

```bash
make up

make logs

make test
```

The application will be available at:
- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## Key Features
- **One-Click Setup**: Easily sync the latest data from the ECB when you first open the app.
- **Interactive Graphs**: High-quality charts that show precise values as you move through the timeline.
- **Works Anywhere**: Fully responsive design that looks great on your phone, tablet, or desktop.
- **Set It and Forget It**: Automatic monthly updates ensure the dashboard is always fresh without any manual work.
