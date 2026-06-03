# Inventory Management System

A full-stack inventory and order management app built with React, FastAPI, and PostgreSQL.

## Tech Stack

- **Frontend** — React, Vite, Tailwind CSS
- **Backend** — Python, FastAPI
- **Database** — PostgreSQL (Neon)
- **Containerization** — Docker, Docker Compose

## Features

- Product management (add, edit, delete, stock tracking)
- Customer management
- Order creation with automatic stock deduction
- Dashboard with summary stats

## Local Development

**Prerequisites:** Node.js, Python 3.12+, or Docker

### With Docker

```bash
cp .env.example .env
# Fill in your DATABASE_URL in .env
docker compose up --build
```

Frontend → http://localhost  
Backend → http://localhost:8000

### Without Docker

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Add your DATABASE_URL to backend/.env
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ALLOWED_ORIGINS` | Frontend URL (for CORS) |
| `VITE_API_URL` | Backend URL used by the frontend |

## Deployment

- **Frontend** → Vercel (set `VITE_API_URL` to your Render backend URL)
- **Backend** → Render (set `DATABASE_URL` and `ALLOWED_ORIGINS` to your Vercel URL)
