# CohortIQ — AI Technical Interview Platform

Turn your 31-day AI Engineering Cohort learning journey into a realistic, personalized, multi-turn technical interview.

## Live Server Links

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:5173](http://localhost:5173) | React web application |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | FastAPI REST API |
| **API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive Swagger UI |

## Quick Start

### 1. Start the Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App

Visit **http://localhost:5173** in your browser.

## Features

- **Personalized interviewing** based on Alex Sharma's cohort profile (22/31 days completed)
- **Adaptive AI engine** with contextual follow-ups, difficulty adjustment, and topic switching
- **8–15 questions** across 4+ curriculum days (RAG, Vector DBs, Prompt Engineering, MCP, Deployment)
- **Live interview UI** with progress sidebar (scores hidden during interview)
- **Structured final report** with revision plan mapped to curriculum days
- **Full curriculum view** with learning signals, skipped topics, and repeated attempts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend | Python, FastAPI, Pydantic |
| AI Engine | Mock LLM evaluator (ready for OpenAI / LangGraph / RAG integration) |
| Data | JSON mock data (ready for PostgreSQL + Redis) |

## Project Structure

```
Interview Agent/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── engine/
│   │   ├── interviewer.py   # Adaptive interview engine
│   │   └── question_bank.py # Topic-organized question bank with follow-ups
│   ├── routers/             # API endpoints
│   └── data/                # Candidate & curriculum JSON
└── frontend/
    └── src/
        ├── pages/           # Landing, Dashboard, Curriculum, Interview, Report
        ├── components/      # Navbar, Layout, ProgressBar
        └── api/             # API client
```

## Sample Candidate

**Alex Sharma** — AI Engineering Cohort Batch 7
- 22 of 31 days completed (71% progress)
- Strong: Prompt Engineering, RAG Architecture
- Weak: Vector Retrieval, Production Deployment
- Skipped: Advanced MCP Patterns
- Learning signal: Strong conceptual understanding, weaker production reasoning

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/candidates` | List candidates |
| GET | `/api/candidates/{id}` | Get candidate profile |
| GET | `/api/curriculum` | Get 31-day curriculum |
| GET | `/api/topics` | List interview topics |
| POST | `/api/interviews/start` | Start new interview |
| POST | `/api/interviews/{id}/answer` | Submit answer |
| POST | `/api/interviews/{id}/skip` | Skip question |
| POST | `/api/interviews/{id}/complete` | Generate final report |

## Architecture Notes

The backend is modular and ready for production AI integration:
- Replace `_evaluate_answer()` with real LLM calls
- Add LangGraph for multi-step agent orchestration
- Connect vector DB for curriculum RAG retrieval
- Swap in-memory `SESSIONS` dict for Redis
- Migrate JSON data to PostgreSQL
