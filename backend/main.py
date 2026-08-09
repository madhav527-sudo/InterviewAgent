"""CohortIQ — AI Technical Interview Platform API."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import candidate_prep, candidates, curriculum, interviews

app = FastAPI(
    title="CohortIQ API",
    description="AI-powered technical interview engine for the 31-Day AI Engineering Cohort",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)
app.include_router(curriculum.router)
app.include_router(interviews.router)
app.include_router(candidate_prep.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "CohortIQ API", "version": "1.0.0"}


@app.get("/api/topics")
async def list_topics():
    from engine.question_bank import get_topics

    return {"topics": get_topics()}
